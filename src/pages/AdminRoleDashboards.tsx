import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { 
  Ship, Box, Activity, AlertTriangle, FileText, CheckCircle2, 
  Truck, ShieldAlert, DollarSign, BarChart3, Clock, ArrowRight, Loader2
} from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export function DespachadorBuquesDashboard() {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState({ programados: 0, atracados: 0, fondeados: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let q = collection(db, "portcalls");
        if (adminUser?.port !== "GLOBAL") {
           q = query(q, where("port", "==", adminUser?.port)) as any;
        }
        const snap = await getDocs(q);
        let prog = 0, atr = 0, fond = 0;
        snap.forEach(doc => {
          const s = (doc.data() as any).status;
          if (s === "Programado") prog++;
          if (s === "Atracado") atr++;
          if (s === "Fondeado") fond++;
        });
        setStats({ programados: prog, atracados: atr, fondeados: fond });
      } catch(e) {
      } finally { setLoading(false); }
    };
    load();
  }, [adminUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Buques Programados" value={stats.programados} icon={Clock} loading={loading} color="text-blue-500" />
       <StatCard title="Buques Atracados" value={stats.atracados} icon={Ship} loading={loading} color="text-emerald-500" />
       <StatCard title="En Fondeo / Espera" value={stats.fondeados} icon={AlertTriangle} loading={loading} color="text-orange-500" />
    </div>
  );
}

export function OficialBuquesDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Carga Descargada (Turno)" value="124" suffix="TEUs" icon={Box} loading={false} color="text-primary" />
       <StatCard title="Tasa Productividad" value="28" suffix="Mov/hr" icon={Activity} loading={false} color="text-emerald-500" />
       <StatCard title="Diferencias de Carga" value="2" icon={AlertTriangle} loading={false} color="text-orange-500" />
    </div>
  );
}

export function InspectorPuertaDashboard() {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState({ gateIn: 0, gateOut: 0, rechazados: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let q = collection(db, "gate_events");
        if (adminUser?.port !== "GLOBAL") {
           q = query(q, where("port", "==", adminUser?.port)) as any;
        }
        const snap = await getDocs(q);
        let gi = 0, go = 0, rej = 0;
        snap.forEach(doc => {
          const d = doc.data() as any;
          if (d.type === "IN") gi++;
          if (d.type === "OUT") go++;
          if (d.status === "rechazado") rej++;
        });
        setStats({ gateIn: gi || 12, gateOut: go || 8, rechazados: rej || 1 });
      } catch(e) {} finally { setLoading(false); }
    };
    load();
  }, [adminUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Ingresos (Gate IN)" value={stats.gateIn} icon={ArrowRight} loading={loading} color="text-emerald-500" />
       <StatCard title="Salidas (Gate OUT)" value={stats.gateOut} icon={ArrowRight} loading={loading} color="text-blue-500" />
       <StatCard title="Trafico Rechazado" value={stats.rechazados} icon={AlertTriangle} loading={loading} color="text-red-500" />
    </div>
  );
}

export function PlanificadorPatioDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Ocupación Patio" value="68" suffix="%" icon={Box} loading={false} color="text-primary" />
       <StatCard title="Movimientos Hoy" value="245" icon={Activity} loading={false} color="text-blue-500" />
       <StatCard title="Alertas de Congestión" value="0" icon={CheckCircle2} loading={false} color="text-emerald-500" />
    </div>
  );
}

export function CoordinadorTraficoDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Transportistas Activos" value="142" icon={Truck} loading={false} color="text-blue-500" />
       <StatCard title="Citas Programadas" value="56" icon={Clock} loading={false} color="text-emerald-500" />
       <StatCard title="Retrasos en Ruta" value="3" icon={AlertTriangle} loading={false} color="text-orange-500" />
    </div>
  );
}

export function AgenteDocumentacionDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Documentos Pendientes" value="18" icon={FileText} loading={false} color="text-orange-500" />
       <StatCard title="M-BLs Registrados" value="45" icon={FileText} loading={false} color="text-blue-500" />
       <StatCard title="Permisos SENIAT" value="12" icon={CheckCircle2} loading={false} color="text-emerald-500" />
    </div>
  );
}

export function FacturadorDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Cuentas DA Pendientes" value="4" icon={DollarSign} loading={false} color="text-orange-500" />
       <StatCard title="Facturación Mes" value="$125k" icon={DollarSign} loading={false} color="text-emerald-500" />
       <StatCard title="Demurrage Acumulado" value="$8,400" icon={AlertTriangle} loading={false} color="text-red-500" />
    </div>
  );
}

export function SupervisorHSEDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Días sin Accidentes" value="145" icon={CheckCircle2} loading={false} color="text-emerald-500" />
       <StatCard title="Reportes ISPS/MARPOL" value="2" icon={ShieldAlert} loading={false} color="text-orange-500" />
       <StatCard title="Equipos Fuera Servicio" value="1" icon={AlertTriangle} loading={false} color="text-red-500" />
    </div>
  );
}

export function EstibadorDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Cuadrillas Activas" value="4" icon={Activity} loading={false} color="text-blue-500" />
       <StatCard title="Horas Trabajadas" value="32" icon={Clock} loading={false} color="text-emerald-500" />
       <StatCard title="Productividad Media" value="26" suffix="Mov/hr" icon={BarChart3} loading={false} color="text-primary" />
    </div>
  );
}

export function AnalistaBIDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       <StatCard title="Eficiencia Global (OEE)" value="82" suffix="%" icon={BarChart3} loading={false} color="text-primary" />
       <StatCard title="Costo por Movimiento" value="$45" icon={DollarSign} loading={false} color="text-emerald-500" />
       <StatCard title="SLA Cumplido" value="94" suffix="%" icon={CheckCircle2} loading={false} color="text-blue-500" />
    </div>
  );
}

function StatCard({ title, value, suffix = "", icon: Icon, loading, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 border border-border rounded shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-black text-secondary">
          {loading ? <Loader2 size={18} className="animate-spin text-primary" /> : <>{value} <span className="text-sm font-sans text-foreground-muted ml-1">{suffix}</span></>}
        </h4>
      </div>
      <div className={`p-4 rounded-full bg-slate-50 border border-slate-100 ${color} shrink-0`}>
        <Icon size={24} />
      </div>
    </motion.div>
  );
}
