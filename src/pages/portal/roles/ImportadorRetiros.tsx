import { useState, useEffect } from "react";
import { Truck, CheckCircle2, Clock, PlusCircle, X } from "lucide-react";
import { collection, query, addDoc, getDocs, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../contexts/AuthContext";

export function ImportadorRetiros() {
  const { user } = useAuth();
  const [retiros, setRetiros] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ container: "", transportista: "", fechaRetiro: "" });

  useEffect(() => {
    fetchRetiros();
  }, [user]);

  const fetchRetiros = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(query(collection(db, "retiro_requests"), where("importadorId", "==", user.id)));
      setRetiros(snap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e) {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "retiro_requests"), {
        ...formData,
        status: "Programado",
        importadorId: user?.id,
        createdAt: new Date().toISOString()
      });
      setShowModal(false);
      setFormData({ container: "", transportista: "", fechaRetiro: "" });
      fetchRetiros();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Programación de Retiros</h2>
            <p className="text-foreground-muted text-sm font-sans mt-1">Gestione y agende el retiro de su carga con las empresas de transporte.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <PlusCircle size={16} /> Programar Retiro
          </button>
       </div>

       {retiros.length === 0 ? (
         <div className="bg-white border border-border shadow-sm rounded-lg p-8 text-center">
              <Truck className="mx-auto h-12 w-12 text-slate-200 mb-4" />
              <p className="font-bold text-secondary font-mono tracking-widest uppercase mb-2">No hay retiros programados</p>
              <p className="text-sm text-foreground-muted max-w-md mx-auto mb-6">
                 Los contenedores deben cumplir con el levante de aduanas y el pago de almacenaje/demurrage respectivo antes de poder agendar su retiro en garita.
              </p>
              <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto">
                <PlusCircle size={16} /> Agendar Retiro
              </button>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {retiros.map(ret => (
             <div key={ret.id} className="bg-white border border-border shadow-sm rounded-lg p-5">
               <div className="flex items-center justify-between border-b pb-3 mb-3">
                 <p className="font-bold text-secondary font-mono flex items-center gap-2">
                   <Truck size={18} className="text-blue-500" />
                   Contenedor: {ret.container}
                 </p>
                 <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${ret.status === 'Programado' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                   {ret.status === 'Programado' ? <Clock size={12}/> : <CheckCircle2 size={12}/>} {ret.status}
                 </span>
               </div>
               <div className="space-y-2">
                 <p className="text-sm"><span className="text-slate-500">Transporte Asignado:</span> <span className="font-bold">{ret.transportista}</span></p>
                 <p className="text-sm"><span className="text-slate-500">Fecha Retiro:</span> <span className="font-mono">{ret.fechaRetiro}</span></p>
               </div>
             </div>
           ))}
         </div>
       )}

       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Agendar Retiro</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">N° Contenedor / BL</label>
                <input required type="text" className="w-full border rounded p-2 text-sm font-mono uppercase" value={formData.container} onChange={e => setFormData({...formData, container: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Empresa de Transporte</label>
                <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.transportista} onChange={e => setFormData({...formData, transportista: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Día y Hora de Retiro</label>
                <input required type="datetime-local" className="w-full border rounded p-2 text-sm" value={formData.fechaRetiro} onChange={e => setFormData({...formData, fechaRetiro: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm font-bold">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded text-sm font-bold flex items-center gap-1"><PlusCircle size={16}/> Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
