import { useState, useEffect } from "react";
import { Truck, Navigation, Search, CheckSquare } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";

export function TransportistaOrdenes() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const snap = await getDocs(query(collection(db, "eir_orders")));
      setOrders(snap.docs.map(d => ({id: d.id, ...d.data()})).filter(o => o.status !== "Completado"));
    } catch(e) {}
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
     o.container.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Órdenes de Carga</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestión de órdenes recibidas para movilizar contenedores en puerto o entregas locales.</p>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
         <div className="p-4 border-b border-border flex items-center relative gap-3 bg-slate-50">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por EIR, o Contenedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary ml-3 bg-white"
            />
         </div>
         <div className="divide-y divide-border">
           {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-sm">No hay órdenes pendientes.</div>
           ) : (
             filteredOrders.map(order => (
                <div key={order.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                   <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                         <Truck className="text-primary" size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-secondary font-mono text-sm">{order.eir}</p>
                         <p className="text-xs text-foreground-muted mt-0.5">Contenedor: <span className="font-bold text-secondary">{order.container}</span> ({order.type})</p>
                         <p className="text-xs font-mono mt-1 text-slate-500">Destino: {order.destination}</p>
                      </div>
                   </div>
                   <div className="text-left md:text-right flex flex-col items-start md:items-end gap-2">
                       <div className="flex items-center gap-2">
                         <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">{order.status}</span>
                         <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Placa: {order.placa}</span>
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
  );
}
