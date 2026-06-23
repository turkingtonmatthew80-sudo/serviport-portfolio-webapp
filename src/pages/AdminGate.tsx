import { useState, useEffect } from "react";
import { 
  Camera, Truck, ArrowRight, Save, Loader2, CheckCircle2, ScanLine, Cpu,
  Search, FileText, Printer, Check, ShieldCheck, AlertTriangle, Compass, 
  MapPin, Clock, RefreshCw, ClipboardList, Eye, Plus, ChevronRight, UserCheck, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, 
  doc, updateDoc, where, getDoc, setDoc
} from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

// Interface Definitions
interface QueueItem {
  id: string;
  driverName: string;
  driverCI: string;
  plate: string;
  company: string;
  flowType: "IMPORTACION_RETIRADA" | "EXPORTACION_ENTREGA" | "VACIO_ENTREGA";
  containerId: string;
  containerType: string;
  sealNumber?: string;
  eta: string;
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
  isBlocked?: boolean;
}

interface GateEvent {
  id: string;
  type: "IN" | "OUT";
  placa: string;
  cedula: string;
  driverName: string;
  booking: string;
  container: string;
  containerType: string;
  flowType: string;
  sealNumber: string;
  condition: string;
  photoUrl?: string;
  timestamp: any;
  eirNumber: string;
  inspector: string;
}

export function AdminGate() {
  const { adminUser } = useAdminAuth();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"gate-in" | "gate-out" | "historial">("gate-in");
  
  // Loader states
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successEvent, setSuccessEvent] = useState<string | null>(null);
  
  // Inbound Form Inputs
  const [placa, setPlaca] = useState("");
  const [driverName, setDriverName] = useState("");
  const [cedula, setCedula] = useState("");
  const [company, setCompany] = useState("TRANSPORTE CABELLO C.A.");
  const [booking, setBooking] = useState("");
  const [container, setContainer] = useState("");
  const [containerType, setContainerType] = useState("40' High Cube");
  const [sealNumber, setSealNumber] = useState("");
  const [flowType, setFlowType] = useState<"EXPORTACION_ENTREGA" | "VACIO_ENTREGA" | "IMPORTACION_RETIRADA">("EXPORTACION_ENTREGA");
  
  // Physical Checklist EIR
  const [hasDamage, setHasDamage] = useState(false);
  const [damageNotes, setDamageNotes] = useState("");
  const [containerCondition, setContainerCondition] = useState("ÓPTIMO");
  
  // Photo simulator state
  const [hasCapturedTruck, setHasCapturedTruck] = useState(false);
  const [hasCapturedContainer, setHasCapturedContainer] = useState(false);
  const [hasCapturedSeal, setHasCapturedSeal] = useState(false);
  const [activeCamAngle, setActiveCamAngle] = useState<"frontal" | "lateral" | "sello">("frontal");

  // Database lists
  const [dbContainers, setDbContainers] = useState<DBContainer[]>([]);
  const [history, setHistory] = useState<GateEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // EIR Modal state
  const [selectedEIR, setSelectedEIR] = useState<GateEvent | null>(null);
  const [showEIRModal, setShowEIRModal] = useState(false);

  // Search filter for autocompletion
  const [searchContainerQuery, setSearchContainerQuery] = useState("");
  const [isSearchingDb, setIsSearchingDb] = useState(false);

  // Simulation Truck Queue (representing live trucks waiting at Bolipuertos gate)
  const [liveQueue, setLiveQueue] = useState<QueueItem[]>([
    {
      id: "Q-104",
      driverName: "José Altuve",
      driverCI: "V-18.490.211",
      plate: "A77CD9V",
      company: "FLETES MARÍTIMOS CHENE S.A.",
      flowType: "EXPORTACION_ENTREGA",
      containerId: "SUDU8492019",
      containerType: "40' Dry Van",
      sealNumber: "SEAL-XYZ-4421",
      eta: "En fila (Carril 1)"
    },
    {
      id: "Q-105",
      driverName: "Ramón Herrera",
      driverCI: "V-15.334.892",
      plate: "A15AG3H",
      company: "TRANSPORTE RÁPIDO ORIENTE",
      flowType: "VACIO_ENTREGA",
      containerId: "MSKU4411209",
      containerType: "20' Standard",
      sealNumber: "SEAL-MSK-9901",
      eta: "En fila (Carril 2)"
    },
    {
      id: "Q-106",
      driverName: "Wilmer Flores",
      driverCI: "V-22.104.593",
      plate: "A02BC1D",
      company: "LOGÍSTICA PUERTO CABELLO",
      flowType: "IMPORTACION_RETIRADA",
      containerId: "TEMPORAL_WDRW",
      containerType: "40' High Cube",
      eta: "Arribando en 2 min"
    }
  ]);

  // Load initial historical operations & active container references
  const loadSystemReferenceData = async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch live historical gate events from firestore
      let qEvents: any = collection(db, "gate_events");
      if (adminUser && adminUser.port !== "GLOBAL") {
         qEvents = query(collection(db, "gate_events"), where("port", "==", adminUser.port), orderBy("timestamp", "desc"), limit(25));
      } else {
         qEvents = query(collection(db, "gate_events"), orderBy("timestamp", "desc"), limit(25));
      }
      
      let eventsSnap;
      try {
        eventsSnap = await getDocs(qEvents);
      } catch (err: any) {
        console.warn("Index missing for gate_events, falling back to unordered", err);
        if (adminUser && adminUser.port !== "GLOBAL") {
           qEvents = query(collection(db, "gate_events"), where("port", "==", adminUser.port), limit(50));
        } else {
           qEvents = query(collection(db, "gate_events"), limit(50));
        }
        eventsSnap = await getDocs(qEvents);
      }
      const events: GateEvent[] = [];
      eventsSnap.forEach(doc => {
        events.push({ id: doc.id, ...(doc.data() as any) } as GateEvent);
      });
      setHistory(events);

      // 2. Fetch active containers in database to allow searching the list for withdrawals
      let qContainers: any = collection(db, "contenedores");
      if (adminUser && adminUser.port !== "GLOBAL") {
         qContainers = query(collection(db, "contenedores"), where("port", "==", adminUser.port));
      }
      const consSnap = await getDocs(qContainers);
      const cons: DBContainer[] = [];
      consSnap.forEach(doc => {
        cons.push({ id: doc.id, ...(doc.data() as any) } as DBContainer);
      });
      setDbContainers(cons);

    } catch (err) {
      console.error("Error loading gate databases:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadSystemReferenceData();
  }, [activeTab]);

  const handleProcessQueueItem = (item: QueueItem) => {
    setPlaca(item.plate);
    setDriverName(item.driverName);
    setCedula(item.driverCI);
    setCompany(item.company);
    setContainerType(item.containerType);
    setFlowType(item.flowType);
    
    // Set container & seal details if they exist in queue item
    if (item.containerId && item.containerId !== "TEMPORAL_WDRW") {
      setContainer(item.containerId);
    } else {
      setContainer("");
    }
    
    if (item.sealNumber) {
      setSealNumber(item.sealNumber);
    } else {
      setSealNumber("");
    }

    // Trigger OCR status indicators
    setHasCapturedTruck(true);
    setHasCapturedContainer(true);
    setHasCapturedSeal(true);
    
    // Inform the user
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-700.wav");
    audio.play().catch(() => {}); // Optional scan chirp
  };

  // Process interactive camera feeds
  const handleTriggerCamera = () => {
    if (activeCamAngle === "frontal") {
      setHasCapturedTruck(true);
      setActiveCamAngle("lateral");
    } else if (activeCamAngle === "lateral") {
      setHasCapturedContainer(true);
      setActiveCamAngle("sello");
    } else {
      setHasCapturedSeal(true);
      setActiveCamAngle("frontal");
    }
  };

  const handleResetCamera = () => {
    setHasCapturedTruck(false);
    setHasCapturedContainer(false);
    setHasCapturedSeal(false);
    setActiveCamAngle("frontal");
  };

  // Auto-generate high-contrast Venezuela custom plate format
  const handleQuickAutocompletePlates = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const generated = chars[Math.floor(Math.random() * 26)] + 
                      nums[Math.floor(Math.random() * 10)] + 
                      nums[Math.floor(Math.random() * 10)] + 
                      chars[Math.floor(Math.random() * 26)] + 
                      chars[Math.floor(Math.random() * 26)] + 
                      nums[Math.floor(Math.random() * 10)];
    setPlaca(generated);
  };

  // Submits a Gate-In (Entrada) event
  const handleSubmitGateIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !cedula || !driverName) {
      alert("Por favor rellene los datos básicos obligatorios (Camión, Conductor).");
      return;
    }

    if (!hasCapturedTruck || !hasCapturedContainer) {
      alert("Es requisito obligatorio capturar la secuencia de fotos de inspección de seguridad antes de permitir el ingreso.");
      return;
    }

    setIsLoading(true);
    try {
      const eirId = `EIR-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const cleanContainerId = container.trim().toUpperCase();

      // Trigger SQL specific Gate-In for exportations if flowType is EXPORTACION_ENTREGA
      if (flowType === "EXPORTACION_ENTREGA" && cleanContainerId) {
         try {
           const res = await fetch('/api/tos/gate-in-export', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ bic: cleanContainerId, bookingExportacionId: booking })
           });
           if (!res.ok) {
             console.warn("SQL Gate-In endpoint failed or not fully integrated:", await res.text());
           }
         } catch(e) {
           console.error("Failed to hit SQL gate-in", e);
         }
      }

      // 1. Log event details to firestore database
      const gateEventData: Omit<GateEvent, "id"> = {
        type: "IN",
        placa: placa.toUpperCase(),
        cedula,
        driverName,
        booking: booking.toUpperCase() || "BKG-SIN-DOC",
        container: cleanContainerId || "VACÍO / SIN CONTENEDOR",
        containerType,
        flowType,
        sealNumber: sealNumber.toUpperCase() || "N/A - ABIESTO",
        condition: containerCondition,
        eirNumber: eirId,
        inspector: adminUser?.email || "puerta.guard@serviport.com.ve",
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello"),
        timestamp: serverTimestamp()
      } as any;

      const docRef = await addDoc(collection(db, "gate_events"), gateEventData);

      // 2. Insert new shipping container to TOS database automatically if it's an inbound export
      if (flowType === "EXPORTACION_ENTREGA" && cleanContainerId) {
        // Query to check if container already exists to avoid duplication
        const qCheck = query(collection(db, "contenedores"), where("containerId", "==", cleanContainerId));
        const checkSnap = await getDocs(qCheck);
        
        if (checkSnap.empty) {
          const cRef = doc(collection(db, "contenedores"));
          await setDoc(cRef, {
            containerId: cleanContainerId,
            type: containerType,
            cycleId: cRef.id,
            vesselRef: "", // Unassigned to vessel yet (Bottom-up flow)
            status: "Disponible",
            location: "AGD PATIO EXPORTACIÓN",
            sealNumber: sealNumber.toUpperCase() || "SL-MOCK-9921",
            lineOperator: "NAVIERA ASOCIADA B2B",
            weight: 22.4, // standard
            cargoDesc: "CARGA EXPEDIDA EN PUERTO EXPORTACIÓN",
            operationType: "Carga",
            portcallId: "", // unassigned to ship yet
            userId: "CLIENT_B2B_MOCK", // links to B2B portal representation
            port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
          });
        }
      }

      // 3. Insert empty container into AGD zone
      if (flowType === "VACIO_ENTREGA" && cleanContainerId) {
        const cRef = doc(collection(db, "contenedores"));
        await setDoc(cRef, {
          containerId: cleanContainerId,
          type: containerType,
          cycleId: cRef.id,
          vesselRef: "", // Empty container waiting for allocation
          status: "Disponible",
          location: "AGD PATIO VACÍOS",
          sealNumber: "N/A - VACÍO",
          lineOperator: "OPERADOR POOL",
          weight: 4.2, // tare weight
          cargoDesc: "CONTENEDOR VACÍO REAPROVISIONAMIENTO",
          operationType: "Carga",
          portcallId: "",
          userId: "CLIENT_B2B_MOCK",
          port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
        });
      }

      await logAuditAction(
        `Registró GATE-IN para camión ${placa.toUpperCase()} con contenedor ${cleanContainerId || "Chuto vacío"}. Emitió EIR: ${eirId}`, 
        adminUser?.role || "GATE_CHECKER", 
        adminUser?.email
      );

      // Remove from live mock queue if processed from there
      setLiveQueue(prev => prev.filter(q => q.plate !== placa));

      // Show EIR Modal for the newly processed event
      const readyEvent: GateEvent = {
        id: docRef.id,
        ...gateEventData,
        timestamp: { toDate: () => new Date() } // Local feedback datetime
      };
      
      setSelectedEIR(readyEvent);
      setShowEIRModal(true);

      // Clear Form and photographic checks
      setPlaca("");
      setDriverName("");
      setCedula("");
      setBooking("");
      setContainer("");
      setSealNumber("");
      handleResetCamera();

      setSuccessEvent(`Ingreso registrado exitosamente. EIR Generado: ${eirId}`);
      setTimeout(() => setSuccessEvent(null), 7000);

      await loadSystemReferenceData();
    } catch (err) {
      console.error("Error creating Gate-In event in DB:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submits a Gate-Out (Salida) event
  const handleSubmitGateOut = async (c: DBContainer) => {
    if (!placa || !cedula || !driverName) {
      alert("Por favor rellene los datos del transportista que retira en la sección superior.");
      return;
    }

    setIsLoading(true);
    try {
      const eirId = `EIR-OUT-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Update the container's status in the database to "Retirado"
      await updateDoc(doc(db, "contenedores", c.id), {
        status: "Retirado",
        location: "FUERA DEL TERMINAL"
      });

      // 2. Add Gate Event Out record
      const gateEventData: Omit<GateEvent, "id"> = {
        type: "OUT",
        placa: placa.toUpperCase(),
        cedula,
        driverName,
        booking: `RET-${c.containerId}`,
        container: c.containerId,
        containerType: c.type,
        flowType: "IMPORTACION_RETIRADA",
        sealNumber: c.sealNumber || "VERIFICADO",
        condition: "SUSTRECCIÓN AUTORIZADA - DOCUMENTADO",
        eirNumber: eirId,
        inspector: adminUser?.email || "puerta.guard@serviport.com.ve",
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello"),
        timestamp: serverTimestamp()
      } as any;

      const docRef = await addDoc(collection(db, "gate_events"), gateEventData);

      await logAuditAction(
        `Despachó GATE-OUT para contenedor importado ${c.containerId} retirado por camión ${placa.toUpperCase()}. Emitió EIR: ${eirId}`, 
        adminUser?.role || "GATE_CHECKER", 
        adminUser?.email
      );

      // Show freshly issued EIR
      const readyEvent: GateEvent = {
        id: docRef.id,
        ...gateEventData,
        timestamp: { toDate: () => new Date() }
      };
      
      setSelectedEIR(readyEvent);
      setShowEIRModal(true);

      // Clean form inputs
      setPlaca("");
      setDriverName("");
      setCedula("");
      setBooking("");
      setContainer("");
      setSealNumber("");
      handleResetCamera();

      setSuccessEvent(`Retiro completado e EIR ${eirId} impreso para transportista.`);
      setTimeout(() => setSuccessEvent(null), 6000);

      await loadSystemReferenceData();
    } catch (err) {
      console.error("Error writing Gate-out record:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick helper to fill a withdrawal driver's credentials manually for mock testing
  const handleQuickFillWithdrawTruck = () => {
    setPlaca("A80DF6K");
    setDriverName("Gleiber Torres");
    setCedula("V-20.119.502");
    setCompany("SERVICIOS LOGÍSTICOS CARIBE S.A.");
  };

   // Searching database containers for withdrawal matches (available options)
  const pickupEligibleContainers = dbContainers.filter(c => {
    // Only items that are in warehouse and available ("Disponible") or blocked ("SENIAT_REPARO") can be viewed for withdrawal
    const isAvailableOrBlocked = c.status === "Disponible" || c.status === "SENIAT_REPARO";
    
    // Support searching container code
    if (searchContainerQuery) {
      return isAvailableOrBlocked && c.containerId.toLowerCase().includes(searchContainerQuery.toLowerCase());
    }
    return isAvailableOrBlocked;
  }).map(c => {
    // Generate a pseudo-random arrival date for Free Time calculations local simulation
    // Using containerId characters to remain deterministic
    const charSum = c.containerId.split('').reduce((acc, val) => acc + val.charCodeAt(0), 0);
    const daysInPort = (charSum % 25) + 1; // 1 to 25 days
    const freeTimeAllowed = 14; // Typical Free Time is 14 days
    const overstayDays = Math.max(0, daysInPort - freeTimeAllowed);
    return { ...c, daysInPort, overstayDays, freeTimeAllowed, isBlocked: c.status === "SENIAT_REPARO" };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Operational Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <Compass size={14} className="animate-spin" /> Control de Accesos / Gatehouse Terminal
          </div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
            Inspector de Puerta (Gate Checker)
          </h2>
          <p className="text-foreground-muted text-sm font-sans">
            Inspección física obligatoria de contenedores, registro de transportistas y emisión de EIR (Equipment Interchange Receipt).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={loadSystemReferenceData}
            title="Sincronizar base de datos de camiones"
            className="p-3 bg-white border border-border text-foreground-muted hover:text-primary hover:bg-slate-50 transition-all rounded shadow-sm flex items-center gap-2 text-xs font-mono font-bold"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            Sincronizar Datos
          </button>
        </div>
      </div>

      {/* Success alert banner */}
      {successEvent && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2.5 rounded shadow-sm"
        >
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successEvent}</span>
        </motion.div>
      )}

      {/* Terminal Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Live Queue (Carriles de Entrada y Espera / OCR Scanner) - 4 Columns */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white border border-border rounded p-5 shadow-sm space-y-4">
             <div className="flex justify-between items-center border-b border-border pb-2.5">
                <span className="text-xs uppercase font-mono font-bold text-secondary tracking-widest flex items-center gap-2">
                   <Clock size={16} className="text-orange-500 animate-pulse" /> Camiones en Fila externa
                </span>
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[8px] font-mono border">TOS LIVE</span>
             </div>
             
             <p className="text-xs text-foreground-muted font-sans leading-relaxed">
               Lista de transportistas en aproximación geolocalizada o carril de acceso. Haz clic en **Procesar** para disparar la autocompletación y simular escaneo OCR.
             </p>

             <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
                {liveQueue.map((item) => (
                   <div 
                     key={item.id}
                     onClick={() => handleProcessQueueItem(item)}
                     className="p-3.5 bg-slate-50 hover:bg-white hover:ring-2 hover:ring-primary/20 hover:border-primary border border-border rounded cursor-pointer transition-all flex justify-between items-start gap-3 relative overflow-hidden group"
                   >
                     <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                           <span className="text-[10px] font-mono font-bold bg-secondary text-white px-1.5 py-0.5 rounded uppercase">
                              {item.plate}
                           </span>
                           <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                              item.flowType === "EXPORTACION_ENTREGA" ? "bg-purple-50 text-purple-700 border-purple-200" :
                              item.flowType === "VACIO_ENTREGA" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              "bg-blue-50 text-blue-700 border-blue-200"
                           }`}>
                              {item.flowType === "EXPORTACION_ENTREGA" ? "EXPORT-IN" : item.flowType === "VACIO_ENTREGA" ? "VACIO-IN" : "TIRO-IN"}
                           </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{item.driverName}</p>
                        <p className="text-[10px] text-foreground-muted font-mono leading-none">{item.company}</p>
                     </div>
                     
                     <div className="text-right shrink-0 flex flex-col items-end justify-between h-full min-h-[50px]">
                        <span className="text-[9px] text-orange-600 font-mono font-bold animate-pulse">{item.eta}</span>
                        <span className="text-[9px] font-mono font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex items-center gap-0.5">
                           Ingresar <ChevronRight size={10} />
                        </span>
                     </div>
                   </div>
                ))}
                
                {liveQueue.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-border rounded bg-slate-50/50">
                     <Truck className="mx-auto text-slate-300 mb-1.5" size={24} />
                     <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-widest leading-none">Valla de cola despejada</p>
                  </div>
                )}
             </div>
          </div>

          {/* LECTURA OCR MONITOR */}
          <div className="bg-slate-950 text-slate-200 p-5 rounded border border-slate-900 shadow-lg font-mono text-xs space-y-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
             
             <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                   <Cpu size={14} className="text-primary animate-pulse" /> OCR Lector de Pórtico
                </span>
                <span className="text-[8px] text-emerald-500 font-bold bg-emerald-950 px-1.5 py-0.5 rounded flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SENSORES ONLINE
                </span>
             </div>

             <div className="space-y-3 leading-relaxed text-[11px]">
                <div className="flex justify-between">
                   <span className="text-slate-500">Auto Scan Placas:</span>
                   <span className="text-white font-bold">{placa ? placa.toUpperCase() : "ESPERANDO VEHÍCULO..."}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500">Container ID:</span>
                   <span className="text-white font-bold">{container ? container.toUpperCase() : "---"}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500">Inspección de Tracción:</span>
                   <span className="text-slate-400">Tráiler acoplado - Ejes 3</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500">Operador Redirección:</span>
                   <span className="text-orange-400 font-extrabold">{flowType === "EXPORTACION_ENTREGA" ? "AGD EXPORT" : flowType === "VACIO_ENTREGA" ? "AGD VACÍOS" : "PATIO RETIRO IMPORT"}</span>
                </div>
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Operational inspection workbench (Form + history) - 8 Columns */}
        <div className="lg:col-span-8 space-y-6">

           {/* Access Mode Switch Tabs */}
           <div className="bg-white border border-border rounded p-1.5 flex shadow-sm max-w-md font-mono text-xs uppercase tracking-wider font-bold">
              {[
                { id: "gate-in", label: "Control de Entrada (Gate-In)" },
                { id: "gate-out", label: "Control de Salida (Gate-Out)" },
                { id: "historial", label: "Historial EIR / Tráfico" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                     setActiveTab(t.id as any);
                     handleResetCamera();
                  }}
                  className={`flex-1 text-center py-2.5 rounded transition-all ${
                     activeTab === t.id 
                     ? "bg-primary text-white font-black shadow-sm" 
                     : "text-foreground-muted hover:text-secondary hover:bg-slate-50"
                  }`}
                >
                   {t.label}
                </button>
              ))}
           </div>

           {/* MAIN TAB CONTENT */}
           <AnimatePresence mode="wait">

              {/* GATE-IN WORKBENCH */}
              {activeTab === "gate-in" && (
                 <motion.div 
                   key="gate-in" 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    {/* INPUT FORM PANEL */}
                    <div className="bg-white border border-border shadow-sm rounded overflow-hidden flex flex-col justify-between">
                       <div className="px-5 py-4 bg-slate-50/70 border-b border-border flex justify-between items-center">
                          <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono flex items-center gap-2">
                             <Truck size={16} className="text-primary" /> Ficha de Registro de Acceso
                          </h3>
                       </div>

                       <form onSubmit={handleSubmitGateIn} className="p-5 space-y-4">
                          {/* Plate and Identity Column */}
                          <div className="grid grid-cols-2 gap-3.5">
                             <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Placa Chuto</label>
                                <div className="relative flex">
                                   <input 
                                     required 
                                     value={placa} 
                                     onChange={e=>setPlaca(e.target.value)} 
                                     type="text" 
                                     placeholder="Ej: A88CD3V" 
                                     className="w-full text-xs font-mono font-bold bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none uppercase" 
                                   />
                                   <button 
                                     type="button" 
                                     onClick={handleQuickAutocompletePlates}
                                     title="Autogenerar matrícula venezolana válida"
                                     className="absolute right-2 top-2 text-[10px] font-bold text-primary hover:underline font-mono"
                                   >
                                      Random
                                   </button>
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Cédula Conductor</label>
                                <input 
                                  required 
                                  value={cedula} 
                                  onChange={e=>setCedula(e.target.value)} 
                                  type="text" 
                                  placeholder="V-28.190.224" 
                                  className="w-full text-xs font-mono font-bold bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none" 
                                />
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3.5">
                             <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Chofer (Nombre)</label>
                                <input 
                                  required 
                                  value={driverName} 
                                  onChange={e=>setDriverName(e.target.value)} 
                                  type="text" 
                                  placeholder="José Francisco Pérez" 
                                  className="w-full text-xs font-sans font-medium bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none" 
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Empresa de Sotrans</label>
                                <input 
                                  value={company} 
                                  onChange={e=>setCompany(e.target.value)} 
                                  type="text" 
                                  placeholder="TRANSPORTE PUERTO CABELLO S.A" 
                                  className="w-full text-xs font-sans bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none" 
                                />
                             </div>
                          </div>

                          {/* Flow Type selector */}
                          <div className="space-y-1">
                             <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Tipo de Operación Interna</label>
                             <select
                               value={flowType}
                               onChange={e => {
                                 const val = e.target.value as any;
                                 setFlowType(val);
                                 if (val === "IMPORTACION_RETIRADA") {
                                   setBooking("RELEASE_IMPORT_RET");
                                 } else {
                                   setBooking("");
                                 }
                               }}
                               className="w-full text-xs border border-border bg-slate-50 px-3 py-2.5 rounded focus:outline-none focus:border-primary font-mono font-bold"
                             >
                                <option value="EXPORTACION_ENTREGA">Ingresa con Contenedor de Exportación (Full Container)</option>
                                <option value="VACIO_ENTREGA">Ingresa con Contenedor Vacío (Empty Depot)</option>
                                <option value="IMPORTACION_RETIRADA">Ingresa Vacío a Retirar Contenedor Importador (Import Pickup)</option>
                             </select>
                          </div>

                          {/* Cargo details (only shown if not empty withdrawal) */}
                          {flowType !== "IMPORTACION_RETIRADA" ? (
                             <>
                               <div className="grid grid-cols-2 gap-3.5">
                                  <div className="space-y-1">
                                     <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">ID Contenedor</label>
                                     <input 
                                       required 
                                       value={container} 
                                       onChange={e=>setContainer(e.target.value)} 
                                       type="text" 
                                       placeholder="TGBU4029410" 
                                       className="w-full text-xs font-mono font-black text-secondary bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none uppercase" 
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Tipo / Medida ISO</label>
                                     <select
                                       value={containerType}
                                       onChange={e=>setContainerType(e.target.value)}
                                       className="w-full text-xs border border-border bg-slate-50 px-3 py-2.5 rounded focus:outline-none focus:border-primary font-mono"
                                     >
                                        <option value="40' High Cube">40' High Cube Container</option>
                                        <option value="40' Dry Van">40' Dry Van Standard</option>
                                        <option value="20' Dry Van">20' Dry Van Standard</option>
                                        <option value="40' Reefer">40' Reefer (Refrigerado)</option>
                                        <option value="20' Reefer">20' Reefer (Refrigerado)</option>
                                     </select>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-3.5">
                                  <div className="space-y-1">
                                     <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Número de Precinto / Sello</label>
                                     <input 
                                       required={flowType === "EXPORTACION_ENTREGA"}
                                       value={sealNumber} 
                                       onChange={e=>setSealNumber(e.target.value)} 
                                       type="text" 
                                       placeholder="SL-XYZ-849021" 
                                       className="w-full text-xs font-mono bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none uppercase" 
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Documento / Booking</label>
                                     <input 
                                       required 
                                       value={booking} 
                                       onChange={e=>setBooking(e.target.value)} 
                                       type="text" 
                                       placeholder="BK-MAERSK-9402" 
                                       className="w-full text-xs font-mono bg-slate-50 border border-border hover:border-slate-300 focus:border-primary px-3 py-2.5 rounded focus:outline-none uppercase" 
                                     />
                                  </div>
                               </div>
                             </>
                          ) : (
                             <div className="p-3.5 border border-dashed border-primary/20 bg-primary/5 text-primary text-xs rounded font-sans leading-relaxed">
                                <strong>Ingreso para Retiro de Contenedor:</strong> El camión ingresa vacío al puerto y no trae un contenedor. Para despachar el retiro con el contenedor escogido, por favor proceda a registrar el camión primero o cambie a la pestaña <strong>Control de Salida (Gate-Out)</strong> para formalizar qué contenedor importado se lleva de los almacenes Serviport.
                                <div className="mt-2.5">
                                   <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">N° de Autorización de Retiro</label>
                                   <input 
                                     value={booking} 
                                     onChange={e=>setBooking(e.target.value)} 
                                     type="text" 
                                     placeholder="BCO-RELEASE-892" 
                                     className="w-full text-xs font-mono mt-1 bg-white border border-border px-3 py-2 rounded focus:outline-none uppercase" 
                                   />
                                </div>
                             </div>
                          )}

                          <div className="space-y-3 bg-slate-100 p-4 rounded border border-slate-200">
                             <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest flex items-center gap-2">
                               <ShieldCheck size={14} className="text-primary"/> Checklist Físico Dinámico EIR
                             </label>
                             <div className="flex items-center gap-3">
                               <input 
                                 type="checkbox" 
                                 id="hasDamage"
                                 checked={hasDamage}
                                 onChange={(e) => {
                                   setHasDamage(e.target.checked);
                                   if (e.target.checked) setContainerCondition("DAMAGE_REPORTED");
                                   else setContainerCondition("ÓPTIMO - SIN DAÑOS VISIBLES");
                                 }}
                                 className="w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary"
                               />
                               <label htmlFor="hasDamage" className="text-xs font-bold text-slate-700">Registrar Avería Física (Golpes, Lona Rota, Daño Interno)</label>
                             </div>
                             {hasDamage && (
                               <div className="space-y-1">
                                 <label className="block text-[10px] font-bold text-red-600 uppercase font-mono tracking-widest">Descripción de la Avería (DAMAGE_REPORTED)</label>
                                 <textarea
                                   required={hasDamage}
                                   value={damageNotes}
                                   onChange={e => {
                                      setDamageNotes(e.target.value);
                                      setContainerCondition("DAMAGE_REPORTED: " + e.target.value);
                                   }}
                                   rows={2}
                                   className="w-full text-xs font-sans bg-white border border-red-300 px-3 py-2 rounded focus:outline-none focus:border-red-500"
                                   placeholder="Ej: Lona superior desgarrada. Rayones mayores en panel lateral derecho."
                                 ></textarea>
                                 <p className="text-[9px] text-red-500 italic mt-1">
                                   * Esta acción cambiará el estado a DAMAGE_REPORTED, alertará a la Torre de Control y notificará a la Naviera B2B.
                                 </p>
                               </div>
                             )}
                          </div>

                          <div className="pt-4 border-t border-border">
                             <button 
                               type="submit" 
                               disabled={isLoading}
                               className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold font-mono tracking-wider text-xs uppercase py-3 px-4 rounded shadow hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
                             >
                                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Procesar Acceso (Gate-In)
                             </button>
                          </div>
                       </form>
                    </div>

                    {/* PHOTO AND CAMERA INTEGRATION PANEL */}
                    <div className="bg-slate-900 border border-slate-800 rounded shadow-sm overflow-hidden flex flex-col justify-between">
                       <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                          <div>
                             <h4 className="text-white text-xs uppercase font-mono font-bold tracking-widest">Secuencia de Captura Obligatoria</h4>
                             <p className="text-[10px] text-slate-400 font-sans mt-0.5">Reporte con EIR requiere fotos de placa, contenedor y precinto intacto.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={handleResetCamera}
                            className="bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold px-2.5 py-1 text-[9px] font-mono border border-slate-700 uppercase rounded transition-colors"
                          >
                             Limpiar Cámaras
                          </button>
                       </div>

                       {/* Cam Angle Sub Tabs */}
                       <div className="bg-slate-950 border-b border-slate-800 flex text-[10px] font-mono uppercase font-bold text-slate-400 select-none">
                          {[
                             { id: "frontal", label: "Cámara 1: Cabina/Placa", state: hasCapturedTruck },
                             { id: "lateral", label: "Cámara 2: Costado TEU", state: hasCapturedContainer },
                             { id: "sello", label: "Cámara 3: Sello Sello", state: hasCapturedSeal }
                          ].map(cam => (
                             <button
                               key={cam.id}
                               type="button"
                               onClick={() => setActiveCamAngle(cam.id as any)}
                               className={`flex-1 py-3 text-center transition-all border-b-2 ${
                                  activeCamAngle === cam.id 
                                  ? "border-primary text-primary bg-slate-900" 
                                  : "border-transparent text-slate-500 hover:text-slate-300"
                               }`}
                             >
                                <span>{cam.label}</span>
                                {cam.state ? (
                                   <span className="text-emerald-500 ml-1.5">✓</span>
                                ) : (
                                   <span className="text-red-500 ml-1.5">•</span>
                                )}
                             </button>
                          ))}
                       </div>

                       {/* Live Iframe Viewport Simulation */}
                       <div className="p-5 flex-1 flex flex-col justify-center items-center relative min-h-[280px]">
                          {/* Simulated View */}
                          <div className="relative w-full aspect-video rounded-lg border border-slate-800 bg-black overflow-hidden flex flex-col justify-center items-center shadow-inner">
                             {/* Scan Reticle */}
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(0,0,0,0.65))]"></div>
                             
                             <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] uppercase font-mono bg-slate-950/80 text-emerald-400 border border-slate-800 px-2 py-1 rounded">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live Feed: Angle {activeCamAngle.toUpperCase()}
                             </div>

                             {/* Render Mock Captured Static or Lens lines */}
                             <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_6px_100%]"></div>
                             
                             {/* Cam Angle Renderings */}
                             {activeCamAngle === "frontal" ? (
                                hasCapturedTruck ? (
                                   <div className="text-center p-4">
                                      <p className="text-emerald-400 font-mono text-base font-bold uppercase tracking-wider">MACK GRANITE - CAPTURADO ✓</p>
                                      <p className="text-xs text-slate-400 mt-1">Placa Detectada: {placa || "A02BC4D"} • Match OCR 99.4%</p>
                                   </div>
                                ) : (
                                   <div className="text-center text-slate-500 font-mono text-xs">
                                      <ScanLine size={48} className="mx-auto text-slate-700 animate-bounce mb-2" />
                                      <span>Enfoque la placa chasis de frente para capturar</span>
                                   </div>
                                )
                             ) : activeCamAngle === "lateral" ? (
                                hasCapturedContainer ? (
                                   <div className="text-center p-4">
                                      <p className="text-emerald-400 font-mono text-base font-bold uppercase tracking-wider">LATERAL ESTIBA - CAPTURADO ✓</p>
                                      <p className="text-xs text-slate-400 mt-1">ISO Code: {container || "TGBU9922110"} ({containerType})</p>
                                   </div>
                                ) : (
                                   <div className="text-center text-slate-500 font-mono text-xs">
                                      <ScanLine size={48} className="mx-auto text-slate-700 animate-bounce mb-2" />
                                      <span>Coloque el contenedor paralelo al pórtico de pesaje</span>
                                   </div>
                                )
                             ) : (
                                hasCapturedSeal ? (
                                   <div className="text-center p-4">
                                      <p className="text-emerald-400 font-mono text-base font-bold uppercase tracking-wider">SELLO METÁLICO - CAPTURADO ✓</p>
                                      <p className="text-xs text-slate-400 mt-1">Sello Sello Número: {sealNumber || "SL-920421"}</p>
                                   </div>
                                ) : (
                                   <div className="text-center text-slate-500 font-mono text-xs">
                                      <ScanLine size={48} className="mx-auto text-slate-700 animate-bounce mb-2" />
                                      <span>Fotografíe de cerca el perno / precinto de traba</span>
                                   </div>
                                )
                             )}
                          </div>
                       </div>

                       {/* Action Capture Trigger */}
                       <div className="p-5 border-t border-slate-800 bg-slate-950/40 flex justify-between gap-3">
                          <p className="text-[10.5px] text-slate-400 font-sans leading-tight flex-1">
                             Presencia de cámaras de carril emulada. Haz clic en **Disparar Captura** para tomar la fotografía correspondiente a la cámara actual.
                          </p>
                          <button
                            type="button"
                            onClick={handleTriggerCamera}
                            className="bg-primary hover:bg-primary-dark text-white font-extrabold font-mono tracking-wider text-[10.5px] uppercase py-2.5 px-4 rounded shadow-sm flex items-center gap-2 transition"
                          >
                             <Camera size={14} /> Disparar Captura
                          </button>
                       </div>
                    </div>
                 </motion.div>
              )}

              {/* GATE-OUT WORKBENCH */}
              {activeTab === "gate-out" && (
                 <motion.div 
                   key="gate-out" 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                 >
                    {/* Upper form section for truck and driver identity */}
                    <div className="bg-white border border-border bg-gradient-to-r from-slate-50/50 via-transparent pr-6 shadow-sm rounded p-5 space-y-4">
                       <div className="flex justify-between items-center border-b border-border pb-3.5">
                          <div>
                             <h4 className="text-secondary text-sm font-bold uppercase font-mono tracking-wider flex items-center gap-2">
                                <UserCheck size={18} className="text-primary" /> Fila 1: Transportista Autorizado para el Retiro
                             </h4>
                             <p className="text-xs text-foreground-muted font-sans mt-0.5">Ingresa los datos del camionero que firmará el manifiesto de retiro EIR de exportación/importación.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={handleQuickFillWithdrawTruck}
                            className="text-xs font-mono font-bold text-primary hover:underline border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded"
                          >
                             Autorellenar Chofer de Prueba
                          </button>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="space-y-1">
                             <label className="block text-[10px] font-bold text-foreground-muted uppercase font-mono tracking-widest">Placa Chuto</label>
                             <input 
                               required 
                               value={placa} 
                               onChange={e=>setPlaca(e.target.value)} 
                               type="text" 
                               placeholder="Ej: A80DF6K" 
                               className="w-full text-xs font-mono font-bold bg-white border border-border px-3 py-2.5 rounded uppercase focus:outline-none" 
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="block text-[10px] font-bold text-foreground-muted uppercase font-mono tracking-widest">CI Conductor</label>
                             <input 
                               required 
                               value={cedula} 
                               onChange={e=>setCedula(e.target.value)} 
                               type="text" 
                               placeholder="Ej: V-20119502" 
                               className="w-full text-xs font-mono font-bold bg-white border border-border px-3 py-2.5 rounded focus:outline-none" 
                             />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                             <label className="block text-[10px] font-bold text-foreground-muted uppercase font-mono tracking-widest">Nombre Completo Conductor</label>
                             <input 
                               required 
                               value={driverName} 
                               onChange={e=>setDriverName(e.target.value)} 
                               type="text" 
                               placeholder="Ej: Gleiber Torres" 
                               className="w-full text-xs font-sans font-medium bg-white border border-border px-3 py-2.5 rounded focus:outline-none" 
                             />
                          </div>
                       </div>
                    </div>

                    {/* Lower choice: select container available, changing status to "Retirado" on submit */}
                    <div className="bg-white border border-border shadow-sm rounded overflow-hidden">
                       <div className="p-5 border-b border-border bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                             <h4 className="text-secondary text-sm font-bold uppercase font-mono tracking-wider flex items-center gap-2">
                                <ClipboardList size={18} className="text-primary" /> Fila 2: Seleccionar Contenedor Disponible en Almacén
                             </h4>
                             <p className="text-xs text-foreground-muted font-sans mt-0.5">Escribe el código para filtrar contenedores despachados por el SENIAT y listos en AGD.</p>
                          </div>
                          <div className="relative max-w-xs w-full">
                             <Search size={14} className="absolute left-3 top-3 text-foreground-muted" />
                             <input 
                               type="text" 
                               value={searchContainerQuery}
                               onChange={e=>setSearchContainerQuery(e.target.value)}
                               placeholder="Filtrar por código (ej: MSKU)..." 
                               className="w-full font-mono text-xs border border-border pl-8 pr-3 py-2 rounded focus:outline-none focus:border-primary uppercase"
                             />
                          </div>
                       </div>

                       {/* Interactive DB Container options table */}
                       <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700">
                             <thead className="bg-slate-50 border-b border-border font-mono text-[10px] text-foreground-muted uppercase tracking-wider select-none">
                                <tr>
                                   <th className="py-2.5 px-5 font-bold">Contenedor ID</th>
                                   <th className="py-2.5 px-5 font-bold">Medida ISO</th>
                                   <th className="py-2.5 px-5 font-bold">Ubicación AGD</th>
                                   <th className="py-2.5 px-5 font-bold">Línea Naviera</th>
                                   <th className="py-2.5 px-5 font-bold">Free Time (Local)</th>
                                   <th className="py-2.5 px-5 font-bold">Status</th>
                                   <th className="py-2.5 px-5 font-bold text-right">Confirmar Despacho</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-border font-mono">
                                {pickupEligibleContainers.length > 0 ? (
                                   pickupEligibleContainers.map(c => (
                                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                         <td className="py-3 px-5 font-bold text-secondary text-sm">
                                            {c.containerId}
                                            {c.overstayDays > 0 && <span className="block text-[9px] text-red-500 uppercase tracking-widest mt-0.5">Demora Activa</span>}
                                         </td>
                                         <td className="py-3 px-5 text-foreground-muted">{c.type}</td>
                                         <td className="py-3 px-5 font-bold text-teal-650 flex items-center gap-1.5"><MapPin size={12} className="text-teal-400" /> {c.location || "AGD BLOCK ALPHA"}</td>
                                         <td className="py-3 px-5 text-slate-500 font-bold">{c.lineOperator || "OPERADOR POOL"}</td>
                                         <td className="py-3 px-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] text-foreground-muted">{c.daysInPort} / {c.freeTimeAllowed} días</span>
                                                {c.overstayDays > 0 ? (
                                                   <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1 py-0.5 border border-red-200 rounded w-fit uppercase">Excedido: +{c.overstayDays}d</span>
                                                ) : (
                                                   <span className="text-[10px] font-bold text-emerald-600 uppercase">En Tiempo</span>
                                                )}
                                            </div>
                                         </td>
                                         <td className="py-3 px-5">
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 font-bold text-[9px] uppercase rounded">
                                               {c.status}
                                            </span>
                                         </td>
                                         <td className="py-3 px-5 text-right">
                                            {c.isBlocked ? (
                                               <div className="flex flex-col items-end gap-1">
                                                  <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1">
                                                     <AlertTriangle size={10} /> SIN LEVANTE
                                                  </span>
                                                  <span className="text-[8px] text-slate-500 font-sans">Bloqueo SIDUNEA/ADUANA</span>
                                               </div>
                                            ) : (
                                               <button 
                                                 disabled={isLoading}
                                                 onClick={() => handleSubmitGateOut(c)}
                                                 className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold font-mono tracking-wider text-[9.5px] uppercase rounded transition-colors disabled:opacity-50 inline-flex items-center gap-1 leading-none shadow-sm"
                                               >
                                                  <ArrowRight size={12} /> Despachar Gate-Out
                                               </button>
                                            )}
                                         </td>
                                      </tr>
                                   ))
                                ) : (
                                   <tr>
                                      <td colSpan={7} className="py-12 text-center text-foreground-muted uppercase tracking-widest bg-slate-50/20">
                                         <AlertTriangle className="mx-auto text-yellow-500 mb-1.5 animate-pulse" size={24} />
                                         <p className="font-bold text-secondary text-xs">Sin contenedores listos para gate-out</p>
                                         <p className="text-[10px] lowercase font-sans mt-0.5 font-normal">No hay correspondencias en el AGD etiquetadas como &quot;Disponible&quot;.</p>
                                      </td>
                                   </tr>
                                )}
                             </tbody>
                          </table>
                       </div>

                       <div className="p-4 bg-slate-50 border-t border-border font-sans text-xs text-foreground-muted flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <p>
                             ¿El contenedor no figura en la lista? El importador debe solicitar autorización de retiro o la cuadrilla estibadora del <strong>Water Clerk</strong> debe reportarlo en patio.
                          </p>
                       </div>
                    </div>
                 </motion.div>
              )}

              {/* TRAFFIC HISTORY LOG */}
              {activeTab === "historial" && (
                 <motion.div 
                   key="historial" 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="bg-white border border-border shadow-sm rounded overflow-hidden"
                 >
                    <div className="px-5 py-4 border-b border-border bg-slate-50/60 flex justify-between items-center select-none">
                       <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono flex items-center gap-2">
                          <FileText size={16} className="text-primary" /> Manifiesto de Flujo Diario de Puertas
                       </h3>
                    </div>

                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-xs">
                          <thead>
                             <tr className="bg-slate-50 border-b border-border font-mono text-[10px] text-foreground-muted uppercase tracking-wider select-none">
                                <th className="py-3 px-5 font-bold">EIR ID</th>
                                <th className="py-3 px-5 font-bold">Tipo</th>
                                <th className="py-3 px-5 font-bold">Matrícula</th>
                                <th className="py-3 px-5 font-bold">Transportista (CI)</th>
                                <th className="py-3 px-5 font-bold">Contenedor Despachado</th>
                                <th className="py-3 px-5 font-bold">Flujo Operativo</th>
                                <th className="py-3 px-5 font-bold text-right">EIR Documento</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-border font-mono">
                             {isLoadingHistory ? (
                                <tr>
                                   <td colSpan={7} className="py-12 text-center text-foreground-muted"><Loader2 className="animate-spin text-primary inline-block mr-1.5" size={16} /> Leyendo historial...</td>
                                </tr>
                             ) : history.length > 0 ? (
                                history.map(h => (
                                   <tr key={h.id} className="hover:bg-slate-50/70 transition-all">
                                      <td className="py-3 px-5 font-bold text-secondary">{h.eirNumber || `EIR-[P]-${h.id.substring(0,6).toUpperCase()}`}</td>
                                      <td className="py-3 px-5">
                                         <span className={`px-2 py-0.5 font-bold text-[9px] uppercase rounded border ${
                                            h.type === "IN" 
                                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                                            : "bg-orange-50 text-orange-700 border-orange-200"
                                         }`}>
                                            {h.type === "IN" ? "INGRESO" : "ZARPE"}
                                         </span>
                                      </td>
                                      <td className="py-3 px-5 font-bold text-secondary text-sm">{h.placa}</td>
                                      <td className="py-3 px-5">
                                         <p className="font-bold text-slate-800 leading-none">{h.driverName}</p>
                                         <span className="text-[10px] text-foreground-muted">{h.cedula}</span>
                                      </td>
                                      <td className="py-3 px-5 font-extrabold text-slate-500">{h.container}</td>
                                      <td className="py-3 px-5">
                                         <span className="text-[10px] text-slate-500 leading-none font-medium">{h.flowType ? h.flowType.replace("_", " ") : "TRANSFERENCIA"}</span>
                                      </td>
                                      <td className="py-3 px-5 text-right">
                                         <button 
                                           onClick={() => {
                                              setSelectedEIR(h);
                                              setShowEIRModal(true);
                                           }}
                                           className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 rounded text-[10px] font-bold uppercase transition-colors inline-flex items-center gap-1.5"
                                         >
                                            <Printer size={12} /> EIR Ticket
                                         </button>
                                      </td>
                                   </tr>
                                ))
                             ) : (
                                <tr>
                                   <td colSpan={7} className="py-10 text-center font-mono text-xs text-foreground-muted uppercase tracking-widest border border-dashed border-border m-4 rounded bg-slate-50/20">
                                      Sin accesos reportados en la base de datos para esta jornada
                                   </td>
                                </tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
              )}

           </AnimatePresence>

        </div>

      </div>

      {/* EIR RECEIPTS GENERATOR TICKET MODAL (HIGH FIDELITY DIALOG) */}
      <AnimatePresence>
         {showEIRModal && selectedEIR && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white text-slate-900 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
               >
                  {/* Modal Header */}
                  <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center shrink-0">
                     <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                        <Printer size={14} className="animate-pulse" /> Recibo de Intercambio de Equipo (EIR)
                     </span>
                     <button 
                       onClick={() => setShowEIRModal(false)}
                       className="p-1 text-slate-400 hover:text-white rounded transition"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  {/* Receipt Print Style Body */}
                  <div className="p-6 overflow-y-auto no-scrollbar font-mono text-xs space-y-5" id="printable-eir-ticket">
                     {/* Company Logo Header */}
                     <div className="text-center border-b border-dashed border-slate-300 pb-4 space-y-1 select-none">
                        <p className="font-sansita text-xl font-black uppercase text-secondary tracking-tight leading-none">SERVIPORT VENEZUELA S.A.</p>
                        <p className="text-[9px] text-slate-500 uppercase">RIF: J-30491029-4 • PUERTO CABELLO, VENEZUELA</p>
                        <p className="text-[9px] text-slate-500">TELÉFONO DE OPERACIONES PIN: +58 242-361092</p>
                        <div className="bg-slate-100 py-1.5 px-3 rounded inline-block mt-2 border">
                           <p className="font-bold text-[10px] text-secondary">N° EIR: <span className="text-primary">{selectedEIR.eirNumber || "EIR-INUB-904"}</span></p>
                        </div>
                     </div>

                     {/* Main Metadata table */}
                     <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-dashed border-slate-300 pb-4">
                        <div>
                           <p className="text-[9px] text-slate-500 uppercase">Inspector Validador:</p>
                           <p className="font-bold text-slate-800 lowercase">{selectedEIR.inspector}</p>
                        </div>
                        <div>
                           <p className="text-[9px] text-slate-500 uppercase">Fecha / Hora Registro:</p>
                           <p className="font-bold text-slate-800">
                              {selectedEIR.timestamp?.toDate ? selectedEIR.timestamp.toDate().toLocaleString('es-VE') : new Date().toLocaleString('es-VE')}
                           </p>
                        </div>
                        <div>
                           <p className="text-[9px] text-slate-500 uppercase">Placa Camión (Chuto):</p>
                           <p className="font-bold text-slate-800 uppercase text-sm">{selectedEIR.placa}</p>
                        </div>
                        <div>
                           <p className="text-[9px] text-slate-500 uppercase">Transportista (Chofer):</p>
                           <p className="font-bold text-slate-800 truncate">{selectedEIR.driverName} ({selectedEIR.cedula})</p>
                        </div>
                     </div>

                     {/* Container and seal specifications */}
                     <div className="space-y-3 bg-slate-50 p-4 border rounded">
                        <div className="flex justify-between border-b pb-1.5">
                           <span className="text-slate-500">Contenedor ID:</span>
                           <span className="font-bold text-secondary">{selectedEIR.container}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1.5">
                           <span className="text-slate-500">Medida ISO / Tipo:</span>
                           <span className="font-bold text-slate-700">{selectedEIR.containerType || "40' Dry Van"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1.5">
                           <span className="text-slate-500">Número de Precinto / Seal:</span>
                           <span className="font-bold text-slate-700">{selectedEIR.sealNumber || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-500">Operación:</span>
                           <span className="font-bold text-primary">{selectedEIR.type === "IN" ? "INGRESO - INBOUND" : "DESPACHO - OUTBOUND"}</span>
                        </div>
                     </div>

                     {/* Visual checklist damages */}
                     <div className="space-y-2 select-none">
                        <p className="text-[10px] font-bold uppercase text-secondary">Inspección de Tránsito (Intacto)</p>
                        <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-emerald-700">
                           <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-center">✓ FRONTAL OK</div>
                           <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-center">✓ LATERALES OK</div>
                           <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-center">✓ TECHO OK</div>
                           <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-center">✓ PISO OK</div>
                           <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-center">✓ PUERTA OK</div>
                           <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-center">✓ PRECINTO OK</div>
                        </div>
                     </div>

                     {/* Signature lines */}
                     <div className="grid grid-cols-2 gap-6 pt-6 border-t border-dashed border-slate-300 text-center select-none">
                        <div className="space-y-6">
                           <div className="h-10 flex items-end justify-center">
                              <span className="text-[10px] font-sans italic text-slate-400">SERVIPORT-GATE-SEC</span>
                           </div>
                           <div className="border-t border-slate-300 pt-1.5">
                              <p className="font-bold text-[9px] text-slate-600">Firma Inspector</p>
                              <p className="text-[8px] text-slate-400">Serviport Puerto Cabello</p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="h-10 flex items-end justify-center">
                              <span className="text-[10px] font-sans italic text-slate-400">{selectedEIR.driverName}</span>
                           </div>
                           <div className="border-t border-slate-300 pt-1.5">
                              <p className="font-bold text-[9px] text-slate-600">Firma Chofer</p>
                              <p className="text-[8px] text-slate-400">Conductor Autorizado</p>
                           </div>
                        </div>
                     </div>

                     {/* Disclaimer stamp */}
                     <p className="text-[8.5px] text-slate-400 leading-normal text-justify pt-4 border-t border-dashed border-slate-300 select-none font-sans">
                        Este boleto EIR de intercambio certifica que el contenedor reportado fue verificado físicamente y coincide con los precintos aportados por el manifiesto aduanal. Serviport no se responsabiliza por daños internos posteriores al egreso.
                     </p>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="bg-slate-50 border-t border-border px-5 py-3.5 flex justify-end gap-2.5 shrink-0 select-none">
                     <button 
                       onClick={() => {
                          import("../lib/pdfGenerator").then(mod => {
                            mod.generateEIRPDF(selectedEIR);
                          });
                       }}
                       className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-border text-slate-700 font-bold font-mono tracking-wide rounded text-xs flex items-center gap-1.5 transition-colors"
                     >
                        <Printer size={13} /> Imprimir Comprobante
                     </button>
                     <button 
                       onClick={() => setShowEIRModal(false)}
                       className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-extrabold font-mono tracking-wider rounded text-xs transition"
                     >
                        Confirmar y Listo
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
