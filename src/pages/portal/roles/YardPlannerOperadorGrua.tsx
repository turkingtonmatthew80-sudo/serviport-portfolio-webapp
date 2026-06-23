import { useState } from "react";
import { Search, MapPin, Navigation, Anchor, Lock, ArrowUpRight, Zap, Play } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function YardPlannerOperadorGrua() {
  const [ordenes, setOrdenes] = useState([
     { id: 'ORD-9182', bic: 'MSKU9911223', maneuver: 'POSICIONAMIENTO_AFORO', from: 'BLOQUE A (IMP)', to: 'AFORO SENIAT', urgent: true, status: 'PENDING' },
     { id: 'ORD-9183', bic: 'HLXU1234567', maneuver: 'DESCARGA_A_PATIO', from: 'CHUTO-04', to: 'BLOQUE A (IMP) - Fila 2 - Nivel 3', urgent: false, status: 'PENDING' },
     { id: 'ORD-9184', bic: 'SUDU0000000', maneuver: 'REMOCION_IMPRODUCTIVA', from: 'BLOQUE A (IMP) - Nivel 3', to: 'BLOQUE A (IMP) - Nivel 4', urgent: false, status: 'PENDING' },
  ]);

  const handleConfirm = (id: string) => {
     setOrdenes(prev => prev.map(o => o.id === id ? { ...o, status: 'COMPLETED' } : o));
     // Simulate the /api/tos/equipos/confirmar-movimiento API call with ACID transaction
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4 pb-12 bg-black">
      <div className="bg-[#111] border border-slate-800 p-4 rounded-xl shadow-xl space-y-4 shrink-0 mx-2">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-black text-white tracking-widest font-mono">RTG-04</h1>
               <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Vehicle Data Interface (VDI)</p>
            </div>
            <div className="bg-emerald-950/40 text-emerald-500 border border-emerald-900/50 px-3 py-1.5 rounded flex items-center gap-2 font-mono text-xs font-bold uppercase">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               Sincronizado
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-2 space-y-3">
         {ordenes.filter(o => o.status === 'PENDING').map(orden => (
            <div key={orden.id} className={`border-2 rounded-xl overflow-hidden relative ${orden.urgent ? 'bg-red-950/20 border-red-900' : 'bg-slate-900 border-slate-700'} shadow-lg`}>
               {orden.urgent && (
                  <div className="bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold py-1 px-3 flex items-center justify-center gap-2">
                     <Zap size={12} /> Alta Prioridad / Mandato Legal
                  </div>
               )}
               <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-3xl font-black text-white font-mono">{orden.bic}</h2>
                     <span className="bg-slate-800 text-slate-400 font-mono text-[10px] px-2 py-1 rounded">20' DRY</span>
                  </div>

                  <div className="space-y-4 mb-6">
                     <div className="flex items-start gap-4 text-slate-300">
                        <div className="bg-slate-800 p-2 rounded-full shrink-0"><Navigation size={18} className="text-blue-500" /></div>
                        <div>
                           <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Origen Actual</p>
                           <p className="font-bold text-lg">{orden.from}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 text-white">
                        <div className="bg-slate-800 p-2 rounded-full shrink-0"><MapPin size={18} className="text-emerald-500" /></div>
                        <div>
                           <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Destino Asignado</p>
                           <p className="font-bold text-lg border-b-2 border-emerald-500/50 pb-1 inline-block">{orden.to}</p>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => handleConfirm(orden.id)}
                     className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-xl text-lg font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                     <Lock size={24} /> Confirmar Bloqueo
                  </button>
               </div>
            </div>
         ))}
         
         {ordenes.filter(o => o.status === 'PENDING').length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-4">
               <Anchor size={48} className="text-slate-700" />
               <p className="font-mono uppercase tracking-widest font-bold text-sm">Cola de trabajo vacía</p>
               <p className="text-[10px]">A la espera de nuevas órdenes del Planificador de Patio.</p>
            </div>
         )}
      </div>
    </div>
  );
}
