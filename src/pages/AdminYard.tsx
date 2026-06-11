import { useState, useEffect } from "react";
import { 
  Maximize2, Map, Layers, Crosshair, Box, Loader2, Play, Pause, 
  RotateCcw, ShieldCheck, Check, AlertTriangle, AlertCircle, Trash2, 
  ArrowRightCircle, Anchor, Zap, Users, Shield, Cpu, RefreshCw, 
  Wrench, Activity, Clock, Compass, Plus, SlidersHorizontal, Info, Grid
} from "lucide-react";
import { 
  collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, query, where, orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion, AnimatePresence } from "motion/react";

// Interface Definitions
interface Patio {
  id: string;
  name: string;
  capacity: number;
  current: number;
  status: string;
}

interface DBContainer {
  id: string;
  containerId: string;
  type: string;
  status: string;
  location?: string;
  weight?: number;
  sealNumber?: string;
  lineOperator?: string;
  cargoDesc?: string;
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
  machineryId?: string | null;
}

interface MachineryItem {
  id: string;
  name: string;
  type: string;
  status: "Disponible" | "En Operación" | "Mantenimiento";
  hoursToService: number;
}

export function AdminYard() {
  const { adminUser } = useAdminAuth();
  
  // Tab/Screen states
  const [selectedPatio, setSelectedPatio] = useState<string>("A"); // Main active patio block viewed (A, B, C or AGD)
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<DBContainer | null>(null);
  
  // Database states
  const [patios, setPatios] = useState<Patio[]>([]);
  const [dbContainers, setDbContainers] = useState<DBContainer[]>([]);
  const [movements, setMovements] = useState<YardMovement[]>([]);
  
  // Loader loader
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Simulation Clock control
  const [simulatedTime, setSimulatedTime] = useState<Date>(new Date());
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(60); // 1s = 60s (1 min)

  // Unassigned Container State Filter
  const [searchFilter, setSearchFilter] = useState("");

  // Custom order inputs
  const [manualContainerId, setManualContainerId] = useState("");
  const [manualOrigin, setManualOrigin] = useState("MUELLE 24");
  const [manualMachinery, setManualMachinery] = useState("RS-01");

  // Machinery fleet status (Persisted in localStorage for simulated realism)
  const [machineryList, setMachineryList] = useState<MachineryItem[]>(() => {
    const saved = localStorage.getItem("serviport_machinery");
    if (saved) return JSON.parse(saved);
    return [
      { id: "RS-01", name: "Reach Stacker Hyster #1", type: "Reach Stacker", status: "Disponible", hoursToService: 48 },
      { id: "RS-02", name: "Reach Stacker Kalmar #2", type: "Reach Stacker", status: "En Operación", hoursToService: 122 },
      { id: "GM-01", name: "Grúa Liebherr LHM-550", type: "Grúa Móvil", status: "Disponible", hoursToService: 9 },
      { id: "GF-01", name: "Grúa Flotante 'Gottwald'", type: "Grúa Sólida", status: "Mantenimiento", hoursToService: 0 },
      { id: "MC-03", name: "Montacargas SANY Heavy #3", type: "Montacargas Pesado", status: "Disponible", hoursToService: 190 }
    ];
  });

  useEffect(() => {
    localStorage.setItem("serviport_machinery", JSON.stringify(machineryList));
  }, [machineryList]);

  // Sync simulated time
  useEffect(() => {
    if (!isSimRunning) return;
    const interval = setInterval(() => {
      setSimulatedTime(prev => new Date(prev.getTime() + simSpeedMultiplier * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimRunning, simSpeedMultiplier]);

  // Fetch full operational data
  const loadWorkspaceData = async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch patios
      const patiosSnap = await getDocs(collection(db, "patios"));
      const loadedPatios: Patio[] = [];
      patiosSnap.forEach(doc => {
        loadedPatios.push({ id: doc.id, ...doc.data() } as Patio);
      });
      setPatios(loadedPatios);

      // 2. Fetch containers
      const conSnap = await getDocs(collection(db, "contenedores"));
      const loadedCons: DBContainer[] = [];
      conSnap.forEach(doc => {
        loadedCons.push({ id: doc.id, ...doc.data() } as DBContainer);
      });
      setDbContainers(loadedCons);

      // 3. Fetch active movements (excluding COMPLETED to avoid visual clutter)
      const movSnap = await getDocs(collection(db, "yard_movements"));
      const loadedMovs: YardMovement[] = [];
      movSnap.forEach(doc => {
        loadedMovs.push({ id: doc.id, ...doc.data() } as YardMovement);
      });
      setMovements(loadedMovs);

    } catch (err) {
      console.error("Error loading yard planner system files:", err);
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const getPatioObj = (id: string) => {
    return patios.find(p => p.id === id) || { id, name: `Patio ${id}`, capacity: 1500, current: 0 };
  };

  // DETERMINISTIC VIRTUAL GRID SLOT PLACEMENT HELPER
  // If a container has strict slot coordinates, e.g. "PATIO A - F-3 - C-5", place it exactly there.
  // Otherwise, deterministically map other general patio containers to fill the visualization board beautifully
  const getContainerAtSlot = (patioId: string, row: number, col: number) => {
    // 1. Look for strict exact coordinate match in location string
    const strictMatch = dbContainers.find(c => {
      const loc = (c.location || "").toUpperCase();
      return (
        loc.includes(`PATIO ${patioId}`) && 
        (loc.includes(`F-${row}`) || loc.includes(`FILA ${row}`)) && 
        (loc.includes(`C-${col}`) || loc.includes(`COL ${col}`) || loc.includes(`C${col}`))
      );
    });
    if (strictMatch) return strictMatch;

    // 2. Otherwise fall back to mapping unplaced containers that belong generally to this patio zone
    const generalContainers = dbContainers.filter(c => {
      const loc = (c.location || "").toUpperCase();
      // Exclude strict match entries
      const hasStrict = loc.includes("F-") && (loc.includes("C-") || loc.includes("COL "));
      if (hasStrict) return false;

      return (
        (patioId === "A" && (loc.includes("PATIO A") || loc.includes("EXPORTACIÓN") || loc.includes("EXP"))) ||
        (patioId === "B" && (loc.includes("PATIO B") || loc.includes("IMPORTACIÓN") || loc.includes("IMP"))) ||
        (patioId === "C" && (loc.includes("PATIO C") || loc.includes("VACÍO") || loc.includes("VACIOS") || loc.includes("MTY"))) ||
        (patioId === "AGD" && (loc.includes("AGD") || loc.includes("DEPÓSITO") || loc.includes("ALMACÉN")))
      );
    });

    // Deterministic layout index to scatter them beautifully
    const slotIndex = (row * 6 + col - 1);
    if (slotIndex < generalContainers.length) {
      return generalContainers[slotIndex];
    }

    return null;
  };

  // Click on a cell in the interactive 2D matrix
  const handleSelectSlot = (row: number, col: number, container: DBContainer | null) => {
    setSelectedRow(row);
    setSelectedCol(col);
    setSelectedContainer(container);
    if (container) {
      setManualContainerId(container.containerId);
    } else {
      setManualContainerId("");
    }
  };

  // FILTERING UNASSIGNED CONTAINERS
  // Those that are list as "POR ASIGNAR", "MUELLE", "PUERTO", or location is blank
  const unassignedContainers = dbContainers.filter(c => {
    const loc = (c.location || "").toUpperCase();
    const isUnassigned = !loc || loc.includes("MUELLE") || loc.includes("POR ASIGNAR") || loc.includes("SIN ASIGNAR") || c.status === "A bordo";
    
    if (searchFilter) {
      return isUnassigned && c.containerId.toLowerCase().includes(searchFilter.toLowerCase());
    }
    return isUnassigned;
  });

  // CRITICAL FLOW: QUEUE YARD MOVEMENT FOR STEVEDORES
  const handleQueueMovementOrder = async (containerCode: string, originLoc: string) => {
    if (!selectedPatio || selectedRow === null || selectedCol === null) {
      alert("Por favor selecciona primero un Slot del mapa 2D (Fila y Columna destino).");
      return;
    }

    const cleanCode = containerCode.trim().toUpperCase();
    if (!cleanCode) {
      alert("Por favor introduce o selecciona un código de contenedor válido.");
      return;
    }

    setIsProcessingOrder("movement-queue");
    try {
      const destinationStr = `PATIO ${selectedPatio} - F-${selectedRow} - C-${selectedCol}`;
      
      // 1. Add document to yard_movements
      await addDoc(collection(db, "yard_movements"), {
        reference: cleanCode,
        origin: originLoc.toUpperCase() || "PATIO GENERAL",
        destination: destinationStr,
        status: "PENDIENTE",
        type: "TRASLADO INTERNO",
        machineryId: manualMachinery,
        timestamp: serverTimestamp()
      });

      // 2. Log audit action
      await logAuditAction(
        `Planificó orden de traslado para contenedor ${cleanCode} desde ${originLoc} hacia slot (${selectedPatio}-F${selectedRow}-C${selectedCol}) con equipo ${manualMachinery}`,
        adminUser?.role || "YARD_PLANNER",
        adminUser?.email
      );

      // 3. Clear active selections and reload
      setSelectedRow(null);
      setSelectedCol(null);
      setSelectedContainer(null);
      setManualContainerId("");
      setActionSuccess(`Orden de traslado creada con éxito para ${cleanCode}`);
      setTimeout(() => setActionSuccess(null), 5000);
      loadWorkspaceData();
    } catch (e) {
      console.error("Error creating movement order:", e);
    } finally {
      setIsProcessingOrder(null);
    }
  };

  // IMMEDIATE BYPASS: PHYSICAL POSITION ASSIGNMENT (Yard Forklift direct action)
  const handleImmediatePlaceContainer = async (containerCode: string, originLoc: string) => {
    if (!selectedPatio || selectedRow === null || selectedCol === null) {
      alert("Por favor selecciona primero un Slot del mapa 2D (Fila y Columna de destino).");
      return;
    }

    const cleanCode = containerCode.trim().toUpperCase();
    if (!cleanCode) {
      alert("Por favor introduce o selecciona un código de contenedor.");
      return;
    }

    setIsProcessingOrder("immediate");
    try {
      const destinationStr = `PATIO ${selectedPatio} - F-${selectedRow} - C-${selectedCol}`;
      
      // 1. Find the container document in local state
      const targetDoc = dbContainers.find(c => c.containerId === cleanCode);
      if (!targetDoc) {
        alert("El contenedor indicado no existe en la base de datos.");
        return;
      }

      // 2. Update the container in Firestore instantly
      await updateDoc(doc(db, "contenedores", targetDoc.id), {
        location: destinationStr,
        status: "Disponible"
      });

      // 3. Log historical finished movement
      await addDoc(collection(db, "yard_movements"), {
        reference: cleanCode,
        origin: originLoc.toUpperCase() || "TRASLADO DIRECTO",
        destination: destinationStr,
        status: "COMPLETED",
        type: "TRASLADO INSTANTÁNEO",
        machineryId: manualMachinery,
        timestamp: serverTimestamp()
      });

      // 4. Log Audit Action
      await logAuditAction(
        `Posicionó de inmediato contenedor ${cleanCode} en slot ${destinationStr}`,
        adminUser?.role || "YARD_PLANNER",
        adminUser?.email
      );

      // 5. Success cleanup
      setSelectedRow(null);
      setSelectedCol(null);
      setSelectedContainer(null);
      setManualContainerId("");
      setActionSuccess(`Contenedor ${cleanCode} ubicado inmediatamente en ${destinationStr}`);
      setTimeout(() => setActionSuccess(null), 5000);
      loadWorkspaceData();
    } catch (e) {
      console.error("Error updates instant container position:", e);
    } finally {
      setIsProcessingOrder(null);
    }
  };

  // SIMULATED COMPLETE ORDER (Simulates Stevedore's Action)
  const handleSimulateStevedoreComplete = async (movId: string, reference: string, destination: string) => {
    setIsProcessingOrder(movId);
    try {
      // 1. Update movement to COMPLETED
      await updateDoc(doc(db, "yard_movements", movId), {
        status: "COMPLETED"
      });

      // 2. Synchronize target container position
      const targetC = dbContainers.find(c => c.containerId === reference);
      if (targetC) {
        await updateDoc(doc(db, "contenedores", targetC.id), {
          location: destination,
          status: "Disponible"
        });
      }

      // 3. Log Audit
      await logAuditAction(
        `[SIMULADO] Completó maniobra y traslado para contenedor ${reference} en ubicación ${destination}`,
        "YARD_PLANNER",
        adminUser?.email
      );

      setActionSuccess(`Maniobra completada para contenedor ${reference}.`);
      setTimeout(() => setActionSuccess(null), 5000);
      loadWorkspaceData();
    } catch (err) {
      console.error("Error completing simulated movement:", err);
    } finally {
      setIsProcessingOrder(null);
    }
  };

  // CANCEL YARD MOVEMENT
  const handleDeleteMovementOrder = async (movId: string, reference: string) => {
    if (!confirm(`¿Desea cancelar la orden de traslado de ${reference}?`)) return;
    setIsProcessingOrder(movId);
    try {
      await deleteDoc(doc(db, "yard_movements", movId));
      await logAuditAction(`Canceló orden de maniobra para contenedor ${reference}`, "YARD_PLANNER", adminUser?.email);
      loadWorkspaceData();
    } catch (e) {
      console.error("Error deleting order:", e);
    } finally {
      setIsProcessingOrder(null);
    }
  };

  // SIMULATE TRIGGER HIGH COOLDOWN FOR ACCELERATION (SPIKES TRUCKS)
  const handleTriggerMockTruckSpikes = async () => {
    setIsProcessingOrder("seeding-trucks");
    try {
      // Simulate adding unassigned containers quickly representing new discharged flow in DB
      const mockCons = [
        { containerId: "MSC" + Math.floor(100000 + Math.random() * 899999) + "U", type: "40' Dry Van", weight: 24.2, status: "Disponible", location: "POR ASIGNAR", sealNumber: "SL-MOCK-" + Math.floor(1000 + Math.random() * 9000), lineOperator: "MSC", cargoDesc: "Simulación de Acceso" },
        { containerId: "HAM" + Math.floor(100000 + Math.random() * 899999) + "U", type: "40' High Cube", weight: 26.5, status: "Disponible", location: "POR ASIGNAR", sealNumber: "SL-MOCK-" + Math.floor(1000 + Math.random() * 9000), lineOperator: "HAMBURG SÜD", cargoDesc: "Materiales Médicos" }
      ];

      for (const mc of mockCons) {
        await addDoc(collection(db, "contenedores"), mc);
      }

      await logAuditAction(
        `Disparó simulación acelerada de desembarque de buque. 2 nuevos contenedores agregados a la cola de espera de patio.`,
        "YARD_PLANNER",
        adminUser?.email
      );

      setActionSuccess("¡Picos de cola disparados! 2 nuevos contenedores ingresaron a puerto.");
      setTimeout(() => setActionSuccess(null), 5000);
      loadWorkspaceData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingOrder(null);
    }
  };

  // TOGGLE MACHINERY STATUS
  const handleToggleMachineryStatus = (id: string, current: string) => {
    const statuses: ("Disponible" | "En Operación" | "Mantenimiento")[] = ["Disponible", "En Operación", "Mantenimiento"];
    const nextIdx = (statuses.indexOf(current as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];
    
    setMachineryList(prev => prev.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          status: nextStatus,
          hoursToService: nextStatus === "Mantenimiento" ? 250 : m.hoursToService // Reset hours on service
        };
      }
      return m;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 1. HEADER SECTION & CLOCK STATUS BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <Cpu size={14} className="text-primary animate-pulse" /> Terminal Operating System (TOS 2D)
          </div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
            Planificador de Patio (Yard Planner)
          </h2>
          <p className="text-foreground-muted text-sm font-sans">
            Asignación de slots espaciales de estibas, planificación de traslados a chasis y optimización de grúas en tiempo real.
          </p>
        </div>

        {/* Accelerated Time Simulation Widget */}
        <div className="flex items-center flex-wrap gap-4 bg-slate-900 border border-slate-800 p-4 rounded text-slate-100 shadow-md">
          {/* Clock */}
          <div className="flex items-center gap-2.5 bg-slate-950 px-3.5 py-1.5 rounded border border-slate-850 font-mono text-xs">
            <Clock size={16} className="text-accent animate-spin" style={{ animationDuration: isSimRunning ? `${20 / Math.log10(simSpeedMultiplier || 10)}s` : '0s' }} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-bold">Reloj del Puerto</p>
              <p className="text-secondary-cyan font-black mt-0.5 whitespace-nowrap">
                {simulatedTime.toLocaleDateString("es-VE")} — {simulatedTime.toLocaleTimeString("es-VE")}
              </p>
            </div>
          </div>

          {/* Controller */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimRunning(!isSimRunning)}
              title={isSimRunning ? "Pausar simulación" : "Reanudar simulación"}
              className={`p-2 rounded font-mono text-xs uppercase font-extrabold flex items-center gap-1.5 transition-colors ${
                isSimRunning 
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950" 
                  : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
              }`}
            >
              {isSimRunning ? <Pause size={14} /> : <Play size={14} />}
              {isSimRunning ? "PAUSAR" : "REANUDAR"}
            </button>

            {/* Select speed */}
            <select
              value={simSpeedMultiplier}
              onChange={e => setSimSpeedMultiplier(parseInt(e.target.value, 10))}
              disabled={!isSimRunning}
              className="bg-slate-950 border border-slate-800 rounded text-xs px-2.5 py-1.5 font-mono text-emerald-400 focus:outline-none"
            >
              <option value="1">1s = 1s (Real)</option>
              <option value="60">1s = 1m (Acelerado)</option>
              <option value="600">1s = 10m (Rápido)</option>
            </select>

            <button
              onClick={handleTriggerMockTruckSpikes}
              disabled={isProcessingOrder === "seeding-trucks"}
              title="Aceleración de buques/camiones: simula nuevos contenedores de descarga al muelle"
              className="p-2 border border-slate-850 bg-slate-950 text-xs font-mono font-bold hover:bg-slate-850 text-accent rounded flex items-center gap-1.5 transition"
            >
              <Zap size={13} className="text-orange-500 animate-pulse" />
              CONVOY
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2.5 rounded shadow-sm">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 2. OPERATIONAL LAYOUT: TWO SECTION DESKTOP VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (7 COLS): Terminal 2D Map & Matrix Slot Board Viewport */}
        <div className="lg:col-span-7 space-y-6">

          {/* Main Patio Selection Bar */}
          <div className="bg-white border border-border p-1 rounded shadow-sm flex font-mono text-xs font-extrabold uppercase select-none">
            {[
              { id: "A", name: "Patio A: Exportación (EXP)", color: "text-blue-500" },
              { id: "B", name: "Patio B: Importación (IMP)", color: "text-orange-500" },
              { id: "C", name: "Patio C: Vacíos (MTY)", color: "text-emerald-500" },
              { id: "AGD", name: "Serviport Almacén (AGD)", color: "text-amber-500" }
            ].map(tab => {
              const count = dbContainers.filter(c => {
                const loc = (c.location || "").toUpperCase();
                return tab.id === "A" ? (loc.includes("PATIO A") || loc.includes("EXPORT"))
                  : tab.id === "B" ? (loc.includes("PATIO B") || loc.includes("IMPORT"))
                  : tab.id === "C" ? (loc.includes("PATIO C") || loc.includes("VACÍO") || loc.includes("MTY"))
                  : (loc.includes("AGD") || loc.includes("ALMACÉN") || loc.includes("DEPÓSITO"));
              }).length;

              const active = selectedPatio === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedPatio(tab.id);
                    setSelectedRow(null);
                    setSelectedCol(null);
                    setSelectedContainer(null);
                  }}
                  className={`flex-1 py-3 text-center rounded transition-all flex flex-col items-center justify-center ${
                    active 
                      ? "bg-secondary text-white font-black shadow-sm" 
                      : "text-foreground-muted hover:text-secondary hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[11px] leading-tight flex items-center gap-1.5">
                    <Grid size={12} className={active ? "text-primary" : "text-slate-400"} />
                    {tab.name}
                  </span>
                  <span className={`text-[9px] font-mono mt-0.5 px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200/50 ${active ? "text-slate-900 bg-emerald-400 font-bold border-transparent" : ""}`}>
                    {count} CONT.
                  </span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE MATRIX BLOCK VIEW */}
          <div className="bg-white border border-border rounded shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-secondary tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-secondary animate-pulse" />
                  Malla de celdas: {selectedPatio === "AGD" ? "Almacén Serviport (AGD)" : `Patio de Operación Marítima ${selectedPatio}`}
                </span>
                <p className="text-[11px] text-foreground-muted font-sans mt-0.5">
                  Mapa interactivo de slots de estiba física. Selecciona una celda para vaciarla, ubicar o planificar orden.
                </p>
              </div>

              <div className="flex gap-4 text-[10px] font-mono text-foreground-muted">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded"></div> Export</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-orange-500 rounded"></div> Import</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded"></div> Vacío</span>
              </div>
            </div>

            {/* Matrix Board */}
            <div className="flex-1 overflow-x-auto">
              <div className="grid grid-cols-6 gap-3.5 min-w-[500px]">
                
                {/* 4 Rows X 6 Columns of container block slots */}
                {Array.from({ length: 4 }).map((_, rIdx) => {
                  const rowNum = 4 - rIdx; // Row numbers 4 to 1
                  return Array.from({ length: 6 }).map((_, cIdx) => {
                    const colNum = cIdx + 1; // Column numbers 1 to 6
                    const currentCont = getContainerAtSlot(selectedPatio, rowNum, colNum);
                    
                    const isSelected = selectedRow === rowNum && selectedCol === colNum;
                    
                    // Container Type colors: Export (blue), Import (orange), Vacío (emerald)
                    let blockColor = "border-slate-200 hover:bg-slate-50";
                    if (currentCont) {
                      const isExport = (currentCont.type || "").toUpperCase().includes("EXP") || (currentCont.location || "").toUpperCase().includes("PATIO A") || currentCont.type.includes("Dry");
                      const isVacio = (currentCont.type || "").toLowerCase().includes("vaci") || (currentCont.location || "").toUpperCase().includes("PATIO C") || currentCont.weight && currentCont.weight <= 5;
                      
                      if (isVacio) {
                        blockColor = "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 font-bold";
                      } else if (isExport) {
                        blockColor = "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 font-bold";
                      } else {
                        blockColor = "bg-orange-500 text-white border-orange-600 hover:bg-orange-600 font-bold";
                      }
                    }

                    return (
                      <div
                        key={`${rowNum}-${colNum}`}
                        onClick={() => handleSelectSlot(rowNum, colNum, currentCont)}
                        className={`border h-24 rounded p-2.5 cursor-pointer flex flex-col justify-between transition-all relative ${blockColor} ${
                          isSelected ? "ring-4 ring-primary ring-offset-2 scale-[1.02] z-10 border-solid" : "border-dashed"
                        }`}
                      >
                        {/* Slot coordinates identifier */}
                        <span className={`text-[8px] font-mono ${currentCont ? "text-white/80" : "text-slate-400"}`}>
                          F{rowNum}-C{colNum}
                        </span>

                        {currentCont ? (
                          <div className="truncate flex flex-col justify-end">
                            <span className="text-[10px] font-black tracking-wider block truncate">{currentCont.containerId}</span>
                            <span className="text-[9px] text-white/90 truncate leading-none mt-0.5">{currentCont.type}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono text-center my-auto">Libre</span>
                        )}

                        {/* Hover visual helper dot for status */}
                        {currentCont && (
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                        )}
                      </div>
                    );
                  });
                })}

              </div>
            </div>

            {/* Selected Cell Detail Panel */}
            {selectedRow !== null && selectedCol !== null ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5.5 bg-slate-50 border border-slate-200 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary text-primary font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      COORD: {selectedPatio}-F{selectedRow}-C{selectedCol}
                    </span>
                    <span className="text-secondary font-bold text-xs uppercase font-mono">Ranura Seleccionada</span>
                  </div>
                  
                  {selectedContainer ? (
                    <div className="space-y-1 mt-2.5 text-xs text-foreground-muted">
                      <p>Contenedor: <span className="font-bold text-secondary font-mono text-sm">{selectedContainer.containerId}</span></p>
                      <p>Tipo ISO: <span className="font-sans font-semibold text-secondary">{selectedContainer.type}</span> • Peso: <span className="font-mono text-secondary font-bold">{selectedContainer.weight} Ton</span></p>
                      <p>Sello/Precinto Naviero: <span className="font-mono text-secondary font-bold font-bold">{selectedContainer.sealNumber || "NA-VACIO"}</span></p>
                      <p className="truncate max-w-sm">Descripción Carga: <span className="italic font-sans">{selectedContainer.cargoDesc || "Carga de comercio exterior"}</span></p>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground-muted italic pt-2">
                      Este espacio físico en el patio está completamente libre. Selecciona un contenedor en la cola derecha para trasladarlo aquí.
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  {selectedContainer && (
                    <button
                      onClick={() => {
                        // Clear strict coord in layout instantly
                        if (confirm(`¿Sacar el contenedor ${selectedContainer.containerId} de este slot de patio?`)) {
                          handleImmediatePlaceContainer(selectedContainer.containerId, "MUELLE_PUERTO_CORTA_ESTANCIA");
                        }
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 p-2.5 rounded text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Sacar Contenedor
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedRow(null);
                      setSelectedCol(null);
                      setSelectedContainer(null);
                      setManualContainerId("");
                    }}
                    className="bg-white border border-border text-foreground-muted hover:text-secondary px-3 py-2 text-xs font-mono font-bold rounded"
                  >
                    Descartar selección
                  </button>
                </div>
              </motion.div>
            ) : null}

          </div>

          {/* SIMULATED HARBOR MOVEMENT TELEMETRY HISTORY */}
          <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-secondary tracking-widest text-sm font-mono uppercase flex items-center gap-2">
                <Activity size={16} className="text-primary animate-pulse" /> Cola de Ordenes de Traslado en Patio
              </h3>
              <span className="text-[10px] text-foreground-muted font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold">MANIOBRAS DEL TURNO</span>
            </div>

            <div className="divide-y divide-border overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-border font-mono text-[9.5px] text-foreground-muted uppercase tracking-wider">
                    <th className="py-3 px-6">Maniobra ID</th>
                    <th className="py-3 px-6">Contenedor</th>
                    <th className="py-3 px-6">Ruta (Origen → Destino)</th>
                    <th className="py-3 px-6">Equipo Asignado</th>
                    <th className="py-3 px-6">Estado Físico</th>
                    <th className="py-3 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {movements.length > 0 ? (
                    movements.map((mov) => {
                      const isProcessing = isProcessingOrder === mov.id;
                      return (
                        <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-mono text-slate-500 font-bold">MVO-{mov.id.substring(0, 6).toUpperCase()}</td>
                          <td className="py-4 px-6 font-mono font-bold text-secondary">{mov.reference}</td>
                          <td className="py-4 px-6 font-mono text-slate-500">
                            <span className="font-semibold text-slate-600 block">{mov.origin || "Muelle 1"}</span>
                            <span className="text-[10px] text-slate-400">Hacia: {mov.destination}</span>
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-secondary flex items-center gap-1.5">
                            <Wrench size={12} className="text-primary" />
                            {mov.machineryId || "RS-01"}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase border ${
                              mov.status === "PENDIENTE"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}>
                              {mov.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {mov.status !== "COMPLETED" ? (
                              <div className="flex gap-2 justify-end">
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleSimulateStevedoreComplete(mov.id, mov.reference, mov.destination)}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition"
                                >
                                  {isProcessing ? <Loader2 size={10} className="animate-spin" /> : <Check size={11} />}
                                  COMPLETAR
                                </button>
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleDeleteMovementOrder(mov.id, mov.reference)}
                                  className="bg-white border border-slate-200 hover:bg-slate-50 p-1 rounded text-red-500"
                                  title="Cancelar maniobra"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400 font-bold flex items-center gap-1 justify-end">
                                <ShieldCheck size={12} className="text-emerald-500" />
                                FINALIZADO
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-foreground-muted bg-slate-50/10">
                        <Box className="mx-auto text-slate-200 mb-2" size={32} />
                        <p className="font-mono text-xs uppercase tracking-widest font-bold">Sin frentes de estiba activos</p>
                        <p className="text-[10px] font-sans mt-0.5">La cola de movimientos de patio está limpia.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 COLS): Workspace Control Sidebar Panels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ACTION PANEL 1: UNASSIGNED CONTAINER QUEUE */}
          <div className="bg-white border border-border shadow-sm rounded overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-4 bg-slate-50/70 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-secondary text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                  <Box size={16} className="text-primary" /> Cajas en espera de Posición
                </h3>
                <p className="text-[10px] text-foreground-muted font-sans mt-0.5">Contenedores descargados o arribando por gate sin slot asignado.</p>
              </div>
              <span className="bg-primary/10 text-primary-dark font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                {unassignedContainers.length} pendientes
              </span>
            </div>

            {/* Search filter for queue */}
            <div className="p-4 border-b border-border bg-slate-50/20">
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="🔎 Alfilas: buscar código contenedor..."
                className="w-full text-xs font-mono border border-border px-3 py-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            {/* Scrollable List queue */}
            <div className="p-4 space-y-3.5 max-h-[340px] overflow-y-auto pr-1 no-scrollbar">
              {unassignedContainers.map(containerItem => {
                const isSelectedOnForm = manualContainerId === containerItem.containerId;
                return (
                  <div 
                    key={containerItem.id}
                    onClick={() => {
                      setManualContainerId(containerItem.containerId);
                      setManualOrigin(containerItem.location || "MUELLE 24");
                    }}
                    className={`p-3.5 border transition-all rounded cursor-pointer relative overflow-hidden group ${
                      isSelectedOnForm 
                        ? "border-primary bg-primary/2 ring-2 ring-primary/20" 
                        : "border-border hover:border-slate-350 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {/* Container ID */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-black text-xs text-secondary">{containerItem.containerId}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-mono font-bold px-1.5 py-0.2 rounded border">
                            {containerItem.type}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-3 mt-2 text-[10px] text-foreground-muted leading-tight font-sans">
                          <p>Naviera: <span className="font-bold text-secondary font-mono">{containerItem.lineOperator || "POOL"}</span></p>
                          <p>Carrying: <span className="text-secondary font-bold font-mono">{containerItem.weight || 22.4} T</span></p>
                          <p className="col-span-2 mt-1 truncate">Status: <span className="bg-amber-100 text-amber-800 font-semibold px-1 rounded">{containerItem.status || "A bordo"}</span></p>
                        </div>
                      </div>

                      {/* Side quick planner button */}
                      <div className="shrink-0 text-right">
                        <span className="text-[9px] font-mono bg-second-cyan text-secondary font-bold px-1 text-slate-500 bg-slate-100 border rounded py-0.5">
                          {containerItem.location || "Muelle 24"}
                        </span>
                      </div>
                    </div>

                    {/* Drag helper indicators */}
                    <div className="absolute right-2 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] font-mono text-primary font-black uppercase tracking-wider">
                      <span>PLANIFICAR</span>
                      <ArrowRightCircle size={12} />
                    </div>
                  </div>
                );
              })}

              {unassignedContainers.length === 0 && (
                <div className="text-center py-10 border border-dashed border-border rounded bg-slate-50/50">
                  <ShieldCheck size={28} className="mx-auto text-emerald-500 mb-2 animate-bounce" />
                  <p className="text-xs font-mono text-foreground-muted uppercase tracking-widest font-black leading-none">Patios Distribuidos ✓</p>
                  <p className="text-[10px] font-sans text-foreground-muted mt-1 normal-case px-4 leading-relaxed">No existen contenedores sueltos sin ubicación asignada en el puerto.</p>
                </div>
              )}
            </div>
          </div>

          {/* ACTION PANEL 2: MANUAL WORKBENCH PLANNER FORM */}
          <div className="bg-white border border-border shadow-sm rounded overflow-hidden">
            <div className="px-5 py-4 bg-slate-50/70 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-secondary text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" /> Ficha de Programación
              </h3>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider">Código de Contenedor</label>
                <input
                  required
                  value={manualContainerId}
                  onChange={e => setManualContainerId(e.target.value.toUpperCase())}
                  placeholder="Ej: MSKU9830114"
                  className="w-full text-xs font-mono font-bold bg-slate-50 border border-border px-3 py-2.5 rounded focus:outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider">Origen Físico</label>
                  <input
                    value={manualOrigin}
                    onChange={e => setManualOrigin(e.target.value.toUpperCase())}
                    placeholder="MUELLE 24"
                    className="w-full text-xs font-mono bg-slate-50 border border-border px-3 py-2 rounded focus:outline-none uppercase"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider">Asignar Maquinaria</label>
                  <select
                    value={manualMachinery}
                    onChange={e=>setManualMachinery(e.target.value)}
                    className="w-full text-xs border border-border bg-slate-50 px-3 py-2 rounded focus:outline-none font-mono"
                  >
                    {machineryList.filter(m => m.status !== "Mantenimiento").map(m => (
                      <option key={m.id} value={m.id}>{m.id} ({m.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Location indicator */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded text-blue-800 space-y-1.5 leading-relaxed">
                <p className="font-mono text-[10px] text-blue-700 tracking-wider uppercase font-bold flex items-center gap-1">
                  <Compass size={12} className="animate-spin" /> Coordenadas Objetivo Destino:
                </p>
                {selectedRow !== null && selectedCol !== null ? (
                  <p className="font-mono text-sm font-black text-secondary">
                    PATIO {selectedPatio} — FILA {selectedRow} — COLUMNA {selectedCol}
                  </p>
                ) : (
                  <p className="italic text-slate-500 font-sans text-[11px]">
                    Ningún espacio del mapa 2D seleccionado. Haz clic en una celda de la rejilla izquierda para fijar las coordenadas de posicionamiento.
                  </p>
                )}
              </div>

              {/* Dispatch Operations triggers */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessingOrder !== null || selectedRow === null || !manualContainerId}
                  onClick={() => handleQueueMovementOrder(manualContainerId, manualOrigin)}
                  className="bg-secondary hover:bg-secondary-dark text-white font-mono font-bold py-2.5 px-3 rounded shadow-sm text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  title="Genera orden de maniobra para las cuadrillas de estibadores"
                >
                  {isProcessingOrder === "movement-queue" ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
                  Cola Pendiente
                </button>

                <button
                  type="button"
                  disabled={isProcessingOrder !== null || selectedRow === null || !manualContainerId}
                  onClick={() => handleImmediatePlaceContainer(manualContainerId, manualOrigin)}
                  className="bg-primary hover:bg-primary-dark text-white font-mono font-black py-2.5 px-3 rounded shadow-sm text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  title="Posiciona inmediatamente el contenedor omitiendo la espera"
                >
                  {isProcessingOrder === "immediate" ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                  Ubicar Directo
                </button>
              </div>
            </div>
          </div>

          {/* ACTION PANEL 3: REAL-TIME MACHINERY FLEET MONITOR */}
          <div className="bg-white border border-border shadow-sm rounded overflow-hidden">
            <div className="px-5 py-4 bg-slate-50/70 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-secondary text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                  <Wrench size={16} className="text-secondary" /> Flota de Maquinarias Serviport
                </h3>
                <p className="text-[10px] text-foreground-muted font-sans mt-0.5">Control de maquinaria pesada. Haz clic en el estado para cambiarlo.</p>
              </div>
            </div>

            <div className="p-4 space-y-3.5">
              {machineryList.map(mach => {
                const isUnderAlert = mach.hoursToService <= 10;
                return (
                  <div key={mach.id} className="p-3 bg-slate-50 border border-slate-100 rounded flex justify-between items-center gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-secondary font-sans leading-none">{mach.id}</span>
                        <span className="text-[9px] text-foreground-muted leading-none">({mach.name})</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-550">
                        <span>Horas hasta Service:</span>
                        <span className={`font-bold ${isUnderAlert ? "text-red-500 animate-pulse" : "text-slate-700"}`}>
                          {mach.hoursToService} hrs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUnderAlert && (
                        <span title="¡Mantenimiento Requerido!">
                          <AlertTriangle size={14} className="text-red-500 animate-bounce" />
                        </span>
                      )}
                      
                      {/* State switch pill */}
                      <button
                        onClick={() => handleToggleMachineryStatus(mach.id, mach.status)}
                        className={`px-3 py-1.5 rounded text-[10px] font-black uppercase font-mono tracking-wider border-0 select-none cursor-pointer transition ${
                          mach.status === "Disponible" 
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                            : mach.status === "En Operación"
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-105"
                            : "bg-red-50 text-red-700 hover:bg-red-101"
                        }`}
                      >
                        {mach.status}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
