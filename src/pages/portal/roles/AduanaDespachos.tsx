import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export function AduanaDespachos() {
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [completados, setCompletados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qPendientes = query(collection(db, "hitos_legales"), where("status", "in", ["PENDIENTE_INSPECCION", "EN_INSPECCION", "AMARILLO"]));
    const unsubPendientes = onSnapshot(qPendientes, (snap) => {
      setPendientes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qCompletados = query(collection(db, "hitos_legales"), where("status", "==", "LIBERADO"));
    const unsubCompletados = onSnapshot(qCompletados, (snap) => {
      setCompletados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => {
      unsubPendientes();
      unsubCompletados();
    };
  }, []);

  const handleLevante = async (item: any) => {
    try {
      // 1. Unblock container if there is an mblId/container associated
      if (item.mblId || item.containerId || item.bl) {
         let searchParam = item.mblId || item.containerId || item.bl;
         let qC = query(collection(db, "contenedores"), where("mblId", "==", searchParam));
         let snapsC = await getDocs(qC);
         if (snapsC.empty) {
            qC = query(collection(db, "contenedores"), where("containerId", "==", searchParam));
            snapsC = await getDocs(qC);
         }
         
         const batchUpdates = snapsC.docs.map(d => updateDoc(d.ref, { isBlocked: false }));
         await Promise.all(batchUpdates);
      }
      
      // 2. Update hito legal status
      await updateDoc(doc(db, "hitos_legales", item.id), { status: "LIBERADO", updatedAt: new Date().toISOString() });

      // 3. Notify via Telegram
      fetch('/api/telegram/send-approval', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `LEVANTE OTORGADO: DUA/Id ${item.id} liberado por Adunas/SIDUNEA.` })
      }).catch(console.error);
      
    } catch (e) {
      console.error(e);
      alert("Error al intentar otorgar levante");
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Estatus Despacho</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestión de levante aduanero y libramiento de cargas tras confirmación de SIDUNEA.</p>
       </div>

       <div className="grid gap-6">
          <div className="bg-white border border-border shadow-sm rounded-lg p-6">
            <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">DESPACHOS A LA ESPERA DE LEVANTE (Canales Rojo y Amarillo)</h3>
            
            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></div>
            ) : pendientes.length === 0 ? (
                <div className="border border-dashed border-slate-300 p-8 rounded text-center text-slate-500 font-mono text-sm bg-slate-50">
                Todas las declaraciones se encuentran despachadas o sin incidencias.
                </div>
            ) : (
                <div className="space-y-3">
                  {pendientes.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col md:flex-row items-center justify-between gap-4">
                       <div className="flex items-center gap-3">
                          <Clock className={p.status !== "AMARILLO" ? "text-red-500" : "text-amber-500"} size={20} />
                          <div>
                            <p className="font-bold font-mono text-sm text-secondary">DUA/Id: {p.id}</p>
                            <p className="text-xs text-foreground-muted">Importador: {p.importador || p.ente || "N/A"}</p>
                            <p className="text-xs text-foreground-muted">BL/Ref: {p.mblId || p.containerId || p.bl || p.vesselName || "N/A"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 w-full md:w-auto">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest ${p.status !== 'AMARILLO' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                             {p.status}
                          </span>
                          <button onClick={() => handleLevante(p)} className="text-xs ml-auto md:ml-0 bg-secondary hover:bg-secondary/90 text-white px-3 py-1.5 rounded font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                            <ShieldCheck size={14}/> Liberar
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 shadow-sm rounded-lg p-6">
            <h3 className="font-bold text-emerald-800 font-mono tracking-widest text-sm mb-4">LEVANTES CONFIRMADOS EN LAS ÚLTIMAS 72H</h3>
            <div className="space-y-3">
              {completados.map(c => (
                <div key={c.id} className="p-4 bg-white rounded border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-500" size={24} />
                      <div>
                        <p className="font-bold font-mono text-sm text-secondary">DUA/Id: {c.id}</p>
                        <p className="text-xs text-foreground-muted">Importador: {c.importador || "N/A"}</p>
                      </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                     {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'Justo ahora'}
                  </span>
                </div>
              ))}
            </div>
          </div>
       </div>
    </div>
  );
}
