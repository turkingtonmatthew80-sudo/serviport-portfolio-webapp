import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { 
  Ship, Box, Activity, AlertTriangle, FileText, CheckCircle2, 
  Truck, ShieldAlert, DollarSign, BarChart3, Clock, ArrowRight, Loader2
} from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export function DespachadorBuquesDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function OficialBuquesDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function InspectorPuertaDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function PlanificadorPatioDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function CoordinadorTraficoDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function AgenteDocumentacionDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function FacturadorDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function SupervisorHSEDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function EstibadorDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
    </div>
  );
}

export function AnalistaBIDashboard() {
  return (
    <div className="flex justify-center items-center h-48 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase">
       Módulo en Desarrollo / Sin Datos Reales en BD
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
