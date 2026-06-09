import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CheckCircle2, Clock, Box, Play, Check } from "lucide-react";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { Loader2 } from "lucide-react";

export function AdminEstibador() {
  const { adminUser } = useAdminAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // Mock an initial structure but fetch from DB. If no tasks, we'll try to find yard_movements
      const q = query(collection(db, "yard_movements"), where("status", "!=", "COMPLETED"));
      const snap = await getDocs(q);
      const loaded: any[] = [];
      snap.forEach(d => loaded.push({ id: d.id, ...d.data() }));
      setTasks(loaded);
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async (taskId: string) => {
    setIsProcessing(taskId);
    try {
       await updateDoc(doc(db, "yard_movements", taskId), { status: "EN_CURSO" });
       await logAuditAction(`Inició tarea de patio ${taskId}`, adminUser?.role, adminUser?.email);
       loadTasks();
    } catch(err) {
       console.error(err);
    } finally {
       setIsProcessing(null);
    }
  };

  const handleComplete = async (taskId: string) => {
    setIsProcessing(taskId);
    try {
       await updateDoc(doc(db, "yard_movements", taskId), { status: "COMPLETED" });
       await logAuditAction(`Completó tarea de patio ${taskId}`, adminUser?.role, adminUser?.email);
       loadTasks();
    } catch(err) {
       console.error(err);
    } finally {
       setIsProcessing(null);
    }
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block text-primary" size={32} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Mis Tareas (Estiba)</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Órdenes de movimiento asignadas en tiempo real.</p>
        </div>
        <button onClick={loadTasks} className="bg-white border border-border px-4 py-2 rounded text-xs font-bold font-mono tracking-widest uppercase text-foreground-muted hover:text-primary transition-colors">
          Refrescar BDD
        </button>
      </div>

      <div className="space-y-4">
         {tasks.length > 0 ? tasks.map(task => (
            <div key={task.id} className="bg-white p-6 border border-border rounded shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        <Box size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-secondary text-lg mb-1">{task.type || "TRASLADO DE CONTENEDOR"}</h3>
                        <p className="text-xs font-mono text-foreground-muted uppercase tracking-wider">Ref: {task.reference || task.id}</p>
                     </div>
                  </div>
                  <span className={`text-[10px] font-bold font-mono uppercase px-2 py-1 rounded border ${task.status === "EN_CURSO" ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {task.status || "PENDIENTE"}
                  </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-border mb-4">
                  <div>
                     <p className="text-[10px] uppercase font-bold text-foreground-muted tracking-widest mb-1">Origen</p>
                     <p className="font-mono text-secondary font-bold">{task.origin || "---"}</p>
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-foreground-muted tracking-widest mb-1">Destino</p>
                     <p className="font-mono text-secondary font-bold">{task.destination || "---"}</p>
                  </div>
               </div>

               <div className="flex justify-end gap-3">
                  {task.status === "EN_CURSO" ? (
                      <button disabled={isProcessing === task.id} onClick={() => handleComplete(task.id)} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded text-xs uppercase font-mono tracking-widest disabled:opacity-50">
                        {isProcessing === task.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Finalizar
                      </button>
                  ) : (
                      <button disabled={isProcessing === task.id} onClick={() => handleStart(task.id)} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded text-xs uppercase font-mono tracking-widest disabled:opacity-50">
                        {isProcessing === task.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} Iniciar
                      </button>
                  )}
               </div>
            </div>
         )) : (
            <div className="bg-white p-12 text-center border border-border rounded shadow-sm border-dashed">
               <Box className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="font-bold text-secondary text-lg mb-2">No tienes tareas asignadas</p>
               <p className="text-foreground-muted text-sm max-w-sm mx-auto">No se encontraron movimientos pendientes en la base de datos para esta sesión.</p>
            </div>
         )}
      </div>
    </div>
  );
}
