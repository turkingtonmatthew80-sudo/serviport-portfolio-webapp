import { useState, useEffect } from "react";
import { 
  Ship, Anchor, MapPin, Search, CalendarClock, Flag, Filter, Loader2, 
  CheckCircle2, Plus, X, Box, Users, ChevronRight, FileText, ArrowUpRight, 
  AlertCircle, TrendingUp, Sparkles, RefreshCw, Trash2, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  collection, getDocs, doc, updateDoc, query, arrayUnion, addDoc, 
  serverTimestamp, where, writeBatch
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

interface PortCall {
  id: string;
  name: string;
  type: string;
  operator: string;
  eta: string;
  status: "Aprobado" | "En Rada" | "Atracado" | "En Operación" | "Finalizado";
  berth: string;
  hitos?: Array<{
    status: string;
    timestamp: any;
    user: string;
    remarks?: string;
  }>;
}

interface B2BPortCall {
  id: string;
  vesselName: string;
  voyageNumber: string;
  location?: string;
  status: "Programado" | "Aprobado" | "En Operación" | "Completado";
  userId: string;
  createdAt?: string;
}

interface ContainerItem {
  id: string;
  containerId: string;
  type: string;
  weight: number;
  status: "En Buque" | "En Tránsito / Descargado" | "Disponible" | "En Altamar" | "Asignado" | "Cargado" | "Inspección";
  location?: string;
  sealNumber: string;
  lineOperator: string;
  cargoDesc: string;
  operationType: "Descarga" | "Carga";
  portcallId: string;
}

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

type TabType = "timeline" | "manifest" | "crews" | "b2b";

export function AdminBuques() {
  const { adminUser } = useAdminAuth();
  
  // Data lists
  const [buques, setBuques] = useState<PortCall[]>([]);
  const [b2bRequests, setB2bRequests] = useState<B2BPortCall[]>([]);
  const [crews, setCrews] = useState<StevedoreCrew[]>([]);
  const [containers, setContainers] = useState<ContainerItem[]>([]);
  
  // Selection and control state
  const [selectedBuqueId, setSelectedBuqueId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("timeline");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Loaders and action states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContainers, setIsLoadingContainers] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Modal states
  const [showManualModal, setShowManualModal] = useState(false);
  const [customRemark, setCustomRemark] = useState("");
  
  // New Manual Vessel Form State
  const [newVesselName, setNewVesselName] = useState("");
  const [newVesselType, setNewVesselType] = useState("Containership");
  const [newVesselOperator, setNewVesselOperator] = useState("Maersk Line");
  const [newVesselBerth, setNewVesselBerth] = useState("Muelle 24");
  const [newVesselETA, setNewVesselETA] = useState("");

  // Load General Data
  // Helper because document keys sometimes are handled strangely
  const idClean = (id: string) => id;

  // Real-time synchronization for dashboard base tables
  useEffect(() => {
    setIsLoading(true);
    let unsubscribePortCalls: any;
    let unsubscribeB2b: any;
    let unsubscribeCrews: any;

    try {
      import("firebase/firestore").then(({ collection, query, where, onSnapshot }) => {
        // 1. Port Calls
        let qPortCalls: any = collection(db, "portcalls");
        if (adminUser && adminUser.port !== "GLOBAL") {
           qPortCalls = query(collection(db, "portcalls"), where("port", "==", adminUser.port));
        }

        unsubscribePortCalls = onSnapshot(qPortCalls, (snap: any) => {
          const loadedPortCalls: PortCall[] = [];
          snap.forEach((doc: any) => {
            loadedPortCalls.push({ id: doc.id, ...(doc.data() as any) } as PortCall);
          });
          setBuques(loadedPortCalls);
          if (loadedPortCalls.length > 0 && !selectedBuqueId) {
            setSelectedBuqueId(loadedPortCalls[0].id);
          }
          setIsLoading(false);
        });

        // 2. B2B Port Calls
        const qB2b = query(collection(db, "port_calls"), where("status", "==", "Programado"));
        unsubscribeB2b = onSnapshot(qB2b, (snap) => {
          const loadedB2B: B2BPortCall[] = [];
          snap.forEach(doc => {
            loadedB2B.push({ id: doc.id, ...(doc.data() as any) } as B2BPortCall);
          });
          setB2bRequests(loadedB2B);
        });

        // 3. Crews
        let qCrews: any = collection(db, "crews");
        if (adminUser && adminUser.port !== "GLOBAL") {
           qCrews = query(collection(db, "crews"), where("port", "==", adminUser.port));
        }
        unsubscribeCrews = onSnapshot(qCrews, (snap: any) => {
          const loadedCrews: StevedoreCrew[] = [];
          snap.forEach((doc: any) => {
            loadedCrews.push({ id: idClean(doc.id), ...(doc.data() as any) } as StevedoreCrew);
          });
          setCrews(loadedCrews);
        });
      });
    } catch (err) {
      console.error("Error loading operational dashboard database:", err);
      setIsLoading(false);
    }

    return () => {
      if (unsubscribePortCalls) unsubscribePortCalls();
      if (unsubscribeB2b) unsubscribeB2b();
      if (unsubscribeCrews) unsubscribeCrews();
    };
  }, []);

  // Real-time synchronization of selected vessel's containers (stowage manifest)
  const [containerUnsubscribe, setContainerUnsubscribe] = useState<any>(null);

  const loadVesselContainers = async (vesselId: string) => {
    setIsLoadingContainers(true);
    if (containerUnsubscribe) {
      containerUnsubscribe();
    }
    try {
      import("firebase/firestore").then(({ collection, query, where, onSnapshot }) => {
        const qC = query(collection(db, "contenedores"), where("portcallId", "==", vesselId));
        const unsub = onSnapshot(qC, (snap) => {
          const loadedCons: ContainerItem[] = [];
          snap.forEach(doc => {
             loadedCons.push({ id: doc.id, ...(doc.data() as any) } as ContainerItem);
          });
          setContainers(loadedCons);
          setIsLoadingContainers(false);
        });
        setContainerUnsubscribe(() => unsub);
      });
    } catch (err) {
      console.error("Error loading stowage containers:", err);
      setIsLoadingContainers(false);
    }
  };

  // Sync containers when selected vessel or active tab changes (to be fast)
  useEffect(() => {
    if (selectedBuqueId) {
      loadVesselContainers(selectedBuqueId);
    }
  }, [selectedBuqueId]);

  const getSelectedVessel = () => {
    return buques.find(b => b.id === selectedBuqueId) || null;
  };

  const getStatusStep = (status: string) => {
    if (status === "Aprobado") return 1;
    if (status === "En Rada") return 2;
    if (status === "Atracado") return 3;
    if (status === "En Operación") return 4;
    if (status === "Finalizado") return 5;
    return 0;
  };

  // Update vessel schedule status & record time landmark (hito)
  const handleUpdateVesselStatus = async (id: string, newStatus: PortCall["status"], vesselName: string) => {
    setProcessingId(id);
    try {
      const hitoItem = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        user: adminUser?.email || "vessel.clerk@serviport.com.ve",
        remarks: customRemark.trim() || `Paso al estado operativo: ${newStatus}`
      };

      await updateDoc(doc(db, "portcalls", id), { 
         status: newStatus,
         hitos: arrayUnion(hitoItem)
      });

      // Also if we finalize operations, liberate any crews assigned to this vessel automatically
      if (newStatus === "Finalizado") {
        const assignedCrews = crews.filter(c => c.vesselId === id);
        for (const crew of assignedCrews) {
          await updateDoc(doc(db, "crews", crew.id), {
            status: "Disponible",
            vesselId: null,
            vesselName: null
          });
        }
      }

      await logAuditAction(`Actualizó estado buque ${vesselName} a ${newStatus}`, adminUser?.role, adminUser?.email);
      setCustomRemark("");
    } catch(err) {
      console.error("Error updating status in DB:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // Add customized remark to current status
  const handleAddLiveHitoRemark = async () => {
    const v = getSelectedVessel();
    if (!v || !customRemark.trim()) return;
    setProcessingId("remark");
    try {
      const hitoItem = {
        status: `${v.status} (Nota)`,
        timestamp: new Date().toISOString(),
        user: adminUser?.email || "vessel.clerk@serviport.com.ve",
        remarks: customRemark.trim()
      };

      await updateDoc(doc(db, "portcalls", v.id), { 
         hitos: arrayUnion(hitoItem)
      });

      await logAuditAction(`Agregó bitácora/comentario a buque ${v.name}: ${customRemark}`, adminUser?.role, adminUser?.email);
      setCustomRemark("");
    } catch(err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // Manually register a new port call scaling
  const handleAddNewManualVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVesselName || !newVesselETA) {
      alert("Por favor rellene los campos obligatorios del buque.");
      return;
    }
    setProcessingId("manual-vessel");
    try {
      const defaultHito = {
        status: "Aprobado",
        timestamp: new Date().toISOString(),
        user: adminUser?.email || "vessel.clerk@serviport.com.ve",
        remarks: "Planificación de recalada creada de forma manual en el sistema TOS."
      };

      const newRef = await addDoc(collection(db, "portcalls"), {
        name: newVesselName.toUpperCase(),
        type: newVesselType,
        operator: newVesselOperator,
        eta: newVesselETA,
        status: "Aprobado",
        berth: newVesselBerth,
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello"),
        hitos: [defaultHito]
      });

      await logAuditAction(`Registró manualmente portcall para buque: ${newVesselName.toUpperCase()}`, adminUser?.role, adminUser?.email);
      
      // Seed manifest automatically so it doesn't look barren!
      await seedAutomaticStowageManifest(newRef.id, newVesselName.toUpperCase(), newVesselOperator);

      // Clean Form and close modal
      setNewVesselName("");
      setNewVesselETA("");
      setShowManualModal(false);
      
      setSelectedBuqueId(newRef.id);
    } catch (err) {
      console.error("Error creating manual Port Call:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // Auto-seed cargo manifest of 12 containers
  const seedAutomaticStowageManifest = async (vId: string, vName: string, opName: string) => {
    try {
      const lines = [opName, "MAERSK", "HAPAG-LLOYD", "MSC", "ONE", "CMA CGM"];
      const operators = lines.filter(Boolean);
      const randomOp = () => operators[Math.floor(Math.random() * operators.length)];

      const randomContainerId = () => {
         const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         const prefix = chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)] + "U";
         const nums = Math.floor(1000000 + Math.random() * 9000000).toString();
         return `${prefix}${nums}`;
      };

      const items: Array<Partial<ContainerItem>> = [
        // Discharging (Descarga) List
        { containerId: randomContainerId(), type: "40' Dry Van", weight: 24.5, status: "En Buque", operationType: "Descarga", location: "BODEGA-02A", sealNumber: "SL-82014902", lineOperator: randomOp(), cargoDesc: "Autopartes y Motores" },
        { containerId: randomContainerId(), type: "20' Reefer", weight: 18.2, status: "En Buque", operationType: "Descarga", location: "CUBIERTA-01", sealNumber: "REF-024921", lineOperator: randomOp(), cargoDesc: "Vacunas y Medicinas" },
        { containerId: randomContainerId(), type: "40' High Cube", weight: 26.8, status: "En Buque", operationType: "Descarga", location: "BODEGA-01C", sealNumber: "SL-9311284", lineOperator: randomOp(), cargoDesc: "Maquinaria Pesada" },
        { containerId: randomContainerId(), type: "40' Dry Van", weight: 21.0, status: "En Buque", operationType: "Descarga", location: "BODEGA-04F", sealNumber: "SL-204128", lineOperator: randomOp(), cargoDesc: "Electrodomésticos" },
        { containerId: randomContainerId(), type: "20' Dry Van", weight: 14.1, status: "En Buque", operationType: "Descarga", location: "CUBIERTA-03", sealNumber: "SL-109284", lineOperator: randomOp(), cargoDesc: "Polímeros Industriales" },
        { containerId: randomContainerId(), type: "40' Reefer", weight: 22.4, status: "En Buque", operationType: "Descarga", location: "CUBIERTA-05", sealNumber: "REF-9311204", lineOperator: randomOp(), cargoDesc: "Fruta Selecta Congelada" },
        
        // Loading (Carga) List
        { containerId: randomContainerId(), type: "40' Dry Van", weight: 25.0, status: "Disponible", operationType: "Carga", location: "PATIO A", sealNumber: "SL-2323114", lineOperator: randomOp(), cargoDesc: "Cocoa en Polvo (Ves)" },
        { containerId: randomContainerId(), type: "20' Dry Van", weight: 12.8, status: "Disponible", operationType: "Carga", location: "PATIO A", sealNumber: "SL-925251", lineOperator: randomOp(), cargoDesc: "Gemas y Silicato" },
        { containerId: randomContainerId(), type: "40' High Cube", weight: 23.5, status: "Disponible", operationType: "Carga", location: "PATIO AGD", sealNumber: "SL-515291", lineOperator: randomOp(), cargoDesc: "Ron Añejo Exportación" },
        { containerId: randomContainerId(), type: "20' Reefer", weight: 16.0, status: "Disponible", operationType: "Carga", location: "PATIO A", sealNumber: "REF-114421", lineOperator: randomOp(), cargoDesc: "Pescado Congelado P.C" },
        { containerId: randomContainerId(), type: "40' Dry Van", weight: 28.1, status: "Disponible", operationType: "Carga", location: "PATIO C", sealNumber: "SL-224419", lineOperator: randomOp(), cargoDesc: "Textiles y Calzado" },
        { containerId: randomContainerId(), type: "40' High Cube", weight: 19.8, status: "Disponible", operationType: "Carga", location: "PATIO A", sealNumber: "SL-994411", lineOperator: randomOp(), cargoDesc: "Mineral de Hierro Prep" }
      ];

      const batch = writeBatch(db);
      for (const item of items) {
        const docRef = doc(collection(db, "contenedores"));
        batch.set(docRef, {
          ...item,
          portcallId: vId,
          userId: "CLIENT_B2B_MOCK", // Placeholder linking importer/exp customer
          port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
        });
      }
      await batch.commit();
      await logAuditAction(`Autogeneró manifiesto operativo de estiba (${items.length} TEUs) para buque ${vName}`, "OFICIAL_BUQUES", adminUser?.email);
    } catch (e) {
      console.error("Error seeding containers: ", e);
    }
  };

  // Button helper to manually trigger manifest generation
  const handleManualSeedManifest = async () => {
    const v = getSelectedVessel();
    if (!v) return;
    setProcessingId("seeding");
    await seedAutomaticStowageManifest(v.id, v.name, v.operator);
    await loadVesselContainers(v.id);
    setProcessingId(null);
  };

  // Approve scales sent from shipping companies (B2B portal)
  const handleApproveB2BRequest = async (req: B2BPortCall, selectedBerth: string) => {
    setProcessingId(req.id);
    try {
      // 1. Update B2B scale document status to "Aprobado"
      await updateDoc(doc(db, "port_calls", req.id), {
        status: "Aprobado",
        location: selectedBerth
      });

      // 2. Clone/Create matching record in "portcalls" internal TOS
      const defaultHito = {
        status: "Aprobado",
        timestamp: new Date().toISOString(),
        user: adminUser?.email || "vessel.clerk@serviport.com.ve",
        remarks: `Solicitud de escala Naviera B2B aprobada formalmente. Puesto asignado: ${selectedBerth}.`
      };

      const newRef = await addDoc(collection(db, "portcalls"), {
        name: req.vesselName.toUpperCase(),
        type: "Containership",
        operator: "Línea Asociada B2B",
        eta: new Date().toISOString().split("T")[0], // Assign current date as base
        status: "Aprobado",
        berth: selectedBerth,
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello"),
        hitos: [defaultHito]
      });

      await seedAutomaticStowageManifest(newRef.id, req.vesselName.toUpperCase(), "B2B NAVIERA");

      await logAuditAction(`Aprobó escala B2B para buque ${req.vesselName} y asignó ${selectedBerth}`, adminUser?.role, adminUser?.email);
      
      setSelectedBuqueId(newRef.id);
    } catch (err) {
      console.error("Error approving B2B Port Call:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // Assign Cuadrilla (Estiba Crew) to the selected ship
  const handleAssignCrewToVessel = async (crewId: string, crewName: string, vessel: PortCall) => {
    setProcessingId(crewId);
    try {
       await updateDoc(doc(db, "crews", crewId), {
          status: "En Operación",
          vesselId: vessel.id,
          vesselName: vessel.name
       });

       await logAuditAction(`Asignó cuadrilla "${crewName}" al buque "${vessel.name}"`, adminUser?.role, adminUser?.email);
    } catch(e) {
       console.error("Error assigning crew:", e);
    } finally {
       setProcessingId(null);
    }
  };

  // Release Cuadrilla (Estiba Crew) from ship duty
  const handleReleaseCrewFromVessel = async (crewId: string, crewName: string) => {
    setProcessingId(crewId);
    try {
       await updateDoc(doc(db, "crews", crewId), {
          status: "Disponible",
          vesselId: null,
          vesselName: null
       });

       await logAuditAction(`Liberó cuadrilla "${crewName}" del buque`, adminUser?.role, adminUser?.email);
    } catch(e) {
       console.error("Error releasing crew:", e);
    } finally {
       setProcessingId(null);
    }
  };

  // Discharge a container, creating a "yard_movements" task queue background item
  const handleDischargeContainer = async (c: ContainerItem, vessel: PortCall) => {
    setProcessingId(c.id);
    try {
      // 1. Update Container Status in database
      await updateDoc(doc(db, "contenedores", c.id), {
        status: "En Tránsito / Descargado",
        location: "ZONA DE DESCARGA MUELLE"
      });

      // 2. Automatically queue a new yard movement from Dock to Warehouse (TOS Integration)
      await addDoc(collection(db, "yard_movements"), {
         reference: c.containerId,
         origin: `MUELLE (${vessel.berth})`,
         destination: "PATIO B", // Direct import yard
         status: "PENDIENTE",
         type: "DESCARGA DE BUQUE",
         timestamp: serverTimestamp()
      });

      await logAuditAction(`Ordenó descarga de contenedor ${c.containerId} desde buque ${vessel.name}`, "OFICIAL_BUQUES", adminUser?.email);
      await loadVesselContainers(vessel.id);
    } catch (err) {
      console.error("Error discharging container:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // Load container to vessel, creating a loading "yard_movements" background task
  const handleLoadContainerToVessel = async (c: ContainerItem, vessel: PortCall) => {
    setProcessingId(c.id);
    try {
      // 1. Update Container Status
      await updateDoc(doc(db, "contenedores", c.id), {
        status: "Cargado",
        location: `BODEGA - ${vessel.name}`
      });

      // 2. Queue movement from current yard location to Dock loading cranage
      await addDoc(collection(db, "yard_movements"), {
         reference: c.containerId,
         origin: c.location || "PATIO A",
         destination: `BUQUE (${vessel.name})`,
         status: "PENDIENTE",
         type: "CARGA DE BUQUE",
         timestamp: serverTimestamp()
      });

      await logAuditAction(`Inició carga de exportación para contenedor ${c.containerId} al buque ${vessel.name}`, "OFICIAL_BUQUES", adminUser?.email);
      await loadVesselContainers(vessel.id);
    } catch (err) {
       console.error("Error loading container:", err);
    } finally {
       setProcessingId(null);
    }
  };

  // Filter Active Vessels in view
  const filteredBuques = buques.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.berth.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVesselObj = getSelectedVessel();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <Anchor size={14} className="animate-pulse" /> Terminal Operating System (TOS)
          </div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
            Oficinista de Buques (Water Clerk)
          </h2>
          <p className="text-foreground-muted text-sm font-sans">
            Planificación de atraque/zarpe, manifiesto de estiba TEUs y control de cuadrillas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/*
          <button 
            type="button"
            title="Sincronizar base de datos"
            className="p-3 bg-white border border-border text-foreground-muted hover:text-primary hover:bg-slate-50 transition-all rounded shadow-sm flex items-center gap-2 text-xs font-mono font-bold"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Sincronizar
          </button>
          */}
          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded font-bold font-mono tracking-widest uppercase transition-all text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-0"
          >
            <Plus size={16} /> Registro Manual
          </button>
        </div>
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: Vessels Control Board (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-border p-4 shadow-sm rounded flex items-center gap-2">
            <Search className="text-foreground-muted" size={18} />
            <input 
              type="text" 
              placeholder="Buscar buques o puestos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm w-full bg-transparent font-mono" 
            />
            {searchTerm && <X size={14} className="text-foreground-muted cursor-pointer" onClick={() => setSearchTerm("")} />}
            <Filter className="text-primary cursor-pointer" size={18} />
          </div>

          {/* Vesel List scrollable */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 no-scrollbar select-none">
            {isLoading ? (
               <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
            ) : filteredBuques.length > 0 ? (
               filteredBuques.map((b) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={b.id} 
                  onClick={() => setSelectedBuqueId(b.id)}
                  className={`p-4 bg-white border rounded cursor-pointer transition-all shadow-sm relative overflow-hidden ${
                    selectedBuqueId === b.id 
                    ? 'border-primary ring-2 ring-primary/20 bg-background-muted/40' 
                    : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-secondary font-sansita text-base tracking-tight">{b.name}</span>
                    <span className={`text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded border ${
                      b.status === 'En Rada' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                      b.status === 'En Operación' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                      b.status === 'Finalizado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs text-foreground-muted flex flex-col gap-1.5 font-mono">
                    <div className="flex items-center gap-2"><Flag size={12} className="text-sky-500"/> {b.operator}</div>
                    <div className="flex items-center gap-2"><CalendarClock size={12}/> ETA: <span className="font-bold">{b.eta}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> Puesto: <span className="text-primary font-bold">{b.berth}</span></div>
                  </div>
                </motion.div>
              ))
            ) : (
               <div className="p-8 text-center border border-dashed border-border rounded bg-white">
                  <Ship className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-xs text-foreground-muted font-mono uppercase tracking-widest">Sin resultados</p>
                  <p className="text-xs text-foreground-muted mt-1">Sincroniza o registra un buque manual.</p>
               </div>
            )}
          </div>

          {/* Quick Stats Summary Widget */}
          <div className="bg-secondary-dark text-white p-5 rounded border border-secondary shadow-md font-mono text-xs space-y-3">
             <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider border-b border-white/10 pb-2">
               <span>Resumen de Escalas</span>
               <TrendingUp size={12} className="text-primary" />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-foreground-muted">Faena Total</p>
                 <p className="text-lg font-bold text-white mt-0.5">{buques.filter(v=>v.status === 'En Operación').length} buques</p>
               </div>
               <div>
                 <p className="text-foreground-muted">En Rada</p>
                 <p className="text-lg font-bold text-orange-400 mt-0.5">{buques.filter(v=>v.status === 'En Rada').length} buques</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side: Operations Detail Panel (8 columns) */}
        <div className="lg:col-span-8">
          {selectedVesselObj ? (
            <div className="bg-white border border-border shadow-sm rounded flex flex-col h-full min-h-[600px] overflow-hidden">
              
              {/* Active Vessel Top Info Banner */}
              <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-muted/80">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="text-2xl font-black text-secondary uppercase font-sansita tracking-tight">{selectedVesselObj.name}</h3>
                    <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded border ${
                      selectedVesselObj.status === 'En Rada' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                      selectedVesselObj.status === 'En Operación' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      selectedVesselObj.status === 'Finalizado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {selectedVesselObj.status}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted font-mono">
                    ID único: <span className="text-secondary select-all">{selectedVesselObj.id}</span> • Operador: <span className="font-bold">{selectedVesselObj.operator}</span> • Tipo: <span className="font-medium">{selectedVesselObj.type}</span>
                  </p>
                </div>
                <div className="text-right flex items-center md:flex-col gap-4 md:gap-0 justify-between">
                  <span className="text-xs font-bold text-foreground-muted uppercase font-mono tracking-wider">Puesto de Atraque</span>
                  <span className="text-2xl font-black text-primary font-mono select-all">{selectedVesselObj.berth}</span>
                </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="border-b border-border bg-slate-50/50 flex flex-wrap font-mono text-xs uppercase tracking-wider font-bold">
                {[
                  { id: "timeline", label: "Línea de Tiempo", icon: CalendarClock },
                  { id: "manifest", label: "Manifiesto Estiba (TEUs)", icon: Box },
                  { id: "crews", label: "Asignar Estibadores", icon: Users },
                  { id: "b2b", label: "Solicitudes B2B", icon: FileText, badge: b2bRequests.length }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as TabType)}
                    className={`flex items-center gap-2 px-5 py-4 border-b-2 transition-all ${
                      activeTab === t.id 
                      ? "border-primary text-primary bg-white" 
                      : "border-transparent text-foreground-muted hover:text-secondary hover:bg-slate-50"
                    }`}
                  >
                    <t.icon size={14} />
                    <span>{t.label}</span>
                    {t.badge && t.badge > 0 ? (
                       <span className="bg-orange-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold tracking-tight animate-bounce">{t.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>

              {/* Active Tab Workspace Panel */}
              <div className="p-6 flex-1 flex flex-col min-h-0 bg-white">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: Voyage Timeline (Control log) */}
                  {activeTab === "timeline" && (
                    <motion.div 
                      key="timeline" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
                        
                        {/* Process Checklist */}
                        <div className="md:col-span-5 border-r border-border pr-6 space-y-4">
                          <h4 className="text-secondary text-sm font-bold uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                            <Sparkles size={16} className="text-orange-500" /> Acciones de Escala
                          </h4>

                          <div className="space-y-3 text-xs font-mono">
                             
                             {/* STEP 1: Rada / Pilot board */}
                             <div className="bg-slate-50 border border-border p-3 rounded flex flex-col gap-2">
                               <p className="font-bold text-secondary">Hito de Rada (NOR)</p>
                               <p className="text-[10px] text-foreground-muted normal-case font-sans">El buque informa que está listo en límites del puerto (Notice of Readiness).</p>
                               <button 
                                 disabled={selectedVesselObj.status !== "Aprobado"} 
                                 onClick={() => handleUpdateVesselStatus(selectedVesselObj.id, "En Rada", selectedVesselObj.name)}
                                 className="w-full py-2 bg-white hover:bg-orange-50 border border-orange-200 text-orange-700 rounded font-bold uppercase tracking-widest transition-colors font-mono text-[10px] disabled:opacity-55 disabled:hover:bg-white"
                               >
                                 Marcar Llegada a Rada
                               </button>
                             </div>

                             {/* STEP 2: Moor / Berth Assign */}
                             <div className="bg-slate-50 border border-border p-3 rounded flex flex-col gap-2">
                               <p className="font-bold text-secondary">Maniobra de Atraco</p>
                               <p className="text-[10px] text-foreground-muted normal-case font-sans">Amarre con práctico y remolcadores en muelle designado.</p>
                               <button 
                                 disabled={selectedVesselObj.status !== "En Rada"} 
                                 onClick={() => handleUpdateVesselStatus(selectedVesselObj.id, "Atracado", selectedVesselObj.name)}
                                 className="w-full py-2 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 rounded font-bold uppercase tracking-widest transition-colors font-mono text-[10px] disabled:opacity-55 disabled:hover:bg-white"
                               >
                                 Confirmar Buque Atracado
                               </button>
                             </div>

                             {/* STEP 3: Start Stevedore Faena */}
                             <div className="bg-slate-50 border border-border p-3 rounded flex flex-col gap-2">
                               <p className="font-bold text-secondary">Iniciar Operación de Estiba</p>
                               <p className="text-[10px] text-foreground-muted normal-case font-sans">Habilitar grúas pórtico de muelle y estibadores para descargar.</p>
                               <button 
                                 disabled={selectedVesselObj.status !== "Atracado"} 
                                 onClick={() => handleUpdateVesselStatus(selectedVesselObj.id, "En Operación", selectedVesselObj.name)}
                                 className="w-full py-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded font-bold uppercase tracking-widest transition-colors font-mono text-[10px] disabled:opacity-55 disabled:hover:bg-white"
                               >
                                 Iniciar Carga/Descarga
                               </button>
                             </div>

                             {/* STEP 4: Terminal Clearance */}
                             <div className="bg-slate-50 border border-border p-3 rounded flex flex-col gap-2">
                               <p className="font-bold text-secondary">Cerrar Operación y Zarpar</p>
                               <p className="text-[10px] text-foreground-muted normal-case font-sans">Faena completada, entrega de recibos de estiba y autorización de salida.</p>
                               <button 
                                 disabled={selectedVesselObj.status !== "En Operación"} 
                                 onClick={() => handleUpdateVesselStatus(selectedVesselObj.id, "Finalizado", selectedVesselObj.name)}
                                 className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded font-bold uppercase tracking-widest transition-colors font-mono text-[10px] disabled:opacity-55 disabled:hover:bg-white"
                               >
                                 Emitir Zarpe / Finalizar
                               </button>
                             </div>

                          </div>
                        </div>

                        {/* Interactive Hito Log Timeline (waterfall format) */}
                        <div className="md:col-span-7 flex flex-col justify-between">
                          <div>
                            <h4 className="text-secondary text-sm font-bold uppercase tracking-widest font-mono mb-4">
                              Bitácora de Sucesos (Port Log)
                            </h4>
                            
                            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 max-h-[340px] overflow-y-auto no-scrollbar pr-1">
                              {selectedVesselObj.hitos && selectedVesselObj.hitos.length > 0 ? (
                                 [...selectedVesselObj.hitos].reverse().map((h, i) => (
                                   <div key={i} className="relative group select-all">
                                      <span className="absolute -left-[31px] top-1 flex items-center justify-center w-4.5 h-4.5 rounded-full bg-slate-200 border border-white text-slate-600 font-mono text-[8px] font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                                        ✓
                                      </span>
                                      <p className="text-xs font-bold font-mono text-secondary uppercase tracking-wide gap-2 flex flex-wrap items-center">
                                        <span>{h.status}</span>
                                        <span className="text-[10px] font-normal text-foreground-muted lowercase font-sans">
                                          - {new Date(h.timestamp).toLocaleTimeString('es-VE', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                      </p>
                                      <p className="text-xs text-foreground-muted font-sans mt-0.5 pr-2">{h.remarks || "Sin comentarios."}</p>
                                      <p className="text-[9px] text-foreground-muted/65 font-mono lowercase tracking-wide mt-0.5">Por: {h.user}</p>
                                   </div>
                                 ))
                              ) : (
                                <div className="text-foreground-muted text-xs font-mono uppercase tracking-widest text-center py-10">
                                   Sin hitos reportados.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Add Custom Log Remark */}
                          <div className="pt-4 border-t border-border flex gap-2 items-end">
                            <div className="flex-1 space-y-1">
                              <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Registrar Nota en Bitácora</label>
                              <input 
                                type="text"
                                placeholder="Escribe observaciones o hito particular (ej: Arribo de Práctico)..." 
                                value={customRemark}
                                onChange={e => setCustomRemark(e.target.value)}
                                className="w-full text-xs border border-border px-3 py-2 rounded focus:outline-none focus:border-primary font-sans bg-background"
                              />
                            </div>
                            <button 
                              disabled={processingId === "remark" || !customRemark.trim()}
                              onClick={handleAddLiveHitoRemark}
                              className="bg-secondary hover:bg-secondary-dark text-white font-bold font-mono tracking-widest px-4 py-2 text-[10px] rounded uppercase disabled:opacity-50 h-[34px] transition-colors"
                            >
                              Registrar
                            </button>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: Stowage & Cargo Manifest (Containers) */}
                  {activeTab === "manifest" && (
                    <motion.div 
                      key="manifest" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 flex flex-col"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-border px-4 py-3 rounded">
                        <div>
                          <p className="text-secondary text-sm font-bold font-mono uppercase tracking-wide">
                            Plan de Carga / Descarga de Contenedores
                          </p>
                          <p className="text-[11px] text-foreground-muted normal-case font-sans mt-0.5">
                            Supervisa los manifiestos e instruye grúas de puerto a moverTEUs del/al barco.
                          </p>
                        </div>
                        {containers.length === 0 && (
                          <button 
                             onClick={handleManualSeedManifest}
                             disabled={processingId === "seeding"}
                             className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                             {processingId === "seeding" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                             Generar Manifiesto de Prueba
                          </button>
                        )}
                      </div>

                      {/* Display Manifest Grid */}
                      {isLoadingContainers ? (
                        <div className="flex justify-center p-12 text-foreground-muted"><Loader2 className="animate-spin text-primary inline-block mr-2" size={20} /> Leyendo manifiesto...</div>
                      ) : containers.length > 0 ? (
                        <div className="flex-1 flex flex-col min-h-0">
                          
                          {/* Manifest Table */}
                          <div className="flex-1 overflow-y-auto max-h-[400px] border border-border rounded no-scrollbar">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-border font-mono text-[10px] text-foreground-muted uppercase tracking-wider select-none sticky top-0">
                                  <th className="py-2.5 px-4 font-bold">Contenedor</th>
                                  <th className="py-2.5 px-4 font-bold">Tipo</th>
                                  <th className="py-2.5 px-4 font-bold">Peso</th>
                                  <th className="py-2.5 px-4 font-bold">Línea</th>
                                  <th className="py-2.5 px-4 font-bold">Operación</th>
                                  <th className="py-2.5 px-4 font-bold">Posición/Patio</th>
                                  <th className="py-2.5 px-4 font-bold">Estado</th>
                                  <th className="py-2.5 px-4 font-bold text-right">Maniobra</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {containers.map((c) => (
                                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors font-mono">
                                    <td className="py-3 px-4 font-bold text-secondary">{c.containerId}</td>
                                    <td className="py-3 px-4 text-foreground-muted">{c.type}</td>
                                    <td className="py-3 px-4 text-slate-700">{c.weight} Ton</td>
                                    <td className="py-3 px-4 font-bold text-slate-500">{c.lineOperator}</td>
                                    <td className="py-3 px-4">
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                        c.operationType === "Descarga" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-sky-50 text-primary border-primary/25"
                                      }`}>
                                        {c.operationType}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 font-bold">{c.location || "Muelle / Buque"}</td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                                        c.status === "Disponible" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                                        c.status === "Cargado" ? "bg-purple-50 text-purple-700 border-purple-200" :
                                        "bg-blue-50 text-blue-700 border-blue-200"
                                      }`}>
                                        {c.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      {c.operationType === "Descarga" ? (
                                        <button 
                                          disabled={c.status !== "En Buque" || processingId === c.id}
                                          onClick={() => handleDischargeContainer(c, selectedVesselObj)}
                                          className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold uppercase tracking-wider leading-none transition-colors disabled:opacity-40"
                                        >
                                          {processingId === c.id ? "A Muelle..." : "Descargar"}
                                        </button>
                                      ) : (
                                        <button 
                                          disabled={c.status === "Cargado" || processingId === c.id}
                                          onClick={() => handleLoadContainerToVessel(c, selectedVesselObj)}
                                          className="px-2.5 py-1 bg-primary hover:bg-primary-dark text-white rounded text-[10px] font-bold uppercase tracking-wider leading-none transition-colors disabled:opacity-40"
                                        >
                                          {processingId === c.id ? "Cargando..." : "Cargar al Buque"}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Action Details Summary */}
                          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px] text-foreground-muted select-none">
                            <p>Descargados: <span className="font-bold text-secondary">{containers.filter(c=>c.operationType === "Descarga" && c.status === "En Tránsito / Descargado").length} / {containers.filter(c=>c.operationType === "Descarga").length} TEUs</span></p>
                            <p>Cargados: <span className="font-bold text-secondary">{containers.filter(c=>c.operationType === "Carga" && c.status === "Cargado").length} / {containers.filter(c=>c.operationType === "Carga").length} TEUs</span></p>
                            <p className="md:text-right text-orange-700 font-bold uppercase flex items-center md:justify-end gap-1"><ArrowUpRight size={14} /> Los descargados se envuelven en traslados de patio automáticamente.</p>
                          </div>

                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-dashed border-border py-12 rounded text-center">
                          <Box className="mx-auto text-slate-300 mb-2 animate-bounce" size={40} />
                          <p className="text-secondary font-bold text-sm tracking-tight mb-1">Sin Manifiesto Cargado</p>
                          <p className="text-foreground-muted text-xs normal-case font-sans max-w-sm mx-auto mb-4">No se han ingresado contenedores de estiba para esta recalada en la base de datos.</p>
                          <button 
                             onClick={handleManualSeedManifest}
                             disabled={processingId === "seeding"}
                             className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded font-mono text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                             {processingId === "seeding" ? <Loader2 size={14} className="animate-spin inline-block" /> : "Generar Manifiesto de Prueba (12 TEUs)"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 3: Crew Assignments */}
                  {activeTab === "crews" && (
                    <motion.div 
                      key="crews" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 flex-1 flex flex-col"
                    >
                      <div>
                        <h4 className="text-secondary text-sm font-bold uppercase tracking-widest font-mono mb-2">
                          Asignación de Personal de Muelle (Cuadrillas)
                        </h4>
                        <p className="text-xs text-foreground-muted leading-relaxed font-sans">
                          Administra los frentes de trabajo y las cuadrillas de estiba asignadas a este barco para agilizar la transferencia terrestre.
                        </p>
                      </div>

                      {/* Crews Listing */}
                      <div className="space-y-3 font-mono text-xs flex-1 overflow-y-auto max-h-[360px] pr-1">
                         {crews.length > 0 ? (
                           crews.map((crew) => {
                             const isAssignedToThis = crew.vesselId === selectedVesselObj.id;
                             const isAssignedToOther = crew.vesselId && crew.vesselId !== selectedVesselObj.id;

                             return (
                               <div key={crew.id} className="p-4 border border-border rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors bg-slate-50/50">
                                 <div>
                                   <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                      <span className="font-bold text-secondary text-sm font-sansita">{crew.name}</span>
                                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 px-2.5 rounded border ${
                                        crew.status === "Disponible" ? "bg-emerald-50 text-emerald-700 border-emerald-250" : "bg-blue-50 text-blue-700 border-blue-200"
                                      }`}>
                                        {crew.status}
                                      </span>
                                   </div>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-foreground-muted text-[11px] truncate">
                                      <p>Jefe: <span className="font-bold text-secondary font-sans">{crew.leader}</span></p>
                                      <p>Tamaño: <span className="font-bold text-secondary">{crew.size} estibadores</span></p>
                                      <p className="col-span-2 sm:col-span-1">Turno: <span className="font-bold">{crew.shift}</span></p>
                                   </div>
                                   {crew.vesselName && (
                                     <p className="text-[10.5px] text-primary font-bold mt-1.5 flex items-center gap-1 leading-none uppercase">
                                       <Ship size={12} /> Atendiendo: {crew.vesselName} {isAssignedToThis && "(Este Barco)"}
                                     </p>
                                   )}
                                 </div>

                                 <div className="shrink-0 self-end sm:self-center">
                                   {isAssignedToThis ? (
                                      <button 
                                        disabled={processingId === crew.id}
                                        onClick={() => handleReleaseCrewFromVessel(crew.id, crew.name)}
                                        className="px-3 py-1.5 border border-red-200 text-red-500 bg-white hover:bg-red-500 hover:text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                      >
                                        {processingId === crew.id ? "Liberando..." : "Liberar"}
                                      </button>
                                   ) : (
                                      <button 
                                        disabled={isAssignedToOther || processingId === crew.id || selectedVesselObj.status === "Finalizado"}
                                        onClick={() => handleAssignCrewToVessel(crew.id, crew.name, selectedVesselObj)}
                                        className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                      >
                                        {processingId === crew.id ? "Asignando..." : "Asignar a este Buque"}
                                      </button>
                                   )}
                                 </div>
                               </div>
                             );
                           })
                         ) : (
                           <div className="p-8 border border-dashed rounded text-center text-foreground-muted uppercase tracking-widest">
                             Sin cuadrillas registradas en base de datos.
                           </div>
                         )}
                      </div>

                    </motion.div>
                  )}

                  {/* TAB 4: B2B Naviera Proposals (Shipping lines) */}
                  {activeTab === "b2b" && (
                    <motion.div 
                      key="b2b" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 flex-1 flex flex-col"
                    >
                      <div>
                        <h4 className="text-secondary text-sm font-bold uppercase tracking-widest font-mono mb-2 flex items-center gap-2">
                          <FileText size={16} className="text-primary" /> Solicitudes de Escala Naviera (B2B)
                        </h4>
                        <p className="text-xs text-foreground-muted leading-relaxed font-sans">
                          Sincronización directa con el portal de clientes B2B. Aprueba las solicitudes de escala enviadas por las líneas navieras registradas para ingresarlas al sistema de control de muelle.
                        </p>
                      </div>

                      {/* Display B2B Proposals */}
                      <div className="space-y-3 font-mono text-xs flex-1 overflow-y-auto max-h-[360px] pr-1">
                        {b2bRequests.length > 0 ? (
                          b2bRequests.map((req) => (
                            <div key={req.id} className="p-4 bg-white border border-border rounded flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors shadow-sm relative">
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-secondary text-base font-sansita">{req.vesselName}</span>
                                  <span className="text-[8px] bg-sky-50 text-primary border border-primary/20 font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                                    Pendiente
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-foreground-muted text-[11px]">
                                   <p>Número de Viaje: <span className="font-bold text-slate-700">{req.voyageNumber || "N/A"}</span></p>
                                   <p>ID Solicitud: <span className="font-bold">{req.id.substring(0, 10)}</span></p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                 <select 
                                   id={`berth-select-${req.id}`} 
                                   defaultValue="Muelle 24" 
                                   className="text-[11px] font-sans border border-border p-1.5 rounded focus:outline-none focus:border-primary bg-background font-mono bg-white"
                                 >
                                   <option value="Muelle 24">Muelle 24</option>
                                   <option value="Muelle 25">Muelle 25</option>
                                   <option value="Muelle 26">Muelle 26</option>
                                   <option value="Muelle 28">Muelle 28</option>
                                 </select>

                                 <button 
                                   disabled={processingId === req.id}
                                   onClick={() => {
                                     const selectEl = document.getElementById(`berth-select-${req.id}`) as HTMLSelectElement;
                                     handleApproveB2BRequest(req, selectEl?.value || "Muelle 24");
                                   }}
                                   className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                                 >
                                   {processingId === req.id ? <Loader2 size={11} className="animate-spin" /> : <ChevronRight size={12} />}
                                   Autorizar Atraque
                                 </button>
                              </div>

                            </div>
                          ))
                        ) : (
                          <div className="p-12 border border-dashed text-center rounded border-border text-foreground-muted normal-case font-sans">
                             <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={36} />
                             <p className="text-secondary font-bold text-sm">Todo Sincronizado</p>
                             <p className="text-foreground-muted text-xs mt-0.5">No hay solicitudes de escala pendientes de aprobación enviadas por navieras B2B en el sistema.</p>
                          </div>
                        )}
                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          ) : (
             <div className="bg-white border border-border shadow-sm rounded flex flex-col h-full min-h-[500px] items-center justify-center text-center p-8 select-none">
                <Ship className="text-slate-200 mb-4 animate-pulse" size={54} />
                <p className="text-lg font-bold text-indigo-950 mb-1">Sin buques cargados</p>
                <p className="text-sm text-foreground-muted font-sans max-w-sm">No se encontraron registros de planificación de recaladas activos en la base de datos.</p>
                <button onClick={() => setShowManualModal(true)} className="mt-4 px-4 py-2 bg-primary text-white text-xs font-mono font-bold uppercase rounded">Registrar Primer Escala</button>
             </div>
          )}
        </div>

      </div>

      {/* MODAL 1: Add New Manual Port Call */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border bg-background-muted flex justify-between items-center select-none">
                <h3 className="font-black text-secondary tracking-tight uppercase font-sansita text-lg">
                  Registrar Escala Manual en TOS
                </h3>
                <button onClick={() => setShowManualModal(false)} className="text-foreground-muted hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddNewManualVessel} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Nombre del Buque *</label>
                  <input
                    type="text"
                    required
                    value={newVesselName}
                    onChange={(e) => setNewVesselName(e.target.value)}
                    placeholder="E.g. EVERGREEN STAR, MAERSK SEOUL"
                    className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary font-mono text-sm uppercase bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Tipo de Buque</label>
                    <select
                      value={newVesselType}
                      onChange={(e) => setNewVesselType(e.target.value)}
                      className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono"
                    >
                      <option value="Containership">Portacontenedores</option>
                      <option value="Bulk Carrier">Granelero</option>
                      <option value="General Cargo">Carga General</option>
                      <option value="Ro-Ro">Ro-Ro Rodante</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest font-bold">Línea Operadora</label>
                    <input
                      type="text"
                      required
                      value={newVesselOperator}
                      onChange={(e) => setNewVesselOperator(e.target.value)}
                      placeholder="Maersk, Evergreen..."
                      className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Muelle Designado</label>
                    <select
                      value={newVesselBerth}
                      onChange={(e) => setNewVesselBerth(e.target.value)}
                      className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono font-medium text-primary bg-white"
                    >
                      <option value="Muelle 24">Muelle 24</option>
                      <option value="Muelle 25">Muelle 25</option>
                      <option value="Muelle 26">Muelle 26</option>
                      <option value="Muelle 28">Muelle 28</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">Fecha Est.ETA *</label>
                    <input
                      type="date"
                      required
                      value={newVesselETA}
                      onChange={(e) => setNewVesselETA(e.target.value)}
                      className="w-full border border-border px-3 py-2 rounded focus:outline-none focus:border-primary text-sm bg-background font-mono"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-foreground-muted font-sans italic leading-relaxed pt-2 border-t border-border">
                  Nota: El buque se creará en estado inicial <strong>&quot;Aprobado&quot;</strong>. Al guardarse, se pre-generará automáticamente un manifiesto aleatorio de 12 contenedores listos para operaciones de estiba y prueba integral en patios.
                </p>

                <div className="pt-4 flex justify-end gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-5 py-2.5 border border-border text-foreground-muted hover:bg-slate-50 rounded font-bold text-xs uppercase"
                  >
                    Salir
                  </button>
                  <button
                    type="submit"
                    disabled={processingId === "manual-vessel"}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    {processingId === "manual-vessel" && <Loader2 size={13} className="animate-spin" />}
                    Guardar Escala
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
