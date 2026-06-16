import { useState, useEffect } from "react";
import { PlusCircle, Search, Anchor, X, CheckSquare, Clock } from "lucide-react";
import { collection, query, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../contexts/AuthContext";

export function ArmadorHusbandry() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ vessel: "", serviceType: "Avituallamiento", details: "", expectedDate: "" });

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(query(collection(db, "husbandry_requests")));
      setRequests(snap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e) {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "husbandry_requests"), {
        ...formData,
        status: "Pendiente",
        armadorId: user?.uid,
        createdAt: new Date().toISOString()
      });
      setShowModal(false);
      setFormData({ vessel: "", serviceType: "Avituallamiento", details: "", expectedDate: "" });
      fetchRequests();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Husbandry y Servicios</h2>
            <p className="text-foreground-muted text-sm font-sans mt-1">Solicite servicios a la tripulación, avituallamiento, cambios de tripulantes y más.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <PlusCircle size={16} /> Crear Solicitud
          </button>
       </div>

       {requests.length === 0 ? (
         <div className="bg-white p-8 border border-border shadow-sm flex flex-col items-center justify-center text-center rounded-lg">
            <Anchor size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-secondary uppercase mb-2">Sin solicitudes activas</h3>
            <p className="text-foreground-muted text-sm max-w-md mx-auto mb-6">Administre provisiones, repuestos, atención médica, y tramitación migratoria para sus embarcaciones escaladas.</p>
            <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <PlusCircle size={16} /> Crear Solicitud de Servicio
            </button>
         </div>
       ) : (
         <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {requests.map(req => (
                 <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <p className="font-bold text-secondary font-mono text-sm">{req.serviceType}</p>
                       <p className="text-xs text-foreground-muted">Buque: <span className="font-bold text-secondary">{req.vessel}</span></p>
                       <p className="text-xs mt-1 text-slate-500">{req.details}</p>
                    </div>
                    <div className="text-left md:text-right">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest flex items-center gap-1 w-fit ml-auto ${req.status === 'Pendiente' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {req.status === 'Pendiente' ? <Clock size={12}/> : <CheckSquare size={12}/>} {req.status}
                       </span>
                       <p className="text-xs text-foreground-muted mt-2 font-mono">Fecha: {req.expectedDate}</p>
                    </div>
                 </div>
              ))}
            </div>
         </div>
       )}

       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Nueva Solicitud Husbandry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Buque</label>
                <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.vessel} onChange={e => setFormData({...formData, vessel: e.target.value})} />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Servicio</label>
                 <select required className="w-full border rounded p-2 text-sm" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
                    <option value="Avituallamiento">Avituallamiento (Provisiones)</option>
                    <option value="Agua Potable">Suminstro de Agua Potable</option>
                    <option value="Recolección Residuos">Recolección de Residuos (MARPOL)</option>
                    <option value="Cambio Tripulación">Cambio de Tripulación</option>
                    <option value="Atención Médica">Atención Médica</option>
                 </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Esperada</label>
                <input required type="date" className="w-full border rounded p-2 text-sm" value={formData.expectedDate} onChange={e => setFormData({...formData, expectedDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Detalles / Requerimientos</label>
                <textarea required className="w-full border rounded p-2 text-sm" rows={3} value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm font-bold">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded text-sm font-bold flex items-center gap-1"><PlusCircle size={16}/> Enviar Solicitud</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
