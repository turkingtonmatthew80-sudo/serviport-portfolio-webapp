import { useState } from "react";
import { FileText, Clock, Truck, Download, ShieldCheck, ArrowRightLeft } from "lucide-react";

export function TransportistaEirs() {
  const [eirs] = useState([
    { 
       id: "EIR-88219", 
       container: "MSKU8091232", 
       type: "GATE-OUT", 
       date: "2024-05-18 08:32 AM", 
       placa: "A123BC",
       chofer: "José Pinto",
       condition: "OK - Sin Daños Reportados" 
    },
    { 
       id: "EIR-87110", 
       container: "CMAU1234567", 
       type: "GATE-IN (VACÍO)", 
       date: "2024-05-17 14:15 PM", 
       placa: "R987ZZ",
       chofer: "Carlos Martínez",
       condition: "DAÑADO - Pared Lateral Hundida" 
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
       <div className="mb-8">
          <h2 className="text-2xl font-black text-secondary uppercase tracking-tight font-sansita">EIRs y Devoluciones de Vacíos</h2>
          <p className="text-foreground-muted text-sm mt-1">
             Histórico de Equipment Interchange Receipts. Descargue el EIR firmado por el Inspector de Garita como escudo legal ante cobros indebidos de las Navieras.
          </p>
       </div>

       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
             <ShieldCheck className="text-yellow-600 shrink-0 mt-0.5" size={20} />
             <div>
                <p className="text-sm text-yellow-800 font-bold uppercase tracking-widest mb-1">Efecto Cascada: Retorno de Vacíos</p>
                <p className="text-xs text-yellow-800/80 leading-relaxed max-w-4xl">
                   Al registrar un Gate-In de Devolución de Vacío en este portal y validarse en la garita, el sistema de ServiPort detiene automáticamente el reloj de Demurrage del contenedor. Si la devolución ocurre dentro del Free Time, la liquidación será de $0 y se liberará la garantía del Importador.
                </p>
             </div>
          </div>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50 flex items-center gap-2">
             <ArrowRightLeft className="text-foreground-muted" size={18} />
             <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase">Movimientos Históricos</h3>
          </div>
          <div className="divide-y divide-border">
            {eirs.length === 0 ? (
               <div className="p-8 text-center text-foreground-muted font-mono text-sm">No hay registros de EIRs for esta empresa.</div>
            ) : eirs.map((eir) => (
               <div key={eir.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                     <div className={`p-3 rounded-lg ${eir.type.includes('OUT') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {eir.type.includes('OUT') ? <Truck size={24} /> : <FileText size={24} />}
                     </div>
                     <div>
                        <p className="font-bold text-secondary font-mono mb-1">{eir.id}</p>
                        <p className="text-sm text-secondary font-bold mb-1">{eir.container}</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                           <Clock size={12} /> {eir.date}
                        </div>
                     </div>
                  </div>
                  <div className="text-left md:text-right flex flex-col md:items-end gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest ${eir.type.includes('OUT') ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                         {eir.type}
                      </span>
                      <p className={`text-xs font-mono font-bold ${eir.condition.includes('OK') ? 'text-green-600' : 'text-red-600'}`}>
                         {eir.condition}
                      </p>
                      <p className="text-xs text-foreground-muted">Chofer: {eir.chofer} | Placa: {eir.placa}</p>
                  </div>
                  <div className="flex justify-end border-t md:border-t-0 pt-3 md:pt-0 pl-0 md:pl-4">
                     <button className="flex items-center gap-1 bg-slate-900 text-white hover:bg-slate-800 px-3 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors">
                        <Download size={14} /> PDF
                     </button>
                  </div>
               </div>
            ))}
          </div>
       </div>
    </div>
  );
}
