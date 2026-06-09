import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertTriangle, FileText, Check, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

interface ApprovalRef {
  id: string;
  type: string;
  client: string;
  subject: string;
  date: string;
  status: string;
}

export function AdminAprobaciones() {
  const { adminUser } = useAdminAuth();
  const [approvals, setApprovals] = useState<ApprovalRef[]>([]);
  const [portcalls, setPortcalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snap = await getDocs(collection(db, "approvals"));
        const loaded: ApprovalRef[] = [];
        snap.forEach(doc => loaded.push({ id: doc.id, ...doc.data() } as ApprovalRef));
        setApprovals(loaded);

        const pcSnap = await getDocs(collection(db, "portcalls"));
        const pcLoaded: any[] = [];
        pcSnap.forEach(doc => {
           if(doc.data().status === "Programado") {
              pcLoaded.push({ id: doc.id, ...doc.data() });
           }
        });
        setPortcalls(pcLoaded);

      } catch (err) {
        console.error("Error loading approvals:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = async (id: string, isPortCall: boolean = false) => {
    try {
      if (isPortCall) {
         await updateDoc(doc(db, "portcalls", id), { status: "Aprobado" });
         setPortcalls(prev => prev.filter(p => p.id !== id));
      } else {
         await updateDoc(doc(db, "approvals", id), { status: "approved" });
         setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "approved" } : a));
      }
      await logAuditAction(`Aprobó solicitud ${id}`, adminUser?.role, adminUser?.email);
    } catch (e) {
      console.error(e);
    }
  };
  
  const handleReject = async (id: string, isPortCall: boolean = false) => {
    try {
      if (isPortCall) {
         await updateDoc(doc(db, "portcalls", id), { status: "Rechazado" });
         setPortcalls(prev => prev.filter(p => p.id !== id));
      } else {
         await updateDoc(doc(db, "approvals", id), { status: "rejected" });
         setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "rejected" } : a));
      }
      await logAuditAction(`Rechazó solicitud ${id}`, adminUser?.role, adminUser?.email);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Aprobaciones Sensibles</h2>
        <p className="text-foreground-muted text-sm font-sans mt-1">Autorización y rechazo de operaciones críticas solicitadas por clientes B2B.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 border border-border rounded shadow-sm">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <Clock size={20} />
            <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Pendientes</h3>
          </div>
          <p className="text-3xl font-black text-secondary">
             {approvals.filter(a => a.status === "pending").length}
             {approvals.length === 0 && !isLoading && <span className="text-[10px] text-orange-400 font-mono tracking-widest uppercase ml-2 select-none border border-orange-200 px-1 rounded">SIN DATOS REALES EN BDD</span>}
          </p>
        </div>
        <div className="bg-white p-6 border border-border rounded shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <CheckCircle2 size={20} />
            <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Aprobadas (Hoy)</h3>
          </div>
          <p className="text-3xl font-black text-secondary">
            {approvals.filter(a => a.status === "approved").length}
            {approvals.length === 0 && !isLoading && <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase ml-2 select-none border border-emerald-200 px-1 rounded">SIN DATOS REALES EN BDD</span>}
          </p>
        </div>
        <div className="bg-white p-6 border border-border rounded shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Alerta SLA</h3>
          </div>
          <p className="text-3xl font-black text-secondary">0</p>
          <p className="text-xs text-foreground-muted mt-1">Rechazos o de mora mayor a 24h</p>
        </div>
      </div>

      <div className="bg-white rounded border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background-muted">
           <h3 className="font-bold text-secondary tracking-widest text-sm font-mono uppercase">Cola de Autorización</h3>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
             <div className="p-12 text-center text-foreground-muted"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></div>
          ) : (approvals.length > 0 || portcalls.length > 0) ? (
            <>
            {portcalls.map(pc => (
              <motion.div layout key={pc.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors border-b border-border last:border-0">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-3 mb-1">
                     <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">
                       {pc.id.substring(0,6)}
                     </span>
                     <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
                       PORT CALL (BUQUE {pc.name})
                     </span>
                   </div>
                   <h4 className="font-bold text-secondary text-lg">Viaje: {pc.voyage} - ETA: {new Date(pc.eta).toLocaleString('es-VE')}</h4>
                   <p className="text-sm text-foreground-muted">IMO: <span className="font-bold">{pc.imo}</span></p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                   <button className="flex items-center gap-2 px-4 py-2 border border-border text-secondary hover:bg-slate-100 font-bold rounded text-xs uppercase tracking-widest transition-colors shadow-sm">
                      <FileText size={16} /> Ver Detalles
                   </button>
                   <button onClick={() => handleReject(pc.id, true)} className="p-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors shadow-sm" title="Rechazar">
                      <X size={20} />
                   </button>
                   <button onClick={() => handleApprove(pc.id, true)} className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition-colors shadow-sm" title="Aprobar Port Call">
                      <Check size={20} />
                   </button>
                </div>
              </motion.div>
            ))}
            {approvals.map(req => (
              <motion.div layout key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-3 mb-1">
                     <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">
                       {req.id}
                     </span>
                     <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono">
                       {req.type}
                     </span>
                   </div>
                   <h4 className="font-bold text-secondary text-lg">{req.subject}</h4>
                   <p className="text-sm text-foreground-muted">Solicitante: <span className="font-bold">{req.client}</span> • {req.date}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {req.status === "pending" ? (
                    <>
                      <button className="flex items-center gap-2 px-4 py-2 border border-border text-secondary hover:bg-slate-100 font-bold rounded text-xs uppercase tracking-widest transition-colors shadow-sm">
                         <FileText size={16} /> Ver Detalles
                      </button>
                      <button onClick={() => handleReject(req.id)} className="p-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors shadow-sm" title="Rechazar">
                         <X size={20} />
                      </button>
                      <button onClick={() => handleApprove(req.id)} className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition-colors shadow-sm" title="Aprobar (Firma Digital)">
                         <Check size={20} />
                      </button>
                    </>
                  ) : (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest font-mono border ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {req.status === 'approved' ? <><CheckCircle2 size={16}/> APROBADO</> : <><AlertTriangle size={16}/> RECHAZADO</>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-foreground-muted">
              <CheckCircle2 className="mx-auto h-12 w-12 text-slate-200 mb-3" />
              <p className="font-mono uppercase tracking-widest text-xs font-bold">Sin datos reales</p>
              <p className="text-sm mt-1">No se encontraron solicitudes en la base de datos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
