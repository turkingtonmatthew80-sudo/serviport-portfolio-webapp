import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import WebSocket from 'ws';
import cron from 'node-cron';
import * as cheerio from 'cheerio';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import TelegramBot from 'node-telegram-bot-api';

if (!getApps().length) {
  try {
    initializeApp();
  } catch(e) {
    console.warn("Could not init firebase admin", e);
  }
}



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

// Competitor mock capacity cache
let competitorCapacity = {
  activeVessels: 0,
  terminalCongestion: "Bajo",
  lastScraped: new Date().toISOString()
};

// Start cron jobs
function startAutonomousJobs() {
  // Cron Job cada 6 horas: "0 */6 * * *"
  cron.schedule("0 */6 * * *", async () => {
     console.log("[CRON] Ejecutando Gemelo Digital - Web Scraping Autónomo con Cheerio...");
     try {
        // En un entorno de producción real, usaríamos la URL pública del puerto o la competencia.
        // Aquí simulamos el scrapeo con cheerio de una estructura típica en internet.
        const mockHtml = `
          <html>
            <body>
               <div class="competitor-stats">
                  <span class="active-vessels">${Math.floor(Math.random() * 5) + 1}</span>
                  <span class="congestion-status">${Math.random() > 0.5 ? 'Alto' : 'Medio'}</span>
               </div>
            </body>
          </html>
        `;
        const $ = cheerio.load(mockHtml);
        const vessels = parseInt($('.active-vessels').text()) || 0;
        const congestion = $('.congestion-status').text() || "Bajo";

        competitorCapacity = {
           activeVessels: vessels,
           terminalCongestion: congestion,
           lastScraped: new Date().toISOString()
        };
        console.log(`[CRON] Capacidad competencia actualizada: ${vessels} buques, Congestión: ${congestion}`);
     } catch(e) {
        console.error("[CRON] Error en el scraper de la competencia:", e);
     }
  });
  
  // Ejecutamos una vez al iniciar
  console.log("[CRON] Inicializando Gemelo Digital...");
}

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
  startAutonomousJobs();
  
  app.get("/api/competitor-capacity", (req, res) => {
    res.json({ success: true, data: competitorCapacity });
  });

  // ======= TELEGRAM BOT (REAL) =======
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  let bot: TelegramBot | null = null;
  
  if (telegramToken && process.env.NODE_ENV !== "production") {
      // In development / container, polling is more reliable if behind NAT
      bot = new TelegramBot(telegramToken, { polling: true });
      console.log("[TELEGRAM] Bot iniciado en modo polling.");

      bot.on('callback_query', async (query) => {
          const chatId = query.message?.chat.id;
          const data = query.data || "";

          console.log(`[TELEGRAM] Autoridad respondió pulsando el botón: ${data}`);

          try {
              if (data.startsWith('APROBAR_HITO_')) {
                  const docId = data.replace('APROBAR_HITO_', '');
                  await getFirestore().collection('hitos_legales').doc(docId).update({
                      status: "APROBADO",
                      updatedAt: new Date().toISOString()
                  });
                  if (chatId) {
                      await bot.answerCallbackQuery(query.id, { text: "Hito Aprobado y enviado al TOS." });
                      await bot.sendMessage(chatId, `✅ Inspección/Levante para el documento *${docId}* fue aprobado con éxito. El recinto portuario ha sido notificado.`, { parse_mode: "Markdown" });
                  }
              } else if (data.startsWith('RECHAZAR_HITO_')) {
                 const docId = data.replace('RECHAZAR_HITO_', '');
                  await getFirestore().collection('hitos_legales').doc(docId).update({
                      status: "RECHAZADO",
                      updatedAt: new Date().toISOString()
                  });
                  if (chatId) {
                      await bot.answerCallbackQuery(query.id, { text: "Operación rechazada." });
                      await bot.sendMessage(chatId, `❌ Inspección/Levante para el documento *${docId}* ha sido denegado permanentemente.`, { parse_mode: "Markdown" });
                  }
              }
          } catch(e) {
              console.error("[TELEGRAM] Firebase admin error:", e);
              if (chatId) bot.answerCallbackQuery(query.id, { text: "Error de servidor al sincronizar." });
          }
      });
  }

  // Endpoints para que la aplicación en React empuje solicitudes interactivas a Telegram
  app.post("/api/telegram/send-approval", express.json(), async (req, res) => {
      // In a real environment, send to specific authority chat IDs based on 'ente' code (e.g. SENIAT)
      const { docId, ente, titulo, detalles, vesselName } = req.body;
      const targetChatId = process.env.TELEGRAM_CHAT_ID;

      if (!bot) {
         console.warn("[TELEGRAM] Bot deshabilitado (No TELEGRAM_BOT_TOKEN). Simulando fallo silencioso para desarrollo.");
         return res.json({ success: false, message: "Bot no configurado" });
      }

      if (!targetChatId) {
         return res.status(400).json({ success: false, message: "No TELEGRAM_CHAT_ID param config" });
      }

      try {
          const opts = {
              parse_mode: "Markdown",
              reply_markup: {
                  inline_keyboard: [
                      [
                          { text: "✅ Aprobar", callback_data: `APROBAR_HITO_${docId}` },
                          { text: "❌ Rechazar", callback_data: `RECHAZAR_HITO_${docId}` }
                      ]
                  ]
              }
          };

          const textMsg = `⚠️ *NUEVA SOLICITUD DE [${ente?.toUpperCase() || "AUTORIDAD"}]*\n\n*Hito:* ${titulo}\n*Buque / Referencia:* ${vesselName}\n*Detalles:* ${detalles}\n*ID Trazabilidad:* ${docId}\n\nPor favor, dictamine el resultado de la inspección:`;
          await bot.sendMessage(targetChatId, textMsg, opts as any);
          
          res.json({ success: true, message: "Enviado al canal de Telegram de la autoridad." });
      } catch(e: any) {
          console.error("[TELEGRAM] Send error", e);
          res.status(500).json({ success: false, error: e.message });
      }
  });

  // (This old mock endpoint remains backwards-compatible if needed)
  app.post("/api/webhook/telegram", express.json(), async (req, res) => {
    try {
      const body = req.body;
      
      // En un caso real con bot de Telegram: 
      // body.callback_query contiene la respuesta del botón que pulsó la autoridad.
      console.log("[TELEGRAM WEBHOOK] Recepción de evento:", JSON.stringify(body));
      
      if (body.callback_query) {
        // Formato Telegram Callback Query (Ej: "CONFORME_DUA_123")
        const callbackData = body.callback_query.data;
        console.log(`[TELEGRAM WEBHOOK] Autoridad respondió: ${callbackData}`);
        
        // Aquí conectaríamos con Firebase Admin para actualizar Firestore y destrabar el proceso logístico
        // const admin = require("firebase-admin");
        // await admin.firestore().collection('hitos_legales').doc('doc-id').update({ ... })
      }

      // IMPORTANTE: Telegram requiere siempre un 200 OK para no reintentar
      res.status(200).send("OK");
    } catch (e) {
      console.error("[TELEGRAM WEBHOOK] Error:", e);
      res.status(500).send("Error interno");
    }
  });

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
          const { ApifyClient } = await import('apify-client');
          const apifyKey = process.env.APIFY_API_KEY;
          if (!apifyKey) {
             throw new Error("Missing APIFY_API_KEY environment variable");
          }
          const client = new ApifyClient({ token: apifyKey });

          console.log(`Forcing Apify scrape for port: ${port} area...`);

          // Broad bounding box around Venezuela Coast
          const input = {
              "lat": target.lat.toString(),
              "lon": target.lng.toString(),
              "zoom": 6
          };

          const run = await client.actor("romy~marine-traffic-scraper").call(input);
          const { items } = await client.dataset(run.defaultDatasetId).listItems();
          
          if (items && items.length > 0) {
            const uniqueShips = new Map();
            items.forEach((item: any) => {
              if (!item.MMSI && !item.SHIPNAME) return;
              
              // Only cargo type ships
              const typeName = (item.TYPE_NAME || item.SHIP_TYPE || "").toLowerCase();
              const isCargo = typeName.includes('cargo') || item.TYPE === 7 || item.TYPE === 8;
              if (typeName && !isCargo) return;

              const mmsi = item.MMSI || Math.floor(Math.random() * 1000000);
              const shipName = item.SHIPNAME || item.NAME || "Unknown";
              const lat = Number(item.LAT);
              const lng = Number(item.LON);

              if (!isNaN(lat) && !isNaN(lng)) {
                // Seed the live cache
                const existing: any = shipCache.get(mmsi) || { mmsi, lat: 0, lng: 0, lastUpdate: new Date() };
                existing.lat = lat;
                existing.lng = lng;
                existing.name = shipName;
                existing.destination = item.DESTINATION || "Desconocido";
                existing.type = item.TYPE || (isCargo ? 7 : undefined);
                existing.lastUpdate = new Date();
                shipCache.set(mmsi, existing);
              }

              if (!uniqueShips.has(mmsi)) {
                 const destination = (item.DESTINATION || "").toLowerCase();
                 const isImport = destination.includes(port.toLowerCase());
                 
                 uniqueShips.set(mmsi, {
                    mmsi: mmsi,
                    shipName: shipName,
                    type: isImport ? 'import' : 'export',
                    originLat: isImport ? lat : target.lat,
                    originLng: isImport ? lng : target.lng,
                    destinationLat: isImport ? target.lat : lat,
                    destinationLng: isImport ? target.lng : lng,
                    date: new Date().toISOString()
                 });
              }
            });
            staticShips.push(...Array.from(uniqueShips.values()));
          }

        } catch (e: any) {
          console.error("Apify extraction failed:", e.message);
          res.json({ success: false, error: `Apify extraction failed: ${e.message}`, liveData: [], staticData: [] });
          return;
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

  app.post("/api/telegram-webhook", (req, res) => {
    // Mock telegram bot webhook
    const { action, portCallId, buque } = req.body;
    console.log(`[TELEGRAM MOCK] Received action: ${action} for buque: ${buque} (ID: ${portCallId})`);
    res.json({ success: true, message: "Mensaje encolado a Telegram" });
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
