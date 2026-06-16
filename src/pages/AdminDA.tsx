import { useState, useEffect } from "react";
import { DollarSign, FileText, Send, CheckCircle, Clock } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { generateDisbursementAccountPDF } from "../lib/pdfGenerator";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export function AdminDA() {
  const { adminUser } = useAdminAuth();
  const [vessels, setVessels] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { query, where, orderBy, limit, getDocs } = await import("firebase/firestore");
      const currentPort = adminUser?.port;
      const isGlobal = currentPort === "GLOBAL";

      let q: any = collection(db, "portcalls");
      if (!isGlobal) {
          q = query(collection(db, "portcalls"), where("port", "==", currentPort), orderBy("createdAt", "desc"), limit(5));
      } else {
          q = query(collection(db, "portcalls"), orderBy("createdAt", "desc"), limit(5));
      }

      // Fallback if index on createdAt fails (since createdAt may not exist in portcalls from simulated data)
      // Usually would try to catch, or just query without orderBy if no index.
      // Let's assume there is index or data but actually in our simulation we use 'eta' sometimes or no creation form yet.
      
      try {
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({id: d.id, ...(d.data() as any)}));
        setVessels(data);
      } catch (e) {
        // If query fails (like missing index), fallback without order
        let fallbackQ: any = collection(db, "portcalls");
        if (!isGlobal) {
            fallbackQ = query(collection(db, "portcalls"), where("port", "==", currentPort), limit(5));
        } else {
            fallbackQ = query(collection(db, "portcalls"), limit(5));
        }
        const snap2 = await getDocs(fallbackQ);
        const data2 = snap2.docs.map(d => ({id: d.id, ...(d.data() as any)}));
        setVessels(data2);
      }
    }
    load();
  }, [adminUser]);
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
          <DollarSign className="text-primary" size={32} />
          Disbursement Accounts (DA)
        </h2>
        <p className="text-foreground-muted font-mono mt-1">
          Borradores, proformas y facturación final a Navieras en {adminUser?.port}
        </p>
      </div>

      <div className="bg-white border border-border p-6 shadow-sm">
         <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">ESCALAS RECIENTES - PENDIENTE FACTURACIÓN</h3>
         
         <div className="space-y-4">
            {vessels.map(v => (
               <div key={v.id} className="border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between bg-slate-50 rounded gap-4">
                  <div>
                     <p className="font-black text-secondary uppercase font-mono">{v.name}</p>
                     <p className="text-xs text-foreground-muted font-mono mt-1">Llegada: {new Date(v.eta).toLocaleDateString()}</p>
                     <p className="text-[10px] uppercase font-bold text-slate-500 mt-2 tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded w-fit">
                        ESTADO ESCALA: {v.status || "DESPACHADO"}
                     </p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <button 
                        onClick={() => generateDisbursementAccountPDF({ vesselName: v.name, port: v.port || adminUser?.port, owner: v.client, eta: v.eta })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded text-xs uppercase tracking-widest transition-colors shadow-sm"
                     >
                        <FileText size={16} /> GENERAR DA
                     </button>
                     <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-transparent bg-primary text-white hover:bg-primary-hover font-bold rounded text-xs uppercase tracking-widest transition-colors shadow-sm">
                        <Send size={16} /> ENVIAR NAVIERA
                     </button>
                  </div>
               </div>
            ))}
            {vessels.length === 0 && (
               <p className="text-sm text-foreground-muted font-mono py-4 text-center">No hay escalas registradas recientes.</p>
            )}
         </div>
      </div>
    </div>
  );
}
