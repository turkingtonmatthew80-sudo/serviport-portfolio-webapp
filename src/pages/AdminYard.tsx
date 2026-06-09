import { useState, useEffect } from "react";
import { Maximize2, Map, Layers, Crosshair, Box, Loader2 } from "lucide-react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

interface Patio {
  id: string;
  name: string;
  capacity: number;
  current: number;
  status: string;
}

export function AdminYard() {
  const { adminUser } = useAdminAuth();
  const [selectedPatio, setSelectedPatio] = useState<string | null>(null);
  
  const [patios, setPatios] = useState<Patio[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [newContainerRef, setNewContainerRef] = useState("");
  const [newOrigin, setNewOrigin] = useState("");

  const loadYardData = async () => {
    try {
      const snap = await getDocs(collection(db, "patios"));
      const movSnap = await getDocs(collection(db, "yard_movements"));
      
      const loadedPatios: Patio[] = [];
      snap.forEach(doc => loadedPatios.push({ id: doc.id, ...doc.data() } as Patio));
      setPatios(loadedPatios);

      const loadedMovs: any[] = [];
      movSnap.forEach(doc => loadedMovs.push({ id: doc.id, ...doc.data() }));
      setMovements(loadedMovs.filter(m => m.status !== "COMPLETED"));
    } catch (err) {
      console.error("Error loading yard DB", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadYardData();
  }, []);

  const getPatio = (id: string) => patios.find(p => p.id === id);

  const assignMovementPosition = async (id: string, ref: string) => {
    if (!selectedPatio) {
      alert("Please select a patio (A, B, C or AGD) first.");
      return;
    }
    setIsProcessing(id);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "yard_movements", id), { destination: `PATIO ${selectedPatio}` });
      await logAuditAction(`Asignó PATIO ${selectedPatio} a orden ${ref}`, adminUser?.role, adminUser?.email);
      loadYardData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  const createMovementOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatio) {
      alert("Please select a destination patio (A, B, C or AGD) first.");
      return;
    }
    setIsProcessing("new");
    try {
       await addDoc(collection(db, "yard_movements"), {
         reference: newContainerRef.toUpperCase(),
         origin: newOrigin.toUpperCase(),
         destination: `PATIO ${selectedPatio}`,
         status: "PENDIENTE",
         type: "TRASLADO DE CONTENEDOR",
         timestamp: serverTimestamp()
       });
       await logAuditAction(`Creó orden estiba a PATIO ${selectedPatio} para ${newContainerRef.toUpperCase()}`, adminUser?.role, adminUser?.email);
       setNewContainerRef("");
       setNewOrigin("");
       loadYardData();
    } catch (e) {
       console.error(e);
    } finally {
       setIsProcessing(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Terminal Operating System (TOS)</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Planificador de Patio 2D (Yard Planner)</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-border p-2 rounded shadow-sm">
          <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-50 text-secondary rounded text-xs font-bold font-mono">
             <Maximize2 size={16} /> PANTALLA COMPLETA
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Panel Izquierdo: Mapa 2D */}
        <div className="flex-[2] bg-white border border-border rounded shadow-sm flex flex-col overflow-hidden relative">
           <div className="absolute top-4 left-4 z-10 flex gap-2">
             <div className="bg-white/90 backdrop-blur-sm border border-border p-1.5 rounded shadow-sm flex gap-1">
                <button className="p-1.5 bg-background-muted text-secondary hover:bg-primary/10 hover:text-primary rounded"><Map size={18} /></button>
                <button className="p-1.5 bg-white text-foreground-muted hover:bg-primary/10 hover:text-primary rounded"><Layers size={18} /></button>
             </div>
           </div>

           {/* Representación esquemática del mapa */}
           <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center p-8">
              <div className="w-full h-full border-2 border-slate-200 border-dashed rounded flex flex-col items-center justify-center text-slate-300 relative">
                 
                 {isLoading ? (
                    <Loader2 className="animate-spin text-primary" size={32} />
                 ) : (
                   <>
                     {/* Zonas Dibujadas */}
                     <div className="absolute inset-8 grid grid-cols-3 gap-4 pb-20">
                        <div onClick={() => setSelectedPatio("A")} className={`border-2 rounded bg-slate-100/50 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedPatio === "A" ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'}`}>
                          <span className="font-bold text-secondary font-mono tracking-widest">PATIO A</span>
                          <span className="text-xs font-mono text-foreground-muted">EXP</span>
                        </div>
                        <div onClick={() => setSelectedPatio("B")} className={`border-2 rounded bg-slate-100/50 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedPatio === "B" ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'}`}>
                          <span className="font-bold text-secondary font-mono tracking-widest">PATIO B</span>
                          <span className="text-xs font-mono text-foreground-muted">IMP</span>
                        </div>
                        <div onClick={() => setSelectedPatio("C")} className={`border-2 rounded bg-slate-100/50 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedPatio === "C" ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'}`}>
                          <span className="font-bold text-secondary font-mono tracking-widest">PATIO C</span>
                          <span className="text-xs font-mono text-foreground-muted">MTY</span>
                        </div>
                     </div>

                     {/* AGD Zone */}
                     <div onClick={() => setSelectedPatio("AGD")} className={`absolute bottom-8 left-8 right-8 h-16 border-2 rounded bg-orange-50/50 flex items-center justify-center cursor-pointer transition-colors ${selectedPatio === "AGD" ? 'border-orange-500 bg-orange-100/50' : 'border-orange-200 hover:border-orange-300'}`}>
                        <span className="font-bold text-orange-800 font-mono tracking-widest">ALMACÉN GENERAL DE DEPÓSITO (AGD)</span>
                     </div>
                   </>
                 )}

              </div>
           </div>
        </div>

        {/* Panel Derecho: Detalles e Inspección */}
        <div className="flex-1 bg-white border border-border rounded shadow-sm flex flex-col min-h-0 overflow-hidden">
           <div className="p-4 border-b border-border bg-background-muted flex items-center justify-between">
              <h3 className="font-bold text-secondary text-sm uppercase tracking-widest font-mono">
                 {selectedPatio ? `Inspector: ${selectedPatio}` : "Inspector General"}
              </h3>
              <Crosshair size={18} className="text-primary" />
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {!selectedPatio ? (
                 <div className="text-center text-foreground-muted py-12">
                   <Map className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                   <p className="text-sm font-mono">Haz clic en un patio del mapa para ver los detalles y ordenar movimientos.</p>
                 </div>
              ) : (
                 <>
                   <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-foreground-muted uppercase">Ocupación Actual</span>
                        <span className="text-xs font-bold font-mono text-secondary">
                          {getPatio(selectedPatio)?.current || 0} / {getPatio(selectedPatio)?.capacity || 0}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 relative">
                        <div className="bg-primary h-2 rounded-full absolute top-0 left-0" style={{ width: `${(getPatio(selectedPatio)?.current || 0) / (getPatio(selectedPatio)?.capacity || 1) * 100}%` }}></div>
                        {(!getPatio(selectedPatio) || getPatio(selectedPatio)?.capacity === 0) && <p className="absolute -bottom-5 right-0 text-[10px] text-red-500 font-mono">0 DB RECORDS</p>}
                      </div>
                   </div>

                     <div className="mb-4">
                       <h4 className="font-bold text-xs text-foreground-muted uppercase mb-3">Crear Orden de Movimiento</h4>
                       <form onSubmit={createMovementOrder} className="bg-blue-50 border border-blue-100 p-3 rounded space-y-3">
                          <div>
                             <input required value={newContainerRef} onChange={e=>setNewContainerRef(e.target.value)} className="w-full text-xs font-mono px-2 py-1.5 border border-blue-200 rounded uppercase outline-none focus:border-primary" placeholder="CONTENEDOR REF..." />
                          </div>
                          <div>
                             <input required value={newOrigin} onChange={e=>setNewOrigin(e.target.value)} className="w-full text-xs font-mono px-2 py-1.5 border border-blue-200 rounded uppercase outline-none focus:border-primary" placeholder="ORIGEN (EJ. GATE / MUELLE 1)" />
                          </div>
                          <div>
                             <p className="text-[10px] text-blue-700 font-mono mb-1 uppercase tracking-widest">Destino: PATIO {selectedPatio}</p>
                             <button disabled={isProcessing === "new"} type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold p-1.5 rounded text-[10px] tracking-widest uppercase transition-colors">
                               {isProcessing === "new" ? <Loader2 size={12} className="animate-spin mx-auto" /> : "CREAR ORDEN"}
                             </button>
                          </div>
                       </form>
                     </div>

                   <div>
                     <h4 className="font-bold text-xs text-foreground-muted uppercase mb-3">Movimientos Pendientes (Cola)</h4>
                     <div className="space-y-2">
                        {movements.length > 0 ? movements.map(m => (
                           <div key={m.id} className="flex items-center justify-between p-3 border border-border rounded text-sm group hover:border-primary transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                <Box size={16} className="text-primary" />
                                <div>
                                  <p className="font-mono font-bold text-secondary">{m.reference}</p>
                                  <p className="text-[10px] text-foreground-muted uppercase">Origen: {m.origin}</p>
                                </div>
                              </div>
                              <button disabled={isProcessing === m.id} onClick={() => assignMovementPosition(m.id, m.reference)} className="text-[10px] font-bold bg-primary text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50">
                                {isProcessing === m.id ? <Loader2 size={12} className="animate-spin mx-auto" /> : "ASIGNAR POSICIÓN"}
                              </button>
                           </div>
                        )) : (
                           <div className="p-4 border border-dashed text-center rounded border-border text-xs text-foreground-muted font-mono uppercase tracking-widest mt-4">
                             Sin movimientos en cola en la base de datos
                           </div>
                        )}
                     </div>
                   </div>
                 </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
