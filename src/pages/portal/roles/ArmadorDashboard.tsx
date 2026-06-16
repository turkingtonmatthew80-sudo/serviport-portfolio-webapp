import { useState, useEffect } from "react";
import { Ship, DollarSign, Search, CheckCircle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

interface ArmadorDA {
  id: string;
  daRef: string;
  vessel: string;
  port: string;
  callDate: string;
  amount: number;
}

export function ArmadorDashboard() {
  const { user } = useAuth();
  const [das, setDas] = useState<ArmadorDA[]>([]);

  useEffect(() => {
     const fetchDas = async () => {
        try {
           const snap = await getDocs(query(collection(db, "armador_das")));
           setDas(snap.docs.map(d => ({id: d.id, ...d.data()}) as ArmadorDA));
        } catch(e) {
           console.error(e);
        }
     };
     fetchDas();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Armador (Ship Owner)
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial} | RIF: {user?.rif}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold text-foreground-muted font-mono tracking-widest uppercase mb-1">DISBURSEMENT ACCOUNTS (PENDIENTES)</p>
                <h3 className="text-3xl font-black text-secondary">{das.length}</h3>
             </div>
             <DollarSign className="text-blue-500" size={48} />
         </div>
         <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold text-foreground-muted font-mono tracking-widest uppercase mb-1">ESCALAS ACTIVAS</p>
                <h3 className="text-3xl font-black text-secondary">{das.length > 0 ? Array.from(new Set(das.map(d => d.vessel))).length : 0}</h3>
             </div>
             <Ship className="text-emerald-500" size={48} />
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">APROBACIÓN DE CUENTAS (DA)</h3>
        </div>
        
        <div className="p-6">
           <div className="space-y-4">
               {das.length === 0 ? (
                 <div className="p-8 text-center border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm">
                   No hay DAs pendientes de revisión.
                 </div>
               ) : (
                 das.map((da) => (
                   <div key={da.id} className="border border-blue-200 p-4 bg-blue-50/50 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                         <p className="font-bold text-secondary font-mono tracking-widest text-sm">{da.daRef}</p>
                         <p className="text-sm font-bold text-blue-900 mt-1">Buque: {da.vessel}</p>
                         <p className="text-xs text-foreground-muted mt-1 font-mono">Puerto: {da.port} • Escala: {da.callDate}</p>
                      </div>
                      <div className="text-left md:text-right">
                         <p className="text-2xl font-black text-secondary font-mono mb-2">$ {da.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                         <button className="bg-primary text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-primary-hover transition-colors">
                            Revisar y Aprobar
                         </button>
                      </div>
                   </div>
                 ))
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
