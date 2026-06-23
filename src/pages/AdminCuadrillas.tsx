import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Edit2, Shield, Loader2, RefreshCcw, X, ToggleLeft, ToggleRight, Ship, CalendarClock, Briefcase, FileText } from "lucide-react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query } from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion, AnimatePresence } from "motion/react";
import { generatePayrollPDF } from "../lib/pdfGenerator";

interface Crew {
  id: string;
  name: string;
  leader: string;
  size: number;
  shift: string;
  status: "Disponible" | "En Operación" | "De Descanso";
  vesselId?: string;
  vesselName?: string;
}

interface PortCall {
  id: string;
  name: string;
  status: string;
}

export function AdminCuadrillas() {
  const { adminUser } = useAdminAuth();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [portCalls, setPortCalls] = useState<PortCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [leader, setLeader] = useState("");
  const [size, setSize] = useState(12);
  const [shift, setShift] = useState("Mañana (07:00 - 15:00)");
  const [status, setStatus] = useState<"Disponible" | "En Operación" | "De Descanso">("Disponible");
  const [selectedVesselId, setSelectedVesselId] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { query, where } = await import("firebase/firestore");
      const currentPort = adminUser?.port;
      const isGlobal = currentPort === "GLOBAL";

      // Load PortCalls for assignment
      let qPc: any = collection(db, "portcalls");
      if (!isGlobal) {
          qPc = query(collection(db, "portcalls"), where("port", "==", currentPort));
      }
      const pcSnap = await getDocs(qPc);
      const pcalls: PortCall[] = [];
      pcSnap.forEach((doc) => {
        pcalls.push({ id: doc.id, ...(doc.data() as any) } as PortCall);
      });
      setPortCalls(pcalls);

      // Load Crews
      let qCrews: any = collection(db, "crews");
      if (!isGlobal) {
          qCrews = query(collection(db, "crews"), where("port", "==", currentPort));
      }
      const snap = await getDocs(qCrews);
      const list: Crew[] = [];
      snap.forEach((doc) => {
        const data = doc.data() as any;
        if (!data.is_archived) {
          list.push({ id: doc.id, ...data } as Crew);
        }
      });
      setCrews(list);
    } catch (e) {
      console.error("Error loading crew data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setName("");
    setLeader("");
    setSize(12);
    setShift("Mañana (07:00 - 15:00)");
    setStatus("Disponible");
    setSelectedVesselId("");
    setShowModal(true);
  };

  const handleEdit = (cr: Crew) => {
    setEditingId(cr.id);
    setName(cr.name);
    setLeader(cr.leader);
    setSize(cr.size);
    setShift(cr.shift);
    setStatus(cr.status);
    setSelectedVesselId(cr.vesselId || "");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leader) {
      alert("Por favor rellene todos los campos obligatorios.");
      return;
    }
    setIsSaving(true);
    try {
      const vName = portCalls.find((v) => v.id === selectedVesselId)?.name || "";
      const crewData = {
        name,
        leader,
        size: Number(size),
        shift,
        status,
        vesselId: selectedVesselId || null,
        vesselName: selectedVesselId ? vName : null,
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
      };

      if (editingId) {
        await updateDoc(doc(db, "crews", editingId), crewData);
        await logAuditAction(`Actualizó cuadrilla de estiba: ${name}`, adminUser?.role, adminUser?.email);
      } else {
        await addDoc(collection(db, "crews"), crewData);
        await logAuditAction(`Creó nueva cuadrilla de estiba: ${name}`, adminUser?.role, adminUser?.email);
      }
      setShowModal(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Error al guardar cuadrilla");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, crewName: string) => {
    if (!confirm(`¿Está seguro de querer archivar la cuadrilla "${crewName}"?`)) return;
    try {
      await updateDoc(doc(db, "crews", id), {
        is_archived: true,
        archived_at: new Date().toISOString(),
        archived_by: adminUser?.email || "SuperAdmin"
      });
      await logAuditAction("GENERAL_CYCLE", `Archivó cuadrilla de estiba: ${crewName}`, adminUser?.email, adminUser?.role, "WARNING");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar cuadrilla");
    }
  };

  const updateCrewStatus = async (id: string, current: string, targetVesselId?: string) => {
    try {
      const vName = portCalls.find((v) => v.id === targetVesselId)?.name || "";
      const updates: Partial<Crew> = {
        status: current as any,
        vesselId: targetVesselId || null,
        vesselName: targetVesselId ? vName : null,
      };
      await updateDoc(doc(db, "crews", id), updates);
      await logAuditAction(`Cambió estado cuadrilla ${id} a ${current}`, adminUser?.role, adminUser?.email);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Gestión de Cuadrillas y Turnos</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Supervisión, despliegue y asignación de personal de estiba para buques activos en muelle.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            title="Refrescar"
            className="p-3 rounded border border-border bg-white hover:bg-background-muted text-foreground-muted transition-colors shadow-sm"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded font-bold font-mono tracking-widest uppercase transition-all text-xs shadow-sm"
          >
            <Plus size={18} /> Nueva Cuadrilla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 border border-border rounded shadow-sm">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Users size={20} />
            <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Total Estibadores</h3>
          </div>
          <p className="text-3xl font-black text-secondary">
            {crews.reduce((acc, c) => acc + c.size, 0)}
          </p>
          <p className="text-xs text-foreground-muted mt-1">Personal calificado distribuido en cuadrillas</p>
        </div>
        <div className="bg-white p-6 border border-border rounded shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <Briefcase size={20} />
            <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Cuadrillas Activas</h3>
          </div>
          <p className="text-3xl font-black text-secondary">
            {crews.filter((c) => c.status === "En Operación").length}
          </p>
          <p className="text-xs text-foreground-muted mt-1">Frentes de estiba en faena de buques ahora</p>
        </div>
        <div className="bg-white p-6 border border-border rounded shadow-sm">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <CalendarClock size={20} />
            <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Turno Actual</h3>
          </div>
          <p className="text-xl font-black text-secondary uppercase font-mono">
            {new Date().getHours() >= 7 && new Date().getHours() < 15
              ? "Mañana"
              : new Date().getHours() >= 15 && new Date().getHours() < 23
              ? "Tarde"
              : "Noche"}
          </p>
          <p className="text-xs text-foreground-muted mt-1">Horas operativas sincronizadas con puerto</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-background-muted flex items-center justify-between">
          <h3 className="font-bold text-secondary tracking-widest text-sm font-mono uppercase">Control de Frentes de Estiba</h3>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-12 text-center text-foreground-muted">
              <Loader2 className="animate-spin mx-auto text-primary mb-2" size={32} />
              <p className="font-mono text-xs uppercase tracking-widest">Cargando frentes de estiba...</p>
            </div>
          ) : crews.length > 0 ? (
            crews.map((cr, idx) => (
              <div key={cr.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col gap-1.5 flex-1 select-none">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                      CWD-{cr.id.substring(0, 4).toUpperCase()}
                    </span>
                    <h4 className="font-black text-secondary text-lg uppercase tracking-tight">{cr.name}</h4>
                    <span
                      className={`text-[10px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${
                        cr.status === "Disponible"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : cr.status === "En Operación"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {cr.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2 text-xs font-mono text-foreground-muted">
                    <div>
                      <span className="font-bold text-secondary uppercase hover:underline">Jefe de Cuadrilla:</span>
                      <p className="font-sans text-sm font-bold text-secondary mt-0.5">{cr.leader}</p>
                    </div>
                    <div>
                      <span className="font-bold text-secondary uppercase">Personal de Estiba:</span>
                      <p className="font-sans text-sm font-bold text-secondary mt-0.5">{cr.size} Hombres</p>
                    </div>
                    <div>
                      <span className="font-bold text-secondary uppercase">Turno de Trabajo:</span>
                      <p className="font-sans text-sm font-bold text-slate-600 mt-0.5">{cr.shift}</p>
                    </div>
                    <div>
                      <span className="font-bold text-secondary uppercase">Asignación Buque:</span>
                      <p className="font-sans text-sm font-bold text-primary mt-0.5 truncate flex items-center gap-1">
                        <Ship size={14} className="shrink-0" />
                        {cr.vesselName || "Sin Buque Asignado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                  {/* Shortcut changes */}
                  <div className="flex items-center gap-1.5 border border-border bg-background-muted p-1 rounded">
                    <button
                      onClick={() => updateCrewStatus(cr.id, "Disponible")}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                        cr.status === "Disponible" ? "bg-emerald-500 text-white shadow-sm" : "hover:bg-slate-100 text-foreground-muted"
                      }`}
                    >
                      Disp
                    </button>
                    <button
                      onClick={() => {
                        const targetPc = portCalls.find((pc) => pc.status === "En Operación" || pc.status === "Atracado")?.id || "";
                        if (!targetPc && cr.status !== "En Operación") {
                          alert("No hay buques atracados o en operación disponibles. Por favor asigne manualmente un barco editando la cuadrilla.");
                          return;
                        }
                        updateCrewStatus(cr.id, "En Operación", cr.vesselId || targetPc);
                      }}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                        cr.status === "En Operación" ? "bg-blue-500 text-white shadow-sm" : "hover:bg-slate-100 text-foreground-muted"
                      }`}
                    >
                      En Faena
                    </button>
                    <button
                      onClick={() => updateCrewStatus(cr.id, "De Descanso")}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                        cr.status === "De Descanso" ? "bg-slate-500 text-white shadow-sm" : "hover:bg-slate-100 text-foreground-muted"
                      }`}
                    >
                      Descanso
                    </button>
                  </div>

                  <button
                    onClick={() => handleEdit(cr)}
                    className="p-2 border border-border text-foreground-muted hover:text-primary rounded transition-all shadow-sm bg-white hover:bg-slate-100"
                    title="Editar Cuadrilla"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => generatePayrollPDF(cr)}
                    className="p-2 border border-blue-200 text-blue-500 hover:text-white hover:bg-blue-500 rounded transition-all shadow-sm bg-white"
                    title="Simular Cierre Turno / Recibo Nómina"
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cr.id, cr.name)}
                    className="p-2 border border-red-200 text-red-500 hover:text-white hover:bg-red-500 rounded transition-all shadow-sm bg-white"
                    title="Eliminar Cuadrilla"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-foreground-muted">
              <Users className="mx-auto h-12 w-12 text-slate-200 mb-3" />
              <p className="font-mono uppercase tracking-widest text-xs font-bold">Sin cuadrillas de estiba</p>
              <p className="text-sm mt-1">Haga clic en 'Nueva Cuadrilla' para registrar un equipo operativo en el puerto.</p>
            </div>
          )}
        </div>
      </div>

      {/* New / Edit Crew Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border bg-background-muted flex justify-between items-center select-none">
                <h3 className="font-black text-secondary tracking-tight uppercase font-sansita">
                  {editingId ? "Editar Cuadrilla" : "Nueva Cuadrilla de Estiba"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-secondary uppercase font-mono tracking-widest">Nombre del Frente / Cuadrilla *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. CUADRILLA ALPHA, FRENTE ES-1"
                    className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary font-mono text-sm uppercase bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-secondary uppercase font-mono tracking-widest">Jefe / Capataz de Cuadrilla *</label>
                  <input
                    type="text"
                    required
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    placeholder="Nombre completo..."
                    className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-secondary uppercase font-mono tracking-widest font-bold">Personal (Estibadores)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-secondary uppercase font-mono tracking-widest">Estado Inicial</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="En Operación">En Operación</option>
                      <option value="De Descanso">De Descanso</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-secondary uppercase font-mono tracking-widest">Turno Asignado</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-sans"
                  >
                    <option value="Mañana (07:00 - 15:00)">Mañana (07:00 - 15:00)</option>
                    <option value="Tarde (15:00 - 23:00)">Tarde (15:00 - 23:00)</option>
                    <option value="Noche (23:00 - 07:00)">Noche (23:00 - 07:00)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-secondary uppercase font-mono tracking-widest">Asignación de Buque Atendido</label>
                  <select
                    value={selectedVesselId}
                    onChange={(e) => setSelectedVesselId(e.target.value)}
                    className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono"
                  >
                    <option value="">-- Sin Asignación (Disponible) --</option>
                    {portCalls.map((pc) => (
                      <option key={pc.id} value={pc.id}>
                        {pc.name} ({pc.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-border text-foreground-muted hover:bg-slate-50 rounded font-bold text-xs uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
