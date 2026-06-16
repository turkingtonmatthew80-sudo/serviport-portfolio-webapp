import { Ship, Clock, CheckCircle, ArrowRight } from "lucide-react";

export function ExportadorEmbarque() {
  const steps = [
    { name: "Ingreso al Patio", status: "completed", date: "15 Jun, 08:30" },
    { name: "Revisión Antidrogas / CNI", status: "completed", date: "15 Jun, 14:15" },
    { name: "Levante Aduana de Exportación", status: "completed", date: "16 Jun, 10:00" },
    { name: "Asignación de Buque / Booking", status: "current", date: "En proceso" },
    { name: "Estiba a Bordo (Load)", status: "upcoming", date: "--" },
    { name: "Zarpe", status: "upcoming", date: "--" }
  ];

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Estatus de Embarque</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Rastree su carga hasta estar a bordo del buque asignado y obtenga su BL de Exportación.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-white border border-border shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
               <div>
                 <h3 className="font-bold text-secondary text-lg flex items-center gap-2 font-mono">
                    <Ship className="text-blue-500" /> BK-EXP-82910
                 </h3>
                 <p className="text-sm text-foreground-muted mt-1">Destino: Puerto de Miami (USMIA)</p>
               </div>
               <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">
                  En progreso
               </span>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
               {steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                     <span className={`absolute -left-[9px] top-1 px-1 py-1 rounded-full ${
                        step.status === 'completed' ? 'bg-emerald-500' :
                        step.status === 'current' ? 'bg-blue-500 ring-4 ring-blue-100' :
                        'bg-slate-300'
                     }`}></span>
                     <div>
                        <p className={`font-bold text-sm ${step.status === 'upcoming' ? 'text-slate-400' : 'text-secondary'}`}>{step.name}</p>
                        <p className="text-xs font-mono text-slate-500 mt-1">{step.date}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">Emisión de B/L</h3>
               <div className="text-center p-6 bg-white border border-dashed border-slate-300 rounded mb-4">
                  <p className="text-xs text-slate-400">El conocimiento de embarque (B/L) estará disponible para descarga una vez el buque haya zarpado.</p>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Agente:</span>
                    <span className="font-bold">GLOBAL SHIPPING CA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Contenedor:</span>
                    <span className="font-bold font-mono">MSCU-829188</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Pre-Estiba:</span>
                    <span className="font-bold">BAY 14</span>
                  </div>
               </div>
            </div>
            <button disabled className="mt-6 w-full opacity-50 cursor-not-allowed bg-secondary text-white py-2 rounded text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2">
               Descargar B/L Formato Borrador <ArrowRight size={14}/>
            </button>
         </div>
       </div>
    </div>
  );
}
