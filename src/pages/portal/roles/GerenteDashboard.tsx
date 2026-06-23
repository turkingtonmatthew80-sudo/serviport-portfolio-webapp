import { useState } from "react";
import { Activity, AlertTriangle, ShieldAlert, BarChart3, Ship, Map } from "lucide-react";

export function GerenteDashboard() {
  const [stats] = useState({ 
    buquesOperando: 2, 
    teusProyectados: 3150, 
    gateVbsLimit: 40,
    ocupacionPatio: 88
  });

  const [alerts] = useState([
    { id: '1', message: 'Alerta: 15 gandolas agendadas para las 10:00 AM, pero solo hay 1 balanza de pesaje activa.', type: 'warning', time: 'Hace 5m' },
    { id: '2', message: 'Crítico: Buque M/N Horizon operando a 12 movimientos/hora (SLA esperado: 25 mov/hora).', type: 'critical', time: 'Hace 12m' },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
           <Activity className="text-primary" /> Torre de Control (Port Control Tower)
        </h1>
        <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
           Puerto Asignado: PUERTO CABELLO | Rol: GERENTE_OPERACIONES
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Buques en Operación</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-blue-400">{stats.buquesOperando}</h3>
          </div>
          <Ship size={80} className="absolute -bottom-4 -right-2 text-blue-500/10" />
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">TEUs Proyectados (Turno)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-emerald-400">{stats.teusProyectados}</h3>
          </div>
          <BarChart3 size={80} className="absolute -bottom-4 -right-2 text-emerald-500/10" />
        </div>
        
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Límite Válvula VBS (Garita)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-purple-400">{stats.gateVbsLimit}</h3>
            <span className="text-xs text-purple-300/50 font-mono mb-1">camiones/hr</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Ocupación Física</p>
          <div className="flex items-end gap-2">
            <h3 className={`text-4xl font-black ${stats.ocupacionPatio > 85 ? 'text-red-400' : 'text-amber-400'}`}>{stats.ocupacionPatio}%</h3>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
             <div className={`h-full ${stats.ocupacionPatio > 85 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${stats.ocupacionPatio}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap de Congestión Simulado */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-5">
           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Map className="text-amber-500" size={18} />
              <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest">Heatmap de Congestión Local</h3>
           </div>
           
           <div className="grid grid-cols-3 gap-2 h-48">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded flex items-center justify-center flex-col gap-1">
                 <span className="text-emerald-400 font-mono font-bold text-xs">Patio A</span>
                 <span className="text-[10px] text-emerald-500/70">45%</span>
              </div>
              <div className="bg-amber-500/20 border border-amber-500/30 rounded flex items-center justify-center flex-col gap-1">
                 <span className="text-amber-400 font-mono font-bold text-xs">Patio B</span>
                 <span className="text-[10px] text-amber-500/70">72%</span>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center flex-col gap-1 relative overflow-hidden">
                 <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                 <span className="text-red-400 font-mono font-bold text-xs relative z-10">Patio Reefer</span>
                 <span className="text-[10px] text-red-500/70 relative z-10">92%</span>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded flex items-center justify-center flex-col gap-1 col-span-2">
                 <span className="text-emerald-400 font-mono font-bold text-xs">Mueles y Frentes de Atraque</span>
                 <span className="text-[10px] text-emerald-500/70">20%</span>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center flex-col gap-1 relative overflow-hidden">
                 <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                 <span className="text-red-400 font-mono font-bold text-xs relative z-10">Garita Pre-Gate</span>
                 <span className="text-[10px] text-red-500/70 relative z-10">98%</span>
              </div>
           </div>
        </div>

        {/* Consola de Cuellos de Botella */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-2">
             <ShieldAlert className="text-orange-500" size={18} />
             <h3 className="font-bold text-slate-200 font-mono tracking-widest text-sm uppercase">Alertas SLA Locales</h3>
          </div>
          <div className="divide-y divide-slate-800/50 flex-1 overflow-y-auto">
             {alerts.map((alert) => (
               <div key={alert.id} className="p-4 flex items-start gap-4 hover:bg-slate-800/20 transition-colors">
                  <div className={`mt-0.5 p-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                     <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                     <p className={`text-sm font-medium ${alert.type === 'critical' ? 'text-red-200' : 'text-amber-200'}`}>{alert.message}</p>
                     <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest flex items-center gap-2">
                        {alert.time}
                        <button className="text-blue-400 hover:underline">Resolver / Escalar</button>
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
