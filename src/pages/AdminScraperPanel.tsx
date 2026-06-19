import { useState, useEffect } from "react";
import { Activity, Server, Clock, AlertTriangle, CheckCircle, Database, Zap } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { logAuditAction } from "../lib/audit";

interface ScraperLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

interface ScraperStatus {
  status: "ACTIVO" | "EN_ESPERA" | "ERROR_BLOQUEO";
  lastRun: string;
  nextRun: string;
  vesselsFound: {
    "VE PCL": number;
    "VE LGU": number;
    "VE MAR": number;
    "VE GUA": number;
  };
  omitted: number;
  logs: ScraperLog[];
}

export function AdminScraperPanel() {
  const { adminUser } = useAdminAuth();
  const [data, setData] = useState<ScraperStatus | null>(null);
  const [isForcing, setIsForcing] = useState(false);

  useEffect(() => {
    const initialStatus: ScraperStatus = {
      status: "EN_ESPERA",
      lastRun: "Nunca",
      nextRun: "N/A",
      vesselsFound: {
        "VE PCL": 0,
        "VE LGU": 0,
        "VE MAR": 0,
        "VE GUA": 0
      },
      omitted: 0,
      logs: []
    };
    setData(initialStatus);
  }, []);

  const handleForceSync = async () => {
    setIsForcing(true);
    try {
      await logAuditAction("GENERAL_CYCLE", "Sincronización del Catálogo Marítimo Forzada Manualmente", adminUser?.email, adminUser?.role, "WARNING");
      const res = await fetch("/api/vessel-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ port: "Puerto Cabello", forceScrape: true }),
      });
      if (res.ok) {
        alert("Sincronización forzada iniciada. Revisa los logs en un momento.");
      } else {
         alert("Fallo al contactar el daemon de scraping.");
      }
    } catch (e) {
      console.error(e);
      alert("Error forzando sincronización.");
    } finally {
      setIsForcing(false);
    }
  };

  if (adminUser?.role !== "GERENTE_GENERAL") {
    return <div className="p-8 text-center font-mono">ACCESO DENEGADO. Solo Gerente General.</div>;
  }

  if (!data) return <div className="p-8 font-mono">Cargando estado del scraper...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
         <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
               <Activity className="text-primary" size={32} />
               Motor de Gemelo Digital (Scraper)
            </h2>
            <p className="text-foreground-muted font-mono mt-1">
               Monitoreo de ingesta autónoma de inteligencia marítima
            </p>
         </div>
         <button 
           onClick={handleForceSync}
           disabled={isForcing}
           className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 font-bold font-mono text-sm tracking-widest rounded shadow disabled:opacity-50 flex items-center gap-2"
         >
           <Zap size={16} />
           {isForcing ? "SINCRONIZANDO..." : "FORZAR SCRAPING"}
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-6 border border-border shadow-sm rounded">
               <h3 className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-4">Estado del Demonio</h3>
               
               <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${data.status === 'ACTIVO' ? 'bg-blue-500' : data.status === 'EN_ESPERA' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <span className="font-bold font-mono tracking-widest uppercase text-sm text-slate-700">{data.status.replace("_", " ")}</span>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1 mb-1"><Clock size={12}/> Último Ciclo</p>
                    <p className="font-mono text-sm font-bold text-slate-700">{data.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1 mb-1"><Clock size={12}/> Próximo Ciclo (CRON)</p>
                    <p className="font-mono text-sm font-bold text-slate-700">{data.nextRun}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-2">Umbrales de Ocupación TOS</p>
                    <div className="w-full bg-slate-100 h-2 rounded"><div className="bg-blue-500 h-2 rounded w-2/3"></div></div>
                    <p className="text-[10px] font-mono text-slate-500 mt-1 text-right">Restrictivo al 85%</p>
                  </div>
               </div>
           </div>

           <div className="bg-[#0b1424] text-white p-6 border border-slate-800 shadow-sm rounded">
              <h3 className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-4">Detecciones (Último Ciclo)</h3>
              <div className="space-y-3">
                 {Object.entries(data.vesselsFound).map(([port, count]) => (
                   <div key={port} className="flex items-center justify-between">
                     <span className="font-mono text-xs">{port}</span>
                     <span className="font-mono font-bold text-emerald-400">{count} buques</span>
                   </div>
                 ))}
                 <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-amber-400">
                    <span className="font-mono text-xs">Omitidos (Incompletos)</span>
                    <span className="font-mono font-bold">{data.omitted} buques</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="md:col-span-3 bg-white border border-border shadow-sm rounded flex flex-col">
          <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
             <h3 className="font-bold text-secondary font-mono tracking-widest text-sm flex items-center gap-2">
                <Server size={16} /> LOGS DEL WORKER NODE.JS
             </h3>
          </div>
          
          <div className="p-6 bg-slate-900 flex-1 overflow-y-auto font-mono text-xs rounded-b">
             <div className="space-y-2">
                {data.logs.map(log => (
                  <div key={log.id} className="flex items-start gap-4 hover:bg-slate-800/50 p-1 rounded transition-colors">
                     <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                     <span className={`shrink-0 font-bold w-12 ${
                        log.level === 'INFO' ? 'text-blue-400' :
                        log.level === 'WARN' ? 'text-amber-400' : 'text-red-400'
                     }`}>
                        [{log.level}]
                     </span>
                     <span className={`${
                        log.level === 'WARN' ? 'text-amber-200' : 
                        log.level === 'ERROR' ? 'text-red-300' : 'text-slate-300'
                     }`}>{log.message}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
