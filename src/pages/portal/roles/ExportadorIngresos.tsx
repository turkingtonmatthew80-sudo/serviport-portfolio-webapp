import { useState, useEffect } from "react";
import { Package, PlusCircle, X, CheckCircle, Clock } from "lucide-react";
import { collection, query, addDoc, getDocs, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../contexts/AuthContext";

export function ExportadorIngresos() {
  const { user } = useAuth();
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ bultos: "", vehiculo: "", horaEstimada: "", descripcion: "" });

  useEffect(() => {
    fetchIngresos();
  }, [user]);

  const fetchIngresos = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(query(collection(db, "anuncios_ingreso"), where("exportadorId", "==", user.uid)));
      setIngresos(snap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e) {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "anuncios_ingreso"), {
        ...formData,
        status: "Anunciado",
        exportadorId: user?.uid,
        createdAt: new Date().toISOString()
      });
      setShowModal(false);
      setFormData({ bultos: "", vehiculo: "", horaEstimada: "", descripcion: "" });
      fetchIngresos();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Ingresos al Almacén</h2>
            <p className="text-foreground-muted text-sm font-sans mt-1">Gestione la recepción y consolidación de su carga de exportación en los patios.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <PlusCircle size={16} /> Anunciar Ingreso
          </button>
       </div>

       {ingresos.length === 0 ? (
         <div className="bg-white p-8 border border-border shadow-sm flex flex-col items-center justify-center text-center rounded-lg">
            <Package size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-secondary uppercase mb-2">Ingresos Pendientes</h3>
            <p className="text-foreground-muted text-sm max-w-md mx-auto mb-6">Declare la cantidad de bultos a ingresar, vehículo de transporte, y hora estimada para agilizar la garita.</p>
            <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <PlusCircle size={16} /> Anunciar Ingreso
            </button>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {ingresos.map(ing => (
             <div key={ing.id} className="bg-white border border-border shadow-sm rounded-lg p-5">
               <div className="flex items-center justify-between border-b pb-3 mb-3">
                 <p className="font-bold text-secondary font-mono flex items-center gap-2">
                   <Package size={18} className="text-blue-500" />
                   {ing.bultos} Bultos
                 </p>
                 <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${ing.status === 'Anunciado' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                   {ing.status === 'Anunciado' ? <Clock size={12}/> : <CheckCircle size={12}/>} {ing.status}
                 </span>
               </div>
               <div className="space-y-2">
                 <p className="text-sm"><span className="text-slate-500">Vehículo:</span> <span className="font-bold">{ing.vehiculo}</span></p>
                 <p className="text-sm"><span className="text-slate-500">ETA / Cita:</span> <span className="font-mono">{ing.horaEstimada}</span></p>
                 <p className="text-sm"><span className="text-slate-500">Mercancía:</span> {ing.descripcion}</p>
               </div>
             </div>
           ))}
         </div>
       )}

       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Anunciar Ingreso de Carga</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cant. Bultos / Peso</label>
                  <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.bultos} onChange={e => setFormData({...formData, bultos: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Placa Vehículo</label>
                  <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.vehiculo} onChange={e => setFormData({...formData, vehiculo: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora Estimada LLegada (ETA)</label>
                <input required type="datetime-local" className="w-full border rounded p-2 text-sm" value={formData.horaEstimada} onChange={e => setFormData({...formData, horaEstimada: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción de Carga</label>
                <textarea required className="w-full border rounded p-2 text-sm" rows={2} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm font-bold">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-bold flex items-center gap-1"><PlusCircle size={16}/> Confirmar y Anunciar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
