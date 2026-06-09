import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import WebSocket from 'ws';

// In-memory cache of live ships
interface LiveShip {
  mmsi: number;
  name?: string;
  destination?: string;
  lat: number;
  lng: number;
  cog?: number;
  type?: number;
  lastUpdate: Date;
}
const shipCache = new Map<number, LiveShip>();

// Start AIS Stream background connection
function startAisStream() {
  let ws: WebSocket;
  const connect = () => {
    ws = new WebSocket("wss://stream.aisstream.io/v0/stream");
    
    ws.on('open', () => {
      console.log("Connected to AIS Stream");
      const apiKey = process.env.AISSTREAM_API_KEY || "37bc920c6a90cc01f434c4cd1b6e04ea54aa8610";
      const msg = {
        ApiKey: apiKey,
        // Caribbean Sea Bounding Box 
        // [ [MaxLat, MinLng], [MinLat, MaxLng] ]
        BoundingBoxes: [[[25.0, -90.0], [8.0, -58.0]]], 
        FilterMessageTypes: ["PositionReport", "ShipStaticData"]
      };
      ws.send(JSON.stringify(msg));
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        const mmsi = parsed.MetaData.MMSI;
        
        if (parsed.MessageType === "PositionReport") {
          const report = parsed.Message.PositionReport;
          const existing = shipCache.get(mmsi) || { mmsi, lat: 0, lng: 0, cog: 0, lastUpdate: new Date() };
          
          existing.lat = report.Latitude;
          existing.lng = report.Longitude;
          existing.cog = report.Cog;
          existing.lastUpdate = new Date();
          
          shipCache.set(mmsi, existing);

        } else if (parsed.MessageType === "ShipStaticData") {
          const statData = parsed.Message.ShipStaticData;
          const existing = shipCache.get(mmsi);
          
          if (existing) {
             existing.name = statData.Name?.trim();
             existing.destination = statData.Destination?.trim();
             existing.type = statData.Type;
             existing.lastUpdate = new Date();
             shipCache.set(mmsi, existing);
          }
        }
      } catch (e) {
        // Ignore JSON parse errors from stream
      }
    });

    ws.on('close', () => {
      console.log("AIS Stream disconnected. Reconnecting in 5s...");
      setTimeout(connect, 5000);
    });
    
    ws.on('error', (err) => {
      console.error("AIS Stream error:", err);
      ws.close();
    });
  };

  connect();
  
  // Cleanup old ships from memory cache every minute
  setInterval(() => {
    const now = new Date();
    for (const [mmsi, ship] of shipCache.entries()) {
      if (now.getTime() - ship.lastUpdate.getTime() > 30 * 60 * 1000) {
        shipCache.delete(mmsi);
      }
    }
  }, 60000);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  startAisStream();

  app.post("/api/vessel-data", async (req, res) => {
    try {
      const { port } = req.body;
      
      const portCoords: Record<string, { lat: number, lng: number }> = {
        "Puerto Cabello": { lat: 10.48, lng: -68.01 },
        "La Guaira": { lat: 10.60, lng: -66.93 },
        "Maracaibo": { lat: 10.64, lng: -71.60 },
        "Guanta": { lat: 10.24, lng: -64.59 }
      };
      
      const target = portCoords[port] || portCoords["Puerto Cabello"];
      const staticShips: any[] = [];

      if (req.body.forceScrape) {
        try {
          const FirecrawlApp = (await import("@mendable/firecrawl-js")).default;
          const firecrawlKey = process.env.FIRECRAWL_API_KEY || "fc-edb4bd8df62049e1b9a0538f1358030a";
          const fc = new FirecrawlApp({ apiKey: firecrawlKey });
          
          console.log(`Forcing Firecrawl scrape for port: ${port}`);
          
          const schema = {
            type: "object",
            properties: {
              ships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    shipName: { type: "string" },
                    originPort: { type: "string" },
                    destinationPort: { type: "string" },
                    originLat: { type: "number" },
                    originLng: { type: "number" },
                    destinationLat: { type: "number" },
                    destinationLng: { type: "number" },
                    type: { type: "string", enum: ["import", "export"] }
                  },
                  required: ["shipName", "originLat", "originLng", "destinationLat", "destinationLng", "type"]
                }
              }
            },
            required: ["ships"]
          };

          const myShipTrackingUrls: Record<string, string> = {
            "Puerto Cabello": "https://www.myshiptracking.com/ports/port-of-puerto-cabello-in-ve-venezuela-id-6886",
            "La Guaira": "https://www.myshiptracking.com/ports/-of-la-guaira-in--id-6875",
            "Maracaibo": "https://www.myshiptracking.com/ports/-of-maracaibo-in--id-6885",
            "Guanta": "https://www.myshiptracking.com/ports/-of-guanta-in--id-6890"
          };
          
          const portUrl = myShipTrackingUrls[port] || `https://www.myshiptracking.com/ports/${encodeURIComponent(port.toLowerCase().replace(/ /g, '-'))}`;

          const extractResult = await fc.extract({
            urls: [
              portUrl
            ],
            prompt: `Extract recent or historical cargo ships and routes arriving at or leaving ${port}, Venezuela. Categorize as 'import' (arriving at ${port}) or 'export' (leaving ${port}). Get approx latitude and longitude for origin and destination ports worldwide. YOU MUST ONLY RETURN REAL EXTRACTED DATA. IF NO DATA IS AVAILABLE, RETURN AN EMPTY ARRAY. DO NOT MAKE UP DATA.`,
            schema: schema
          });

          const result = extractResult as any;
          if (result.success && result.data && result.data.ships) {
             for (const ship of result.data.ships) {
                // Deterministic pseudo-mmsi from shipName to avoid random duplicates
                let hash = 0;
                for (let i = 0; i < ship.shipName.length; i++) hash = Math.imul(31, hash) + ship.shipName.charCodeAt(i) | 0;
                const mockMmsi = 990000000 + Math.abs(hash % 9999999);
                staticShips.push({
                   mmsi: mockMmsi,
                   shipName: ship.shipName,
                   type: ship.type,
                   originLat: ship.type === 'import' ? ship.originLat : target.lat, 
                   originLng: ship.type === 'import' ? ship.originLng : target.lng,
                   destinationLat: ship.type === 'import' ? target.lat : ship.destinationLat,
                   destinationLng: ship.type === 'import' ? target.lng : ship.destinationLng,
                   date: new Date().toISOString()
                });
             }
          }
        } catch (e: any) {
          console.error("Firecrawl extraction failed:", e.message);
        }
      }
      
      const liveMap = new Map();
      Array.from(shipCache.values()).forEach(ship => {
        liveMap.set(ship.mmsi, ship);
      });
      
      const liveShips = Array.from(liveMap.values())
        .filter(ship => ship.name && ship.name.trim().length > 0 && !ship.name.includes('Desconocido'))
        .map(ship => {
        return {
          mmsi: ship.mmsi,
          shipName: ship.name || `Desconocido (MMSI: ${ship.mmsi})`,
          destinationPort: ship.destination || "Desconocido",
          lat: ship.lat,
          lng: ship.lng,
          date: ship.lastUpdate.toISOString()
        };
      });

      res.json({ success: true, liveData: liveShips, staticData: staticShips });

    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
