import { useState } from "react";
import { AlertOctagon, Activity, Play, Zap, CloudLightning, ShieldAlert, Power } from "lucide-react";

export function WaterClerkGruas() {
  const [gruas, setGruas] = useState([
    { id: 'STS-01', operativa: true, downtimeInicio: null, lastMotivo: null },
    { id: 'STS-02', operativa: false, downtimeInicio: '10:45', lastMotivo: 'FALLA_MECANICA_GRUA' },
  ]);

  const motivos = [
    { code: 'FALLA_MECANICA_GRUA', label: 'Spreader / Elevación', icon: Zap },
    { code: 'CLIMA', label: 'Clima Adverso / Lluvia', icon: CloudLightning },
    { code: 'ESPERA_CAMION', label: 'Congestión / Falta Chutos', icon: Activity },
    { code: 'CAMBIO_CUADRILLA', label: 'Cambio de Turno / Comida', icon: Power },
  ];

  const handleToggleGrua = (id: string, motivoCode?: string) => {
    setGruas(prev => prev.map(g => {
       if (g.id === id) {
          if (g.operativa) {
             return { ...g, operativa: false, downtimeInicio: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), lastMotivo: motivoCode };
          } else {
             return { ...g, operativa: true, downtimeInicio: null };
          }
       }
       return g;
    }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl">
         <div>
            <h1 className="text-xl font-black text-slate-100 tracking-tight font-sansita uppercase">Equipos Frontales</h1>
            <p className="text-slate-400 font-mono mt-1 text-[10px] uppercase tracking-widest">
               Registro de Rendimiento (Downtime Tracking)
            </p>
         </div>
      </div>

      <div className="flex-1 space-y-6">
         {gruas.map(grua => (
            <div key={grua.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
               <div className={`p-4 flex justify-between items-center ${grua.operativa ? 'bg-emerald-950/30' : 'bg-red-950/30'}`}>
                  <div className="flex items-center gap-3">
                     <span className={`w-3 h-3 rounded-full ${grua.operativa ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'} animate-pulse`}></span>
                     <h3 className="text-2xl font-black font-mono tracking-widest text-slate-100">{grua.id}</h3>
                  </div>
                  <span className={`text-[10px] font-bold font-mono tracking-widest px-3 py-1 rounded border ${grua.operativa ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                     {grua.operativa ? 'OPERANDO' : `DETENIDA DESDE ${grua.downtimeInicio}`}
                  </span>
               </div>

               <div className="p-6">
                  {grua.operativa ? (
                     <div className="space-y-4">
                        <p className="text-xs text-slate-400 font-mono text-center uppercase tracking-widest mb-2 font-bold">
                           Detener Operación de Equipo
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                           {motivos.map(m => (
                              <button 
                                 key={m.code}
                                 onClick={() => handleToggleGrua(grua.id, m.code)}
                                 className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors active:scale-95"
                              >
                                 <m.icon size={28} className="text-amber-500" />
                                 <span className="text-[10px] font-bold text-slate-300 font-mono text-center uppercase tracking-widest">{m.label}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center py-6">
                        <ShieldAlert size={64} className="text-red-500/50 mb-6" />
                        <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-8 text-center bg-red-500/10 px-4 py-2 rounded">
                           Motivo: {motivos.find(m => m.code === grua.lastMotivo)?.label || grua.lastMotivo}
                        </h4>
                        
                        <button 
                           onClick={() => handleToggleGrua(grua.id)}
                           className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                        >
                           <Play size={24} /> Reanudar Operación
                        </button>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
