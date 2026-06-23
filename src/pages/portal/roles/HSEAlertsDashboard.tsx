import { useState, useEffect } from "react";
import { ShieldAlert, AlertTriangle, AlertOctagon, Hand, Loader2 } from "lucide-react";

export function HSEAlertsDashboard() {
  const [incidentes, setIncidentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidentes = async () => {
      try {
         const res = await fetch('/api/sql/incidentes_hse');
         if (res.ok) {
            setIncidentes(await res.json());
         }
      } catch (e) {
         console.error("Error cargando incidentes", e);
      } finally {
         setLoading(false);
      }
  };

  useEffect(() => {
     fetchIncidentes();
  }, []);

  const declareEmergency = async (tipo: string) => {
     try {
         await fetch('/api/sql/incidentes_hse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               tipo: tipo,
               nivelGravedad: 5,
               paralizacionOperativa: true
            })
         });
         fetchIncidentes();
     } catch (e) {
         alert("Error reportando emergencia");
     }
  };

  const cerrarIncidente = async (id: string) => {
     try {
         await fetch(`/api/sql/incidentes_hse/${id}`, {
            method: 'DELETE'
         });
         fetchIncidentes();
     } catch (e) {
         alert("Error cerrando incidente");
     }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
               <ShieldAlert /> Controladores de Incidentes HSE
            </h1>
            <p className="text-slate-400 font-mono mt-1 text-[10px] uppercase tracking-widest">
               Health, Safety, and Environment • Botón de Pánico
            </p>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-8">
         {/* Botones de Pánico Rápidos */}
         <div className="space-y-4">
            <h3 className="font-bold text-slate-400 font-mono text-xs uppercase tracking-widest mb-2 border-b border-slate-800 pb-2">Declarar Nueva Emergencia</h3>
            
            <button onClick={() => declareEmergency("PARALIZACION_OPERATIVA_TOS")} className="w-full bg-red-950/50 hover:bg-red-900/50 border border-red-900/50 p-6 rounded-xl flex items-center gap-4 transition-all active:scale-95 group">
               <div className="bg-red-600 p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-shadow">
                  <Hand className="text-white" size={32} />
               </div>
               <div className="text-left">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Freno de Emergencia</h4>
                  <p className="text-xs text-red-400 font-mono mt-1">Paralización operativa del TOS en radio local.</p>
               </div>
            </button>

            <button onClick={() => declareEmergency("DERRAME_MARPOL")} className="w-full bg-amber-950/30 hover:bg-amber-900/40 border border-amber-900/50 p-6 rounded-xl flex items-center gap-4 transition-all active:scale-95 group">
               <div className="bg-amber-600 p-3 rounded-full text-white">
                  <AlertOctagon size={24} />
               </div>
               <div className="text-left">
                  <h4 className="text-lg font-black text-white uppercase tracking-widest">Derrame Químico (MARPOL)</h4>
                  <p className="text-[10px] text-amber-400 font-mono mt-1">Notificar HSE y detener maniobras en contenedor.</p>
               </div>
            </button>
            <button onClick={() => declareEmergency("CONATO_INCENDIO")} className="w-full bg-orange-950/30 hover:bg-orange-900/40 border border-orange-900/50 p-6 rounded-xl flex items-center gap-4 transition-all active:scale-95 group">
               <div className="bg-orange-600 p-3 rounded-full text-white">
                  <AlertTriangle size={24} />
               </div>
               <div className="text-left">
                  <h4 className="text-lg font-black text-white uppercase tracking-widest">Conato de Incendio</h4>
                  <p className="text-[10px] text-orange-400 font-mono mt-1">Activar brigada contra incendios y evacuar bloque.</p>
               </div>
            </button>
         </div>

         {/* Monitor Activo */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
            <div className="bg-red-600 w-full p-3 font-black text-white uppercase tracking-widest text-xs font-mono flex items-center justify-between gap-2">
               <div className="flex items-center gap-2"><AlertTriangle size={16} /> Monitor de Incidentes Activos</div>
               {loading && <Loader2 size={14} className="animate-spin text-red-200" />}
            </div>
            <div className="p-4 flex-1 space-y-4">
               {incidentes.map(inc => (
                  <div key={inc.id} className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg animate-pulse">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold font-mono tracking-widest text-red-500 uppercase">{inc.id}</span>
                        <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold">{inc.tipo}</span>
                     </div>
                     <p className="text-white font-bold mb-1">{inc.escalaId ? `Escala: ${inc.escalaId}` : 'Terminal General'}</p>
                     
                     <div className="mt-4 pt-4 border-t border-red-900/30 flex justify-end">
                        <button onClick={() => cerrarIncidente(inc.id)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[10px] font-bold font-mono uppercase px-4 py-2 rounded transition-colors">
                           Liberar Zona / Cerrar Incidente
                        </button>
                     </div>
                  </div>
               ))}
               
               {incidentes.length === 0 && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 p-8 text-center space-y-4">
                     <ShieldAlert size={48} />
                     <p className="font-mono uppercase tracking-widest font-bold text-sm">Operación Normal</p>
                     <p className="text-[10px]">Cero incidentes activos reportados en el terminal.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
