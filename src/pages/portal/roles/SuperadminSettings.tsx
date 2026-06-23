import { useState } from "react";
import { Settings, Cpu, HardDrive, Zap, Globe, DollarSign, Activity, AlertTriangle, ShieldAlert } from "lucide-react";

export function SuperadminSettings() {
  const [bcvRate, setBcvRate] = useState("36.45");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
           <Cpu className="text-primary" /> Gemelo Digital & Ajustes
        </h1>
        <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
           Configuración Macro y Control de Simulaciones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Gemelo Digital & Scraper */}
         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
               <div className="p-2 bg-blue-500/10 rounded">
                  <Globe className="text-blue-500" size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200 uppercase tracking-widest text-sm">Motor de Scraping AIS</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Puppeteer / Cheerio Workers</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded border border-slate-700/50">
                  <div>
                     <p className="font-bold text-slate-300 text-sm">Estado del Cron Job</p>
                     <p className="text-xs text-slate-500 font-mono mt-1">Última ejecución: Hace 14 mins</p>
                  </div>
                  <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest font-mono">
                     <span className="relative flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                     </span>
                     ONLINE
                  </span>
               </div>

               <button 
                  onClick={() => alert("Simulando sincronización con Antenas AIS Vía Satélite...")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  <Zap size={16} /> Forzar Sincronización AIS
               </button>
               <p className="text-[10px] text-slate-500 text-center font-mono uppercase tracking-wider">
                  Dispara un Worker Thread. Evita Timeout de Render.
               </p>
            </div>
         </div>

         {/* Simulaciones Gubernamentales */}
         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
               <div className="p-2 bg-purple-500/10 rounded">
                  <Activity className="text-purple-500" size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200 uppercase tracking-widest text-sm">Simulaciones (Telegram Bots)</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Intervención en Escenarios Reales</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded border border-slate-700/50">
                  <div>
                     <p className="font-bold text-slate-300 text-sm">Enlace API SENIAT / SIDUNEA</p>
                     <p className="text-xs text-slate-500 font-mono mt-1">Simula caída nacional del servidor</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
               </div>

               <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                     <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                     <div>
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Impacto de Desconexión</p>
                        <p className="text-[10px] text-amber-200/60 font-mono">
                           Al apagar el enlace, las DUAs serán rechazadas con Error 503. Obligará a los Gerentes a inyectar "Días de Gracia" en el storage.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Variables Macro */}
         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
               <div className="p-2 bg-emerald-500/10 rounded">
                  <DollarSign className="text-emerald-500" size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200 uppercase tracking-widest text-sm">Variables Macroeconómicas</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Ajustes manuales y Perdones Cambiarios</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-4 bg-slate-800/50 rounded border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">Override Tasa BCV</p>
                  <div className="flex mb-2">
                     <span className="inline-flex items-center px-3 text-sm text-slate-400 bg-slate-700 border border-r-0 border-slate-600 rounded-l-md font-mono">
                        VES/USD
                     </span>
                     <input 
                        type="text" 
                        value={bcvRate}
                        onChange={(e) => setBcvRate(e.target.value)}
                        className="rounded-none rounded-r-lg bg-slate-900 border border-slate-600 text-slate-200 block flex-1 min-w-0 w-full text-sm p-2 font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                     />
                  </div>
                  <button 
                     onClick={() => alert(`Tasa BCV fijada manualmente en ${bcvRate} VES/USD`)}
                     className="w-full text-[10px] font-bold bg-slate-700 hover:bg-slate-600 text-slate-300 py-1.5 rounded transition-colors uppercase tracking-widest mt-2">
                     Fijar Manual
                  </button>
               </div>

               <div className="p-4 bg-slate-800/50 rounded border border-slate-700/50 md:col-span-2 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">Consola de Perdones (Waivers)</p>
                  <p className="text-sm text-slate-300 mb-4">
                     Aprueba zarpes bloqueados por deudas menores a $50 USD (Diferencial Cambiario).
                  </p>
                  <button 
                     onClick={() => alert("Módulo de perdones cambiarios en desarrollo.")}
                     className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg uppercase tracking-widest text-xs inline-flex items-center justify-center gap-2 transition-colors w-fit shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                     <ShieldAlert size={16} /> Emitir Waiver a Naviera
                  </button>
               </div>
            </div>
         </div>

      <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-6 shadow-xl md:col-span-2 mt-6">
         <div className="flex flex-col items-start gap-4">
            <h3 className="font-bold text-red-500 font-mono">ZONA DE PELIGRO: VACIAR BASE DE DATOS Y USUARIOS</h3>
            <p className="text-sm text-red-300">
               Truncará todas las tablas SQL y enviará un comando a Firebase para <b>eliminar todos los usuarios excepto el tuyo</b>.
               Dejará el sistema en Empty State.
            </p>
         </div>
         <div className="mt-6">
            <button 
               onClick={async () => {
                  const code = window.prompt("Esta acción ES DESTRUCTIVA. Escribe CONFIRMAR para continuar:");
                  if (code === "CONFIRMAR") {
                     try {
                        const uid = JSON.parse(localStorage.getItem('admin_user') || "{}")?.uid || "";
                        const res = await fetch('/api/admin/reset-database', { 
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ excludeUid: uid })
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                           window.alert("Sistema devuelto a su Empty State. Base de datos e identidades Firebase limpiadas.");
                           window.location.reload();
                        } else {
                           window.alert("Error: " + (data.error || "Desconocido"));
                        }
                     } catch (e) {
                         window.alert("Fallo de red");
                     }
                  }
               }}
               className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest text-sm w-full md:w-auto shadow-lg"
            >
               Vaciar Todo (SQL + Firebase)
            </button>
         </div>
      </div>

      </div>
    </div>
  );
}
