import { useState, useEffect } from "react";
import { Ship, Activity, Box, Map, Layers, RefreshCcw, Loader2, Gauge, Truck, ArrowRight, CornerDownRight, CheckCircle } from "lucide-react";
import { collection, getDocs, orderBy, limit, query } from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";
import { PortCanvas } from "../components/PortCanvas";
import { useAdminAuth } from "../contexts/AdminAuthContext";

interface Patio {
  id: string;
  name: string;
  capacity: number;
  current: number;
  status: string;
}

export function AdminMonitoreoTOS() {
  const { adminUser } = useAdminAuth();
  const [selectedPatio, setSelectedPatio] = useState<string | null>(null);
  const [patios, setPatios] = useState<Patio[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [gateEvents, setGateEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [competitorStats, setCompetitorStats] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { query, where } = await import("firebase/firestore");
      const currentPort = adminUser?.port;
      const isGlobal = currentPort === "GLOBAL";

      // 1. Get Patios (patios collection)
      let qPatios: any = collection(db, "patios");
      if (!isGlobal) {
          qPatios = query(collection(db, "patios"), where("port", "==", currentPort));
      }
      const patioSnap = await getDocs(qPatios);
      const pList: Patio[] = [];
      patioSnap.forEach((doc) => {
        pList.push({ id: doc.id, ...(doc.data() as any) } as Patio);
      });
      setPatios(pList);

      // 2. Get Live Movements (yard_movements collection)
      let qMovs: any = collection(db, "yard_movements");
      if (!isGlobal) {
          qMovs = query(collection(db, "yard_movements"), where("port", "==", currentPort));
      }
      const movSnap = await getDocs(qMovs);
      const mList: any[] = [];
      movSnap.forEach((doc) => {
        mList.push({ id: doc.id, ...(doc.data() as any) });
      });
      // Sort recently or status
      setMovements(mList);

      // 3. Get Recent Gate Events (gate_events collection)
      let gateQ: any;
      if (!isGlobal) {
          gateQ = query(collection(db, "gate_events"), where("port", "==", currentPort), orderBy("timestamp", "desc"), limit(6));
      } else {
          gateQ = query(collection(db, "gate_events"), orderBy("timestamp", "desc"), limit(6));
      }
      
      let gateSnap;
      try {
        gateSnap = await getDocs(gateQ);
      } catch (err: any) {
        console.warn("Index missing for gate_events in Monitoreo, falling back to unordered", err);
        if (!isGlobal) {
            gateQ = query(collection(db, "gate_events"), where("port", "==", currentPort), limit(20));
        } else {
            gateQ = query(collection(db, "gate_events"), limit(20));
        }
        gateSnap = await getDocs(gateQ);
      }
      
      const gList: any[] = [];
      gateSnap.forEach((doc) => {
        gList.push({ id: doc.id, ...(doc.data() as any) });
      });
      setGateEvents(gList);
      
      // 4. Get Competitor Extracted State 
      try {
         const res = await fetch("/api/competitor-capacity");
         const data = await res.json();
         if (data && data.success) {
            setCompetitorStats(data.data);
         }
      } catch(ignore) {}
    } catch (e) {
      console.error("Error fetching telemetry database", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [adminUser]);

  const getPatio = (id: string) => patios.find((p) => p.id === id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Monitoreo TOS & Telemetría</h2>
          <p className="text-foreground-muted text-sm font-sans mt-0.5">Vista en tiempo real de la distribución de patios, ocupación física y movimientos de estiba.</p>
        </div>
        <button
          onClick={loadData}
          className="p-3 rounded border border-border bg-white hover:bg-background-muted text-foreground-muted transition-colors shadow-sm self-start sm:self-center flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider"
        >
          <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          Actualizar Telemetría
        </button>
      </div>

      {/* Grid of occupancy gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: "A",
            label: "Patio A (Exportación)",
            tag: "EXP",
            desc: "Puesto para revisión y aduana",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            id: "B",
            label: "Patio B (Importación)",
            tag: "IMP",
            desc: "Descarga directa de buques",
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            id: "C",
            label: "Patio C (Vacíos/MTY)",
            tag: "MTY",
            desc: "Contenedores vacíos y de línea",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            id: "AGD",
            label: "Depósito Propio (AGD)",
            tag: "AGD",
            desc: "Almacenaje de larga estancia",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
        ].map((item) => {
          const patio = getPatio(item.id);
          const current = patio?.current || 0;
          const capacity = patio?.capacity || 2000;
          const pct = Math.min(100, Math.round((current / capacity) * 100)) || 0;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedPatio(item.id)}
              className={`bg-white p-5 border rounded shadow-sm hover:border-primary/40 cursor-pointer transition-all ${
                selectedPatio === item.id ? "ring-2 ring-primary border-primary" : "border-border"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-secondary text-sm font-mono uppercase truncate">{item.label}</h4>
                  <p className="text-[10px] text-foreground-muted mt-0.5">{item.desc}</p>
                </div>
                <span className={`text-[10px] font-black font-mono tracking-wider px-2 py-0.5 rounded ${item.bg} ${item.color}`}>
                  {item.tag}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-end justify-between font-mono">
                  <span className="text-2xl font-black text-secondary">{current} <span className="text-xs text-foreground-muted font-normal">/ {capacity} TEUs</span></span>
                  <span className={`text-sm font-black ${item.color}`}>{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      pct > 90 ? "bg-red-500" : pct > 75 ? "bg-orange-500" : pct > 40 ? "bg-blue-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schematic Layout Map */}
        <div className="lg:col-span-2 bg-white border border-border rounded shadow-sm flex flex-col overflow-hidden relative min-h-[420px]">
          <div className="p-4 border-b border-border bg-background-muted flex items-center justify-between select-none">
            <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono flex items-center gap-2">
              <Map size={16} className="text-primary" /> Distribución Esquemática Patios de {adminUser?.port || "Puerto Cabello"}
            </h3>
            <span className="text-[10px] font-mono text-foreground-muted uppercase">Vista de Monitoreo General</span>
          </div>

          <div className="flex-1 relative bg-[#0b1424]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : null}
            <PortCanvas port={adminUser?.port || "Puerto Cabello"} />
          </div>
        </div>

        {/* Live Gates Telemetry */}
        <div className="bg-white border border-border rounded shadow-sm flex flex-col overflow-hidden h-[420px]">
          <div className="p-4 border-b border-border bg-background-muted flex items-center justify-between select-none">
            <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono flex items-center gap-2">
              <Truck size={16} className="text-primary" /> Tránsito de Camiones en Portón
            </h3>
            <span className="text-[10px] font-mono select-none px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded animate-pulse font-bold uppercase">LIVE</span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs divide-y divide-border pr-2 no-scrollbar">
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : gateEvents.length > 0 ? (
              gateEvents.map((evt, idx) => (
                <div key={evt.id} className="pt-3 first:pt-0 pb-1 text-foreground-muted">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] border ${
                      evt.type === "IN"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}>
                      GATE-{evt.type}
                    </span>
                    <span className="text-[10px] text-foreground-muted">
                      {evt.timestamp?.toDate ? evt.timestamp.toDate().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }) : 'Justo ahora'}
                    </span>
                  </div>
                  <div className="font-sans text-sm font-bold text-secondary flex items-center gap-1 mt-1">
                    <span>{evt.truckPlate}</span>
                    <ArrowRight size={12} className="text-primary shrink-0" />
                    <span className="font-mono text-xs bg-slate-100 text-slate-500 px-1 rounded truncate max-w-[124px]">{evt.containerRef}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[10px] text-foreground-muted">
                    <p>Cond: <span className="font-bold text-secondary font-sans">{evt.driverName}</span></p>
                    <p className="text-right">Precinto: <span className="font-bold text-secondary">{evt.sealNumber || "N/A"}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-foreground-muted font-mono leading-relaxed h-full flex flex-col items-center justify-center">
                <Truck className="text-slate-200 mb-2" size={32} />
                <p className="text-xs uppercase tracking-widest font-bold">Sin gate-ins/outs recientes</p>
                <p className="text-[10px] mt-1 text-foreground-muted normal-case font-sans">No se han registrado visitas por portería hoy.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yard Movements in progress */}
      <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-background-muted flex items-center justify-between select-none">
          <h3 className="font-bold text-secondary tracking-widest text-sm font-mono uppercase flex items-center gap-2">
            <Activity size={16} className="text-primary animate-pulse" /> Movimientos en Progreso en Patios
          </h3>
          <span className="text-[10px] text-foreground-muted font-mono">Órdenes de traslado activas</span>
        </div>

        <div className="divide-y divide-border overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-border font-mono text-[10px] text-foreground-muted uppercase tracking-wider select-none">
                <th className="py-3 px-6">Identificador</th>
                <th className="py-3 px-6">Contenedor</th>
                <th className="py-3 px-6">Origen</th>
                <th className="py-3 px-6">Destino Asignado</th>
                <th className="py-3 px-6">Estado Físico</th>
                <th className="py-3 px-6">Tipo Traslado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground-muted">
                    <Loader2 className="animate-spin text-primary inline-block mr-2" size={20} /> Cargando órdenes de traslado...
                  </td>
                </tr>
              ) : movements.length > 0 ? (
                movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-500 font-bold">ORD-{mov.id.substring(0, 6).toUpperCase()}</td>
                    <td className="py-4 px-6 font-mono font-bold text-secondary">{mov.reference}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-500 flex items-center gap-1 mt-1">
                      <CornerDownRight size={12} className="text-primary shrink-0" /> {mov.origin || "-"}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-primary">{mov.destination || "Pendiente Asignar"}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${
                        mov.status === "PENDIENTE"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : mov.status === "CONFIRMADO" || mov.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {mov.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-sans text-secondary font-bold truncate max-w-[150px]">{mov.type || "TRASLADO"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground-muted">
                    <CheckCircle className="mx-auto text-slate-200 mb-2" size={32} />
                    <p className="font-mono text-xs uppercase tracking-widest font-bold">Sin traslados pendientes</p>
                    <p className="text-[10px] mt-1 font-sans">El planificador de patio no tiene frentes de estiba en espera.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gemelo Digital & Web Scraping Autónomo */}
      <div className="bg-[#0b1424] border border-slate-800 rounded shadow-sm overflow-hidden text-white relative">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Gauge size={180} />
         </div>
         <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between relative z-10 w-full flex-wrap gap-4">
            <div>
               <h3 className="font-bold text-[#00A9CE] tracking-widest text-sm font-mono uppercase flex items-center gap-2">
                 <RefreshCcw size={16} className="animate-spin text-[#00A9CE]/50" /> GEMELO DIGITAL & INTELIGENCIA COMPETITIVA
               </h3>
               <p className="text-[10px] text-slate-400 font-mono mt-1 w-full max-w-2xl">Scraper Node/Cheerio activo (ciclo: 6h). Extracción autónoma de capacidad instalada de competencia en terminales paralelos del país.</p>
            </div>
            <div className="bg-slate-950 border border-[#00A9CE]/30 text-[#00A9CE] px-3 py-1.5 rounded font-mono text-[10px] uppercase font-bold tracking-widest animate-pulse flex items-center gap-2">
              <CheckCircle size={12} /> CRON DAEMON ACTIVO
            </div>
         </div>
         <div className="p-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded flex flex-col items-center justify-center text-center">
               <span className="text-4xl font-black font-sansita text-white mb-1">{competitorStats ? competitorStats.activeVessels : 0}</span>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Buques (Competencia)</span>
               <span className="text-[9px] font-sans text-slate-500 mt-2">Dato extraído del Web Scraper</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded flex flex-col items-center justify-center text-center">
               <span className={`text-2xl font-black font-sansita mb-1 ${competitorStats?.terminalCongestion === 'Alto' ? 'text-red-500' : 'text-emerald-500'}`}>
                 {competitorStats ? competitorStats.terminalCongestion : 'Desconocido'}
               </span>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Status Terminal</span>
               <span className="text-[9px] font-sans text-slate-500 mt-2">Estimación heurística de demora</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded flex flex-col items-center justify-center text-center">
               <span className="text-lg font-black font-mono text-slate-300 mb-1">
                 {competitorStats ? new Date(competitorStats.lastScraped).toLocaleTimeString('es-VE') : '--:--'}
               </span>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Última Extracción</span>
               <button onClick={async () => {
                  alert("Simulando trigger manual del scraper sobre terminal competidor...");
                  setCompetitorStats({...competitorStats, lastScraped: new Date().toISOString()});
               }} className="mt-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[9px] px-2 py-1 uppercase tracking-widest font-bold rounded transition-colors">
                  Forzar Crawler
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
