import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Loader2,
  RefreshCcw,
  X,
  MapPin
} from "lucide-react";
import { Role, PortLocation, useAdminAuth } from "../contexts/AdminAuthContext";
import { logAuditAction } from "../lib/audit";

interface Employee {
  id: string;
  name: string;
  username: string;
  password?: string; // only for form, not best to show always but okay for internal 
  role: Role;
  port: PortLocation;
  status: "active" | "inactive";
}

const CREATABLE_ROLES: Role[] = [
  "GERENTE_GENERAL",
  "GERENTE_OPERACIONES",
  "DESPACHADOR_BUQUES",
  "OFICIAL_BUQUES",
  "AGENTE_DOCUMENTACION",
  "INSPECTOR_PUERTA",
  "PLANIFICADOR_PATIO",
  "COORDINADOR_TRAFICO",
  "ESTIBADOR",
  "SUPERVISOR_HSE",
  "CONTADOR",
  "FACTURADOR",
  "ANALISTA_BI"
];

const PORTS: PortLocation[] = [
  "Puerto Cabello",
  "La Guaira",
  "Maracaibo",
  "Guanta"
];

export function AdminEmployees() {
  const { adminUser } = useAdminAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("INSPECTOR_PUERTA");
  const [port, setPort] = useState<PortLocation>("Puerto Cabello");

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, "employees"));
      const list: Employee[] = [];
      snap.forEach(doc => {
        const data = doc.data() as any;
        if (!data.is_archived) {
          list.push({ id: doc.id, ...data } as Employee);
        }
      });
      setEmployees(list);
    } catch (error) {
      console.error("Error al cargar empleados", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setUsername("");
    setPassword("");
    setRole("INSPECTOR_PUERTA");
    setPort("Puerto Cabello");
    setShowModal(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setUsername(emp.username);
    setPassword(emp.password || "");
    setRole(emp.role);
    setPort(emp.port || "Puerto Cabello");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        // Update
        const ref = doc(db, "employees", editingId);
        await updateDoc(ref, {
          username,
          password,
          role,
          port
        });
        await logAuditAction(`Actualizó empleado (${username} a ${role} en ${port})`, adminUser?.role, adminUser?.email);
      } else {
        // Create
        await addDoc(collection(db, "employees"), {
          name: "Sin Configurar", // name is added on the user's first login
          username,
          password,
          role,
          port,
          status: "active"
        });
        await logAuditAction(`Creó empleado (${username} - ${role} en ${port})`, adminUser?.role, adminUser?.email);
      }
      setShowModal(false);
      fetchEmployees();
    } catch (e) {
      console.error(e);
      alert("Error al guardar empleado");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, empUsername: string) => {
    if (!confirm("¿Desea cambiar el estado de esta cuenta?")) return;
    try {
       const newStatus = currentStatus === "active" ? "inactive" : "active";
       await updateDoc(doc(db, "employees", id), {
         status: newStatus
       });
       await logAuditAction(`Cambió estado empleado ${empUsername} a ${newStatus}`, adminUser?.role, adminUser?.email);
       fetchEmployees();
    } catch (error) {
       alert("Error al actualizar");
    }
  };
  
  const handleDelete = async (id: string, empUsername: string) => {
    if (!confirm("¿Estás seguro de que quieres archivar a este empleado?")) return;
    try {
       await updateDoc(doc(db, "employees", id), {
         is_archived: true,
         archived_at: new Date().toISOString(),
         archived_by: adminUser?.email || "SuperAdmin"
       });
       await logAuditAction("GENERAL_CYCLE", `Archivó empleado ${empUsername}`, adminUser?.email, adminUser?.role, "WARNING");
       fetchEmployees();
    } catch (error) {
       alert("Error al archivar");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Gestión de Personal Interno</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Creación y configuración de credenciales operativas</p>
        </div>
        <div className="flex gap-2">
          <button 
             onClick={fetchEmployees}
             title="Refrescar"
             className="p-3 rounded border border-border bg-white hover:bg-background-muted text-foreground-muted transition-colors"
          >
             <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded font-bold font-mono tracking-widest uppercase transition-all text-xs shadow-sm"
          >
            <Plus size={18} /> Nuevo Empleado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center text-foreground-muted">
             <Loader2 size={32} className="animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-foreground-muted">
            <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="font-mono">No hay empleados registrados en la base de datos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-foreground">
              <thead>
                <tr className="bg-background-muted text-foreground-muted border-b border-border uppercase tracking-wider text-[10px] font-mono">
                  <th className="px-6 py-4 font-bold">Empleado</th>
                  <th className="px-6 py-4 font-bold">Usuario ID</th>
                  <th className="px-6 py-4 font-bold">Rol Operativo</th>
                  <th className="px-6 py-4 font-bold">Puerto Asignado</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-secondary flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-white text-secondary-dark flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-foreground-muted">{emp.username}</td>
                    <td className="px-6 py-4 flex flex-col gap-1 items-start">
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded font-mono text-[10px] font-bold tracking-widest border border-primary/20 block w-fit">
                        {emp.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-slate-500 font-mono text-xs font-bold uppercase tracking-widest">
                         <MapPin size={12} /> {emp.port || "NO ASIGNADO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        onClick={() => handleToggleStatus(emp.id, emp.status, emp.username)}
                        className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-widest font-mono cursor-pointer border ${
                          emp.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {emp.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => handleEdit(emp)}
                           className="p-2 text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded transition-all"
                         >
                            <Edit2 size={16} />
                         </button>
                         <button 
                           onClick={() => handleDelete(emp.id, emp.username)}
                           className="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition-all"
                         >
                            <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded border border-border shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background-muted">
                <h3 className="font-bold text-secondary tracking-widest text-sm font-mono uppercase">
                  {editingId ? "Editar Empleado" : "Nueva Cuenta Interna"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-secondary transition-colors">
                  <X size={20} />
                </button>
             </div>
             
             <form onSubmit={handleSave} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-foreground-muted mb-2 uppercase tracking-wide font-mono">Usuario (Login ID)</label>
                  <input 
                    type="text" required value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm transition-colors"
                    placeholder="carlos_m"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground-muted mb-2 uppercase tracking-wide font-mono">Rol Operativo</label>
                  <select 
                    value={role} onChange={e => setRole(e.target.value as Role)}
                    className="w-full px-4 py-3 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm uppercase transition-colors"
                  >
                    {CREATABLE_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground-muted mb-2 uppercase tracking-wide font-mono">Puerto Asignado</label>
                  <select 
                    value={port} onChange={e => setPort(e.target.value as PortLocation)}
                    className="w-full px-4 py-3 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm uppercase transition-colors"
                  >
                    {PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                    {role === "GERENTE_GENERAL" && <option value="GLOBAL">GLOBAL (TODOS)</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground-muted mb-2 uppercase tracking-wide font-mono">Contraseña Temporal</label>
                  <input 
                    type="text" required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm transition-colors"
                    placeholder="123456"
                  />
                  <p className="text-xs text-foreground-muted mt-2 font-serif">Las credenciales deberán ser proporcionadas manualmente.</p>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-border bg-white hover:bg-background-muted text-foreground font-bold tracking-widest font-mono text-xs uppercase rounded transition-colors shadow-sm">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSaving} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest font-mono text-xs uppercase rounded transition-colors disabled:opacity-50 shadow-sm">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Guardar Cuenta"}
                  </button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
