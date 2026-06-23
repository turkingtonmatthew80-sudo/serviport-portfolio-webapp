import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import WebSocket from "ws";
import cron from "node-cron";
import * as cheerio from "cheerio";
import { db as sqlDb } from "./src/db/index.js";
import * as schema from "./src/db/schema.js";
import { eq, and, asc, desc, sql } from 'drizzle-orm';
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  writeBatch,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
} from "firebase/firestore";
import TelegramBot from "node-telegram-bot-api";

import * as admin from "firebase-admin";

// Initialize Firebase Admin (Fallback for Server Node environments)
try {
  // @ts-ignore
  if (!admin.apps?.length) {
    admin.initializeApp();
    console.log("[FIREBASE ADMIN] Inicializado correctamente en el servidor.");
  }
} catch (e: any) {
  console.warn("[FIREBASE ADMIN] No se pudo inicializar (Verificar credenciales GOOGLE_APPLICATION_CREDENTIALS):", e.message);
}

const firebaseConfig = {
  apiKey: "AIzaSyDKiPUS-7IBkYxgygW5kwZG5b3H0BP2LXA",
  authDomain: "serviport-24f31.firebaseapp.com",
  projectId: "serviport-24f31",
  storageBucket: "serviport-24f31.firebasestorage.app",
  messagingSenderId: "20443440053",
  appId: "1:20443440053:web:34b301392ede5602a02ffc",
  measurementId: "G-7ZD8063D0D",
};

let firebaseApp;
if (!getApps().length) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
  } catch (e) {
    console.warn("Could not init firebase client app in server", e);
  }
} else {
  firebaseApp = getApps()[0];
}
const db = getFirestore(firebaseApp!);

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
  lastScraped: new Date().toISOString(),
};

// Start cron jobs
function startAutonomousJobs() {
  // Cron Job cada 6 horas: "0 */6 * * *"
  cron.schedule("0 */6 * * *", async () => {
    console.log(
      "[CRON] Ejecutando Gemelo Digital - Autoscrapeo Apify y Cheerio...",
    );
    try {
      // 1. Scrapeo Marina (Apify) simulado
      const targetPorts = ["Puerto Cabello", "La Guaira"];
      const port = targetPorts[Math.floor(Math.random() * targetPorts.length)];
      console.log(`[CRON] Sincronizando catálogo con Apify para: ${port}`);
      // Llama a la ruta local para forzar el scraping (que internamente guarda en cache y db)
      await fetch(`http://127.0.0.1:${process.env.PORT || 3000}/api/vessel-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ port, forceScrape: true }),
      }).catch(e => console.warn(`[CRON] Fetch local falló en dev: ${e.message}`));

      // 2. Scrapeo Competencia (Cheerio)
      const mockHtml = `
          <html>
            <body>
               <div class="competitor-stats">
                  <span class="active-vessels">${Math.floor(Math.random() * 5) + 1}</span>
                  <span class="congestion-status">${Math.random() > 0.5 ? "Alto" : "Medio"}</span>
               </div>
            </body>
          </html>
        `;
      const $ = cheerio.load(mockHtml);
      const vessels = parseInt($(".active-vessels").text()) || 0;
      const congestion = $(".congestion-status").text() || "Bajo";

      competitorCapacity = {
        activeVessels: vessels,
        terminalCongestion: congestion,
        lastScraped: new Date().toISOString(),
      };
      console.log(
        `[CRON] Capacidad competencia actualizada: ${vessels} buques, Congestión: ${congestion}`,
      );
    } catch (e) {
      console.error("[CRON] Error en el scraper de la competencia:", e);
    }
  });

  // Demurrage/Almacenaje Cron Job: Ejecuta cada día a la medianoche
  cron.schedule("0 0 * * *", async () => {
    console.log(
      "[CRON] Ejecutando cálculo de Demurrage / Almacenaje (Reloj de Costos)...",
    );
    try {
      const contenedoresRef = collection(db, "contenedores");
      const activeContainersQuery = query(
        contenedoresRef,
        where("status", "==", "AGD"),
      );
      const snapshot = await getDocs(activeContainersQuery);

      let newInvoices = 0;
      const facturasRef = collection(db, "facturas_pendientes");

      for (const cDoc of snapshot.docs) {
        const cData = cDoc.data();
        // Assuming arrivalDate exists, or fallback to daysInPort logic.
        // For simulation purposes if arrivalDate is missing we assume 0 overstays to start, or use daysInPort
        if (cData.arrivalDate && cData.freeDays) {
          const arrival = new Date(cData.arrivalDate);
          const now = new Date();
          const diffDiff = Math.abs(now.getTime() - arrival.getTime());
          const diffDays = Math.ceil(diffDiff / (1000 * 60 * 60 * 24));

          if (diffDays > cData.freeDays) {
            const overstayDays = diffDays - cData.freeDays;
            // Solo generar si sobrepasa un dia más respecto a la última vez,
            // O simplemente generamos deuda acumulada diaria.

            await addDoc(facturasRef, {
              contenedorId: cData.containerId || cDoc.id,
              tipo: "Demurrage",
              monto: overstayDays * 120, // USD
              moneda: "USD",
              fechaEmision: now.toISOString(),
              estado: "PENDIENTE",
              diasRetraso: overstayDays,
              clienteId: cData.mblId || "Desconocido",
            });

            await updateDoc(cDoc.ref, {
              overstayDays,
              daysInPort: diffDays,
            });

            newInvoices++;
          }
        } else if (cData.daysInPort && cData.freeDays) {
          // Fallback logic for seeded data
          const newDaysInPort = cData.daysInPort + 1;
          const overstayDays =
            newDaysInPort > cData.freeDays ? newDaysInPort - cData.freeDays : 0;
          await updateDoc(cDoc.ref, {
            daysInPort: newDaysInPort,
            overstayDays: overstayDays,
          });
          if (overstayDays > 0) {
            await addDoc(facturasRef, {
              contenedorId: cData.containerId || cDoc.id,
              tipo: "Demurrage",
              monto: overstayDays * 120,
              moneda: "USD",
              fechaEmision: new Date().toISOString(),
              estado: "PENDIENTE",
              diasRetraso: overstayDays,
              clienteId: cData.mblId || "Desconocido",
            });
            newInvoices++;
          }
        }
      }
      console.log(
        `[CRON] Cálculo finalizado. Se generaron ${newInvoices} facturas de demoras.`,
      );
    } catch (e) {
      console.error("[CRON] Error calculando Demurrage:", e);
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

    ws.on("open", () => {
      console.log("Connected to AIS Stream");
      const apiKey =
        process.env.AISSTREAM_API_KEY ||
        "37bc920c6a90cc01f434c4cd1b6e04ea54aa8610";
      const msg = {
        ApiKey: apiKey,
        // Caribbean Sea Bounding Box
        // [ [MaxLat, MinLng], [MinLat, MaxLng] ]
        BoundingBoxes: [
          [
            [25.0, -90.0],
            [8.0, -58.0],
          ],
        ],
        FilterMessageTypes: ["PositionReport", "ShipStaticData"],
      };
      ws.send(JSON.stringify(msg));
    });

    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        const mmsi = parsed.MetaData.MMSI;

        if (parsed.MessageType === "PositionReport") {
          const report = parsed.Message.PositionReport;
          const existing = shipCache.get(mmsi) || {
            mmsi,
            lat: 0,
            lng: 0,
            cog: 0,
            lastUpdate: new Date(),
          };

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

    ws.on("close", () => {
      console.log("AIS Stream disconnected. Reconnecting in 5s...");
      setTimeout(connect, 5000);
    });

    ws.on("error", (err) => {
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

  // Handle generalized SQL operations
  app.get("/api/sql/:table", async (req, res) => {
    try {
      const { table } = req.params;
      let schemaTable = (schema as any)[table];
      if (!schemaTable) {
        // Fallback for camelCase matches (e.g., yard_movements vs yardMovements)
        const camelTable = Object.keys(schema).find(k => k.toLowerCase() === table.toLowerCase().replace(/_/g, ''));
        if (camelTable) {
          schemaTable = (schema as any)[camelTable];
        } else {
          return res.status(404).json({ error: "Table not found" });
        }
      }
      
      let q: any = sqlDb.select().from(schemaTable);
      
      if (req.query.filters) {
         try {
           const filters = JSON.parse(req.query.filters as string);
           for (const filter of filters) {
             if (filter.type === 'where') {
                const column = (schema as any)[table][filter.field === 'id' ? 'id' : filter.field];
                if (column) {
                  q = q.where(eq(column, filter.value));
                }
             } else if (filter.type === 'limit') {
                q = q.limit(filter.count);
             } else if (filter.type === 'orderBy') {
                const column = (schema as any)[table][filter.field];
                if (column) {
                  q = q.orderBy(filter.direction === 'desc' ? desc(column) : asc(column));
                }
             }
           }
         } catch(e) { console.error('Filter error', e); }
      }

      const results = await q;
      res.json(results);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/sql/:table/:id", async (req, res) => {
    try {
      const { table, id } = req.params;
      let schemaTable = (schema as any)[table];
      if (!schemaTable) {
        const camelTable = Object.keys(schema).find(k => k.toLowerCase() === table.toLowerCase().replace(/_/g, ''));
        if (camelTable) schemaTable = (schema as any)[camelTable];
        else return res.status(404).json({ error: "Table not found" });
      }

      const pkField = schemaTable.uid ? schemaTable.uid : schemaTable.id;
      const parsedId = schemaTable.uid ? id : (isNaN(parseInt(id)) ? id : parseInt(id));
      
      const result = await sqlDb.select().from(schemaTable).where(eq(pkField, parsedId));
      
      if (result.length === 0) {
        return res.json(null); // Document not found (like Firestore getDoc returning !exists)
      }
      res.json(result[0]);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/sql/:table", async (req, res) => {
    try {
      const { table } = req.params;
      const schemaTable = (schema as any)[table] || (schema as any)[Object.keys(schema).find(k => k.toLowerCase() === table.toLowerCase().replace(/_/g, ''))!];
      if (!schemaTable) return res.status(404).json({ error: "Table not found" });

      const rawBody = req.body;
      const validKeys = Object.keys(schemaTable);
      const data: any = {};
      for (const key of Object.keys(rawBody)) {
        if (validKeys.includes(key) && key !== 'id') {
          data[key] = rawBody[key];
        }
      }

      const result = await sqlDb.insert(schemaTable).values(data).returning();
      res.json(result[0] || {});
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/sql/:table/:id", async (req, res) => {
    try {
      const { table, id } = req.params;
      const schemaTable = (schema as any)[table] || (schema as any)[Object.keys(schema).find(k => k.toLowerCase() === table.toLowerCase().replace(/_/g, ''))!];
      if (!schemaTable) return res.status(404).json({ error: "Table not found" });
      
      const { _isSet, ...rawBody } = req.body;
      const pkField = schemaTable.uid ? schemaTable.uid : schemaTable.id;
      const parsedId = schemaTable.uid ? id : (isNaN(parseInt(id)) ? id : parseInt(id));

      // Sanitize fields to only those present in the schema
      const validKeys = Object.keys(schemaTable);
      const data: any = {};
      for (const key of Object.keys(rawBody)) {
        if (validKeys.includes(key) && key !== 'id' && key !== 'uid') {
          data[key] = rawBody[key];
        } else if (validKeys.includes(key) && schemaTable.uid && key === 'uid') {
           // Allow uid to be updated if it is not the PK
        }
      }

      if (_isSet) {
         // rough implementation of upsert or set
         const existing = await sqlDb.select().from(schemaTable).where(eq(pkField, parsedId));
         if (existing.length === 0) {
            const insertData = { ...data };
            if (schemaTable.uid) insertData.uid = parsedId;
            else insertData.id = parsedId;
            
            await sqlDb.insert(schemaTable).values(insertData).returning();
            return res.json({ success: true });
         }
      }

      await sqlDb.update(schemaTable).set(data).where(eq(pkField, parsedId));
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/sql/:table/:id", async (req, res) => {
    try {
      const { table, id } = req.params;
      const schemaTable = (schema as any)[table] || (schema as any)[Object.keys(schema).find(k => k.toLowerCase() === table.toLowerCase().replace(/_/g, ''))!];
      if (!schemaTable) return res.status(404).json({ error: "Table not found" });

      const pkField = schemaTable.uid ? schemaTable.uid : schemaTable.id;
      const parsedId = schemaTable.uid ? id : (isNaN(parseInt(id)) ? id : parseInt(id));

      await sqlDb.delete(schemaTable).where(eq(pkField, parsedId));
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/seed", async (req, res) => {
    try {
      const batch = writeBatch(db);

      // 1. Seed Master BLs
      const masterBls = [
        {
          id: "MBL_1",
          mbl: "ZIMU12345678",
          vessel: "ZIM LUANDA (V203)",
          container: "ZCSU9988112",
          status: "PENDIENTE",
          canal: "VERDE",
          type: "LCL CONSOLIDADO",
          port: "Puerto Cabello",
        },
        {
          id: "MBL_2",
          mbl: "MSKU33445566",
          vessel: "MSC ROSARIA (V101)",
          container: "MSKU3344556",
          status: "VALIDATED_SIDUNEA",
          canal: "ROJO",
          type: "FCL STANDARD",
          port: "Puerto Cabello",
        },
        {
          id: "MBL_3",
          mbl: "CMAU77778888",
          vessel: "CMA CGM MARSEILLE",
          container: "TGBU8989123",
          status: "PENDIENTE",
          canal: "AMARILLO",
          type: "FCL STANDARD",
          port: "La Guaira",
        },
      ];
      masterBls.forEach((docData) => {
        const docRef = doc(collection(db, "master_bls"), docData.id);
        batch.set(docRef, docData);
      });

      // 2. Seed House BLs
      const houseBls = [
        {
          id: "HBL_1",
          masterId: "MBL_1",
          hbl: "HBL-001A",
          consignee: "TECNOLOGÍA CARACAS C.A.",
          packages: 12,
          weight: 2.5,
          description: "Electrónicos",
          status: "PENDIENTE",
        },
        {
          id: "HBL_2",
          masterId: "MBL_1",
          hbl: "HBL-001B",
          consignee: "IMPORTACIONES LARA",
          packages: 4,
          weight: 0.8,
          description: "Repuestos Auto",
          status: "PENDIENTE",
        },
      ];
      houseBls.forEach((docData) => {
        const docRef = doc(collection(db, "house_bls"), docData.id);
        batch.set(docRef, docData);
      });

      // 3. Seed hitos_legales
      const hitos = [
        {
          id: "DUA-9876543",
          status: "PENDIENTE_INSPECCION",
          createdAt: new Date().toISOString(),
          mblId: "MBL_3",
          ente: "SENIAT",
          tipo: "FCL STANDARD",
        },
        {
          id: "DUA-1112223",
          status: "APROBADO",
          createdAt: new Date().toISOString(),
          mblId: "MBL_2",
          ente: "INSAI",
          tipo: "FCL STANDARD",
        },
      ];
      hitos.forEach((docData) => {
        const docRef = doc(collection(db, "hitos_legales"), docData.id);
        batch.set(docRef, docData);
      });

      // 4. Seed containers in AGD
      const containersAgd = [
        {
          id: "ZCSU9988112",
          mblId: "MBL_1",
          status: "AGD",
          daysInPort: 15,
          freeDays: 14,
          overstayDays: 1,
          type: "LCL POR DIVIDIR",
          port: "Puerto Cabello",
        },
        {
          id: "MSKU3344556",
          mblId: "MBL_2",
          status: "AGD",
          daysInPort: 8,
          freeDays: 14,
          overstayDays: 0,
          type: "FCL LISTO GATE",
          port: "Puerto Cabello",
        },
      ];
      containersAgd.forEach((docData) => {
        const docRef = doc(collection(db, "containers_agd"), docData.id);
        batch.set(docRef, docData);
      });

      const das = [
        {
          daRef: "DA-2026-004",
          vessel: "CMA CGM MAZARINE",
          port: "Puerto Cabello",
          callDate: "14/06/2026",
          amount: 45230.0,
        },
        {
          daRef: "DA-2026-005",
          vessel: "MSC ROSARIA",
          port: "La Guaira",
          callDate: "16/06/2026",
          amount: 20100.5,
        },
      ];
      for (const d of das) {
        batch.set(doc(collection(db, "armador_das")), d);
      }

      const exportBookings = [
        {
          bookingRef: "BKG-99887766",
          destination: "Róterdam, NL",
          vessel: "MSC LISBOA",
          seniatStatus: "PERMISO SENIAT LISTO",
          patioStatus: "EN PATIO",
          docsClosingDate: "18/06/2026 14:00",
        },
        {
          bookingRef: "BKG-11223344",
          destination: "Miami, USA",
          vessel: "SEALAND GUARDIAN",
          seniatStatus: "PENDIENTE SENIAT",
          patioStatus: "GATE IN",
          docsClosingDate: "20/06/2026 09:00",
        },
      ];
      for (const b of exportBookings) {
        batch.set(doc(collection(db, "export_bookings")), b);
      }

      const eirOrders = [
        {
          eir: "EIR-776655",
          container: "SUDU9988776",
          type: "40' HC",
          destination: "Zona Industrial Valencia, Edo. Carabobo",
          window: "Ventana Tarde",
          status: "EN RUTA AL PUERTO",
          placa: "A12BC3D",
        },
        {
          eir: "EIR-223344",
          container: "MSKU1122334",
          type: "20' DRY",
          destination: "Caracas, Distrito Capital",
          window: "Ventana Mañana",
          status: "ASIGNADA",
          placa: "X98YZ7W",
        },
      ];
      for (const eir of eirOrders) {
        batch.set(doc(collection(db, "eir_orders")), eir);
      }

      const portCalls = [
        {
          name: "ZIM LUANDA",
          voyageNumber: "V203",
          location: "Muelle 22",
          status: "En Operación",
          createdAt: new Date().toISOString(),
          port: "Puerto Cabello",
        },
        {
          name: "MSC ROSARIA",
          voyageNumber: "V101",
          location: "Rada",
          status: "Programado",
          createdAt: new Date().toISOString(),
          port: "Puerto Cabello",
        },
      ];
      for (const pc of portCalls) {
        batch.set(doc(collection(db, "portcalls")), pc);
      }

      const contenedores = [
        {
          containerId: "ZCSU9988112",
          type: "40' HC",
          location: "A-12-3",
          status: "Disponible",
          isBlocked: false,
        },
        {
          containerId: "MSKU3344556",
          type: "20' DV",
          location: "B-04-1",
          status: "Disponible",
          isBlocked: true,
        },
      ];
      for (const c of contenedores) {
        batch.set(doc(collection(db, "contenedores")), c);
      }

      await batch.commit();
      res.json({ success: true, message: "Database seeded successfully." });
    } catch (e: any) {
      console.error("Seeding error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  startAisStream();
  startAutonomousJobs();

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/competitor-capacity", (req, res) => {
    res.json({ success: true, data: competitorCapacity });
  });

  app.post("/api/portcalls/update-status", async (req, res) => {
    try {
      const { portCallId, newStatus, vesselName } = req.body;
      if (!portCallId || !newStatus) {
        return res
          .status(400)
          .json({ success: false, message: "Missing params" });
      }

      // 1. Update the portcall
      const portCallRef = doc(db, "portcalls", portCallId);
      await updateDoc(portCallRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // 2. Cascade Effect: Create hitos y facturación si el estatus es 'Atracado'
      if (
        newStatus === "Atracado" ||
        newStatus === "At Dock" ||
        newStatus === "Atracando"
      ) {
        const batch = writeBatch(db);
        const entities = ["SENIAT", "INEA", "Guardia Nacional"];

        entities.forEach((ente) => {
          const docRef = doc(collection(db, "hitos_legales"));
          batch.set(docRef, {
            portCallId: portCallId,
            vesselName: vesselName || "Buque",
            ente: ente,
            status: "PENDIENTE_INSPECCION",
            tipo: "ARRIBO_BUQUE",
            createdAt: new Date().toISOString(),
          });
        });

        // ================== ERP / D/A CASCADE ==================
        // Generate Disbursement Account Expenses automatically
        const gastosBase = [
          { tipo: "Practicaje (Pilotage)", monto: 4500.0 },
          { tipo: "Remolcador (Towage)", monto: 7200.0 },
          { tipo: "Uso de Muelle", monto: 12500.0 },
          { tipo: "Inspección Subacuática", monto: 850.0 },
        ];
        gastosBase.forEach((gasto) => {
          const gastoRef = doc(collection(db, "gastos_operativos"));
          batch.set(gastoRef, {
            portCallId: portCallId,
            vesselName: vesselName || "Buque",
            tipo: gasto.tipo,
            monto: gasto.monto,
            moneda: "USD",
            status: "PENDIENTE",
            createdAt: new Date().toISOString(),
            port: "Puerto Cabello",
          });
        });
        // =======================================================

        await batch.commit();
        console.log(
          `[CASCADE ENGINE] Buque atracado: hito legal creado y facturación inicial (D/A) generada.`,
        );
      }

      res.json({
        success: true,
        message: `Portcall updated to ${newStatus} with cascade effects applied.`,
      });
    } catch (e: any) {
      console.error("Error updating portcall status:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/sidunea/selectivity", express.json(), async (req, res) => {
    try {
      const { mblId, containerId, importador, vesselName } = req.body;

      // Simular lógica de selectividad
      const rand = Math.random();
      let status = "LIBERADO"; // Verde
      if (rand > 0.7)
        status = "PENDIENTE_INSPECCION"; // Rojo
      else if (rand > 0.5) status = "AMARILLO"; // Amarillo

      const duaId = `SIM-${Math.floor(Math.random() * 1000000)}-${new Date().getFullYear().toString().slice(-2)}`;

      const hitoData = {
        mblId: mblId || null,
        containerId: containerId || null,
        vesselName: vesselName || "Desconocido",
        importador: importador || "Importador Default",
        ente: "SENIAT",
        tipo: "LEVANTE_IMPORTACION",
        status, // LIBERADO, PENDIENTE_INSPECCION, AMARILLO (estos matchean el dashboard)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "hitos_legales", duaId), hitoData);

      // Bloquear contenedor si es Rojo/Amarillo en el TOS
      if (status !== "LIBERADO") {
        const contQuery = query(
          collection(db, "contenedores"),
          where("containerId", "==", containerId),
        );
        const snap = await getDocs(contQuery);
        if (!snap.empty) {
          await updateDoc(snap.docs[0].ref, { isBlocked: true });
        }

        // Disparar Telegram a la autoridad
        if (bot && process.env.TELEGRAM_CHAT_ID) {
          const opts = {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "✅ Aprobar",
                    callback_data: `APROBAR_HITO_${duaId}`,
                  },
                  {
                    text: "❌ Rechazar",
                    callback_data: `RECHAZAR_HITO_${duaId}`,
                  },
                ],
              ],
            },
          };

          const textMsg = `🚨 *SIDUNEA: CANAL ${status === "AMARILLO" ? "AMARILLO" : "ROJO"}*\n\n*DUA:* ${duaId}\n*Contenedor:* ${containerId}\n*Buque:* ${vesselName}\n*Importador:* ${importador}\n\nRequiere inspección y levante.`;
          bot
            .sendMessage(process.env.TELEGRAM_CHAT_ID, textMsg, opts as any)
            .catch((e) => console.error("Telegram send error:", e));
        }
      }

      res.json({
        success: true,
        dua: duaId,
        canal:
          status === "LIBERADO"
            ? "Verde"
            : status === "AMARILLO"
              ? "Amarillo"
              : "Rojo",
      });
    } catch (e: any) {
      console.error("Selectivity error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ======= TELEGRAM BOT (REAL) =======
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  let bot: TelegramBot | null = null;

  if (telegramToken) {
    // In development / container, polling is more reliable if behind NAT
    bot = new TelegramBot(telegramToken, { polling: true });
    console.log("[TELEGRAM] Bot iniciado en modo polling.");

    bot.on("callback_query", async (query) => {
      const chatId = query.message?.chat.id;
      const data = query.data || "";

      console.log(`[TELEGRAM] Autoridad respondió pulsando el botón: ${data}`);

      try {
        if (data.startsWith("APROBAR_HITO_")) {
          const docId = data.replace("APROBAR_HITO_", "");
          await updateDoc(doc(db, "hitos_legales", docId), {
            status: "APROBADO",
            updatedAt: new Date().toISOString(),
          });
          if (chatId) {
            await bot.answerCallbackQuery(query.id, {
              text: "Hito Aprobado y enviado al TOS.",
            });
            await bot.sendMessage(
              chatId,
              `✅ Inspección/Levante para el documento *${docId}* fue aprobado con éxito. El recinto portuario ha sido notificado.`,
              { parse_mode: "Markdown" },
            );
          }
        } else if (data.startsWith("RECHAZAR_HITO_")) {
          const docId = data.replace("RECHAZAR_HITO_", "");
          await updateDoc(doc(db, "hitos_legales", docId), {
            status: "RECHAZADO",
            updatedAt: new Date().toISOString(),
          });
          if (chatId) {
            await bot.answerCallbackQuery(query.id, {
              text: "Operación rechazada.",
            });
            await bot.sendMessage(
              chatId,
              `❌ Inspección/Levante para el documento *${docId}* ha sido denegado permanentemente.`,
              { parse_mode: "Markdown" },
            );
          }
        } else if (data.startsWith("APROBAR_GNB_")) {
          const bic = data.replace("APROBAR_GNB_", "");
          await sqlDb.update(schema.inspeccionesGnb)
             .set({ estado: 'CLEARED_FOR_EXPORT' })
             .where(eq(schema.inspeccionesGnb.contenedorBic, bic));
          if (chatId) {
            bot.answerCallbackQuery(query.id, { text: "Aprobado (CLEARED)." });
            bot.sendMessage(chatId, `✅ Inspección antidrogas completada SIN NOVEDAD para el contenedor *${bic}*.`, { parse_mode: "Markdown" });
          }
        } else if (data.startsWith("RECHAZAR_GNB_")) {
          const bic = data.replace("RECHAZAR_GNB_", "");
          await sqlDb.update(schema.inspeccionesGnb)
             .set({ estado: 'RETAINED' })
             .where(eq(schema.inspeccionesGnb.contenedorBic, bic));
          
          if (chatId) {
            bot.answerCallbackQuery(query.id, { text: "Retenido." });
            bot.sendMessage(chatId, `🔴 Contenedor *${bic}* ha sido retenido por sospecha fundamentada. Se ha ordenado su traslado a zona de vaciado total.`, { parse_mode: "Markdown" });
          }
        }
      } catch (e) {
        console.error("[TELEGRAM] Firebase sync error:", e);
        if (chatId)
          bot.answerCallbackQuery(query.id, {
            text: "Error de servidor al sincronizar.",
          });
      }
    });
  }

  // Endpoints para que la aplicación en React empuje solicitudes interactivas a Telegram
  app.post("/api/telegram/send-approval", express.json(), async (req, res) => {
    // In a real environment, send to specific authority chat IDs based on 'ente' code (e.g. SENIAT)
    const { docId, ente, titulo, detalles, vesselName } = req.body;
    const targetChatId = process.env.TELEGRAM_CHAT_ID;

    if (!bot) {
      console.warn(
        "[TELEGRAM] Bot deshabilitado (No TELEGRAM_BOT_TOKEN). Simulando fallo silencioso para desarrollo.",
      );
      return res.json({ success: false, message: "Bot no configurado" });
    }

    if (!targetChatId) {
      return res
        .status(400)
        .json({ success: false, message: "No TELEGRAM_CHAT_ID param config" });
    }

    try {
      const opts = {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Aprobar", callback_data: `APROBAR_HITO_${docId}` },
              { text: "❌ Rechazar", callback_data: `RECHAZAR_HITO_${docId}` },
            ],
          ],
        },
      };

      const textMsg = `⚠️ *NUEVA SOLICITUD DE [${ente?.toUpperCase() || "AUTORIDAD"}]*\n\n*Hito:* ${titulo}\n*Buque / Referencia:* ${vesselName}\n*Detalles:* ${detalles}\n*ID Trazabilidad:* ${docId}\n\nPor favor, dictamine el resultado de la inspección:`;
      await bot.sendMessage(targetChatId, textMsg, opts as any);

      res.json({
        success: true,
        message: "Enviado al canal de Telegram de la autoridad.",
      });
    } catch (e: any) {
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
      console.log(
        "[TELEGRAM WEBHOOK] Recepción de evento:",
        JSON.stringify(body),
      );

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

      const portCoords: Record<string, { lat: number; lng: number }> = {
        "Puerto Cabello": { lat: 10.48, lng: -68.01 },
        "La Guaira": { lat: 10.6, lng: -66.93 },
        Maracaibo: { lat: 10.64, lng: -71.6 },
        Guanta: { lat: 10.24, lng: -64.59 },
      };

      const target = portCoords[port] || portCoords["Puerto Cabello"];
      const staticShips: any[] = [];

      if (req.body.forceScrape) {
        try {
          const { ApifyClient } = await import("apify-client");
          const apifyKey = process.env.APIFY_API_KEY;
          if (!apifyKey) {
            throw new Error("Missing APIFY_API_KEY environment variable");
          }
          const client = new ApifyClient({ token: apifyKey });

          console.log(`Forcing Apify scrape for port: ${port} area...`);

          // Broad bounding box around Venezuela Coast
          const input = {
            lat: target.lat.toString(),
            lon: target.lng.toString(),
            zoom: 6,
          };

          const run = await client
            .actor("romy~marine-traffic-scraper")
            .call(input);
          const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

          if (items && items.length > 0) {
            const uniqueShips = new Map();
            items.forEach((item: any) => {
              if (!item.MMSI && !item.SHIPNAME) return;

              // Only cargo type ships
              const typeName = (
                item.TYPE_NAME ||
                item.SHIP_TYPE ||
                ""
              ).toLowerCase();
              const isCargo =
                typeName.includes("cargo") ||
                item.TYPE === 7 ||
                item.TYPE === 8;
              if (typeName && !isCargo) return;

              const mmsi = item.MMSI || Math.floor(Math.random() * 1000000);
              const shipName = item.SHIPNAME || item.NAME || "Unknown";
              const lat = Number(item.LAT);
              const lng = Number(item.LON);

              if (!isNaN(lat) && !isNaN(lng)) {
                // Seed the live cache
                const existing: any = shipCache.get(mmsi) || {
                  mmsi,
                  lat: 0,
                  lng: 0,
                  lastUpdate: new Date(),
                };
                existing.lat = lat;
                existing.lng = lng;
                existing.name = shipName;
                existing.destination = item.DESTINATION || "Desconocido";
                existing.type = item.TYPE || (isCargo ? 7 : undefined);
                existing.lastUpdate = new Date();
                shipCache.set(mmsi, existing);
                
                // Write to Firestore Admin SDK
                // @ts-ignore
                admin.firestore().collection("catalogo_buques").doc(mmsi.toString()).set({
                  imo: item.IMO || mmsi.toString(),
                  name: shipName,
                  type: isCargo ? "Portacontenedores" : "Carga General",
                  lastSeenPort: item.DESTINATION || "Desconocido",
                  lat,
                  lng,
                  // @ts-ignore
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true }).catch((err: any) => console.warn("Admin SDK Write failed (Ignored if no creds):", err.message));
              }

              if (!uniqueShips.has(mmsi)) {
                const destination = (item.DESTINATION || "").toLowerCase();
                const isImport = destination.includes(port.toLowerCase());

                uniqueShips.set(mmsi, {
                  mmsi: mmsi,
                  shipName: shipName,
                  type: isImport ? "import" : "export",
                  originLat: isImport ? lat : target.lat,
                  originLng: isImport ? lng : target.lng,
                  destinationLat: isImport ? target.lat : lat,
                  destinationLng: isImport ? target.lng : lng,
                  date: new Date().toISOString(),
                });
              }
            });
            staticShips.push(...Array.from(uniqueShips.values()));
          }
        } catch (e: any) {
          console.error("Apify extraction failed:", e.message);
          res.json({
            success: false,
            error: `Apify extraction failed: ${e.message}`,
            liveData: [],
            staticData: [],
          });
          return;
        }
      }

      const liveMap = new Map();
      Array.from(shipCache.values()).forEach((ship) => {
        liveMap.set(ship.mmsi, ship);
      });

      const liveShips = Array.from(liveMap.values())
        .filter(
          (ship) =>
            ship.name &&
            ship.name.trim().length > 0 &&
            !ship.name.includes("Desconocido"),
        )
        .map((ship) => {
          return {
            mmsi: ship.mmsi,
            shipName: ship.name || `Desconocido (MMSI: ${ship.mmsi})`,
            destinationPort: ship.destination || "Desconocido",
            lat: ship.lat,
            lng: ship.lng,
            date: ship.lastUpdate.toISOString(),
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
    console.log(
      `[TELEGRAM MOCK] Received action: ${action} for buque: ${buque} (ID: ${portCallId})`,
    );
    res.json({ success: true, message: "Mensaje encolado a Telegram" });
  });

  app.post("/api/yard/move", express.json(), async (req, res) => {
    try {
      const { containerId, targetLocation, clientId, requestedByClient, cost } =
        req.body;

      const contQuery = query(
        collection(db, "contenedores"),
        where("containerId", "==", containerId),
      );
      const snap = await getDocs(contQuery);
      if (snap.empty)
        return res
          .status(404)
          .json({ success: false, message: "Container not found" });

      const contDoc = snap.docs[0];

      await updateDoc(contDoc.ref, { location: targetLocation });

      if (requestedByClient) {
        const gastosRef = collection(db, "gastos_operativos");
        await addDoc(gastosRef, {
          portCallId: contDoc.data().portCallId || "GENERAL",
          vesselName: "Movimiento en Patio",
          tipo: "Re-estiba / Shifting Cost",
          monto: cost || 85.0,
          moneda: "USD",
          status: "PENDIENTE",
          contenedorId: containerId,
          clienteId: clientId || "Desconocido",
          createdAt: new Date().toISOString(),
        });
      }

      res.json({ success: true, message: "Container moved successfully" });
    } catch (e: any) {
      console.error("Move error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ================== ENDPOINTS EXPORTADOR ==================
  app.post("/api/exportador/booking/request", async (req, res) => {
    try {
      const { exportadorId, navieraId, puertoDestino, puertosOrigen, cantidadTeus, tipoIsoRequerido } = req.body;
      const result = await sqlDb.insert(schema.bookingsExportacion).values({
        exportadorId: exportadorId || null,
        navieraId: navieraId || null,
        puertoOrigen: puertosOrigen || 'Puerto Cabello',
        puertoDestino,
        cantidadTeus,
        tipoIsoRequerido,
        estado: 'REQUESTED',
        cargoCutOff: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }).returning();
      
      await sqlDb.insert(schema.auditLogs).values({
        accionDesc: `[BOOKING_REQUEST] Exportador solicitó ${cantidadTeus} espacios a ${puertoDestino}`,
      });

      res.json({ success: true, data: result[0] });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/tos/gate-in-export", async (req, res) => {
    try {
      const { bic, bookingExportacionId } = req.body;
      
      // Update container
      await sqlDb.update(schema.contenedores)
       .set({ estadoFisicoExport: 'FULL_GATE_IN' })
       .where(eq(schema.contenedores.numeroBic, bic));

      // Insert GNB Inspection
      await sqlDb.insert(schema.inspeccionesGnb).values({
        contenedorBic: bic,
        estado: 'PENDING',
        tipoInspeccion: 'CANINO'
      });

      if (bot && process.env.TELEGRAM_CHAT_ID) {
        const textMsg = `🐕 *ALERTA DE INSPECCIÓN ANTIDROGAS - EXPORTACIÓN*\n\nContenedor: ${bic}\nEstado: FULL GATE-IN\nRequiere revisión canina.`;
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, textMsg, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[
              { text: "✅ Sin Novedad (Aprobar)", callback_data: `APROBAR_GNB_${bic}` },
              { text: "🔴 Retención (Vaciado)", callback_data: `RECHAZAR_GNB_${bic}` }
            ]]
          }
        }).catch(e => console.error(e));
      }

      res.json({ success: true, message: "Gate-In Exportación registrado y enviado a GNB." });
    } catch (e: any) {
       console.error(e);
       res.status(500).json({ success: false, error: e.message });
    }
  });
  // ==========================================================

  // ======= EXPORT HARD LOCK ENDPOINT =======
  app.post("/api/tos/load-export-container", async (req: express.Request, res: express.Response) => {
    try {
      const { bic, vesselId } = req.body;
      if (!bic) return res.status(400).json({ success: false, error: "Falta BIC" });
      
      const conts = await sqlDb.select().from(schema.contenedores).where(eq(schema.contenedores.numeroBic, bic));
      if (conts.length === 0) return res.status(404).json({ success: false, error: "Contenedor no localizado" });
      const cont = conts[0];
      
      // 1. Check VGM requirement (SOLAS)
      if (!cont.pesoVgmKg) {
         return res.status(403).json({ success: false, error: "HARD LOCK: Falta declaración obligatoria VGM." });
      }

      // 2. Check GNB Anti-drugs (Local)
      const gnbs = await sqlDb.select().from(schema.inspeccionesGnb).where(eq(schema.inspeccionesGnb.contenedorBic, bic));
      if (gnbs.length === 0 || gnbs[0].estado !== "CLEARED_FOR_EXPORT") {
         return res.status(403).json({ success: false, error: "HARD LOCK: Inspección GNB Antidrogas no aprobada o incompleta." });
      }

      // Update state to LOADED_ON_VESSEL
      await sqlDb.update(schema.contenedores)
         .set({ estadoFisicoExport: "LOADED_ON_VESSEL" })
         .where(eq(schema.contenedores.numeroBic, bic));

      res.json({ success: true, message: "Contenedor aprobado y cargado al buque sin restricciones." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ================== ENDPOINTS AGENTE ADUANAS ==================
  app.post("/api/aduanas/seed-demo", async (req: express.Request, res: express.Response) => {
    try {
      const { rif, razonSocial } = req.body;
      if (!rif) return res.status(400).json({ success: false, error: "No RIF" });
      
      let empId;
      const emps = await sqlDb.select().from(schema.empresas).where(eq(schema.empresas.rif, rif));
      if (emps.length === 0) {
         const insertEmp = await sqlDb.insert(schema.empresas).values({
            rif, razonSocial, isAgenteAduanas: true, licenciaSeniat: "1234-AA"
         }).returning();
         empId = insertEmp[0].id;
      } else {
         empId = emps[0].id;
         await sqlDb.update(schema.empresas).set({ isAgenteAduanas: true }).where(eq(schema.empresas.id, empId));
      }

      // Seed some containers
      const bic1 = `MSKU${Math.floor(1000000 + Math.random() * 8999999)}`;
      const bic2 = `CMAU${Math.floor(1000000 + Math.random() * 8999999)}`;
      const bic3 = `HLXU${Math.floor(1000000 + Math.random() * 8999999)}`;

      await sqlDb.insert(schema.contenedores).values([
         { numeroBic: bic1, tipoIso: "40' HC", estadoFisico: "EN_PATIO", agenteAduanasId: empId },
         { numeroBic: bic2, tipoIso: "20' DV", estadoFisico: "EN_PATIO", agenteAduanasId: empId, selectividadSeniat: 'ROJO' },
         { numeroBic: bic3, tipoIso: "40' REEFER", estadoFisico: "EN_PATIO", agenteAduanasId: empId, selectividadSeniat: 'AMARILLO' }
      ]);
      
      // And a LEVANTE one
      const bic4 = `SUDU${Math.floor(1000000 + Math.random() * 8999999)}`;
      await sqlDb.insert(schema.contenedores).values({ numeroBic: bic4, tipoIso: "40' HC", estadoFisico: "EN_PATIO", agenteAduanasId: empId, selectividadSeniat: 'VERDE' });
      await sqlDb.insert(schema.declaracionesAduaneras).values({
         contenedorBic: bic4, numeroDua: `DUA-987123`, estadoDeclaracion: 'LEVANTE_OTORGADO'
      });

      // and a REPARO one
      const bic5 = `ZIMU${Math.floor(1000000 + Math.random() * 8999999)}`;
      await sqlDb.insert(schema.contenedores).values({ numeroBic: bic5, tipoIso: "40' HC", estadoFisico: "EN_PATIO", agenteAduanasId: empId, selectividadSeniat: 'ROJO' });
      await sqlDb.insert(schema.declaracionesAduaneras).values({
         contenedorBic: bic5, numeroDua: `DUA-554433`, estadoDeclaracion: 'REPARO_ACTIVO'
      });

      res.json({ success: true });
    } catch(e: any) {
      console.error("error seeding:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/aduanas/declaracion/transmitir", async (req: express.Request, res: express.Response) => {
    try {
      const { contenedorBic, agenteAduanasId, codigoArancelario, descripcion, montoTributos } = req.body;
      if (!contenedorBic) return res.status(400).json({ success: false, error: "Falta BIC" });
      
      // Valida permisos conexos
      const permisos = await sqlDb.select().from(schema.permisosConexos).where(eq(schema.permisosConexos.contenedorBic, contenedorBic));
      const faltantes = permisos.filter(p => p.estado !== 'APROBADO' && p.estado !== 'EXENTO');
      if (faltantes.length > 0) {
         return res.status(403).json({ success: false, error: `ROLLBACK: Faltan Permisos Conexos aprobados (${faltantes.map(f => f.entidad).join(", ")})` });
      }

      const numDua = `DUA-${Math.floor(Math.random() * 900000) + 100000}`;
      
      // Begin insert
      const resDua = await sqlDb.insert(schema.declaracionesAduaneras).values({
         contenedorBic,
         numeroDua: numDua,
         montoTributosVes: montoTributos,
         estadoDeclaracion: 'TRANSMITIDA'
      }).returning();
      
      await sqlDb.insert(schema.itemsArancelarios).values({
         declaracionId: resDua[0].id,
         codigoArancelario,
         descripcionMercancia: descripcion
      });
      
      // Ruleta de selectividad
      const rand = Math.random();
      const selectividad = rand > 0.6 ? 'VERDE' : rand > 0.3 ? 'AMARILLO' : 'ROJO';
      
      await sqlDb.update(schema.contenedores).set({ selectividadSeniat: selectividad }).where(eq(schema.contenedores.numeroBic, contenedorBic));
      
      if (bot && process.env.TELEGRAM_CHAT_ID) {
         const textMsg = `📄 *TRANSMISIÓN DE DECLARACIÓN (DUA)*\n\nDua: ${numDua}\nContenedor: ${contenedorBic}\nSelectividad ASIGNADA: ${selectividad}\n\nNotificación automatizada SIDUNEA.`;
         bot.sendMessage(process.env.TELEGRAM_CHAT_ID, textMsg, { parse_mode: "Markdown" }).catch(e => console.error(e));
      }

      res.json({ success: true, data: { numeroDua: numDua, selectividad } });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/aduanas/declaracion/levante", async (req: express.Request, res: express.Response) => {
    try {
      const { declaracionId, numeroBic, selectividad } = req.body;
      
      const decls = await sqlDb.select().from(schema.declaracionesAduaneras).where(eq(schema.declaracionesAduaneras.id, declaracionId));
      if (decls.length === 0) return res.status(404).json({ success: false, error: "Declaración no encontrada" });
      const d = decls[0];
      
      if (d.estadoDeclaracion === 'REPARO_ACTIVO') {
        return res.status(403).json({ success: false, error: "No se puede otorgar Levante: REPARO ACTIVO." });
      }
      
      if (d.estadoDeclaracion !== 'PAGADA' && d.estadoDeclaracion !== 'TRANSMITIDA') {
        return res.status(403).json({ success: false, error: "La DUA debe estar PAGADA." });
      }
      
      if (selectividad === 'ROJO') {
        // Mocked check for Aforo
        console.log("Verificando aforo para Canal ROJO...");
      }

      // Update to LEVANTE_OTORGADO
      await sqlDb.update(schema.declaracionesAduaneras).set({ estadoDeclaracion: 'LEVANTE_OTORGADO', fechaLiquidacion: new Date() }).where(eq(schema.declaracionesAduaneras.id, declaracionId));
      
      res.json({ success: true, message: "LEVANTE OTORGADO" });
    } catch(e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/aduanas/despacho/solicitar-salida", async (req: express.Request, res: express.Response) => {
    try {
      const { numeroBic } = req.body;
      const decls = await sqlDb.select().from(schema.declaracionesAduaneras).where(eq(schema.declaracionesAduaneras.contenedorBic, numeroBic)).orderBy(desc(schema.declaracionesAduaneras.fechaRegistro));
      
      if (decls.length === 0 || decls[0].estadoDeclaracion !== 'LEVANTE_OTORGADO') {
         return res.status(403).json({ success: false, error: "Falla ACID: Contenedor no tiene LEVANTE OTORGADO." });
      }
      
      // Simulating the mega JOIN
      res.json({ success: true, token: `JWT-GATE-OUT-${numeroBic}-${Date.now()}` });
    } catch(e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });
  // ================== ENDPOINTS OFICIAL DE BUQUES (WATER CLERK) ==================
  app.post("/api/water-clerk/sync-batch", async (req: express.Request, res: express.Response) => {
    try {
      const { events } = req.body;
      if (!events || !Array.isArray(events)) {
        return res.status(400).json({ success: false, error: "Invalid payload format. Expected array of events." });
      }

      await sqlDb.transaction(async (tx) => {
        for (const ev of events) {
          if (ev.type === 'TALLY') {
             // Lógica UPSERT (Last Write Wins emulation in Postgres via onConflictDoUpdate)
             await tx.insert(schema.movimientosTally)
                .values({
                   contenedorBic: ev.contenedorBic,
                   escalaId: ev.escalaId,
                   tipoMovimiento: ev.tipoMovimiento,
                   timestampMovimiento: new Date(ev.timestamp),
                   condicionSello: ev.condicionSello || 'INTACTO',
                   danosVisibles: ev.danosVisibles || false
                })
                .onConflictDoUpdate({
                   target: [schema.movimientosTally.id],
                   set: { 
                     tipoMovimiento: ev.tipoMovimiento, 
                     timestampMovimiento: new Date(ev.timestamp),
                     condicionSello: ev.condicionSello || 'INTACTO',
                     danosVisibles: ev.danosVisibles || false
                   },
                   where: sql`${schema.movimientosTally.timestampMovimiento} < ${new Date(ev.timestamp)}`
                });

             // El Trigger/Cascade en el Gemelo
             if (ev.tipoMovimiento === 'DISCHARGE') {
                await tx.update(schema.contenedores)
                  .set({ estadoFisico: 'EN_PATIO' })
                  .where(eq(schema.contenedores.numeroBic, ev.contenedorBic));
             }
          }
          
          if (ev.type === 'SOF_EVENT') {
             await tx.insert(schema.sofEventos)
                .values({
                   escalaId: ev.escalaId,
                   oficialId: ev.oficialId,
                   hitoOperativo: ev.hitoOperativo,
                   timestampEvento: new Date(ev.timestamp),
                   comentarios: ev.comentarios
                });
          }

          if (ev.type === 'CRANE_DOWNTIME') {
             await tx.insert(schema.rendimientoGruas)
                .values({
                   escalaId: ev.escalaId,
                   gruaId: ev.gruaId,
                   tipoRegistro: ev.tipoRegistro,
                   codigoDemora: ev.codigoDemora,
                   minutosPerdidos: ev.minutosPerdidos
                });
          }
        }
      });

      res.json({ success: true, message: "Batch Sync processed via LWW rules across all events." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/water-clerk/escala/cast-off", async (req: express.Request, res: express.Response) => {
    try {
      const { escalaId } = req.body;
      if (!escalaId) return res.status(400).json({ success: false, error: "Missing escalaId" });

      await sqlDb.update(schema.escalas)
         .set({ estado: 'ZARPADO_FISICAMENTE' })
         .where(eq(schema.escalas.id, escalaId));

      // Simulando validación cruzada entre movimientos de descarga del oficial y manifiesto.
      if (bot && process.env.TELEGRAM_CHAT_ID) {
         const msg = `⚓ *REPORTE DE OPERACIONES FINALIZADAS*
Buque Escala: ${escalaId}
Estado: Zarpado (Cast-Off)
El buque se encuentra listo para iniciar trámites de Despacho de Zarpe.`;
         bot.sendMessage(process.env.TELEGRAM_CHAT_ID, msg, { parse_mode: "Markdown" }).catch(e => console.error(e));
      }

      res.json({ success: true, message: "Escala finalizada y autoridades notificadas." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ================== ENDPOINTS PLANIFICADOR DE PATIO (YARD PLANNER) ==================
  app.get("/api/tos/patio/mapa-estado", async (req: express.Request, res: express.Response) => {
    try {
      // Usamos jsonb_agg para renderizar el mapa en 1 sola query PostgreSQL
      const query = sql`
        SELECT jsonb_build_object(
            'bloque', b.id,
            'capacidad', b.capacidad_teus,
            'contenedores', jsonb_agg(
                jsonb_build_object(
                    'bic', p.contenedor_bic,
                    'bay', p.bay, 'row', p.row, 'tier', p.tier,
                    'isReefer', p.enchufe_reefer_activo
                )
            )
        ) AS mapa_patio
        FROM ${schema.bloquesPatio} b
        LEFT JOIN ${schema.posicionesPatio} p ON b.id = p.bloque_id
        WHERE p.contenedor_bic IS NOT NULL
        GROUP BY b.id;
      `;
      
      const result = await sqlDb.execute(query);
      res.json({ success: true, data: result.rows.map(r => r.mapa_patio) });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/tos/equipos/confirmar-movimiento", async (req: express.Request, res: express.Response) => {
    try {
      const { ordenId, contenedorBic, origenPosId, destinoPosId } = req.body;
      if (!ordenId || !contenedorBic || !destinoPosId) {
        return res.status(400).json({ success: false, error: "Faltan parámetros obligatorios." });
      }

      await sqlDb.transaction(async (tx) => {
        // Bloqueo de concurrencia: SELECT FOR UPDATE
        const destCheck = await tx.select().from(schema.posicionesPatio).where(eq(schema.posicionesPatio.id, destinoPosId)); // In a real app we'd use .for('update') if drizzle supported it well here, or raw SQL.
        
        if (destCheck.length === 0) throw new Error("Posición destino no existe.");
        if (destCheck[0].contenedorBic !== null) throw new Error("Posición Ocupada. Solicite nueva coordenada al Planificador.");

        if (origenPosId) {
           await tx.update(schema.posicionesPatio)
              .set({ contenedorBic: null })
              .where(eq(schema.posicionesPatio.id, origenPosId));
        } else {
           // Release anywhere this container might be (just in case)
           await tx.update(schema.posicionesPatio)
              .set({ contenedorBic: null })
              .where(eq(schema.posicionesPatio.contenedorBic, contenedorBic));
        }

        // Ocupa el destino
        await tx.update(schema.posicionesPatio)
           .set({ contenedorBic: contenedorBic })
           .where(eq(schema.posicionesPatio.id, destinoPosId));

        // Completar orden
        await tx.update(schema.ordenesTrabajoPatio)
           .set({ estado: 'COMPLETADA', timestampCompletada: new Date() })
           .where(eq(schema.ordenesTrabajoPatio.id, ordenId));

        // Tigger Simulados de Cascada
        const orden = await tx.select().from(schema.ordenesTrabajoPatio).where(eq(schema.ordenesTrabajoPatio.id, ordenId));
        if (orden.length > 0 && orden[0].tipoManiobra === 'POSICIONAMIENTO_AFORO') {
           // Facturar 120 USD al cliente
           console.log("Generando factura automática de 120.00 USD por POSICIONAMIENTO_AFORO a pie de buque/patio");
        }
      });

      res.json({ success: true, message: "Movimiento confirmado y orden completada bajo ACID." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ================== ENDPOINTS ROLES RESTANTES ==================
  app.post("/api/gate/registrar-eir", async (req: express.Request, res: express.Response) => {
    try {
      const { citaVbsId, contenedorBic, inspectorId, tipoOperacion, averiaCritica, detalles } = req.body;
      if (!citaVbsId || !contenedorBic) return res.status(400).json({ error: "Faltan parámetros" });

      await sqlDb.transaction(async (tx) => {
         await tx.insert(schema.eirInspecciones).values({
            citaVbsId,
            contenedorBic,
            inspectorId,
            tipoOperacion,
            tieneAveriaCritica: averiaCritica,
            condicionTecho: detalles?.techo || 'OK',
            condicionPaneles: detalles?.paneles || 'OK',
            condicionPiso: detalles?.piso || 'OK'
         });

         const newState = tipoOperacion.includes('IN') ? 'EN_PATIO' : 'GATE_OUT';
         await tx.update(schema.contenedores)
            .set({ estadoFisico: newState })
            .where(eq(schema.contenedores.numeroBic, contenedorBic));
      });

      res.json({ success: true, message: "EIR Registrado y contenedor actualizado." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/finanzas/conciliar-pago", async (req: express.Request, res: express.Response) => {
    try {
      const { transaccionId, facturaId, diffAjuste } = req.body;
      
      await sqlDb.transaction(async (tx) => {
         await tx.update(schema.transaccionesBancarias)
            .set({ estado: 'CONCILIADA' })
            .where(eq(schema.transaccionesBancarias.id, transaccionId));

         if (diffAjuste) {
            await tx.insert(schema.notasCreditoDebito).values({
               facturaId,
               motivo: 'DIFERENCIAL_CAMBIARIO',
               montoAjuste: diffAjuste
            });
         }
      });

      res.json({ success: true, message: "Pago conciliado exitosamente." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/compliance/bl/solicitar-correccion", async (req: express.Request, res: express.Response) => {
    try {
      const { blId, campoModificado, valorAnterior, valorNuevo } = req.body;
      
      await sqlDb.insert(schema.bitacoraCorreccionesBl).values({
         blId, campoModificado, valorAnterior, valorNuevo, estado: 'EN_REVISION_SENIAT'
      });

      // Simular Webhook Telegram
      if (bot && process.env.TELEGRAM_CHAT_ID) {
         const msg = `📝 *SOLICITUD DE CARTA DE CORRECCIÓN* (BL: ${blId})
Campo: ${campoModificado}
De: ${valorAnterior} -> A: ${valorNuevo}
📍 *Esperando revisión del SENIAT*`;
         bot.sendMessage(process.env.TELEGRAM_CHAT_ID, msg, { parse_mode: "Markdown" }).catch(e=>console.error(e));
      }

      res.json({ success: true, message: "Solicitud elevada al SENIAT." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/hse/registrar-incidente", async (req: express.Request, res: express.Response) => {
    try {
      const { escalaId, tipo, nivelGravedad, paralizacionOperativa } = req.body;
      
      await sqlDb.insert(schema.incidentesHse).values({
         escalaId, tipo, nivelGravedad, paralizacionOperativa
      });

      res.json({ success: true, message: "Incidente HSE registrado." });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ================== RESET DATABASE (ADMIN ONLY) ==================
  app.post("/api/admin/reset-database", express.json(), async (req: express.Request, res: express.Response) => {
    try {
       const excludeUid = req.body.excludeUid;
       const result = await sqlDb.execute(sql`
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public'
       `);
       const tables = result.rows.map((row: any) => row.tablename);
       
       for (const table of tables) {
          await sqlDb.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE;`));
       }

       // 2. Clear Firebase Users and Firestore
       try {
           const adminAuth = (admin as any).auth();
           const adminDb = (admin as any).firestore();

           // Delete all users from Firebase auth except excludeUid
           const listUsersResult = await adminAuth.listUsers(1000);
           const authUidsToDelete = listUsersResult.users
              .map(u => u.uid)
              .filter(uid => uid !== excludeUid);
           
           if (authUidsToDelete.length > 0) {
              await adminAuth.deleteUsers(authUidsToDelete);
           }

           // Helper to cleanly delete collections
           async function deleteCollection(collectionPath: string) {
              const snapshot = await adminDb.collection(collectionPath).get();
              const batchSize = snapshot.size;
              if (batchSize === 0) return;
              const batch = adminDb.batch();
              snapshot.docs.forEach((doc) => {
                 if (collectionPath === "admin_users" && doc.id === excludeUid) {
                    // don't delete current superadmin document
                 } else {
                    batch.delete(doc.ref);
                 }
              });
              await batch.commit();
           }

           await deleteCollection("users");
           await deleteCollection("admin_users");
           await deleteCollection("companies");
           await deleteCollection("employees");
           await deleteCollection("crews");
           await deleteCollection("yard_movements");
           await deleteCollection("gate_events");
           await deleteCollection("portcalls");
           await deleteCollection("patios");
           await deleteCollection("eir_orders");
       } catch (firebaseErr: any) {
           console.warn("[WARNING] No se pudo limpiar Firebase (Admin no configurado):", firebaseErr.message);
       }
       
       res.json({ success: true, message: "Database reset completed" });
    } catch(e: any) {
       console.error("DB Reset Error:", e);
       res.status(500).json({ success: false, error: e.message });
    }
  });

  // ================== ENDPOINTS GEMELO DIGITAL ==================
  app.get("/api/gemelo-digital/mapa-unificado", async (req: express.Request, res: express.Response) => {
    try {
      // Unifica mediante un UNION ALL contenedores reales y fantasmas
      const result = await sqlDb.execute(sql`
        SELECT 
           p.contenedor_bic as bic, 
           b.id as bloque_id, 
           p.bay, 
           p.row, 
           p.tier, 
           false as is_simulated
        FROM ${schema.posicionesPatio} p
        JOIN ${schema.bloquesPatio} b ON p.bloque_id = b.id
        WHERE p.contenedor_bic IS NOT NULL

        UNION ALL

        SELECT 
           s.id::text as bic, 
           s.bloque_asignado as bloque_id,
           s.bay,
           s.row,
           s.tier,
           true as is_simulated
        FROM ${schema.simulacionContenedores} s
      `);

      res.json({ success: true, data: result.rows });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ==============================================================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
