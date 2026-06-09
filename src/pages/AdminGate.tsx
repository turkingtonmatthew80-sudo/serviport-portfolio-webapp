import { useState, useEffect } from "react";
import { Camera, Truck, ArrowRight, Save, Loader2, CheckCircle2, ScanLine, Cpu } from "lucide-react";
import { motion } from "motion/react";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export function AdminGate() {
  const { adminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"gate-in" | "gate-out" | "historial">("gate-in");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [placa, setPlaca] = useState("");
  const [cedula, setCedula] = useState("");
  const [booking, setBooking] = useState("");
  const [container, setContainer] = useState("");
  
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === "historial") {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
     setIsLoadingHistory(true);
     try {
       const q = query(collection(db, "gate_events"), orderBy("timestamp", "desc"), limit(20));
       const snap = await getDocs(q);
       const loaded: any[] = [];
       snap.forEach(doc => loaded.push({ id: doc.id, ...doc.data() }));
       setHistory(loaded);
     } catch(err) {
       console.error("Error loading history", err);
     } finally {
       setIsLoadingHistory(false);
     }
  };

  const handleProcess = async (e: React.FormEvent, gateType: string = "IN") => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "gate_events"), {
        type: gateType,
        placa: placa.toUpperCase(),
        cedula,
        booking: booking.toUpperCase(),
        container: container.toUpperCase(),
        timestamp: serverTimestamp(),
      });
      await logAuditAction(`Registró Gate-${gateType} (Vehículo ${placa.toUpperCase()})`, adminUser?.role, adminUser?.email);
      setSuccess(true);
      setPlaca(""); setCedula(""); setBooking(""); setContainer("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(`Error processing gate ${gateType}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Gate Control</h2>
        <p className="text-foreground-muted text-sm font-sans mt-1">Registro y validación de entradas/salidas de transportistas del puerto.</p>
      </div>

      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("gate-in")}
          className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors uppercase font-mono ${
            activeTab === "gate-in" ? "text-primary border-b-2 border-primary" : "text-foreground-muted hover:text-secondary"
          }`}
        >
          Registro Entrada (Gate-In)
        </button>
        <button
          onClick={() => setActiveTab("gate-out")}
          className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors uppercase font-mono ${
            activeTab === "gate-out" ? "text-primary border-b-2 border-primary" : "text-foreground-muted hover:text-secondary"
          }`}
        >
          Registro Salida (Gate-Out)
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors uppercase font-mono ${
            activeTab === "historial" ? "text-primary border-b-2 border-primary" : "text-foreground-muted hover:text-secondary"
          }`}
        >
          Tráfico Hoy
        </button>
      </div>

      {activeTab === "gate-in" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded border border-border shadow-sm overflow-hidden">
             <div className="px-6 py-4 bg-background-muted border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono">Revisión de Entrada</h3>
                <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">Nuevo</span>
             </div>
             <form onSubmit={handleProcess} className="p-6 space-y-5">
               {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2 rounded">
                    <CheckCircle2 size={16} /> GATE-IN REGISTRADO EN BDD EXITOSAMENTE.
                  </div>
               )}
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">Placa Vehículo</label>
                   <input required value={placa} onChange={e=>setPlaca(e.target.value)} type="text" className="w-full px-3 py-2 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary font-mono text-sm uppercase" placeholder="A12BC3D" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">Cédula Conductor</label>
                   <input required value={cedula} onChange={e=>setCedula(e.target.value)} type="text" className="w-full px-3 py-2 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary font-mono text-sm" placeholder="V-12345678" />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">Booking / Documento</label>
                  <input required value={booking} onChange={e=>setBooking(e.target.value)} type="text" className="w-full px-3 py-2 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary font-mono text-sm uppercase" placeholder="BKG-89012" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">ID Contenedor (Opcional si es retiro)</label>
                  <input value={container} onChange={e=>setContainer(e.target.value)} type="text" className="w-full px-3 py-2 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary font-mono text-sm uppercase" placeholder="MSKU..." />
               </div>

               <div className="pt-4 border-t border-border">
                  <button type="button" className="w-full flex justify-center items-center gap-2 px-4 py-3 border-2 border-dashed border-border bg-slate-50 hover:bg-slate-100 text-foreground-muted font-bold font-mono text-xs uppercase rounded transition-colors mb-4">
                    <Camera size={16} /> Capturar Fotografía
                  </button>
                  <button type="submit" disabled={isLoading || success} className="w-full justify-center flex items-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest font-mono text-sm uppercase rounded transition-colors disabled:opacity-50 shadow-sm">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    Procesar Gate-In
                  </button>
               </div>
             </form>
          </div>

          <div className="bg-white rounded border border-border shadow-sm p-6 flex flex-col items-center justify-center text-center">
             <div className="bg-slate-50 border border-slate-200 outline-dashed outline-1 outline-slate-300 outline-offset-4 rounded-full p-8 text-slate-300 mb-6">
                <Truck size={64} />
             </div>
             <h3 className="font-bold text-secondary text-lg mb-2">Monitor OCR Directo</h3>
             <p className="text-sm text-foreground-muted">Integración con cámaras de carril en desarrollo.</p>
          </div>
        </motion.div>
      )}

      {activeTab === "historial" && (
         <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead>
                  <tr className="bg-background-muted text-foreground-muted border-b border-border uppercase tracking-wider text-[10px] font-mono">
                     <th className="px-6 py-4 font-bold">Tipo</th>
                     <th className="px-6 py-4 font-bold">Placa</th>
                     <th className="px-6 py-4 font-bold">Cédula</th>
                     <th className="px-6 py-4 font-bold">Documento</th>
                     <th className="px-6 py-4 font-bold">Fecha</th>
                     <th className="px-6 py-4 font-bold text-right">EIR</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {isLoadingHistory ? (
                     <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="animate-spin text-primary inline-block" /></td></tr>
                  ) : history.length > 0 ? history.map(h => (
                     <tr key={h.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded font-bold text-[10px] uppercase font-mono ${h.type === 'IN' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>{h.type}</span></td>
                        <td className="px-6 py-4 font-bold font-mono">{h.placa}</td>
                        <td className="px-6 py-4 text-foreground-muted">{h.cedula}</td>
                        <td className="px-6 py-4 font-mono font-bold text-secondary">{h.booking}</td>
                        <td className="px-6 py-4 font-mono text-xs text-foreground-muted">{(h.timestamp?.toDate() || new Date()).toLocaleString('es-VE')}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => alert(`Vista previa del EIR-${h.id.substring(0,6).toUpperCase()} no implementada en este prototipo, pero disponible para descargar en PDF.`)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-border text-foreground-muted rounded text-[10px] font-mono font-bold">VER EIR</button>
                        </td>
                     </tr>
                  )) : (
                     <tr><td colSpan={6} className="p-8 text-center font-mono text-xs text-foreground-muted uppercase tracking-widest border border-dashed border-border bg-slate-50 m-4 rounded">Sin eventos registrados en BDD para hoy</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === "gate-out" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded border border-border shadow-sm overflow-hidden">
             <div className="px-6 py-4 bg-background-muted border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono">Revisión de Salida</h3>
                <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">Nuevo</span>
             </div>
             <form onSubmit={(e) => handleProcess(e, "OUT")} className="p-6 space-y-5">
               {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2 rounded">
                    <CheckCircle2 size={16} /> GATE-OUT REGISTRADO EN BDD EXITOSAMENTE.
                  </div>
               )}
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">Placa Vehículo</label>
                   <input required value={placa} onChange={e=>setPlaca(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-sm uppercase font-mono outline-none focus:border-primary" placeholder="Ej. A12B34C" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">CI / Identidad</label>
                   <input required value={cedula} onChange={e=>setCedula(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-sm font-mono outline-none focus:border-primary" placeholder="Ej. V-12345678" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">N° de EIR / Release Order</label>
                 <input required value={booking} onChange={e=>setBooking(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-sm uppercase font-mono outline-none focus:border-primary" placeholder="Ej. EIR-99381" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-foreground-muted mb-1 uppercase font-mono">Contenedor Retirado (Opcional)</label>
                 <input value={container} onChange={e=>setContainer(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-sm uppercase font-mono outline-none focus:border-primary" placeholder="Ej. GATU8765432" />
               </div>

               <button disabled={isLoading} type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded uppercase tracking-widest text-xs font-mono transition-colors shadow-sm disabled:opacity-50">
                 {isLoading ? "PROCESANDO..." : "REGISTRAR SALIDA Y EMITIR EIR"}
               </button>
             </form>
          </div>

          {/* OCR Panel Mock UI (Consistent Design) */}
          <div className="bg-slate-900 rounded border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 opacity-50"></div>
             
             <div className="relative z-10 w-full mb-6">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                   <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Cámara Gate-Out</span>
                   <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> REC</span>
                </div>
                <div className="aspect-video bg-black rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center shadow-inner">
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                   
                   <ScanLine className="text-primary w-12 h-12 opacity-50 animate-pulse absolute" />
                   
                   <div className="absolute left-1/4 right-1/4 top-1/4 bottom-1/4 border-2 border-primary/40 rounded-sm">
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-primary"></div>
                   </div>
                </div>
             </div>

             <div className="relative z-10 w-full bg-slate-800/80 backdrop-blur rounded p-4 border border-slate-700">
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
                  <Cpu size={12} /> Lectura LPR / OCR Interna
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] text-slate-500 uppercase font-mono">Placa Vehículo</p>
                     <p className="text-white font-mono font-bold">{placa ? placa.toUpperCase() : "ESPERANDO..."}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-500 uppercase font-mono">Contenedor</p>
                     <p className="text-white font-mono font-bold">{container ? container.toUpperCase() : "---"}</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
