import { useState, useEffect } from "react";
import { Ship, Clock, CheckCircle } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

export function NavieraPortCalls() {
  const [portcalls, setPortcalls] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, "portcalls")));
        setPortcalls(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } catch(e) {}
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Port Calls (Escalas en Puerto)</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Histórico y programación de escalas de sus buques.</p>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-border font-bold text-sm text-secondary font-mono">Listado de Escalas</div>
         <div className="divide-y divide-border">
           {portcalls.map((pc) => (
             <div key={pc.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <p className="font-bold text-secondary flex items-center gap-2">
                       <Ship size={18} className="text-blue-500" />
                       Buque: {pc.name}
                   </p>
                   <p className="text-xs text-foreground-muted mt-1 font-mono">IMO: {pc.imo} • Viaje: {pc.voyage} • Puerto: {pc.port}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-mono font-bold text-slate-500 mb-1">ETA: {pc.eta}</p>
                   <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">{pc.status}</span>
                </div>
             </div>
           ))}
           {portcalls.length === 0 && (
              <div className="p-8 text-center text-slate-400 font-mono text-sm">No hay port calls registrados.</div>
           )}
         </div>
       </div>
    </div>
  );
}
