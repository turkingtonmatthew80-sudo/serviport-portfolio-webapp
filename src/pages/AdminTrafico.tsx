import { useState, useEffect } from "react";
import { Truck, MapPin, Search, CalendarClock, ShieldCheck, User, Package, Filter, CheckCircle2, Factory, Clock } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface TransportOrder {
  id: string;
  contractor: string;
  driverName: string;
  plate: string;
  containerId: string;
  status: "ASIGNADO" | "EN_CAMINO" | "EN_PUERTO" | "RECOGIDO" | "ENTREGADO";
  appointmentTime: string;
  origin: string;
  destination: string;
}

export function AdminTrafico() {
  const { adminUser } = useAdminAuth();
  const [orders, setOrders] = useState<TransportOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    // Generate some mock orders representing traffic for this port
    const mockOrders: TransportOrder[] = [
      { id: "TRF-819", contractor: "Transportes Lider C.A.", driverName: "Luis Perez", plate: "A12BC3D", containerId: "MRKU1234567", status: "EN_CAMINO", appointmentTime: "14:00", origin: "Caracas", destination: "Puerto Cabello" },
      { id: "TRF-820", contractor: "Carga Pesada Vzla", driverName: "Mario Ruiz", plate: "X98YZ7F", containerId: "MSCU8882910", status: "EN_PUERTO", appointmentTime: "10:30", origin: "Valencia", destination: "Puerto Cabello" },
      { id: "TRF-821", contractor: "Logistica SUR", driverName: "Ana Gomez", plate: "C44DF1H", containerId: "ZIMU7738210", status: "ASIGNADO", appointmentTime: "16:00", origin: "Barquisimeto", destination: "Puerto Cabello" },
      { id: "TRF-822", contractor: "Transportes Lider C.A.", driverName: "Carlos Toro", plate: "B55TR9W", containerId: "EVER1155998", status: "RECOGIDO", appointmentTime: "09:00", origin: "Puerto Cabello", destination: "Maracay" },
      { id: "TRF-823", contractor: "Carga Pesada Vzla", driverName: "Hector Bello", plate: "H22JK4L", containerId: "HLCU4455221", status: "ENTREGADO", appointmentTime: "08:00", origin: "Puerto Cabello", destination: "Valencia" }
    ];
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filterStatus !== "ALL" && o.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return o.plate.toLowerCase().includes(term) || o.containerId.toLowerCase().includes(term) || o.contractor.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
         <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
               <Truck className="text-primary" size={32} />
               Control de Tráfico y Transporte
            </h2>
            <p className="text-foreground-muted font-mono mt-1">
               Coordinación de contratistas, despachos terrestres y acceso a {adminUser?.port || "Puerto Cabello"}
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-6 border border-border shadow-sm flex flex-col gap-6">
           <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-primary font-mono"
                   placeholder="Buscar por Placa, Contenedor, Contratista..."
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <select 
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-primary font-bold text-secondary cursor-pointer"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                 >
                    <option value="ALL">TODOS LOS ESTADOS</option>
                    <option value="ASIGNADO">ASIGNADOS</option>
                    <option value="EN_CAMINO">EN CAMINO (Ruta)</option>
                    <option value="EN_PUERTO">EN PUERTO (Garita)</option>
                    <option value="RECOGIDO">CON CARGA (Tránsito)</option>
                    <option value="ENTREGADO">ENTREGADOS (Destino)</option>
                 </select>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b-2 border-slate-200">
                       <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Orden / Cita</th>
                       <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Contratista</th>
                       <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Unidad / Chofer</th>
                       <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Contenedor</th>
                       <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Ruta</th>
                       <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Estado actual</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-2">
                             <p className="font-bold text-secondary font-mono text-sm">{o.id}</p>
                             <p className="text-[10px] text-primary flex items-center gap-1 font-bold mt-1">
                                <Clock size={12} /> {o.appointmentTime}
                             </p>
                          </td>
                          <td className="py-3 px-2">
                             <p className="font-bold text-slate-700 text-xs">{o.contractor}</p>
                          </td>
                          <td className="py-3 px-2">
                             <p className="font-bold text-blue-700 text-xs tracking-wider flex items-center gap-1">
                                <Truck size={12} className="text-slate-400" /> {o.plate}
                             </p>
                             <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><User size={10} /> {o.driverName}</p>
                          </td>
                          <td className="py-3 px-2">
                             <p className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-flex border border-slate-200">
                                <Package size={12} className="mr-1 text-slate-400" /> {o.containerId}
                             </p>
                          </td>
                          <td className="py-3 px-2 text-xs font-sans text-slate-600">
                             <p>{o.origin} <span className="text-slate-400 mx-1">→</span></p>
                             <p>{o.destination}</p>
                          </td>
                          <td className="py-3 px-2">
                             <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${
                                o.status === 'EN_PUERTO' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                o.status === 'EN_CAMINO' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                o.status === 'ASIGNADO' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                o.status === 'RECOGIDO' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                'bg-emerald-100 text-emerald-700 border-emerald-200'
                             }`}>
                                {o.status.replace('_', ' ')}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#0b1424] p-6 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Truck size={100} className="text-primary" />
              </div>
              <h3 className="font-bold text-white font-mono tracking-widest text-sm mb-4 relative z-10">CITAS DISPONIBLES (HOY)</h3>
              <div className="space-y-4 relative z-10">
                 <div>
                   <p className="text-xs text-slate-400 font-mono mb-1 flex items-center justify-between">14:00 - 15:00 <span>AGOTADO</span></p>
                   <div className="w-full bg-slate-800 h-2 rounded"><div className="bg-red-500 h-2 rounded w-full"></div></div>
                   <p className="text-[10px] text-slate-500 text-right mt-1 font-mono">0 cupos libres</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-mono mb-1">15:00 - 16:00 (Ventana Tarde)</p>
                   <div className="w-full bg-slate-800 h-2 rounded"><div className="bg-emerald-500 h-2 rounded w-1/4"></div></div>
                   <p className="text-[10px] text-emerald-500 text-right mt-1 font-mono">15 cupos libres</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-mono mb-1">16:00 - 17:00 (Ventana Tarde)</p>
                   <div className="w-full bg-slate-800 h-2 rounded"><div className="bg-orange-500 h-2 rounded w-3/4"></div></div>
                   <p className="text-[10px] text-orange-400 text-right mt-1 font-mono">3 cupos libres</p>
                 </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800 relative z-10 font-sans text-xs text-slate-400">
                 Las ventanas horarias son gestionadas por el Coordinador para evitar congestión en el pre-puerto (Garita).
              </div>
           </div>
           
           <div className="bg-white border border-slate-200 p-6 shadow-sm">
               <h3 className="font-bold text-secondary font-mono tracking-widest text-xs mb-4 uppercase">Rendimiento Contratistas</h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-700">Transportes Lider C.A.</span>
                     <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">ON TIME (94%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-700">Carga Pesada Vzla</span>
                     <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">DELAYED (12%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-700">Logistica SUR</span>
                     <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">ON TIME (98%)</span>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
