import { useState, useEffect } from "react";
import { Package, Search } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export function ConsolidadorHouse() {
  const [houses, setHouses] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "house_bls"));
        setHouses(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } catch(e) {}
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">House B/L</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Conocimientos de embarque derivados para clientes de carga consolidada NVOCC.</p>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
         <div className="divide-y divide-border">
           {houses.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-sm">No hay House B/L registrados.</div>
           ) : (
             houses.map(hbl => (
                <div key={hbl.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex flex-col">
                       <p className="font-bold text-secondary font-mono tracking-widest text-sm flex items-center gap-2">
                           <Package size={16} className="text-orange-500" />
                           {hbl.hbl}
                       </p>
                       <p className="text-xs text-foreground-muted mt-1 leading-relaxed max-w-sm">
                           Consignatario: <strong className="text-secondary">{hbl.consignee}</strong><br/>
                           Desc: {hbl.description}
                       </p>
                   </div>
                   <div className="text-left md:text-right">
                       <p className="text-xs font-mono font-bold text-slate-500 mb-2">
                           {hbl.packages} Bultos / {hbl.weight} TM
                       </p>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-widest ${hbl.status === 'APROBADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                           {hbl.status}
                       </span>
                   </div>
                </div>
             ))
           )}
         </div>
       </div>
    </div>
  );
}
