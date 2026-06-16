import { useState, useEffect } from "react";
import { Truck, Search, CheckCircle, Navigation, CheckSquare } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";

interface EirOrder {
  id: string;
  eir: string;
  container: string;
  type: string;
  destination: string;
  window: string;
  status: string;
  placa: string;
}

export function TransportistaDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<EirOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
     fetchOrders();
  }, []);

  const fetchOrders = async () => {
     try {
        const snap = await getDocs(query(collection(db, "eir_orders")));
        setOrders(snap.docs.map(d => ({id: d.id, ...d.data()}) as EirOrder));
     } catch(e) {
        console.error(e);
     }
  };

  const handleComplete = async (id: string) => {
     try {
        await updateDoc(doc(db, "eir_orders", id), {
            status: "Completado"
        });
        fetchOrders();
     } catch(e) {
        console.error(e);
     }
  };

  const filteredOrders = orders.filter(o => 
     o.eir.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.container.toLowerCase().includes(searchTerm.toLowerCase()) ||
     o.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Transportista
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial || "Transportes C.A."} | RIF: {user?.rif || "J-12345678-9"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#0b1424] p-6 border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Truck size={100} className="text-primary" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">CITAS ASIGNADAS</p>
             <h3 className="text-4xl font-black relative z-10">{orders.filter(o => o.status !== "Completado").length}</h3>
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">ÓRDENES DE CARGA PENDIENTES</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar contenedor, placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="p-6">
           <div className="space-y-4">
               {filteredOrders.filter(o => o.status !== "Completado").length === 0 ? (
                 <div className="p-8 text-center border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm">
                   No hay órdenes de carga pendientes. Vaya al histórico de EIRs.
                 </div>
               ) : (
                 filteredOrders.filter(o => o.status !== "Completado").map(order => (
                   <div key={order.id} className="border border-slate-200 p-4 bg-slate-50 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                         <p className="font-bold text-secondary font-mono text-sm tracking-widest">{order.eir}</p>
                         <p className="text-sm font-bold text-slate-700 mt-1">Contenedor: {order.container} ({order.type})</p>
                         <p className="text-xs text-foreground-muted mt-1">Destino: {order.destination}</p>
                      </div>
                      <div className="text-left md:text-right flex flex-col items-start md:items-end gap-2">
                         <p className="text-xs tracking-widest font-mono text-slate-500 uppercase mb-1">Cita {order.window}</p>
                         <div className="flex items-center gap-2">
                           <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">{order.status}</span>
                           <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">Placa: {order.placa}</span>
                         </div>
                         <button onClick={() => handleComplete(order.id)} className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                            <CheckSquare size={14}/> Finalizar EIR
                         </button>
                      </div>
                   </div>
                 ))
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
