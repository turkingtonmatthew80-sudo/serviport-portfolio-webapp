import { useState, useEffect } from "react";
import { Package, Search, MapPin, CheckCircle2, Clock } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

export function ImportadorTracking() {
  const [contenedores, setContenedores] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, "yard_movements")));
        setContenedores(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } catch(e) {}
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Trazabilidad en AGD</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Rastree la ubicación física de su mercancía dentro del terminal portuario.</p>
       </div>

       <div className="bg-white p-4 border border-border shadow-sm flex items-center relative rounded-lg">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
          <input 
            type="text" 
            placeholder="Ingrese Número de Contenedor o BL..."
            className="pl-10 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary bg-slate-50 relative ml-3"
          />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {contenedores.map((c) => (
               <div key={c.id} className="border border-border bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                     <p className="font-bold text-secondary flex items-center gap-2 font-mono">
                         <Package size={18} className="text-blue-500" />
                         {c.containerId}
                     </p>
                     <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">ACTIVO</span>
                  </div>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                         <MapPin size={16} className="text-slate-400 mt-0.5" />
                         <div>
                            <p className="text-xs text-foreground-muted">Ubicación Actual</p>
                            <p className="font-bold text-secondary font-mono text-sm">{c.targetLocation || "Patio Principal"}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <Clock size={16} className="text-slate-400 mt-0.5" />
                         <div>
                            <p className="text-xs text-foreground-muted">Último Movimiento</p>
                            <p className="font-bold text-secondary font-mono text-sm">{c.timestamp?.toDate ? c.timestamp.toDate().toLocaleString('es-VE') : c.status}</p>
                         </div>
                      </div>
                  </div>
               </div>
           ))}
           {contenedores.length === 0 && (
               <div className="col-span-1 md:col-span-2 p-8 text-center text-slate-400 font-mono text-sm border border-dashed rounded-lg bg-white">
                  No se encontraron contenedores para rastrear.
               </div>
           )}
       </div>
    </div>
  );
}
