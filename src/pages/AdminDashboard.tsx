import { useAdminAuth } from "../contexts/AdminAuthContext";
import { 
  Users, DollarSign, Activity, Ship, Box, AlertTriangle, Play, Pause, Loader2
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "../lib/db-wrapper";
import { db } from "../lib/firebase";
import { AdminContador } from "./AdminContador";
import {
  DespachadorBuquesDashboard,
  OficialBuquesDashboard,
  InspectorPuertaDashboard,
  PlanificadorPatioDashboard,
  CoordinadorTraficoDashboard,
  AgenteDocumentacionDashboard,
  FacturadorDashboard,
  SupervisorHSEDashboard,
  EstibadorDashboard,
  AnalistaBIDashboard
} from "./AdminRoleDashboards";
import { SuperadminDashboard as NewSuperadminDashboard } from "./portal/roles/SuperadminDashboard";
import { GerenteDashboard } from "./portal/roles/GerenteDashboard";

export function AdminDashboard() {
  const { adminUser } = useAdminAuth();

  if (!adminUser) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {adminUser.role === "GERENTE_GENERAL" ? (
        <NewSuperadminDashboard />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
                Dashboard Operativo
              </h2>
              <p className="text-foreground-muted text-sm font-sans mt-1">
                Resumen en tiempo real del estado del sistema
              </p>
            </div>
          </div>
          {adminUser.role === "GERENTE_OPERACIONES" && <GerenteDashboard />}
          {adminUser.role === "CONTADOR" && <Navigate to="/admin/contador" replace />}
          {adminUser.role === "DESPACHADOR_BUQUES" && <Navigate to="/admin/buques" replace />}
          {adminUser.role === "OFICIAL_BUQUES" && <Navigate to="/admin/oficial-sof" replace />}
          {adminUser.role === "INSPECTOR_PUERTA" && <Navigate to="/admin/gate" replace />}
          {adminUser.role === "PLANIFICADOR_PATIO" && <Navigate to="/admin/yard-planner" replace />}
          {adminUser.role === "COORDINADOR_TRAFICO" && <CoordinadorTraficoDashboard />}
          {adminUser.role === "AGENTE_DOCUMENTACION" && <Navigate to="/admin/documentos" replace />}
          {adminUser.role === "FACTURADOR" && <Navigate to="/admin/da" replace />}
          {adminUser.role === "SUPERVISOR_HSE" && <Navigate to="/admin/hse" replace />}
          {adminUser.role === "ESTIBADOR" && <EstibadorDashboard />}
          {adminUser.role === "ANALISTA_BI" && <AnalistaBIDashboard />}
        </>
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
             logsSnap.forEach(doc => loadedLogs.push({ id: doc.id, ...(doc.data() as any) }));
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
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="clay-card p-6 flex items-center justify-between">
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
        <div className="lg:col-span-2 clay-card p-6 relative">
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

        <div className="clay-card p-6">
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

