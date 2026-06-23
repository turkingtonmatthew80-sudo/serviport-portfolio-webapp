import { useState } from "react";
import { Truck, Activity, Lock, Unlock, AlertTriangle } from "lucide-react";

export function GerenteVbs() {
  const [capacidad, setCapacidad] = useState(40);
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
           <Truck className="text-primary" /> Regulador VBS (Vehicle Booking System)
        </h1>
        <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
           Control de Flujo Terrestre | Emisión de Citas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Main Válvula */}
         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl flex flex-col items-center text-center">
            <h3 className="font-bold text-slate-200 uppercase tracking-widest text-sm mb-1 text-center w-full">Válvula de Presión VBS</h3>
            <p className="text-xs text-slate-500 font-mono mb-8">Base Máxima Permitida por Hora</p>
            
            <div className="relative w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center bg-slate-950 mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
               {/* Decorative ring */}
               <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                  <circle 
                     cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                     className={`${capacidad > 45 ? 'text-red-500' : capacidad < 25 ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-300`} 
                     strokeDasharray="289" 
                     strokeDashoffset={289 - (capacidad / 60) * 289}
                  />
               </svg>
               <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-slate-100 font-mono">{capacidad}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Camiones / Hr</span>
               </div>
            </div>

            <div className="w-full max-w-sm px-4">
               <input 
                  type="range" 
                  min="0" max="60" step="5"
                  value={capacidad}
                  onChange={(e) => setCapacidad(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
               />
               <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-2">
                  <span>Cierre Total (0)</span>
                  <span>Operación Normal (40)</span>
                  <span className="text-red-500/70">Máx (60)</span>
               </div>
            </div>

            <p className="text-xs text-slate-400 mt-6 max-w-sm">
               Al ajustar la capacidad, el Padrón de Transportistas verá la disponibilidad de cupos en tiempo real para las ventanas horarias.
            </p>
            
            <button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all">
               Aplicar Límite Transaccional
            </button>
         </div>

         {/* Protocolos de Contingencia VBS */}
         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Activity size={120} className="text-red-500" />
            </div>
            
            <h3 className="font-bold text-slate-200 uppercase tracking-widest text-sm mb-1">Protocolos de Congestión Extrema</h3>
            <p className="text-xs text-slate-500 font-mono mb-6">Bloqueos automatizados en cascada</p>

            <div className="space-y-4 relative z-10">
               <div className="bg-slate-800/50 border border-slate-700 rounded p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-red-500/10 rounded">
                        <Lock className="text-red-500" size={16} />
                     </div>
                     <div>
                        <p className="font-bold text-slate-300 text-sm">Bloqueo de Devolución de Vacíos</p>
                        <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">Cancela citas Gate-In</p>
                     </div>
                  </div>
                  <button className="bg-red-900/50 hover:bg-red-600 border border-red-500/50 text-red-100 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                     Ejecutar
                  </button>
               </div>

               <div className="bg-slate-800/50 border border-slate-700 rounded p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-red-500/10 rounded">
                        <AlertTriangle className="text-red-500" size={16} />
                     </div>
                     <div>
                        <p className="font-bold text-slate-300 text-sm">Suspender Bookings de Exportación</p>
                        <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">Retorna 503 a Navieras</p>
                     </div>
                  </div>
                  <button className="bg-red-900/50 hover:bg-red-600 border border-red-500/50 text-red-100 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                     Ejecutar
                  </button>
               </div>

               <div className="bg-slate-800/50 border border-slate-700 rounded p-4 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-500/10 rounded">
                        <Unlock className="text-emerald-500" size={16} />
                     </div>
                     <div>
                        <p className="font-bold text-slate-300 text-sm">Normalizar Régimen</p>
                        <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">Reactivar Operaciones</p>
                     </div>
                  </div>
                  <button disabled className="bg-slate-700 text-slate-400 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest cursor-not-allowed">
                     Inactivo
                  </button>
               </div>
            </div>
            
            <div className="mt-6 p-3 bg-red-950/30 border border-red-900/50 rounded flex gap-3 text-xs text-red-200">
               <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={14} />
               <p className="font-mono">Nota: Estos bloqueos envían correos automáticos al Padrón de Agentes de Aduanas y detienen el reloj de demora de las navieras.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
