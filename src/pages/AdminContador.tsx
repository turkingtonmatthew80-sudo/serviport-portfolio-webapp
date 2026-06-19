import { useState, useEffect } from "react";
import { 
  DollarSign, FileText, CheckSquare, ShieldCheck, TrendingUp, Calendar, 
  Layers, MapPin, Printer, Download, Plus, Loader2, ArrowRightCircle, 
  Check, RefreshCw, BarChart2, ShieldAlert, FileCheck, Compass, Settings, AlertTriangle
} from "lucide-react";
import { 
  collection, getDocs, addDoc, setDoc, doc, updateDoc, query, where, orderBy, getDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell
} from "recharts";
import { generateFacturaFiscalPDF } from "../lib/pdfGenerator";

// Interfaces mirroring actual model schema
interface PortCall {
  id: string;
  name: string;
  berth: string;
  eta: string;
  etd?: string;
  status: "Programado" | "Aprobado" | "En Rada" | "Atracado" | "En Operación" | "Finalizado";
  lineOperator?: string;
  voyageNumber?: string;
  cargoType?: string;
  cargoQty?: number;
  clientRIF?: string;
}

interface DBContainer {
  id: string;
  containerId: string;
  type: string;
  status: string;
  location?: string;
  weight?: number;
  lineOperator?: string;
  fechaIngreso?: string; // Entry date for AGD calculation
  createdAt?: string;
}

interface Tariff {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface Invoice {
  id: string;
  portcallId: string;
  vesselName: string;
  clientName: string;
  clientRIF: string;
  controlNo: string;
  issueDate: string;
  exchangeRate: number;
  items: { concept: string; qty: number; unitPrice: number; total: number }[];
  subtotalUSD: number;
  subtotalVES: number;
  taxUSD: number;
  taxVES: number;
  totalUSD: number;
  totalVES: number;
  isProforma: boolean;
  status: "PENDIENTE" | "APROBADO_CLIENTE" | "FACTURADO";
}

export function AdminContador() {
  const { adminUser } = useAdminAuth();
  
  // Tab Navigation states
  const [activeTab, setActiveTab] = useState<"dashboard" | "portcalls" | "agd" | "tasas" | "cat" | "reporte">("dashboard");
  
  // Database States
  const [portCalls, setPortCalls] = useState<PortCall[]>([]);
  const [containersInAgd, setContainersInAgd] = useState<DBContainer[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(36.45);
  const [lastBcvUpdatedStr, setLastBcvUpdatedStr] = useState<string>("Hoy");

  // Operational Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isActionsProcessing, setIsActionsProcessing] = useState<string | null>(null);
  const [opSuccessMessage, setOpSuccessMessage] = useState<string | null>(null);

  // Cost Consolidation Engine State (When Accountant clicks on a specific PortCall)
  const [selectedPortCall, setSelectedPortCall] = useState<PortCall | null>(null);
  const [consolidationItems, setConsolidationItems] = useState<{ concept: string; qty: number; unitPrice: number; total: number }[]>([]);
  const [customClientName, setCustomClientName] = useState("");
  const [customClientRIF, setCustomClientRIF] = useState("J-40292851-4");
  
  // View Printable document state (Fictional PDF modal)
  const [activeReceiptDoc, setActiveReceiptDoc] = useState<Invoice | null>(null);

  // Report Dates/Filters
  const [reportRange, setReportRange] = useState({ start: "2026-06-01", end: "2026-06-30" });

  useEffect(() => {
    loadAccountingWorkspace();
  }, []);

  // Fetch full accounting environment records
  const loadAccountingWorkspace = async () => {
    setIsLoading(true);
    try {
      const currentPort = adminUser?.port;
      const isGlobal = currentPort === "GLOBAL";

      // 1. Fetch official Port Calls
      let qB = collection(db, "portcalls");
      if (!isGlobal) {
          qB = query(collection(db, "portcalls"), where("port", "==", currentPort)) as any;
      }
      const pcSnap = await getDocs(qB);
      const pList: PortCall[] = [];
      pcSnap.forEach(d => {
        pList.push({ id: d.id, ...d.data() } as PortCall);
      });
      setPortCalls(pList);

      // 2. Fetch Containers for AGD counts and stay fees
      let qCon = collection(db, "contenedores");
      if (!isGlobal) {
          qCon = query(collection(db, "contenedores"), where("port", "==", currentPort)) as any;
      }
      const conSnap = await getDocs(qCon);
      const cList: DBContainer[] = [];
      conSnap.forEach(d => {
        const data = d.data();
        const loc = (data.location || "").toUpperCase();
        if (loc.includes("AGD") || loc.includes("DEPÓSITO") || loc.includes("ALMACÉN")) {
          cList.push({ id: d.id, ...data } as DBContainer);
        }
      });
      setContainersInAgd(cList);

      // 3. Fetch base exchange rate from system settings
      const settingsRef = doc(db, "settings", "global");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const sData = settingsSnap.data();
        const rate = parseFloat(sData.exchangeRate) || 36.45;
        setExchangeRate(rate);
        setLastBcvUpdatedStr(sData.exchangeRateLastUpdated || "Reciente");
      }

      // 4. Fetch tariffs from tariffs collection
      const tSnap = await getDocs(collection(db, "tariffs"));
      const tList: Tariff[] = [];
      tSnap.forEach(d => {
        tList.push({ id: d.id, ...d.data() } as Tariff);
      });
      // Fallback seed inside visual state if DB not loaded
      if (tList.length === 0) {
        tList.push(
          { id: "TF-01", name: "Agenciamiento Naviero Base", type: "por escala", price: 1550 },
          { id: "TF-02", name: "Estiba de Contenedores Sólida", type: "por contenedor", price: 180 },
          { id: "TF-03", name: "Desestiba y Conexión de Reefer", type: "por contenedor", price: 215 },
          { id: "TF-04", name: "Arrendamiento de Patio AGD ( diario )", type: "por día", price: 45 },
          { id: "TF-05", name: "Grúas de Alta Capacidad Auxiliar", type: "por hora", price: 320 },
          { id: "TF-06", name: "Suministro de Reaprovisionamiento Crucial", type: "unidad", price: 1250 }
        );
      }
      setTariffs(tList);

      // 5. Fetch registered Invoices/Proformas (from persistent Firestore database)
      let qInv = collection(db, "invoices");
      if (!isGlobal) {
          qInv = query(collection(db, "invoices"), where("port", "==", currentPort)) as any;
      }
      const invSnap = await getDocs(qInv);
      const invList: Invoice[] = [];
      invSnap.forEach(d => {
        invList.push({ id: d.id, ...d.data() } as Invoice);
      });

      // Quick seed if empty for beautiful statistical rendering
      if (invList.length === 0) {
        const preInvoices: Invoice[] = [
          {
            id: "inv-seed-1",
            portcallId: "pc-demo-1",
            vesselName: "MAERSK ADRIATIC",
            clientName: "MAERSK VENEZUELA S.A.",
            clientRIF: "J-30429103-2",
            controlNo: "00-014902",
            issueDate: "2026-06-08",
            exchangeRate: 36.45,
            items: [
              { concept: "Agenciamiento Naviero Base", qty: 1, unitPrice: 1550, total: 1550 },
              { concept: "Estiba de Contenedores Sólida", qty: 12, unitPrice: 180, total: 2160 },
              { concept: "Grúas de Alta Capacidad Auxiliar", qty: 4, unitPrice: 320, total: 1280 }
            ],
            subtotalUSD: 4990,
            subtotalVES: 4990 * 36.45,
            taxUSD: 4990 * 0.16,
            taxVES: (4990 * 0.16) * 36.45,
            totalUSD: 4990 * 1.16,
            totalVES: (4990 * 1.16) * 36.45,
            isProforma: false,
            status: "FACTURADO"
          },
          {
            id: "inv-seed-2",
            portcallId: "pc-demo-2",
            vesselName: "MSC VALENCIA",
            clientName: "MEDITERRANEAN SHIPPING COMPANY VENEZUELA",
            clientRIF: "J-09252011-4",
            controlNo: "00-014903",
            issueDate: "2026-06-10",
            exchangeRate: 36.45,
            items: [
              { concept: "Agenciamiento Naviero Base", qty: 1, unitPrice: 1550, total: 1550 },
              { concept: "Desestiba y Conexión de Reefer", qty: 8, unitPrice: 215, total: 1720 },
              { concept: "Suministro de Reaprovisionamiento Crucial", qty: 1, unitPrice: 1250, total: 1250 }
            ],
            subtotalUSD: 4520,
            subtotalVES: 4520 * 36.45,
            taxUSD: 4520 * 0.16,
            taxVES: (4520 * 0.16) * 36.45,
            totalUSD: 4520 * 1.16,
            totalVES: (4520 * 1.16) * 36.45,
            isProforma: true,
            status: "PENDIENTE"
          }
        ];
        
        // Write seeds so they persist
        for (const pre of preInvoices) {
          await setDoc(doc(db, "invoices", pre.id), pre);
          invList.push(pre);
        }
      }

      setInvoices(invList);

    } catch (err) {
      console.error("Accounting workspace compilation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // BCV RATE MANUAL TRIGGER
  const handleUpdateBcvRate = async (newRateVal: number) => {
    if (!newRateVal || newRateVal <= 0) return;
    setIsActionsProcessing("bcv-update");
    try {
      const today = new Date().toISOString().split("T")[0];
      const settingsRef = doc(db, "settings", "global");
      
      await setDoc(settingsRef, { 
        exchangeRate: newRateVal, 
        exchangeRateLastUpdated: today 
      }, { merge: true });

      setExchangeRate(newRateVal);
      setLastBcvUpdatedStr(today);

      await logAuditAction(
        `Actualizó la tasa de cambio BCV a ${newRateVal} VES/USD mediante el Terminal Financiero`,
        adminUser?.role || "CONTADOR",
        adminUser?.email
      );

      setOpSuccessMessage(`Tasa oficial BCV actualizada con éxito a ${newRateVal} VES/USD.`);
      setTimeout(() => setOpSuccessMessage(null), 5000);
      loadAccountingWorkspace();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionsProcessing(null);
    }
  };

  // TRIGGER BCV AUTO FETCH
  const handleFetchBcvApi = async () => {
    setIsActionsProcessing("bcv-api");
    try {
      const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
      if (res.ok) {
        const data = await res.json();
        const apiRate = parseFloat(data.promedio);
        if (apiRate && apiRate > 10) {
          handleUpdateBcvRate(apiRate);
        } else {
          alert("Error: Valor retornado de la API es inválido.");
        }
      } else {
        alert("No se pudo conectar con el servicio DolarAPI oficial. Por favor ingrese manualmente.");
      }
    } catch (e) {
      console.error("DolarAPI exception:", e);
      alert("Fallo de conexión. Por favor introduzca la tasa BCV manualmente.");
    } finally {
      setIsActionsProcessing(null);
    }
  };

  // TARIFF ENGINE CALCULATOR & SETTLER (Consolidator)
  const handleSelectVesselForBilling = (pc: PortCall) => {
    setSelectedPortCall(pc);
    setCustomClientName(pc.lineOperator || "NAVIERA POOL VENEZUELA");
    setCustomClientRIF(pc.clientRIF || "J-40292851-4");

    const arrivalDate = pc.eta ? new Date(pc.eta).getTime() : new Date().getTime();
    const departureDate = pc.etd ? new Date(pc.etd).getTime() : new Date().getTime();
    const calculatedStayDays = Math.max(1, Math.ceil((departureDate - arrivalDate) / (1000 * 3600 * 24)));
    const containerCount = pc.cargoQty || 12; // Cargo count (default or scale amount)

    const baseAgenciamiento = tariffs.find(t=>t.id === "TF-01")?.price || 1550;
    const itemEstibaRate = tariffs.find(t=>t.id === "TF-02")?.price || 180;
    const supportCraneRate = tariffs.find(t=>t.id === "TF-05")?.price || 320;
    const provisioningPrice = tariffs.find(t=>t.id === "TF-06")?.price || 1250;

    // Build consolidated receipt list
    const computedItems = [
      { concept: "Agenciamiento Naviero Base", qty: 1, unitPrice: baseAgenciamiento, total: baseAgenciamiento },
      { concept: `Estiba de Contenedores (${pc.cargoType || "Portacontenedores"})`, qty: containerCount, unitPrice: itemEstibaRate, total: containerCount * itemEstibaRate },
      { concept: "Uso Grúa de Alta Capacidad Liebherr (Horas de maniobra)", qty: 6, unitPrice: supportCraneRate, total: 6 * supportCraneRate },
      { concept: "Servicios de Husbandry / Reaprovisionamiento Buque", qty: 1, unitPrice: provisioningPrice, total: provisioningPrice }
    ];

    setConsolidationItems(computedItems);
  };

  // ADD CUSTOM CHASSIS OR OUTSIDE OVERTIME MANUEVER ITEM TO RUNNING ESTIMATE
  const handleAddCustomChargeItem = (conceptRaw: string, qtyRaw: number, priceRaw: number) => {
    if (!conceptRaw.trim() || qtyRaw <= 0 || priceRaw <= 0) return;
    const newItem = {
      concept: conceptRaw.trim(),
      qty: qtyRaw,
      unitPrice: priceRaw,
      total: qtyRaw * priceRaw
    };
    setConsolidationItems([...consolidationItems, newItem]);
  };

  // PERSIST NEW PROFORMA TO FIRESTORE
  const handleSaveProformaDoc = async () => {
    if (!selectedPortCall) return;
    setIsActionsProcessing("generating-proforma");
    try {
      const today = new Date().toISOString().split("T")[0];
      const usdSubtotal = consolidationItems.reduce((acc, curr) => acc + curr.total, 0);
      const usdTax = usdSubtotal * 0.16; // SENIAT VAT 16%
      const usdTotal = usdSubtotal + usdTax;

      const newInv: Invoice = {
        id: "PRO-" + Math.floor(100000 + Math.random() * 899999),
        portcallId: selectedPortCall.id,
        vesselName: selectedPortCall.name,
        clientName: customClientName,
        clientRIF: customClientRIF,
        controlNo: "PRO-" + Math.floor(1000 + Math.random() * 9000),
        issueDate: today,
        exchangeRate: exchangeRate,
        items: consolidationItems,
        subtotalUSD: usdSubtotal,
        subtotalVES: usdSubtotal * exchangeRate,
        taxUSD: usdTax,
        taxVES: usdTax * exchangeRate,
        totalUSD: usdTotal,
        totalVES: usdTotal * exchangeRate,
        isProforma: true,
        status: "PENDIENTE",
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
      } as any;

      // Set to Firestore Invoices collection
      await setDoc(doc(db, "invoices", newInv.id), newInv);

      // Register B2B Client approval notification (B2B approvals collection)
      await addDoc(collection(db, "approvals"), {
        referenceId: newInv.id,
        type: "invoice-proforma",
        vesselName: selectedPortCall.name,
        totalUSD: usdTotal,
        status: "pending",
        timestamp: serverTimestamp(),
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
      });

      // Audit Logger
      await logAuditAction(
        `Consolidó costos y generó Proforma Invoice ${newInv.controlNo} por valor de $${usdTotal.toFixed(2)} para el buque ${selectedPortCall.name}`,
        "CONTADOR",
        adminUser?.email
      );

      setOpSuccessMessage(`La Proforma Invoice ${newInv.controlNo} se ha registrado y remitido al portal B2B para aprobación del cliente.`);
      setSelectedPortCall(null);
      setTimeout(() => setOpSuccessMessage(null), 5000);
      loadAccountingWorkspace();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionsProcessing(null);
    }
  };

  // CONVERT APPROVED PROFORMA TO FINAL FISCAL INVOICE ( Venezuelan SENIAT standards )
  const handleConvertProformaToFiscalInvoice = async (prof: Invoice) => {
    setIsActionsProcessing(prof.id);
    try {
      const today = new Date().toISOString().split("T")[0];
      const nextControlNo = "SENIAT-FACT-" + Math.floor(100000 + Math.random() * 899999);
      
      const invoiceRef = doc(db, "invoices", prof.id);
      await updateDoc(invoiceRef, {
        isProforma: false,
        status: "FACTURADO",
        controlNo: nextControlNo,
        issueDate: today
      });

      // Log Audit
      await logAuditAction(
        `EMISIÓN FISCAL: Convirtió Proforma ${prof.controlNo} en Factura Fiscal Definitiva SENIAT Numero ${nextControlNo} para ${prof.vesselName}`,
        "CONTADOR",
        adminUser?.email
      );

      // Trigger automatic receipt view instantly for high satisfaction
      const updatedSnap = await getDoc(invoiceRef);
      if (updatedSnap.exists()) {
        setActiveReceiptDoc({ id: updatedSnap.id, ...updatedSnap.data() } as Invoice);
      }

      setOpSuccessMessage(`Factura Fiscal ${nextControlNo} generada con éxito.`);
      setTimeout(() => setOpSuccessMessage(null), 5000);
      loadAccountingWorkspace();
    } catch (e) {
      console.error("Error converting invoice:", e);
    } finally {
      setIsActionsProcessing(null);
    }
  };

  // MANUAL OVERRIDE: Admin intentionally marks Proforma as approved if client offline.
  const handleManualClientApprovalOverride = async (profId: string) => {
    setIsActionsProcessing(`client-approve-${profId}`);
    try {
      // 1. Update the B2B notifications approvals node if exists
      const appSnap = await getDocs(query(collection(db, "approvals"), where("referenceId", "==", profId)));
      if (!appSnap.empty) {
        await updateDoc(doc(db, "approvals", appSnap.docs[0].id), {
          status: "approved"
        });
      }

      // 2. Set Invoice state to APROBADO_CLIENTE ready for accountant fiscal emit
      await updateDoc(doc(db, "invoices", profId), {
        status: "APROBADO_CLIENTE"
      });

      await logAuditAction(
        `Aprobación Administrativa Manual (Override). Proforma (${profId}) marcada como aprobada.`,
        "CONTADOR",
        adminUser?.email
      );

      setOpSuccessMessage(`Proforma aprobada administrativamente. Proceda a emitir la Factura Fiscal.`);
      setTimeout(() => setOpSuccessMessage(null), 5000);
      loadAccountingWorkspace();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionsProcessing(null);
    }
  };

  // PRE-RENDER STATISTICAL INFORMATION
  const totalReceivables = invoices.reduce((acc, curr) => acc + curr.totalUSD, 0);
  const totalPaid = invoices.filter(i => i.status === "FACTURADO").reduce((acc, curr) => acc + curr.totalUSD, 0);
  const totalPending = invoices.filter(i => i.status === "PENDIENTE").reduce((acc, curr) => acc + curr.totalUSD, 0);

  // Recharts Chart structures
  const chartServiceCategorizedData = [
    { name: "Estiba", amount: 18450 },
    { name: "Almacenaje AGD", amount: 11420 },
    { name: "Husbandry", amount: 8250 },
    { name: "Acarreo", amount: 4530 }
  ];

  const recentScalesHistoryData = [
    { month: "Mar", totalUSD: 31200 },
    { month: "Abr", totalUSD: 42000 },
    { month: "May", totalUSD: 38900 },
    { month: "Jun (Hoy)", totalUSD: totalPaid }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 1. COMPACT PROFESSIONAL HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-bold uppercase tracking-widest leading-none mb-1">
            <DollarSign size={14} className="text-primary animate-pulse" /> ERP Módulo Financiero
          </div>
          <h2 className="text-3.5xl font-black text-secondary uppercase tracking-tight font-sansita">
            Terminal Financiero y de Control de Costos
          </h2>
          <p className="text-foreground-muted text-sm font-sans">
            Sistematización de tarifas generales, emisión de Proformas, Facturación Fiscal venezolana y conversión oficial VES.
          </p>
        </div>

        {/* BCV exchange widget overlay */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded text-slate-100 shadow-md">
          <div className="font-mono text-right">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-bold">Oficial BCV Diario</p>
            <p className="text-accent text-sm font-black mt-0.5">{exchangeRate.toFixed(2)} VES/USD</p>
            <p className="text-[8px] text-slate-500 font-normal">Act: {lastBcvUpdatedStr}</p>
          </div>
          <button 
            disabled={isActionsProcessing !== null}
            onClick={handleFetchBcvApi}
            className="p-2 border border-slate-850 hover:bg-slate-800 bg-slate-950 text-xs font-mono text-emerald-400 rounded flex items-center gap-1"
            title="Consumir Banco Central de Venezuela"
          >
            <RefreshCw size={13} className={isActionsProcessing === "bcv-api" ? "animate-spin" : ""} />
            API
          </button>
        </div>
      </div>

      {opSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2.5 rounded shadow-sm animate-fade-in">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
          <span>{opSuccessMessage}</span>
        </div>
      )}

      {/* 2. TABBED CONTROLLERS */}
      <div className="flex flex-wrap border-b border-border mb-6">
        {[
          { id: "dashboard", label: "Dashboard", badge: "KPIs" },
          { id: "portcalls", label: "Liquidación Escalas", badge: `${portCalls.length} SCALE` },
          { id: "agd", label: "Rentabilidad AGD", badge: `${containersInAgd.length} CONT` },
          { id: "tasas", label: "Tasa Bancaria", badge: "BCV" },
          { id: "cat", label: "Tarifas Base", badge: "TARIFF" },
          { id: "reporte", label: "Generador de Cuentas", badge: "PDF" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedPortCall(null);
            }}
            className={`px-5 py-4 font-mono text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? "text-primary border-primary bg-primary/2" 
                : "text-foreground-muted hover:text-secondary border-transparent"
            }`}
          >
            {tab.label}
            <span className={`text-[8px] font-mono px-1 rounded ${activeTab === tab.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>{tab.badge}</span>
          </button>
        ))}
      </div>

      {/* 3. WORKSPACE VIEWS CONTAINER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          
          {/* TAB 1: DASHBOARD AND CHARTS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Financial KPI stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Receivables de Turno (USD)", value: `$${totalReceivables.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subValue: `${(totalReceivables * exchangeRate).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VES`, icon: FileText, bg: "bg-indigo-50", text: "text-indigo-600" },
                  { label: "Recaudado Conciliado (USD)", value: `$${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subValue: `${(totalPaid * exchangeRate).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VES`, icon: ShieldCheck, bg: "bg-emerald-50", text: "text-emerald-600" },
                  { label: "Crédito Pendiente (USD)", value: `$${totalPending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subValue: `${(totalPending * exchangeRate).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VES`, icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-600" },
                  { label: "Tasa USD/VES Oficial", value: `${exchangeRate.toFixed(4)} VES`, subValue: `Actualizado: ${lastBcvUpdatedStr}`, icon: DollarSign, bg: "bg-blue-50", text: "text-blue-600" }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-5 border border-border rounded shadow-sm flex items-start justify-between relative overflow-hidden group">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 leading-none">{kpi.label}</p>
                      <h4 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-secondary leading-tight truncate">{kpi.value}</h4>
                      <p className="text-[10px] text-foreground-muted font-bold block truncate">{kpi.subValue}</p>
                    </div>
                    <div className={`p-3 rounded-full ${kpi.bg} ${kpi.text} shrink-0`}>
                      <kpi.icon size={18} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphical Earnings Representation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 5-Month Revenue flow chart */}
                <div className="lg:col-span-8 bg-white border border-border rounded shadow-sm p-5 flex flex-col justify-between h-[360px]">
                  <div>
                    <h3 className="font-bold text-secondary text-sm uppercase font-mono tracking-wider">Historial de Recaudación Consolidada</h3>
                    <p className="text-[11px] text-foreground-muted">Comparativo del volumen de facturaciones validadas por el Contador de Serviport.</p>
                  </div>
                  <div className="flex-1 min-h-0 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={recentScalesHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUSD" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="totalUSD" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorUSD)" name="Ingresos (USD)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category composition cake chart */}
                <div className="lg:col-span-4 bg-white border border-border rounded shadow-sm p-5 flex flex-col justify-between h-[360px]">
                  <div>
                    <h3 className="font-bold text-secondary text-xs uppercase font-mono tracking-wider">Composición de Rubros de Cobro</h3>
                    <p className="text-[11px] text-foreground-muted">Distribución de ingresos según el tipo de servicio.</p>
                  </div>
                  <div className="flex-1 min-h-0 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartServiceCategorizedData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#0284c7" radius={[4, 4, 0, 0]} name="USD">
                          {chartServiceCategorizedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "#1e293b" : index === 1 ? "#0284c7" : index === 2 ? "#10b981" : "#f59e0b"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Transactions state logs summary */}
              <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
                <div className="px-6 py-4.5 border-b border-border bg-slate-50/50 flex justify-between items-center text-xs">
                  <h3 className="font-bold font-mono tracking-wider text-secondary uppercase flex items-center gap-1.5">
                    <FileText size={16} className="text-primary animate-pulse" /> Registro de Cuentas por Cobrar y Documentos Fiscales
                  </h3>
                  <span className="font-mono text-[9px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded border uppercase">FACTURAS EMITIDAS</span>
                </div>

                <div className="overflow-x-auto divide-y divide-border">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border font-mono text-[9px] text-foreground-muted uppercase tracking-wider">
                        <th className="py-3 px-6">Documento No</th>
                        <th className="py-3 px-6">Embarcación / Buque</th>
                        <th className="py-3 px-6">Cliente Facturado</th>
                        <th className="py-3 px-6">Fecha Emisión</th>
                        <th className="py-3 px-6">Monto Total USD</th>
                        <th className="py-3 px-6">Equivalente VES</th>
                        <th className="py-3 px-6 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/40 transition-colors select-none font-sans">
                          <td className="py-3.5 px-6 font-mono font-bold text-secondary">
                            <span className="block">{inv.controlNo}</span>
                            <span className="text-[9px] text-slate-400 font-normal">ID: {inv.id}</span>
                          </td>
                          <td className="py-3.5 px-6 font-mono text-[11px] text-slate-600">{inv.vesselName}</td>
                          <td className="py-3.5 px-6 font-semibold text-slate-600">{inv.clientName}</td>
                          <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">{inv.issueDate}</td>
                          <td className="py-3.5 px-6 font-mono font-extrabold text-secondary">${inv.totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3.5 px-6 font-mono font-bold text-emerald-700">Bs. {inv.totalVES.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3.5 px-6 text-right">
                            <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded ${
                              inv.status === "FACTURADO" 
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                : inv.status === "APROBADO_CLIENTE"
                                ? "bg-blue-100 text-blue-800 border border-blue-200 animate-pulse"
                                : "bg-orange-100 text-orange-850 border border-orange-200"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIQUIDACIÓN ESCALAS PORT CALLS */}
          {activeTab === "portcalls" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (5 Cols) - PortCalls Tracker List */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border bg-slate-50">
                    <h3 className="font-bold text-secondary text-sm uppercase font-mono tracking-wider">Escalas de Buques del Período</h3>
                    <p className="text-[10px] text-slate-400">Selecciona un buque listo para proceder con la consolidación y auditoría de consumos.</p>
                  </div>

                  <div className="divide-y divide-border max-h-[500px] overflow-y-auto no-scrollbar">
                    {portCalls.map(pc => {
                      const isSelected = selectedPortCall?.id === pc.id;
                      const hasInvoice = invoices.some(inv => inv.portcallId === pc.id);
                      return (
                        <div
                          key={pc.id}
                          onClick={() => handleSelectVesselForBilling(pc)}
                          className={`p-4 transition-all cursor-pointer relative ${
                            isSelected 
                              ? "bg-slate-900 text-white" 
                              : "hover:bg-slate-50 bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-sm tracking-tight">{pc.name}</h4>
                              <p className={`text-[10px] font-mono ${isSelected ? "text-slate-400" : "text-foreground-muted"}`}>
                                Puesto: <span className="font-semibold text-primary">{pc.berth || "Muelle 24"}</span> • ETA: {pc.eta}
                              </p>
                            </div>
                            {hasInvoice ? (
                              <span className="text-[8px] font-mono bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded leading-none">FACTURADO</span>
                            ) : (
                              <span className="text-[8px] font-mono bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded leading-none">PENDIENTE</span>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-3 text-[10px]">
                            <span className={isSelected ? "text-slate-300" : "text-slate-500"}>Naviera: <span className="font-mono font-bold">{pc.lineOperator || "MSC"}</span></span>
                            <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[9px] border ${
                              pc.status === "Finalizado" 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                                : pc.status === "En Operación"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {pc.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {portCalls.length === 0 && (
                      <p className="p-8 font-mono text-xs text-center text-foreground-muted uppercase tracking-wider">No hay escalas registradas</p>
                    )}
                  </div>
                </div>

                {/* Approved Proformas awaiting billing convert */}
                <div className="bg-white border border-border rounded shadow-sm overflow-hidden p-4 space-y-3.5">
                  <h4 className="font-bold text-secondary text-xs uppercase font-mono tracking-wider flex items-center gap-1">
                    <FileCheck size={14} className="text-secondary" /> Procesos de Firma Pendientes
                  </h4>
                  <p className="text-[10px] text-foreground-muted font-sans leading-normal">
                    Las proformas ya emitidas que requieren la aprobación digital del cliente B2B, o listas para la facturación final SENIAT.
                  </p>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar">
                    {invoices.filter(i => i.isProforma).map(inv => {
                      const isClientApproved = inv.status === "APROBADO_CLIENTE";
                      return (
                        <div key={inv.id} className="p-3 border border-border bg-slate-50 rounded text-xs space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-secondary">{inv.vesselName}</p>
                              <p className="text-[9px] font-mono text-slate-400">PRO: {inv.controlNo}</p>
                            </div>
                            <span className={`text-[9px] font-mono font-bold uppercase px-1 rounded ${isClientApproved ? "bg-blue-200 text-blue-900 animate-pulse" : "bg-orange-100 text-orange-900"}`}>
                              {inv.status}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-200/50">
                            <p className="font-mono font-bold">${inv.totalUSD.toFixed(2)}</p>
                            <div className="flex gap-1.5">
                              {!isClientApproved && (
                                <button
                                  disabled={isActionsProcessing !== null}
                                  onClick={() => handleManualClientApprovalOverride(inv.id)}
                                  className="px-1.5 py-0.5 bg-secondary text-white rounded font-mono text-[8px] font-bold uppercase hover:bg-slate-800"
                                  title="Aprobación Administrativa (Override)"
                                >
                                  Override
                                </button>
                              )}
                              <button
                                disabled={isActionsProcessing !== null}
                                onClick={() => handleConvertProformaToFiscalInvoice(inv)}
                                className="px-1.5 py-0.5 bg-primary text-white rounded font-mono text-[8px] font-black uppercase hover:bg-primary-dark"
                                title="Emitir Factura Fiscal SENIAT"
                              >
                                EMITIR
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column (7 Cols) - Consolidated Bill Calculation / document preview */}
              <div className="lg:col-span-7">
                {selectedPortCall ? (
                  <div className="bg-white border border-border rounded shadow-sm p-6 space-y-6">
                    <div className="border-b border-border pb-3 flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.2 rounded uppercase">Liquidador Consolidado (Tariff Engine)</span>
                        <h3 className="font-black text-secondary text-2xl tracking-tight mt-1">{selectedPortCall.name}</h3>
                        <p className="text-foreground-muted text-[11px] font-mono">Línea Operadora: {selectedPortCall.lineOperator || "MSC VENEZUELA"}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">Consumo de Escala</p>
                        <p className="font-mono font-extrabold text-sm text-secondary">{selectedPortCall.cargoQty || 12} TEUs Procesados</p>
                      </div>
                    </div>

                    {/* Costing Table Grid preview */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-[10px] uppercase font-bold text-slate-500">Detalle preliminar de servicios de estiba y puerto</h4>
                      <div className="border border-border rounded overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-border font-mono text-[9px] text-slate-500 uppercase">
                              <th className="py-2.5 px-4">Servicio/Concepto</th>
                              <th className="py-2.5 px-4 text-center">Cant</th>
                              <th className="py-2.5 px-4 text-right">Unitario USD</th>
                              <th className="py-2.5 px-4 text-right">Total USD</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {consolidationItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-4 font-sans font-semibold text-slate-700">{item.concept}</td>
                                <td className="py-2.5 px-4 text-center font-mono">{item.qty}</td>
                                <td className="py-2.5 px-4 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-secondary">${item.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add manual custom surcharge panel */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const concept = (form.elements.namedItem("concept") as HTMLInputElement).value;
                      const qty = parseInt((form.elements.namedItem("qty") as HTMLInputElement).value, 10);
                      const price = parseFloat((form.elements.namedItem("price") as HTMLInputElement).value);
                      handleAddCustomChargeItem(concept, qty, price);
                      form.reset();
                    }} className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                      <p className="font-mono uppercase font-bold text-[10px] text-slate-600">Acarreos Internos y Demurrage Excedente (Recargo manual)</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input name="concept" placeholder="Ej: Energía Reefer adicional" className="p-2 border border-border bg-white rounded md:col-span-2" required />
                        <input name="qty" type="number" placeholder="Cant" className="p-2 border border-border bg-white rounded" required />
                        <input name="price" type="number" step="0.01" placeholder="Precio ($)" className="p-2 border border-border bg-white rounded" required />
                      </div>
                      <button type="submit" className="px-3 py-1.5 bg-secondary text-white rounded font-mono text-[9px] font-bold uppercase hover:bg-slate-800">
                        + Añadir Recargo
                      </button>
                    </form>

                    {/* Settlement details & invoice config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans border-t border-border pt-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider mb-1">Nombre Comercial de Facturación</label>
                          <input className="w-full p-2 border border-border bg-slate-50 rounded" value={customClientName} onChange={e=>setCustomClientName(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider mb-1">RIF de la Empresa J-XXXXXXX-X</label>
                          <input className="w-full p-2 border border-border bg-slate-50 rounded font-mono" value={customClientRIF} onChange={e=>setCustomClientRIF(e.target.value)} />
                        </div>
                      </div>

                      {/* VAT & Totals box */}
                      <div className="bg-slate-900 text-white p-4 rounded font-mono flex flex-col justify-between leading-normal shadow-sm">
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span>Subtotal USD:</span>
                            <span>${consolidationItems.reduce((acc, curr) => acc + curr.total, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IVA (16% Fiscal):</span>
                            <span>${(consolidationItems.reduce((acc, curr) => acc + curr.total, 0) * 0.16).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-850 flex justify-between items-center mt-3">
                          <span className="text-[10px] uppercase text-emerald-400 font-bold">Total Liquidación:</span>
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold text-base leading-none">${(consolidationItems.reduce((acc, curr) => acc + curr.total, 0) * 1.16).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-[9px] text-slate-400">VES: Bs. {((consolidationItems.reduce((acc, curr) => acc + curr.total, 0) * 1.16) * exchangeRate).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generation control triggers */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setSelectedPortCall(null)}
                        className="px-4 py-2 border border-border rounded text-slate-600 text-xs font-mono font-bold"
                      >
                        Descartar
                      </button>
                      <button
                        disabled={isActionsProcessing !== null}
                        onClick={handleSaveProformaDoc}
                        className="px-4 py-2.5 bg-primary text-white hover:bg-primary-dark font-mono font-bold rounded text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1"
                      >
                        {isActionsProcessing === "generating-proforma" ? <Loader2 size={12} className="animate-spin" /> : <FileText size={13} />}
                        Generar Proforma B2B
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-border border-dashed p-12 text-center rounded shadow-sm">
                    <Compass size={40} className="mx-auto text-slate-300 animate-spin mb-4" style={{ animationDuration: '6s' }} />
                    <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono">Plataforma de Facturación Activa ✓</h3>
                    <p className="text-foreground-muted text-xs normal-case mt-1.5 max-w-md mx-auto">
                      Selecciona cualquier embarcación de la recalada en curso para consolidar sus manifiestos de estiba, horas de grúa y servicios generales prestados.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: ALMACENAJE EN AGD */}
          {activeTab === "agd" && (
            <div className="space-y-6">
              
              <div className="bg-white border border-border shadow-sm p-6 rounded space-y-4">
                <div>
                  <h3 className="font-bold text-secondary text-sm uppercase font-mono tracking-wider">Unidades de Carga Resguardadas en AGD (Rentabilidad Directa)</h3>
                  <p className="text-foreground-muted text-xs mt-0.5">La facturación de almacenaje se calcula automáticamente por cada día de permanencia devengado según la tarifa diaria asignada de $45.00/día.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border font-mono text-[9px] text-foreground-muted uppercase tracking-wider">
                        <th className="py-3 px-6">Contenedor ID</th>
                        <th className="py-3 px-6">Tipo ISO</th>
                        <th className="py-3 px-6">Operador Naviero</th>
                        <th className="py-3 px-6">Ubicación Actual</th>
                        <th className="py-3 px-6">Días en AGD</th>
                        <th className="py-3 px-6 text-right">Tarifa Diaria</th>
                        <th className="py-3 px-6 text-right">Acumulado Neto</th>
                        <th className="py-3 px-6 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {containersInAgd.map((c, idx) => {
                        // Real day calculation from container creation date in the port
                        const calculatedDays = c.createdAt ? Math.ceil((new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600 * 24)) || 1 : 1;
                        const dailyCharge = 45.00;
                        const netAcumulado = calculatedDays * dailyCharge;

                        return (
                          <tr key={c.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-6 font-mono font-bold text-secondary">{c.containerId}</td>
                            <td className="py-3.5 px-6 font-mono text-slate-500">{c.type}</td>
                            <td className="py-3.5 px-6 font-semibold text-slate-600">{c.lineOperator || "EVERGREEN"}</td>
                            <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500">{c.location || "Patio AGD F-2"}</td>
                            <td className="py-3.5 px-6 font-mono font-bold text-slate-700">{calculatedDays} días</td>
                            <td className="py-3.5 px-6 font-mono text-right font-medium">${dailyCharge.toFixed(2)}</td>
                            <td className="py-3.5 px-6 font-mono text-right font-black text-secondary">${netAcumulado.toFixed(2)}</td>
                            <td className="py-3.5 px-6 text-right">
                              <button 
                                onClick={async () => {
                                  // Direct immediate bill of AGD space
                                  setIsActionsProcessing(`bill-${c.id}`);
                                  try {
                                    const today = new Date().toISOString().split("T")[0];
                                    const newControl = "AGD-FACT-" + Math.floor(100000 + Math.random() * 899999);
                                    
                                    const invoiceItem: Invoice = {
                                      id: "AGD-" + Math.floor(100000 + Math.random() * 899999),
                                      portcallId: "AGD-DIRECT-SCALE",
                                      vesselName: "RETIRO DE PATIO AGD",
                                      clientName: `REPRESENTANTE ADUANAL CONSIGNATARIO DE ${c.lineOperator || "EVERGREEN"}`,
                                      clientRIF: "J-49210204-1",
                                      controlNo: newControl,
                                      issueDate: today,
                                      exchangeRate: exchangeRate,
                                      items: [
                                        { concept: `Servicio Almacenaje Resguardado AGD Contenedor ${c.containerId}`, qty: calculatedDays, unitPrice: dailyCharge, total: netAcumulado }
                                      ],
                                      subtotalUSD: netAcumulado,
                                      subtotalVES: netAcumulado * exchangeRate,
                                      taxUSD: netAcumulado * 0.16,
                                      taxVES: (netAcumulado * 0.16) * exchangeRate,
                                      totalUSD: netAcumulado * 1.16,
                                      totalVES: (netAcumulado * 1.16) * exchangeRate,
                                      isProforma: false,
                                      status: "FACTURADO"
                                    };

                                    await setDoc(doc(db, "invoices", invoiceItem.id), invoiceItem);
                                    
                                    await logAuditAction(
                                      `EMISIÓN ALMACENAJE: Generó factura fiscal directa ${newControl} por estadía de ${calculatedDays} días del contenedor ${c.containerId}`,
                                      "CONTADOR",
                                      adminUser?.email
                                    );

                                    setOpSuccessMessage(`Factura fiscal ${newControl} por almacenaje generada con exito.`);
                                    setTimeout(() => setOpSuccessMessage(null), 5000);
                                    loadAccountingWorkspace();
                                  } catch (err) {
                                    console.error(err);
                                  } finally {
                                    setIsActionsProcessing(null);
                                  }
                                }}
                                disabled={isActionsProcessing !== null}
                                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded font-mono text-[10px] uppercase flex items-center gap-1 transition"
                              >
                                <DollarSign size={11} /> Facturar Salida
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {containersInAgd.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-10 text-center font-mono text-xs text-foreground-muted uppercase tracking-widest bg-slate-50/20">
                            <Layers size={24} className="text-slate-300 mx-auto mb-2 animate-bounce" />
                            No hay contenedores registrados en AGD actualmente
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: BCV TASA DE CAMBIO */}
          {activeTab === "tasas" && (
            <div className="bg-white rounded border border-border shadow-sm p-8 max-w-2xl mx-auto space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-3 rounded text-emerald-600 shrink-0 border border-emerald-100">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-lg mb-1">Tasa del Banco Central de Venezuela de Hoy</h3>
                  <p className="text-xs text-foreground-muted leading-relaxed font-sans">
                     Establece el tipo de cambio oficial de referencia del BCV para la paridad dual USD/VES exigida en denominaciones de facturación nacionales del SENIAT.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded border border-slate-200/50 space-y-5">
                <div className="flex justify-between items-center bg-slate-900 text-white p-4.5 rounded font-mono border">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">VALOR EN BASE DE DATOS:</p>
                    <p className="text-base font-black text-emerald-400 mt-1">{exchangeRate.toFixed(4)} VES</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold text-right">ÚLTIMA ACTUALIZACIÓN FÍSICA:</p>
                    <p className="text-xs text-secondary-cyan font-bold text-right mt-1">{lastBcvUpdatedStr}</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const rateVal = parseFloat((e.currentTarget.elements.namedItem("manual-rate") as HTMLInputElement).value);
                  handleUpdateBcvRate(rateVal);
                }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider">Actualizar Tasa VES Manual</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-foreground-muted font-bold text-sm">Bs.</span>
                      <input 
                        name="manual-rate"
                        step="0.0001"
                        type="number"
                        placeholder="Ej: 36.4510"
                        required 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-border text-foreground rounded font-mono font-bold text-base focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <button 
                      type="button" 
                      onClick={handleFetchBcvApi}
                      disabled={isActionsProcessing !== null}
                      className="px-4 py-3 bg-slate-100 border hover:bg-slate-200 text-secondary font-mono font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5 transition"
                    >
                      <RefreshCw size={14} className={isActionsProcessing === "bcv-api" ? "animate-spin text-primary" : ""} />
                      Consumir API BCV
                    </button>
                    <button 
                      type="submit"
                      disabled={isActionsProcessing !== null}
                      className="px-4 py-3 bg-primary hover:bg-primary-dark text-white font-mono font-black text-xs uppercase rounded flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      {isActionsProcessing === "bcv-update" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Establecer Tasa
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: TARIFARIO CATALOG */}
          {activeTab === "cat" && (
            <div className="bg-white rounded border border-border shadow-sm overflow-hidden">
               <div className="px-6 py-5 border-b border-border bg-slate-50/50 flex items-center justify-between">
                 <div>
                   <h3 className="font-bold text-secondary text-sm uppercase font-mono tracking-wider">Catálogo Base de Tarifas Serviport</h3>
                   <p className="text-[10px] text-foreground-muted font-sans m-0">Precios y rubros definidos en base de datos. Utilizados para la automatización del liquidador de escalas.</p>
                 </div>
                 <button 
                   onClick={() => {
                     const name = prompt("Nombre del servicio:");
                     const price = parseFloat(prompt("Precio en USD:") || "0");
                     const type = prompt("Unidad de cobro (por escala, por contenedor, por tonelada):") || "unidad";
                     if (name && price > 0) {
                        setTariffs([...tariffs, { id: "TF-" + Math.floor(10 + Math.random() * 90), name, price, type }]);
                     }
                   }}
                   className="px-3 py-1.5 bg-primary text-white rounded font-mono text-[10px] font-bold uppercase hover:bg-primary-dark flex items-center gap-1 transition"
                 >
                   <Plus size={14} /> Añadir Rubro
                 </button>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse text-xs">
                   <thead>
                     <tr className="bg-slate-50 font-mono text-[9px] text-slate-500 border-b border-border uppercase">
                       <th className="py-3 px-6">Código rubro</th>
                       <th className="py-3 px-6">Concepto / Servicio</th>
                       <th className="py-3 px-6">Unidad de Medida</th>
                       <th className="py-3 px-6 text-right">Precio USD</th>
                       <th className="py-3 px-6 text-right">VES (Aprox BCV)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border font-sans text-secondary">
                     {tariffs.map(t => (
                       <tr key={t.id} className="hover:bg-slate-50/50">
                         <td className="py-3 px-6 font-mono font-bold text-slate-400">{t.id}</td>
                         <td className="py-3 px-6 font-bold">{t.name}</td>
                         <td className="py-3 px-6 font-mono text-[10px] font-semibold text-slate-500 uppercase">{t.type}</td>
                         <td className="py-3 px-6 font-mono text-right font-extrabold text-slate-900">${t.price.toFixed(2)}</td>
                         <td className="py-3 px-6 font-mono text-right font-black text-emerald-700">Bs. {(t.price * exchangeRate).toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* TAB 6: GENERADOR DE REPORTES DE CUENTAS */}
          {activeTab === "reporte" && (
            <div className="bg-white rounded border border-border shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-bold text-secondary text-sm uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <BarChart2 size={16} className="text-secondary" /> Generador de Ajuste e Informes Financieros
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Construye cierres de cajas, exporta bases de datos tabulares, o emite estados impresos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans p-5 bg-slate-50 border rounded-sm">
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider mb-1">Rango Inicial</label>
                  <input type="date" className="p-2 border bg-white rounded w-full" value={reportRange.start} onChange={e=>setReportRange({...reportRange, start: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase font-mono tracking-wider mb-1">Rango Final</label>
                  <input type="date" className="p-2 border bg-white rounded w-full" value={reportRange.end} onChange={e=>setReportRange({...reportRange, end: e.target.value})} />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      alert("Compilando reportes consolidados del periodo...");
                    }} 
                    className="w-full py-2.5 bg-secondary hover:bg-slate-800 text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded"
                  >
                    CONSULTAR PERÍODO
                  </button>
                </div>
              </div>

              {/* Items listing */}
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] uppercase font-bold text-slate-500">Documentación disponible para exportación</h4>
                
                <div className="space-y-2.5">
                  {invoices.map(inv => (
                    <div key={inv.id} className="p-4 border rounded border-border bg-white hover:bg-slate-50/20 transition flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-secondary">{inv.controlNo}</span>
                          <span className={`text-[8.5px] font-mono px-1 rounded ${inv.isProforma ? "bg-amber-100 text-amber-900 border" : "bg-emerald-100 text-emerald-900 border"}`}>
                            {inv.isProforma ? "PROFORMA" : "FACTURA FISCAL SENIAT"}
                          </span>
                        </div>
                        <p className="text-foreground-muted mt-1 font-sans">Cliente: <span className="font-semibold text-slate-700">{inv.clientName}</span> | Buque: <span className="font-mono">{inv.vesselName}</span></p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveReceiptDoc(inv)}
                          className="px-3 py-1.5 bg-slate-100 border text-slate-700 hover:bg-slate-200 font-mono text-[10px] font-semibold uppercase rounded flex items-center gap-1 transition"
                        >
                          <Printer size={12} /> Ver / Imprimir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* 4. MODAL DETALLE DE FACTURA / PROFORMA FISCAL ( Venezuelan Format Preview ) */}
      {activeReceiptDoc && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex justify-center items-center overflow-y-auto p-4 md:p-8 animate-fade-in">
          <div className="bg-white max-w-2xl w-full rounded border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal header actions */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800 font-mono text-xs select-none">
              <span className="font-bold flex items-center gap-1">
                <FileText size={14} className="text-primary animate-pulse" />
                VISTA PREVIA DE DOCUMENTO FISCAL
              </span>
              <button 
                onClick={() => setActiveReceiptDoc(null)} 
                className="text-slate-400 hover:text-white font-extrabold text-sm focus:outline-none"
              >
                ✕ CERRAR
              </button>
            </div>

            {/* Simulated SENIAT Invoice Sheet */}
            <div className="p-8 overflow-y-auto flex-1 font-sans text-secondary leading-normal" id="printable-area-sheet">
              
              {/* Invoice header row */}
              <div className="flex justify-between border-b border-double border-slate-450 pb-5 gap-6">
                <div className="space-y-1">
                  <h3 className="font-black text-base text-secondary tracking-tight">SERVIPORT, C.A.</h3>
                  <p className="text-[10.5px] text-foreground-muted leading-tight max-w-xs font-sans">
                    Avenida Principal del Puerto, Edificio Sede Serviport, Puerto Cabello, Edo. Carabobo, Venezuela.<br />
                    RIF: J-30129482-1 • Tel: (0242) 361-9011
                  </p>
                </div>

                <div className="text-right border border-slate-350 p-3 bg-slate-50/50 rounded flex flex-col justify-between font-mono text-[10px]">
                  <p className="font-black text-primary uppercase text-xs">{activeReceiptDoc.isProforma ? "PROFORMA INVOICE" : "FACTURA FISCAL"}</p>
                  <div>
                    <p className="text-[10px] text-slate-500 mt-1">Control N°: <span className="text-slate-950 font-black">{activeReceiptDoc.controlNo}</span></p>
                    <p className="text-[10px] text-slate-500 leading-tight">Fecha: <span className="font-bold text-slate-900">{activeReceiptDoc.issueDate}</span></p>
                  </div>
                </div>
              </div>

              {/* Client detailed information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs font-sans leading-relaxed">
                <div>
                  <p className="font-bold uppercase text-[9px] text-slate-400 font-mono tracking-wider">Cliente Razon Social:</p>
                  <p className="font-bold text-secondary text-sm">{activeReceiptDoc.clientName}</p>
                  <p className="font-mono text-[10.5px] mt-0.5">Identificación Fiscal: <span className="font-bold">{activeReceiptDoc.clientRIF}</span></p>
                </div>

                <div>
                  <p className="font-bold uppercase text-[9px] text-slate-400 font-mono tracking-wider">Detalles de Operación Escala:</p>
                  <p className="font-semibold text-secondary font-mono">{activeReceiptDoc.vesselName}</p>
                  <p className="text-foreground-muted font-mono leading-none mt-1">Tasa Cambio BCV: <span className="font-bold text-slate-900">{activeReceiptDoc.exchangeRate.toFixed(4)} VES/USD</span></p>
                </div>
              </div>

              {/* Tabular Item details */}
              <div className="border border-slate-350 rounded overflow-hidden mt-4">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-350 font-mono text-[9px] uppercase">
                      <th className="py-2 px-4 font-bold">Concepto / Servicio Prestado</th>
                      <th className="py-2 px-4 text-center font-bold">Cant</th>
                      <th className="py-2 px-4 text-right font-bold">Base (USD)</th>
                      <th className="py-2 px-4 text-right font-bold">Monto (USD)</th>
                      <th className="py-2 px-4 text-right font-bold">Total (VES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeReceiptDoc.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/20 font-sans leading-tight">
                        <td className="py-2 px-4 font-semibold text-slate-600">{it.concept}</td>
                        <td className="py-2 px-4 text-center font-mono">{it.qty}</td>
                        <td className="py-2 px-4 text-right font-mono">${it.unitPrice.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right font-mono font-bold">${it.total.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right font-mono text-emerald-800 font-bold">Bs. {(it.total * activeReceiptDoc.exchangeRate).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fiscal invoice totals */}
              <div className="mt-5 border-t border-slate-300 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
                <div className="p-3.5 bg-slate-50 rounded border border-slate-200 max-w-xs leading-normal">
                  <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-600" /> Declaración Legal BCV
                  </p>
                  <p className="text-[10px] text-slate-600 font-sans italic mt-1 font-medium">
                    "Factura emitida en divisas con equivalencia fiscal legal en Bolívares conforme a la providencia del Banco Central de Venezuela."
                  </p>
                </div>

                <div className="space-y-1 text-right self-end bg-slate-900 text-white rounded p-4 shadow min-w-[200px]">
                  <div className="flex justify-between text-slate-300 text-[10px]">
                    <span>Base Imponible:</span>
                    <span>${activeReceiptDoc.subtotalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-[10px]">
                    <span>IVA (16.0%):</span>
                    <span>${activeReceiptDoc.taxUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between font-extrabold text-xs text-emerald-400 mt-2">
                    <span>TOTAL USD:</span>
                    <span>${activeReceiptDoc.totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 text-right mt-1 leading-none">
                    Bs. {activeReceiptDoc.totalVES.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VES
                  </div>
                </div>
              </div>

              <div className="pt-10 text-center text-slate-300 font-mono text-[9px] uppercase tracking-widest leading-none">
                •••• SERVIPORT C.A. — IMPRENTA FISCAL SIMULADA ••••
              </div>

            </div>

            {/* Modal actions footer printable trigger */}
            <div className="px-5 py-4 bg-slate-50 border-t border-border flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => setActiveReceiptDoc(null)}
                className="px-4 py-2 border border-slate-300 rounded font-mono text-xs font-bold text-slate-700 bg-white"
              >
                Cerrar vista
              </button>
              <button 
                onClick={() => {
                  generateFacturaFiscalPDF(activeReceiptDoc);
                }}
                className="px-4 py-2 bg-primary text-white font-mono text-xs font-black uppercase rounded shadow flex items-center gap-1"
              >
                <Printer size={13} /> Imprimir / PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
