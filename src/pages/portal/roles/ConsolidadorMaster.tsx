import { useState, useEffect } from "react";
import { Ship, FileText } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export function ConsolidadorMaster() {
  const [masters, setMasters] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, "master_bls"), where("type", "==", "LCL CONSOLIDADO")));
        setMasters(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } catch(e) {}
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Máster B/L</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestión de conocimientos de embarque matriz emitidos a la naviera de consolidación.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {masters.length === 0 ? (
             <div className="col-span-1 md:col-span-2 p-8 text-center text-slate-400 font-mono text-sm border border-dashed rounded-lg bg-white">
                No hay M-BL registrados.
             </div>
          ) : (
             masters.map(mbl => (
               <div key={mbl.id} className="bg-white border border-border shadow-sm p-5 rounded-lg flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-secondary font-mono text-lg flex items-center gap-2">
                      <Ship size={20} className="text-blue-500" />
                      {mbl.mbl}
                    </p>
                    <p className="text-sm text-foreground-muted mt-2">Buque: <span className="font-medium text-slate-700">{mbl.vessel}</span></p>
                    <p className="text-sm text-foreground-muted mt-0.5">Contenedor: <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">{mbl.container}</span></p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                     <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 uppercase tracking-widest font-bold rounded">
                        LCL CONSOLIDADO
                     </span>
                     <button className="text-xs font-bold text-primary hover:underline font-mono uppercase">
                        Ver House BLs &rarr;
                     </button>
                  </div>
               </div>
             ))
          )}
       </div>
    </div>
  );
}
