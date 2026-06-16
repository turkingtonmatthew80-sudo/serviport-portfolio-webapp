import { useState, useEffect } from "react";
import { FileText, CheckCircle, Search, DollarSign } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";

export function ArmadorCuentas() {
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
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Cuentas y DA</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestión y aprobación de Disbursement Accounts (Cuentas de Escala).</p>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
            <span className="font-bold text-sm text-secondary font-mono">Listado de DAs Pendientes</span>
         </div>
         <div className="divide-y divide-border">
           {das.map((da) => (
             <div key={da.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <p className="font-bold text-secondary flex items-center gap-2 font-mono">
                       <FileText size={18} className="text-blue-500" />
                       DA REF: {da.daRef}
                   </p>
                   <p className="text-xs text-foreground-muted mt-1 font-mono">Buque: {da.vessel} • Puerto: {da.port}</p>
                </div>
                <div className="text-left md:text-right">
                   <p className="text-lg font-mono font-black text-secondary mb-1">$ {da.amount?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                   {da.status === "Aprobado" ? (
                     <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1 w-fit ml-auto">
                        <CheckCircle size={12} /> DA APROBADA
                     </span>
                   ) : (
                     <button onClick={() => handleApprove(da.id)} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-primary text-white hover:bg-primary-hover border border-primary rounded flex items-center gap-1 transition-colors">
                        <CheckCircle size={12} /> Aprobar DA
                     </button>
                   )}
                </div>
             </div>
           ))}
           {das.length === 0 && (
              <div className="p-8 text-center text-slate-400 font-mono text-sm">No hay DA registradas.</div>
           )}
         </div>
       </div>
    </div>
  );
}
