import { useState, useEffect } from "react";
import { FileText, CheckCircle, FileOutput } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs, updateDoc, doc } from "@/src/lib/db-wrapper";

export function NavieraProformas() {
  const [das, setDas] = useState<any[]>([]);

  useEffect(() => {
    fetchDas();
  }, []);

  const fetchDas = async () => {
    try {
      const snap = await getDocs(query(collection(db, "armador_das")));
      setDas(snap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e) {}
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "armador_das", id), {
        status: "Aprobado",
        approvedAt: new Date()
      });
      fetchDas();
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Proformas y DAs</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Disbursement Accounts y facturación de escala.</p>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-border font-bold text-sm text-secondary font-mono">Listado de DAs Proforma</div>
         <div className="divide-y divide-border">
           {das.map((da) => (
             <div key={da.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <p className="font-bold text-secondary flex items-center gap-2">
                       <FileText size={18} className="text-orange-500" />
                       DA Reference: {da.daRef}
                   </p>
                   <p className="text-xs text-foreground-muted mt-1 font-mono">Buque: {da.vessel} • Puerto: {da.port} • Escala: {da.callDate}</p>
                </div>
                <div className="text-left md:text-right">
                   <p className="text-lg font-mono font-black text-secondary mb-1">$ {da.amount?.toLocaleString()}</p>
                   {da.status === "Aprobado" ? (
                     <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1 w-fit ml-auto">
                        <CheckCircle size={12} /> DA APROBADA
                     </span>
                   ) : (
                     <button onClick={() => handleApprove(da.id)} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded flex items-center gap-1 transition-colors">
                        <FileOutput size={12} /> Revisar & Aprobar
                     </button>
                   )}
                </div>
             </div>
           ))}
           {das.length === 0 && (
              <div className="p-8 text-center text-slate-400 font-mono text-sm">No hay DAs registrados.</div>
           )}
         </div>
       </div>
    </div>
  );
}
