import { useAdminAuth } from "../contexts/AdminAuthContext";
import { 
  Users, DollarSign, Activity, Ship, Box, AlertTriangle, Play, Pause, Loader2
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function AdminDashboard() {
  const { adminUser } = useAdminAuth();

  if (!adminUser) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
            Dashboard {adminUser.role === "SUPERADMIN" ? "Global" : "Operativo"}
          </h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">
            Resumen en tiempo real del estado del sistema
          </p>
        </div>
        {adminUser.role === "SUPERADMIN" && (
          <div className="flex items-center gap-3 bg-white border border-border p-2 rounded shadow-sm">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-widest pl-2">SIMULACIÓN:</span>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold">
              <Play size={14} /> REANUDAR
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-bold mr-1">
              <Pause size={14} /> PAUSAR
            </button>
          </div>
        )}
      </div>

      {adminUser.role === "SUPERADMIN" && <SuperAdminDashboard />}
      {adminUser.role === "GERENTE_OPERACIONES" && <GerenteDashboard />}
      {adminUser.role === "CONTADOR" && <ContadorDashboard />}
      {["PLANIFICADOR_PATIO", "OFICINISTA_BUQUES", "INSPECTOR_PUERTA", "ESTIBADOR"].includes(adminUser.role) && (
        <div className="bg-white p-8 border border-border rounded shadow-sm text-center mt-12">
          <p className="text-primary font-bold tracking-widest uppercase font-mono mb-2 text-xl">SISTEMA TOS ACTIVO</p>
          <p className="text-foreground-muted">Utiliza el menú lateral para acceder a tu herramienta operativa y proceder con los registros en la base de datos.</p>
        </div>
      )}
    </div>
  );
}

function ContadorDashboard() {
  return (
    <div className="bg-white p-8 border border-border rounded shadow-sm flex items-center gap-6 mt-12">
      <div className="bg-emerald-50 text-emerald-600 p-6 rounded-full border border-emerald-100 shrink-0">
         <DollarSign size={48} />
      </div>
      <div>
         <h3 className="text-xl font-bold text-secondary mb-2 uppercase font-sansita">Terminal Financiero (ERP)</h3>
         <p className="text-foreground-muted text-sm max-w-lg mb-4">El control detallado de facturación, emisión de proformas y liquidación de costos está en desarrollo y se habilitará en la próxima fase.</p>
         <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs uppercase cursor-not-allowed border border-slate-200">Exportar Reportes PDF (Próximamente)</button>
      </div>
    </div>
  );
}

function SuperAdminDashboard() {
  const [stats, setStats] = useState({ employees: 0, portalUsers: 0, bcv: 0, ops: 0 });
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const loadData = async () => {
         try {
             const userSnap = await getDocs(collection(db, "users"));
             const empSnap = await getDocs(collection(db, "employees"));
             const docRef = doc(db, "settings", "global");
             const docSnap = await getDoc(docRef);
             const opsSnap = await getDocs(collection(db, "gate_events"));
             
             setStats({
                 portalUsers: userSnap.empty ? 0 : userSnap.size,
                 employees: empSnap.empty ? 0 : empSnap.size,
                 bcv: docSnap.exists() && docSnap.data()?.exchangeRate ? docSnap.data().exchangeRate : 36.25,
                 ops: opsSnap.empty ? 0 : opsSnap.size
             });

             const { query, orderBy, limit } = await import("firebase/firestore");
             const logsQ = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(5));
             const logsSnap = await getDocs(logsQ);
             const loadedLogs: any[] = [];
             logsSnap.forEach(doc => loadedLogs.push({ id: doc.id, ...doc.data() }));
             setLogs(loadedLogs);
         } catch(e) {
             console.error(e);
         } finally {
             setIsLoading(false);
         }
     };
     loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Personal Activo", value: stats.employees, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Clientes B2B", value: stats.portalUsers, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "Tasa de Cambio (USD/VES)", value: stats.bcv, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Operaciones (Gate)", value: stats.ops, icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 border border-border rounded shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">{stat.label}</p>
              <h4 className="text-xl lg:text-2xl font-black text-secondary">
                 {isLoading ? <Loader2 size={18} className="animate-spin text-primary" /> : stat.value}
                 {!isLoading && stat.value === 0 && <span className="ml-2 text-[10px] text-red-500 font-mono tracking-widest border border-red-200 bg-red-50 px-1 rounded absolute top-2 right-2">SIN DATOS DB</span>}
              </h4>
            </div>
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border rounded shadow-sm p-6 relative">
           <h3 className="text-lg font-bold text-secondary font-sansita uppercase tracking-tight mb-4">Registro de Auditoría</h3>
           <div className="space-y-3">
             {isLoading ? (
                <div className="p-4 text-center"><Loader2 size={24} className="animate-spin text-primary inline-block" /></div>
             ) : logs.length > 0 ? (
                logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between py-3 border-b border-border text-sm">
                    <span className="text-foreground-muted font-mono text-xs w-24 shrink-0">
                      {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                    </span>
                    <span className="font-bold text-secondary w-32 shrink-0 truncate px-2">{log.userRole || 'Sistema'}</span>
                    <span className="text-foreground-muted flex-1 pl-2">{log.action}</span>
                  </div>
                ))
             ) : (
                <div className="p-8 text-center text-foreground-muted uppercase tracking-widest font-mono text-xs border border-dashed rounded">Sin registros de auditoría en la BD</div>
             )}
           </div>
        </div>

        <div className="bg-white border border-border rounded shadow-sm p-6">
           <h3 className="text-lg font-bold text-secondary font-sansita uppercase tracking-tight mb-4">Estado General (Sim)</h3>
           <div className="space-y-4">
             <div>
               <div className="flex justify-between mb-1 text-sm font-bold text-secondary">
                 <span>Conexión Firebase</span>
                 <span className="text-emerald-600">En Línea</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                 <div className="bg-emerald-500 h-2 rounded-full w-[100%]"></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between mb-1 text-sm font-bold text-secondary">
                 <span>Ocupación Almacenaje DB</span>
                 <span className="text-primary">12 KB</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                 <div className="bg-primary h-2 rounded-full w-[1%]"></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function GerenteDashboard() {
  const [stats, setStats] = useState({ buques: 0, approvals: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const loadStats = async () => {
         try {
             const bSnap = await getDocs(collection(db, "portcalls"));
             const aSnap = await getDocs(collection(db, "approvals"));
             
             setStats({
                 buques: bSnap.empty ? 0 : bSnap.size,
                 approvals: aSnap.empty ? 0 : aSnap.size
             });
         } catch(e) {
             console.error(e);
         } finally {
             setIsLoading(false);
         }
     };
     loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Buques en Muelle", value: stats.buques, icon: Ship, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Capacidad Patios", value: "N/A", icon: Box, color: "text-primary", bg: "bg-primary/10" },
          { label: "Aprobaciones BBDD", value: stats.approvals, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Movimientos / Hora", value: "0", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 border border-border rounded shadow-sm flex items-center justify-between relative">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-secondary">
                 {isLoading ? <Loader2 size={18} className="animate-spin text-primary" /> : stat.value}
                 {!isLoading && stat.value === 0 && <span className="ml-2 text-[10px] text-red-500 font-mono tracking-widest border border-red-200 bg-red-50 px-1 rounded absolute top-2 right-2">SIN DATOS DB</span>}
              </h4>
            </div>
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded shadow-sm p-6 flex flex-col h-[400px] relative">
           <h3 className="text-lg font-bold text-secondary font-sansita uppercase tracking-tight mb-4">Notificaciones del Sistema</h3>
           <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              <p className="text-center text-sm font-mono text-foreground-muted mt-8">Sin notificaciones relevantes en el turno actual.</p>
           </div>
        </div>

        <div className="bg-white border border-border rounded shadow-sm p-6 flex flex-col h-[400px] relative">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-secondary font-sansita uppercase tracking-tight">Buques en Muelle (Ahora)</h3>
             <button className="text-xs font-bold text-primary hover:text-primary-dark">VER BDD</button>
           </div>
           <div className="flex-1 overflow-y-auto space-y-4">
              <p className="text-center text-sm font-mono text-foreground-muted mt-8">Sin registros operativos recientes en este segmento.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
