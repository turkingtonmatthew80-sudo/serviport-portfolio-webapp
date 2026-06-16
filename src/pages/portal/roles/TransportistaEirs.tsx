import { useState, useEffect } from "react";
import { FileText, Clock, Truck } from "lucide-react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export function TransportistaEirs() {
  const [eirs, setEirs] = useState<any[]>([]);

  useEffect(() => {
    const fetchEirs = async () => {
      try {
        const snap = await getDocs(query(collection(db, "eir_orders")));
        setEirs(snap.docs.map(d => ({id: d.id, ...d.data()})).filter((e: any) => e.status === "Completado"));
      } catch(e) {}
    };
    fetchEirs();
  }, []);

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Mis EIRs (Histórico)</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Equipment Interchange Receipts generados por los movimientos de su flota.</p>
       </div>

       {eirs.length === 0 ? (
         <div className="bg-white p-8 border border-border shadow-sm flex flex-col items-center justify-center text-center rounded-lg">
            <FileText size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-secondary uppercase mb-2">No hay EIRs históricos</h3>
            <p className="text-foreground-muted text-sm max-w-md mx-auto mb-6">A medida que entregue o reciba contenedores cerrando el ciclo de EIR, los comprobantes aparecerán archivados aquí.</p>
         </div>
       ) : (
         <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
           <div className="divide-y divide-border">
             {eirs.map((eir) => (
                <div key={eir.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                   <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded">
                         <FileText className="text-slate-500" size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-secondary font-mono text-sm">{eir.eir}</p>
                         <p className="text-xs text-foreground-muted mt-0.5">Contenedor: <span className="font-bold text-secondary">{eir.container}</span></p>
                         <p className="text-xs font-mono mt-1 text-slate-500">Destino original: {eir.destination}</p>
                      </div>
                   </div>
                   <div className="text-left md:text-right">
                       <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest flex items-center gap-1 w-fit ml-auto">
                          <Clock size={12}/> COMPLETADO
                       </span>
                       <p className="text-xs text-foreground-muted mt-2 font-mono flex items-center gap-1"><Truck size={12}/> {eir.placa}</p>
                   </div>
                </div>
             ))}
           </div>
         </div>
       )}
    </div>
  );
}
