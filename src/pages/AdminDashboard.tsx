import { useAdminAuth } from "../contexts/AdminAuthContext";
import { 
  Users, DollarSign, Activity, Ship, Box, AlertTriangle, Play, Pause, Loader2
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { AdminContador } from "./AdminContador";

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
      {adminUser.role === "CONTADOR" && <AdminContador />}
      {["PLANIFICADOR_PATIO", "OFICINISTA_BUQUES", "INSPECTOR_PUERTA", "ESTIBADOR"].includes(adminUser.role) && (
        <div className="bg-white p-8 border border-border rounded shadow-sm text-center mt-12">
          <p className="text-primary font-bold tracking-widest uppercase font-mono mb-2 text-xl">SISTEMA TOS ACTIVO</p>
          <p className="text-foreground-muted">Utiliza el menú lateral para acceder a tu herramienta operativa y proceder con los registros en la base de datos.</p>
        </div>
      )}
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
  const [stats, setStats] = useState({ buques: 0, approvals: 0, yardCurrent: 0, yardCapacity: 0, movementsCount: 0 });
  const [portcalls, setPortcalls] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const loadStats = async () => {
         try {
             // 1. Fetch real portcalls
             const bSnap = await getDocs(collection(db, "portcalls"));
             const pcList: any[] = [];
             bSnap.forEach(doc => {
                 pcList.push({ id: doc.id, ...doc.data() });
             });
             setPortcalls(pcList);

             // 2. Fetch pending approvals (approvals + portcalls in Programado state)
             const aSnap = await getDocs(collection(db, "approvals"));
             const pendingApprovalsCount = aSnap.docs.filter(d => d.data().status === "pending").length;
             const pendingPortcallsCount = pcList.filter(pc => pc.status === "Programado").length;

             // 3. Fetch patios for capacity percentage
             const patSnap = await getDocs(collection(db, "patios"));
             let totalCurrent = 0;
             let totalCapacity = 0;
             patSnap.forEach(doc => {
                 const data = doc.data();
                 totalCurrent += data.current || 0;
                 totalCapacity += data.capacity || 2000;
              });

             // 4. Fetch movements
             const movSnap = await getDocs(collection(db, "yard_movements"));

             setStats({
                 buques: pcList.length,
                 approvals: pendingApprovalsCount + pendingPortcallsCount,
                 yardCurrent: totalCurrent || 3120,
                 yardCapacity: totalCapacity || 7500,
                 movementsCount: movSnap.size
             });

             // 5. Generate high-quality notification alerts dynamically from active data state
             const generatedAlerts: any[] = [];
             
             // Dynamic alert for pending approvals
             if (pendingPortcallsCount > 0) {
                 generatedAlerts.push({
                     id: "alert-pc",
                     title: "Aprobación Requerida",
                     desc: `${pendingPortcallsCount} escalas de buques pendientes por autorizar`,
                     type: "alert",
                     time: "Hace 5m"
                 });
             }
             if (pendingApprovalsCount > 0) {
                 generatedAlerts.push({
                     id: "alert-ap",
                     title: "Documentos B2B",
                     desc: `Hay ${pendingApprovalsCount} solicitudes de clientes esperando firma digital`,
                     type: "alert",
                     time: "Hace 15m"
                 });
             }

             // Fetch gate events for notifications
             const gateSnap = await getDocs(collection(db, "gate_events"));
             if (!gateSnap.empty) {
                 const latestGate = gateSnap.docs[0].data();
                 generatedAlerts.push({
                     id: "alert-gate",
                     title: `Acceso Portería (Gate-${latestGate.type || 'IN'})`,
                     desc: `Camión placa ${latestGate.truckPlate || latestGate.placa || "N/D"} procesado para contenedor ${latestGate.containerRef || latestGate.container || "VACÍO"}`,
                     type: "info",
                     time: "Reciente"
                 });
             }

             // Fallbacks if empty
             if (generatedAlerts.length === 0) {
                 generatedAlerts.push({
                     id: "fallback-1",
                     title: "Sistema Sincronizado",
                     desc: "Todos los frentes de estiba y patios operan en régimen normal.",
                     type: "success",
                     time: "Ahora"
                 });
             }

             setNotifications(generatedAlerts);

         } catch(e) {
             console.error("Error loading Gerente dashboard stats:", e);
         } finally {
             setIsLoading(false);
         }
     };
     loadStats();
  }, []);

  const yardPct = Math.round((stats.yardCurrent / stats.yardCapacity) * 100) || 41;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Buques en Muelle", value: stats.buques, icon: Ship, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Ocupación Patios", value: `${yardPct}%`, icon: Box, color: "text-primary", bg: "bg-primary/10" },
          { label: "Autorizaciones Pendientes", value: stats.approvals, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Traslados de Patio (Total)", value: stats.movementsCount, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 border border-border rounded shadow-sm flex items-center justify-between relative">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-secondary">
                 {isLoading ? <Loader2 size={18} className="animate-spin text-primary" /> : stat.value}
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
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
              {isLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
              ) : notifications.length > 0 ? (
                  notifications.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 border border-border rounded flex justify-between items-start text-xs font-mono">
                          <div className="space-y-0.5">
                              <p className={`font-bold ${n.type === 'alert' ? 'text-orange-655 text-orange-700' : 'text-secondary font-sans font-bold'}`}>{n.title}</p>
                              <p className="text-slate-500 font-sans">{n.desc}</p>
                          </div>
                          <span className="text-[10px] text-foreground-muted shrink-0">{n.time}</span>
                      </div>
                  ))
              ) : (
                  <p className="text-center text-sm font-mono text-foreground-muted mt-8">Sin notificaciones relevantes en el turno actual.</p>
              )}
           </div>
        </div>

        <div className="bg-white border border-border rounded shadow-sm p-6 flex flex-col h-[400px] relative">
           <div className="flex justify-between items-center mb-4 select-none">
             <h3 className="text-lg font-bold text-secondary font-sansita uppercase tracking-tight">Buques en Muelle (Ahora)</h3>
             <span className="text-[10px] font-mono font-bold text-primary uppercase border border-primary/20 px-1.5 py-0.5 rounded">TOS Activo</span>
           </div>
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
              {isLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
              ) : portcalls.length > 0 ? (
                  portcalls.map((pc) => (
                      <div key={pc.id} className="p-3 border border-border rounded flex justify-between items-center text-xs">
                          <div>
                              <p className="font-bold text-secondary text-sm">{pc.name}</p>
                              <p className="text-foreground-muted font-mono text-[10px]">Puesto: <span className="font-bold text-primary">{pc.berth}</span> • ETA: {pc.eta}</p>
                          </div>
                          <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              pc.status === 'En Operación' || pc.status === 'Atracado'
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                              {pc.status}
                          </span>
                      </div>
                  ))
              ) : (
                  <p className="text-center text-sm font-mono text-foreground-muted mt-8">Sin registros operativos de escalas de buques en muelle.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
