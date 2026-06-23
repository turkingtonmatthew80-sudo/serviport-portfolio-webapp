import { useState } from "react";
import { Ship, Calendar, Anchor, AlertTriangle, CheckCircle2 } from "lucide-react";

export function GerenteBerthPlanning() {
  const [buquesPendientes] = useState([
    { id: 'VES-01', name: 'MSC ALINA', eta: '2026-06-25 10:00', calado: 12.5, estadoFondeo: 'PENDIENTE' },
    { id: 'VES-02', name: 'CMA CGM LOUVRE', eta: '2026-06-25 14:00', calado: 11.2, estadoFondeo: 'FONDEADO' },
  ]);

  const [muelles] = useState([
    { id: 'Muelle 22', caladoOperativo: 14.0 },
    { id: 'Muelle 24', caladoOperativo: 13.5 },
    { id: 'Muelle 26', caladoOperativo: 10.0 }, // Calado menor
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
           <Anchor className="text-primary" /> Planificador de Atraque (Berth Planning)
        </h1>
        <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
           Asignación Física de Muelles | Validación de PDA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Cola de Buques (Sidebar) */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-xl lg:col-span-1 h-[600px] flex flex-col">
           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Ship className="text-blue-500" size={18} />
              <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest">Buques Esperando</h3>
           </div>
           
           <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {buquesPendientes.map(buque => (
                <div 
                  key={buque.id} 
                  className={`p-3 rounded border text-sm relative transition-colors ${
                     buque.estadoFondeo === 'FONDEADO' 
                       ? 'bg-slate-800 border-slate-600 cursor-grab hover:border-blue-500 active:cursor-grabbing' 
                       : 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                   {buque.estadoFondeo === 'FONDEADO' ? (
                     <CheckCircle2 className="absolute top-2 right-2 text-emerald-500" size={16} />
                   ) : (
                     <AlertTriangle className="absolute top-2 right-2 text-amber-500/50" size={16} />
                   )}
                   <p className={`font-bold font-mono tracking-tight ${buque.estadoFondeo === 'FONDEADO' ? 'text-blue-400' : 'text-slate-500'}`}>
                     {buque.name}
                   </p>
                   <div className="mt-2 space-y-1">
                      <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">ETA: <span className="text-slate-300">{buque.eta}</span></p>
                      <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Calado Max: <span className={buque.estadoFondeo === 'FONDEADO' ? 'text-emerald-400' : ''}>{buque.calado}m</span></p>
                   </div>
                   
                   {buque.estadoFondeo !== 'FONDEADO' && (
                     <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-amber-500/70 uppercase tracking-widest font-bold font-mono flex items-center justify-center">
                        PDA Bloqueada
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Gantt Chart Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-xl lg:col-span-3 h-[600px] flex flex-col">
           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 justify-between">
              <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center gap-2">
                 <Calendar className="text-emerald-500" size={18} /> Cronograma Frentes de Atraque
              </h3>
              <div className="flex gap-4">
                 <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div> Programado
                 </span>
                 <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Operando
                 </span>
              </div>
           </div>
           
           <div className="flex-1 overflow-x-auto relative">
              {/* Very simplified Gantt visualization mockup */}
              <div className="min-w-[800px] h-full flex flex-col">
                 <div className="flex h-8 border-b border-slate-800 ml-24 font-mono text-[10px] text-slate-500 uppercase">
                    <div className="flex-1 px-2 border-r border-slate-800 border-dashed">25 JUN 00:00</div>
                    <div className="flex-1 px-2 border-r border-slate-800 border-dashed">25 JUN 08:00</div>
                    <div className="flex-1 px-2 border-r border-slate-800 border-dashed">25 JUN 16:00</div>
                    <div className="flex-1 px-2">26 JUN 00:00</div>
                 </div>
                 
                 {muelles.map(muelle => (
                   <div key={muelle.id} className="flex flex-1 min-h-[100px] border-b border-slate-800 relative">
                     <div className="w-24 shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center p-2 z-10 text-center">
                        <span className="font-bold text-slate-300 font-mono text-xs">{muelle.id}</span>
                        <span className="text-[10px] text-emerald-500 font-mono mt-1">Calado: {muelle.caladoOperativo}m</span>
                     </div>
                     <div className="flex-1 relative bg-[repeating-linear-gradient(90deg,transparent,transparent_25%,rgba(30,41,59,0.5)_25%,rgba(30,41,59,0.5)_25.5%)]">
                        {/* Mock placed block */}
                        {muelle.id === 'Muelle 24' && (
                           <div className="absolute top-[20%] left-[10%] h-[60%] w-[35%] bg-blue-600 border border-blue-500 rounded p-2 flex flex-col justify-center overflow-hidden cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
                              <p className="text-xs font-bold text-white font-mono truncate">M/N POLARIS</p>
                              <p className="text-[10px] text-blue-200 mt-1 uppercase truncate font-mono">25 JUN 02:00 - 14:00</p>
                           </div>
                        )}
                        {muelle.id === 'Muelle 22' && (
                           <div className="absolute top-[20%] left-[40%] h-[60%] w-[50%] bg-emerald-600 border border-emerald-500 rounded p-2 flex flex-col justify-center overflow-hidden cursor-pointer hover:bg-emerald-500 transition-colors shadow-lg">
                              <p className="text-xs font-bold text-white font-mono truncate">M/N SEASPAN</p>
                              <p className="text-[10px] text-emerald-200 mt-1 uppercase truncate font-mono">25 JUN 10:00 - 26 JUN 06:00</p>
                              <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                           </div>
                        )}
                     </div>
                   </div>
                 ))}
                 
                 {/* Drag and drop target overlay mockup */}
                 <div className="p-4 bg-slate-800/30 border border-dashed border-slate-700 m-4 rounded flex items-center justify-center text-slate-500 text-sm font-mono uppercase tracking-widest h-20">
                    Arrastre un buque desbloqueado aquí para planificar 
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
