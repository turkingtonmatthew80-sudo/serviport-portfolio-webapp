import { useState, useEffect } from "react";
import { 
  collection, getDocs, doc, updateDoc, query, where, orderBy, addDoc, 
  serverTimestamp, limit 
} from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";
import { 
  CheckCircle2, Clock, Box, Play, Check, Users, Ship, Anchor, Loader2, 
  MapPin, AlertCircle, TrendingUp, Sparkles, RefreshCw, BarChart2, ShieldCheck, ClipboardList
} from "lucide-react";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion, AnimatePresence } from "motion/react";

interface StevedoreCrew {
  id: string;
  name: string;
  leader: string;
  size: number;
  status: "Disponible" | "En Operación" | "De Descanso";
  vesselId?: string | null;
  vesselName?: string | null;
  shift: string;
}

interface YardMovement {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  status: "PENDIENTE" | "EN_CURSO" | "COMPLETED";
  type: string;
  timestamp: any;
  assignedCrewId?: string | null;
  assignedCrewName?: string | null;
}

interface ContainerItem {
  id: string;
  containerId: string;
  status: string;
  location?: string;
  portcallId: string;
}

export function AdminEstibador() {
  const { adminUser } = useAdminAuth();
  
  // Data lists
  const [movements, setMovements] = useState<YardMovement[]>([]);
  const [crews, setCrews] = useState<StevedoreCrew[]>([]);
  const [activeVessels, setActiveVessels] = useState<any[]>([]);
  
  // Selection/Context state
  const [selectedCrewId, setSelectedCrewId] = useState<string>(() => {
    return localStorage.getItem("serviport_estibador_crew_id") || "";
  });
  const [filterMode, setFilterMode] = useState<"all" | "crew">("crew");
  
  // Loaders
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Statistics tracker
  const [completedToday, setCompletedToday] = useState<number>(() => {
     const saved = localStorage.getItem("serviport_estibador_completed_count");
     return saved ? parseInt(saved, 10) : 0;
  });

  const loadOperationalData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch pending/active yard movements
      let qMovs = query(collection(db, "yard_movements"), orderBy("timestamp", "desc"));
      // Firestore requires composite index if where + orderBy on different fields. 
      // If we don't have it, we just fetch and filter client side.
      const movSnap = await getDocs(qMovs);
      const loadedMovs: YardMovement[] = [];
      movSnap.forEach(d => {
         const data = d.data();
         // Port manual filter to avoid index requirement
         if (adminUser && adminUser.port !== "GLOBAL" && data.port !== adminUser.port && data.port) return; 

         if (data.status !== "COMPLETED") {
           loadedMovs.push({ id: d.id, ...data } as YardMovement);
         }
      });
      setMovements(loadedMovs);

      // 2. Fetch crews
      let qCrews: any = collection(db, "crews");
      if (adminUser && adminUser.port !== "GLOBAL") {
         qCrews = query(qCrews, where("port", "==", adminUser.port));
      }
      const crewSnap = await getDocs(qCrews);
      const loadedCrews: StevedoreCrew[] = [];
      crewSnap.forEach(d => {
         loadedCrews.push({ id: d.id, ...(d.data() as any) } as StevedoreCrew);
      });
      setCrews(loadedCrews);

      // 3. Fetch active vessels to display corresponding vessel layout
      let qVessels: any = collection(db, "portcalls");
      if (adminUser && adminUser.port !== "GLOBAL") {
         qVessels = query(qVessels, where("port", "==", adminUser.port));
      }
      const vesselSnap = await getDocs(qVessels);
      const vessels: any[] = [];
      vesselSnap.forEach(d => {
         const data = d.data() as any;
         if (data.status !== "Finalizado") {
           vessels.push({ id: d.id, ...data });
         }
      });
      setActiveVessels(vessels);

    } catch (err) {
      console.error("Error loading operational files for Stevedore:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOperationalData();
  }, []);

  const getSelectedCrewObj = () => {
    return crews.find(c => c.id === selectedCrewId) || null;
  };

  const handleCrewSelection = (id: string) => {
    setSelectedCrewId(id);
    if (id) {
      localStorage.setItem("serviport_estibador_crew_id", id);
    } else {
      localStorage.removeItem("serviport_estibador_crew_id");
    }
  };

  // Claim a movement order for the selected squad (Cuadrilla)
  const handleClaimMovement = async (movementId: string, crewObj: StevedoreCrew) => {
    setIsProcessing(movementId);
    try {
       await updateDoc(doc(db, "yard_movements", movementId), {
          assignedCrewId: crewObj.id,
          assignedCrewName: crewObj.name,
          status: "EN_CURSO"
       });

       await logAuditAction(
         `Cuadrilla "${crewObj.name}" reclamó la maniobra del contenedor ${movementId}`, 
         "ESTIBADOR", 
         adminUser?.email || "estibador.guard@serviport.com.ve"
       );
       await loadOperationalData();
    } catch(err) {
       console.error("Error claiming movement in DB:", err);
    } finally {
       setIsProcessing(null);
    }
  };

  // Complete a movement order (updates movement status, logs action, and updates container location)
  const handleCompleteMovement = async (movement: YardMovement) => {
    setIsProcessing(movement.id);
    try {
      // 1. Update movement status to COMPLETED
      await updateDoc(doc(db, "yard_movements", movement.id), {
        status: "COMPLETED"
      });

      // 2. Synchronize container position: find corresponding container by reference key matching containerId
      const containerSnap = await getDocs(query(collection(db, "contenedores"), where("containerId", "==", movement.reference)));
      if (!containerSnap.empty) {
         const containerDoc = containerSnap.docs[0];
         
         let newContainerStatus = "Disponible";
         if (movement.type === "CARGA DE BUQUE") {
           newContainerStatus = "Cargado";
         } else if (movement.type === "DESCARGA DE BUQUE") {
           newContainerStatus = "Disponible";
         }

         await updateDoc(doc(db, "contenedores", containerDoc.id), {
            status: newContainerStatus,
            location: movement.destination
         });

         await logAuditAction(
           `Actualizó ubicación del contenedor ${movement.reference} a ${movement.destination} (${newContainerStatus})`,
           "ESTIBADOR",
           adminUser?.email
         );
      }

      await logAuditAction(
        `Completó de forma exitosa maniobra de estiba ${movement.reference} (${movement.type})`, 
        "ESTIBADOR", 
        adminUser?.email
      );

      // Increment today's completions
      const newCount = completedToday + 1;
      setCompletedToday(newCount);
      localStorage.setItem("serviport_estibador_completed_count", newCount.toString());

      await loadOperationalData();
    } catch (err) {
      console.error("Error completing cargo movement:", err);
    } finally {
      setIsProcessing(null);
    }
  };

  // Filter tasks based on crew selection and active settings
  const filteredMovements = movements.filter(m => {
    const crewObj = getSelectedCrewObj();
    if (filterMode === "crew") {
      // If no crew selected, return all, or strictly show matching claimed/unassigned
      if (!crewObj) return true;
      
      // If movement is unclaimed OR assigned to this crew
      const isUnassigned = !m.assignedCrewId;
      const isMine = m.assignedCrewId === crewObj.id;
      
      // Also filter based on active vessel of the crew if they are assigned to one
      if (crewObj.vesselId) {
        // Show movements matching their ship or general yard movements
        return isMine || (isUnassigned && (m.origin.includes(crewObj.vesselName || "") || m.destination.includes(crewObj.vesselName || "")));
      }
      return isMine || isUnassigned;
    }
    return true;
  });

  const selectedCrewObj = getSelectedCrewObj();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <Anchor size={14} className="animate-pulse" /> Operaciones de Muelle y Estiba
          </div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
            Panel del Estibador (Stevedore)
          </h2>
          <p className="text-foreground-muted text-sm font-sans">
            Recibe instrucciones de traslado, grúas pórtico y registro de faenas de estiba completadas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={loadOperationalData}
            title="Sincronizar base de datos"
            className="p-3 bg-white border border-border text-foreground-muted hover:text-primary hover:bg-slate-50 transition-all rounded shadow-sm flex items-center gap-2 text-xs font-mono font-bold"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Sincronizar
          </button>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column: Cuadrilla context and vessel details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SQUAD / CUADRILLA SELECTOR COHESION */}
          <div className="bg-white border border-border rounded p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
               <Users className="text-primary" size={20} />
               <span className="font-bold text-secondary uppercase tracking-wider font-mono text-xs">Filiación de Cuadrilla</span>
            </div>
            
            <p className="text-xs text-foreground-muted font-sans leading-relaxed">
              Selecciona la cuadrilla (squad) de estibadores en la que estás trabajando hoy para heredar su asignación de buques y maniobras específicas.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Cuadrilla Activa</label>
              <select 
                value={selectedCrewId}
                onChange={e => handleCrewSelection(e.target.value)}
                className="w-full text-xs border border-border px-3 py-2.5 rounded focus:outline-none focus:border-primary font-sans bg-background bg-white font-medium text-secondary"
              >
                <option value="">-- No Filiado (Ver Todo) --</option>
                {crews.map(c => (
                   <option key={c.id} value={c.id}>
                     {c.name} ({c.status})
                   </option>
                ))}
              </select>
            </div>

            {selectedCrewObj ? (
               <div className="bg-slate-50 border border-border rounded p-4 font-mono text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Jefe de Cuadrilla:</span>
                    <span className="font-bold text-secondary">{selectedCrewObj.leader}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Estibadores Fieles:</span>
                    <span className="font-bold text-secondary">{selectedCrewObj.size} hombres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Turno de Faena:</span>
                    <span className="font-bold text-secondary">{selectedCrewObj.shift}</span>
                  </div>
                  <div className="border-t border-border/70 pt-2 flex flex-col gap-1">
                     <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wide">Status General:</span>
                     <span className={`text-[10px] font-bold uppercase rounded border px-2 py-0.5 inline-block text-center mt-0.5 ${
                        selectedCrewObj.status === "En Operación" 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                     }`}>
                        {selectedCrewObj.status}
                     </span>
                  </div>
               </div>
            ) : (
               <div className="p-4 border border-dashed border-yellow-200 rounded bg-yellow-50/50 flex gap-2.5">
                  <AlertCircle className="text-yellow-600 shrink-0" size={16} />
                  <p className="text-[11px] text-yellow-800 font-sans leading-tight">
                     No has seleccionado ninguna cuadrilla. Para ver tareas filtradas según barcos y frentes de trabajo, asóciate a una cuadrilla en el selector de arriba.
                  </p>
               </div>
            )}
          </div>

          {/* SQUAD VESSEL DETAILS CARD */}
          {selectedCrewObj && selectedCrewObj.vesselId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary-dark text-white rounded p-5 border border-secondary shadow-lg space-y-4"
            >
               <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider">
                     <Ship size={14} className="animate-pulse" /> Buque Asignado
                  </div>
                  <span className="text-[9px] bg-primary text-white font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 rounded leading-none">
                     FAENA ACTIVA
                  </span>
               </div>

               <div>
                 <p className="text-lg font-black text-white font-sansita uppercase tracking-tight mb-0.5 truncate">{selectedCrewObj.vesselName}</p>
                 <p className="text-[11px] text-slate-400 font-mono tracking-wide">Representante Serviport: Oficinista de Buques</p>
               </div>

               {/* Find active vessel detail to show current status & berth */}
               {(() => {
                 const match = activeVessels.find(v => v.id === selectedCrewObj.vesselId);
                 if (match) {
                   return (
                     <div className="space-y-3 font-mono text-xs pt-2">
                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                           <div>
                             <p className="text-slate-400 text-[10px] uppercase">Berth / Muelle</p>
                             <div className="flex items-center gap-1 text-primary font-bold mt-0.5">
                                <MapPin size={12} /> {match.berth || "Muelle 24"}
                             </div>
                           </div>
                           <div>
                             <p className="text-slate-400 text-[10px] uppercase">Estado Escala</p>
                             <p className="font-bold text-white mt-0.5">{match.status}</p>
                           </div>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase leading-none mt-2">Último Hito:</p>
                        <p className="text-xs text-slate-200 font-sans italic">
                           &quot;{match.hitos && match.hitos.length > 0 ? match.hitos[match.hitos.length - 1].remarks : "Escala planificada iniciándose."}&quot;
                        </p>
                     </div>
                   );
                 }
                 return <p className="text-xs text-slate-400 italic">No hay detalles extra disponibles en rada.</p>;
               })()}
            </motion.div>
          )}

          {/* PERSONAL KPI TRACKER */}
          <div className="bg-white border border-border rounded p-5 shadow-sm space-y-3">
             <div className="flex justify-between items-center border-b border-border pb-2.5">
                <span className="text-xs uppercase font-mono font-bold text-secondary tracking-widest flex items-center gap-2">
                   <BarChart2 size={16} className="text-primary" /> Mi Jornada Operativa
                </span>
             </div>
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded border border-border">
                   <p className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">TEUs Movidos</p>
                   <p className="text-2xl font-black text-secondary font-mono mt-1">{completedToday}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-border">
                   <p className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Eficiencia</p>
                   <p className="text-2xl font-black text-emerald-600 font-mono mt-1">100%</p>
                </div>
             </div>
             <p className="text-[10px] text-foreground-muted font-sans text-center mt-1">
                La eficiencia se calcula según la precisión del registro EIR y la ausencia de demoras.
             </p>
          </div>

        </div>

        {/* Right column: Tareas Asignadas Checklist */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[600px] bg-white border border-border shadow-sm rounded overflow-hidden">
          
          {/* List Title Panel & Filters */}
          <div className="p-6 border-b border-border bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h3 className="text-xl font-bold font-sansita text-secondary uppercase tracking-tight flex items-center gap-2">
                   <ClipboardList size={20} className="text-primary" /> Órdenes de Estiba Pendientes
                </h3>
                <p className="text-xs text-foreground-muted font-sans mt-0.5">
                   Trabajando en tiempo real procesando órdenes (TOS Sync).
                 </p>
             </div>

             {/* Filter Tabs */}
             <div className="flex bg-white border border-border rounded p-1 font-mono text-[10px] uppercase font-bold text-foreground-muted tracking-wider gap-0.5">
                <button 
                  onClick={() => setFilterMode("crew")}
                  className={`px-3 py-1.5 rounded transition-all ${filterMode === "crew" ? "bg-primary text-white" : "hover:text-secondary hover:bg-slate-50"}`}
                >
                   Mi Cuadrilla / Barco
                </button>
                <button 
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1.5 rounded transition-all ${filterMode === "all" ? "bg-primary text-white" : "hover:text-secondary hover:bg-slate-50"}`}
                >
                   Todos los Movimientos ({movements.length})
                </button>
             </div>
          </div>

          {/* Active Tasks list */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[600px] no-scrollbar">
             <AnimatePresence mode="wait">
                {isLoading ? (
                   <div className="flex justify-center py-20">
                      <Loader2 className="animate-spin text-primary" size={32} />
                   </div>
                ) : filteredMovements.length > 0 ? (
                   <div className="space-y-4">
                      {filteredMovements.map((mov) => {
                         const isAssignedToThisCrew = selectedCrewId && mov.assignedCrewId === selectedCrewId;
                         const isClaimedByOther = mov.assignedCrewId && mov.assignedCrewId !== selectedCrewId;
                         const isUnassigned = !mov.assignedCrewId;

                         return (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              key={mov.id}
                              className={`p-5 border rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                                 mov.status === "EN_CURSO" 
                                 ? "border-primary/60 bg-gradient-to-r from-primary/5 via-transparent to-transparent ring-1 ring-primary/10" 
                                 : "border-border hover:border-slate-350 bg-white"
                              }`}
                            >
                               {/* Container Details & Type Info */}
                               <div className="space-y-3 flex-1 min-w-0">
                                  <div className="flex items-center gap-3 flex-wrap">
                                     <div className="px-2.5 py-1 bg-secondary text-white font-mono text-xs font-bold uppercase rounded-sm border border-secondary shadow-sm flex items-center gap-1.5 shrink-0">
                                        <Box size={13} /> {mov.reference}
                                     </div>
                                     <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase border shrink-0 ${
                                        mov.type === "DESCARGA DE BUQUE" 
                                        ? "bg-orange-50 text-orange-700 border-orange-200" 
                                        : mTypeClean(mov.type) === "CARGA" 
                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                        : "bg-teal-50 text-teal-700 border-teal-200"
                                     }`}>
                                        {mov.type || "TRASLADO EXTRA"}
                                     </span>
                                     
                                     {mov.assignedCrewName && (
                                        <span className="text-[10px] font-mono text-slate-500 font-bold flex items-center gap-1">
                                           ⚡ {mov.assignedCrewName} {isAssignedToThisCrew && "(Tu Cuadrilla)"}
                                        </span>
                                      )}
                                  </div>

                                  {/* Route Transfer Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-150 p-3 rounded font-mono text-xs select-all">
                                     <div>
                                        <p className="text-[9px] uppercase font-bold text-foreground-muted tracking-widest leading-none mb-1">Origen (Recoger de)</p>
                                        <p className="font-bold text-secondary truncate">{mov.origin}</p>
                                     </div>
                                     <div className="border-l border-border pl-3 md:pl-4">
                                        <p className="text-[9px] uppercase font-bold text-foreground-muted tracking-widest leading-none mb-1">Destino (Depositar en)</p>
                                        <p className="font-bold text-primary truncate">{mov.destination || "Pendiente Planificación Patio"}</p>
                                     </div>
                                  </div>

                                  <p className="text-[10px] text-foreground-muted font-sans flex items-center gap-1.5 select-none leading-none pt-0.5">
                                     <Clock size={12} /> Creado en muelle: {new Date(mov.timestamp?.seconds * 1000 || Date.now()).toLocaleTimeString()}
                                  </p>
                               </div>

                               {/* Operation Buttons */}
                               <div className="shrink-0 self-end md:self-center">
                                  {isClaimedByOther ? (
                                     <div className="text-right">
                                        <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded uppercase">
                                           En curso por otra cuadrilla
                                        </span>
                                     </div>
                                  ) : (
                                     <div className="flex items-center gap-2">
                                        {mov.status === "EN_CURSO" ? (
                                           <button 
                                             disabled={isProcessing === mov.id}
                                             onClick={() => handleCompleteMovement(mov)}
                                             className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-mono tracking-wider text-[11px] rounded uppercase shadow-sm transition-transform active:translate-y-0.5"
                                           >
                                              {isProcessing === mov.id ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={14} />}
                                              Completado
                                           </button>
                                        ) : (
                                           <button 
                                             disabled={!selectedCrewId || isProcessing === mov.id}
                                             onClick={() => handleClaimMovement(mov.id, selectedCrewObj!)}
                                             className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold font-mono tracking-wider text-[11px] rounded uppercase shadow-sm transition-transform active:translate-y-0.5 disabled:opacity-45 disabled:active:translate-y-0"
                                             title={!selectedCrewId ? "Fíliate a una cuadrilla" : "Iniciar faena"}
                                           >
                                              {isProcessing === mov.id ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                                              Reclamar / Iniciar
                                           </button>
                                        )}
                                     </div>
                                  )}
                               </div>
                            </motion.div>
                         );
                      })}
                   </div>
                ) : (
                   <div className="border border-dashed border-border rounded p-16 text-center select-none bg-slate-50/30">
                      <ClipboardList className="mx-auto text-slate-300 mb-3" size={48} />
                      <p className="text-secondary font-bold text-lg mb-0.5">Fila de Trabajo Vacía</p>
                      <p className="text-foreground-muted text-xs max-w-sm mx-auto font-sans leading-relaxed">
                         {filterMode === "crew" 
                           ? "No hay órdenes de grúa asignadas directamente a tu muelle/barco. Registra descargas en 'Control de Buques' (Oficinista) o cambia el filtro a 'Todos' para ver transferencias globales."
                           : "Todos los movimientos del sistema han sido completados con éxito por el equipo estibador."
                         }
                      </p>
                   </div>
                )}
             </AnimatePresence>
          </div>

          {/* Quick Informative Bottom Bar */}
          <div className="p-4 bg-slate-50 border-t border-border font-mono text-[10px] text-foreground-muted flex flex-col md:flex-row md:justify-between gap-2 select-none">
             <span>Serviport TOS • Módulo de Ejecutores</span>
             <span className="text-primary font-bold uppercase flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" /> Sincronizado con Almacén General de Depósito y Yard Master.
             </span>
          </div>

        </div>

      </div>

    </div>
  );
}

// Clean movement types helper
function mTypeClean(type: string) {
  if (type && type.includes("CARGA")) return "CARGA";
  if (type && type.includes("DESCARGA")) return "DESCARGA";
  return "TRASLADO";
}
