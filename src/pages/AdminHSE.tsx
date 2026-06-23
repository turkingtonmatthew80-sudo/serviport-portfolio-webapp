import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock, Printer, Plus } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";
import { generateHSEIncidentPDF } from "../lib/pdfGenerator";
import { logAuditAction } from "../lib/audit";

interface Incident {
  id: string;
  category: string;
  zone: string;
  description: string;
  actionTaken: string;
  reporter: string;
  timestamp: string;
  port: string;
}

export function AdminHSE() {
  const { adminUser } = useAdminAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [formCategory, setFormCategory] = useState("ISPS");
  const [formZone, setFormZone] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAction, setFormAction] = useState("");

  useEffect(() => {
    loadIncidents();
  }, [adminUser]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      let q = collection(db, "hse_incidents");
      if (adminUser?.port !== "GLOBAL") {
        q = query(collection(db, "hse_incidents"), where("port", "==", adminUser?.port), orderBy("timestamp", "desc")) as any;
      }
      const snap = await getDocs(q);
      const list: Incident[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as Incident);
      });
      setIncidents(list);
    } catch (e) {
      console.error("Error loading HSE incidents:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        category: formCategory,
        zone: formZone,
        description: formDescription,
        actionTaken: formAction,
        reporter: adminUser?.name || "Personal HSE",
        timestamp: new Date().toISOString(),
        port: adminUser?.port === "GLOBAL" ? "Puerto Cabello" : (adminUser?.port || "Puerto Cabello")
      };
      const docRef = await addDoc(collection(db, "hse_incidents"), data);
      await logAuditAction(`Reportó incidente HSE: ${formCategory}`, adminUser?.role, adminUser?.email);
      
      setIncidents([{ id: docRef.id, ...data }, ...incidents]);
      setIsFormOpen(false);
      setFormZone("");
      setFormDescription("");
      setFormAction("");
    } catch (err) {
      console.error(err);
      alert("Error al registrar incidente.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
            <Shield className="text-emerald-600" size={32} />
            Control de Incidentes HSE
          </h2>
          <p className="text-foreground-muted font-mono mt-1">
            Seguridad industrial, salud y ambiente (ISPS / MARPOL) en {adminUser?.port}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-mono text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> NUEVO REPORTE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-200 p-6 shadow-sm rounded flex flex-col items-center justify-center text-center">
            <CheckCircle className="text-emerald-500 mb-2" size={48} />
            <h3 className="font-black text-emerald-900 font-mono tracking-widest text-2xl">412 DÍAS</h3>
            <p className="text-emerald-700 text-xs font-bold uppercase mt-1">Sin accidentes con pérdida de tiempo</p>
        </div>

        <div className="bg-white p-6 border border-border shadow-sm col-span-2 relative">
           <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">REPORTE DE INCIDENCIAS</h3>
           
           {loading ? (
             <p className="text-sm font-mono text-slate-500">Cargando reportes...</p>
           ) : incidents.length === 0 ? (
             <div className="text-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm">
               Sin incidentes registrados.
             </div>
           ) : (
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {incidents.map(inc => (
                  <div key={inc.id} className="border border-orange-200 bg-orange-50/30 p-4 rounded flex items-start gap-4">
                      <div className="bg-orange-100 p-2 text-orange-600 rounded">
                         <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-bold text-orange-900 font-mono">{inc.description}</h4>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 border border-orange-200 px-2 py-0.5 rounded">{inc.category}</span>
                          </div>
                          <p className="text-sm text-orange-800 mt-1">Zona: {inc.zone}. Acción: {inc.actionTaken}</p>
                          <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-orange-500 font-mono flex items-center gap-1"><Clock size={12}/> {new Date(inc.timestamp).toLocaleString()}</p>
                            <button 
                                onClick={() => generateHSEIncidentPDF(inc)}
                                className="flex items-center gap-1 text-[10px] font-mono uppercase bg-white border border-orange-200 text-orange-700 px-2 py-1 rounded hover:bg-orange-100 font-bold"
                            >
                                <Printer size={12}/> IMPRIMIR
                            </button>
                          </div>
                      </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded max-w-lg w-full p-6 shadow-xl border border-border">
                <h3 className="font-bold font-mono text-secondary text-lg mb-4">Declaración de Incidente</h3>
                <form onSubmit={handleCreateIncident} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categoría</label>
                        <select className="w-full border border-border p-2 rounded" value={formCategory} onChange={e=>setFormCategory(e.target.value)}>
                            <option value="ISPS">Protección ISPS</option>
                            <option value="MARPOL">Ambiental MARPOL</option>
                            <option value="Laboral">Seguridad Laboral</option>
                            <option value="Operativo">Incidente Operativo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Zona</label>
                        <input className="w-full border border-border p-2 rounded" required value={formZone} onChange={e=>setFormZone(e.target.value)} placeholder="Ej: Patio B" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Descripción del Evento</label>
                        <textarea className="w-full border border-border p-2 rounded h-24" required value={formDescription} onChange={e=>setFormDescription(e.target.value)}></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Medidas Tomadas</label>
                        <textarea className="w-full border border-border p-2 rounded h-20" required value={formAction} onChange={e=>setFormAction(e.target.value)}></textarea>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-slate-300 rounded font-mono text-xs font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-secondary text-white rounded font-mono text-xs font-bold">Registrar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
