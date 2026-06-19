import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import WebSocket from "ws";
import cron from "node-cron";
import * as cheerio from "cheerio";
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

import admin from "firebase-admin";

// Initialize Firebase Admin (Fallback for Server Node environments)
try {
  // @ts-ignore
  if (!admin.apps.length) {
    admin.initializeApp();
    console.log("[FIREBASE ADMIN] Inicializado correctamente en el servidor.");
  }
} catch (e) {
  console.warn("[FIREBASE ADMIN] No se pudo inicializar (Verificar credenciales GOOGLE_APPLICATION_CREDENTIALS):", e);
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
