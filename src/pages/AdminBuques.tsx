import { useState, useEffect } from "react";
import { Ship, Anchor, MapPin, Search, CalendarClock, Flag, Filter, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { collection, getDocs, doc, updateDoc, query, arrayUnion } from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

interface PortCall {
  id: string;
  name: string;
  type: string;
  operator: string;
  eta: string;
  status: string;
  berth: string;
}

export function AdminBuques() {
  const { adminUser } = useAdminAuth();
  const [buques, setBuques] = useState<PortCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadBuques = async () => {
    setIsLoading(true);
    try {
       const q = query(collection(db, "portcalls"));
       const snap = await getDocs(q);
       const loaded: PortCall[] = [];
       snap.forEach(doc => {
          loaded.push({ id: doc.id, ...doc.data() } as PortCall);
       });
       setBuques(loaded);
    } catch(err) {
       console.error("Error loading buques", err);
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBuques();
  }, []);

  const getStatusStep = (status: string) => {
    if (status === "Aprobado") return 1;
    if (status === "En Rada") return 2;
    if (status === "Atracado") return 3;
    if (status === "En Operación") return 4;
    if (status === "Finalizado") return 5;
    return 0;
  };

  const updateVesselStatus = async (id: string, newStatus: string, vesselName: string) => {
    setProcessingId(id);
    try {
      await updateDoc(doc(db, "portcalls", id), { 
         status: newStatus,
         hitos: arrayUnion({
            status: newStatus,
            timestamp: new Date(),
            user: adminUser?.email || "unknown"
         })
      });
      await logAuditAction(`Actualizó estado buque ${vesselName} a ${newStatus}`, adminUser?.role, adminUser?.email);
      loadBuques();
    } catch(err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Control de Buques en Muelle</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestión de hitos operativos, atraques y zarpes (Water Clerk).</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded font-bold font-mono tracking-widest uppercase transition-all text-xs shadow-sm">
          <Ship size={18} /> Nuevo Registro Manual
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-border p-4 shadow-sm rounded flex items-center gap-2">
            <Search className="text-foreground-muted" size={18} />
            <input type="text" placeholder="Buscar buque o número de viaje..." className="outline-none text-sm w-full bg-transparent font-mono" />
            <Filter className="text-primary cursor-pointer" size={18} />
          </div>

          <div className="space-y-3">
            {isLoading ? (
               <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : buques.length > 0 ? (
              buques.map((b, i) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={b.id} className={`p-4 bg-white border rounded cursor-pointer transition-colors shadow-sm ${i === 0 ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-secondary">{b.name}</span>
                    <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded ${b.status === 'En Rada' ? 'bg-orange-50 text-orange-700 border border-orange-200' : b.status === 'En Operación' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-foreground-muted flex flex-col gap-1">
                    <div className="flex items-center gap-2"><Flag size={12}/> {b.operator}</div>
                    <div className="flex items-center gap-2"><CalendarClock size={12}/> ETA: <span className="font-mono">{b.eta}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={12}/> Puesto: <span className="font-bold">{b.berth}</span></div>
                  </div>
                </motion.div>
              ))
            ) : (
               <div className="p-8 text-center border border-dashed border-border rounded bg-white">
                  <Ship className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-xs text-foreground-muted font-mono uppercase tracking-widest">Sin datos reales</p>
                  <p className="text-xs text-foreground-muted mt-1">0 registros en Base de Datos</p>
               </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {buques.length > 0 ? (
            <div className="bg-white border border-border shadow-sm rounded flex flex-col h-full min-h-[500px]">
              <div className="p-6 border-b border-border flex justify-between items-start bg-background-muted">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-secondary uppercase font-sansita tracking-tight">{buques[0].name}</h3>
                    <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest">{buques[0].status}</span>
                  </div>
                  <p className="text-sm text-foreground-muted font-mono tracking-wide">ID: {buques[0].id} • Operador: {buques[0].operator}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Puesto Asignado</p>
                  <p className="text-xl font-black text-primary font-mono cursor-pointer hover:underline">{buques[0].berth}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest font-mono mb-6">Registro de Hitos (Port Call Log)</h4>
                
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 flex-1">
                  
                  <div className={`relative pl-6 ${getStatusStep(buques[0].status) < 1 ? 'opacity-30' : ''}`}>
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${getStatusStep(buques[0].status) >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 font-mono ${getStatusStep(buques[0].status) >= 1 ? 'text-primary' : 'text-foreground-muted'}`}>1. SOLICITUD APROBADA</p>
                  </div>

                  <div className={`relative pl-6 mt-6 ${getStatusStep(buques[0].status) < 2 ? 'opacity-30' : ''}`}>
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${getStatusStep(buques[0].status) >= 2 ? 'bg-orange-500 ring-4 ring-orange-100' : 'bg-slate-200'}`}></div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 font-mono ${getStatusStep(buques[0].status) >= 2 ? 'text-orange-600' : 'text-foreground-muted'}`}>2. LLEGADA A RADA (NOR)</p>
                    {getStatusStep(buques[0].status) === 2 && (
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded mt-2">
                        <p className="text-sm text-orange-900 mb-2">El buque está en rada esperando ingreso.</p>
                        <button disabled={processingId === buques[0].id} onClick={() => updateVesselStatus(buques[0].id, "Atracado", buques[0].name)} className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-700 hover:bg-orange-100 rounded font-bold text-xs uppercase disabled:opacity-50 transition-colors shadow-sm font-mono tracking-widest">
                          {processingId === buques[0].id ? <Loader2 size={14} className="animate-spin" /> : <Anchor size={14} />} Iniciar Maniobra al Muelle
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`relative pl-6 mt-6 ${getStatusStep(buques[0].status) < 3 ? 'opacity-30' : ''}`}>
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${getStatusStep(buques[0].status) >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 font-mono ${getStatusStep(buques[0].status) >= 3 ? 'text-emerald-700' : 'text-foreground-muted'}`}>3. PRIMERA LÍNEA A TIERRA (ATRACADO)</p>
                    {getStatusStep(buques[0].status) === 3 && (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded mt-2">
                        <button disabled={processingId === buques[0].id} onClick={() => updateVesselStatus(buques[0].id, "En Operación", buques[0].name)} className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 rounded font-bold text-xs uppercase transition-colors shadow-sm font-mono tracking-widest">
                          {processingId === buques[0].id ? <Loader2 size={14} className="animate-spin" /> : <Ship size={14} />} Iniciar Operaciones de Estiba
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`relative pl-6 mt-6 ${getStatusStep(buques[0].status) < 4 ? 'opacity-30' : ''}`}>
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${getStatusStep(buques[0].status) >= 4 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 font-mono ${getStatusStep(buques[0].status) >= 4 ? 'text-blue-700' : 'text-foreground-muted'}`}>4. EN OPERACIÓN (ESTIBA/DESESTIBA)</p>
                    {getStatusStep(buques[0].status) === 4 && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-2">
                         <button disabled={processingId === buques[0].id} onClick={() => updateVesselStatus(buques[0].id, "Finalizado", buques[0].name)} className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 rounded font-bold text-xs uppercase disabled:opacity-50 transition-colors shadow-sm font-mono tracking-widest">
                          {processingId === buques[0].id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Completar Operación y Autorizar Zarpe
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-border shadow-sm rounded flex flex-col h-full min-h-[500px] items-center justify-center text-center p-8">
               <Ship className="text-slate-200 mb-4" size={48} />
               <p className="text-lg font-bold text-secondary mb-1">Sin Registros Activos</p>
               <p className="text-sm text-foreground-muted font-mono">No hay datos reales para mostrar detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
