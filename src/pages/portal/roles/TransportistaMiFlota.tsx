import { useState } from "react";
import { Truck, Users, Plus, AlertTriangle, CheckCircle, Search, ShieldAlert } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function TransportistaMiFlota() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"vehiculos" | "choferes">("vehiculos");

  const [vehiculos] = useState([
    { placa: "A123BC", tipo: "CHUTO", ejes: 3, capacidad: 30, seguro_vence: "2024-12-10", estado: "ACTIVO" },
    { placa: "R987ZZ", tipo: "REMOLQUE_PLATAFORMA", ejes: 2, capacidad: 40, seguro_vence: "2024-06-01", estado: "ALERTA" },
  ]);

  const [choferes] = useState([
    { id: "1", cedula: "V-15.123.456", nombre: "José Pinto", licencia: "5ta", vence: "2025-01-20", estado: "ACTIVO" },
    { id: "2", cedula: "V-12.987.654", nombre: "Carlos Martínez", licencia: "5ta", vence: "2024-05-18", estado: "ALERTA_DOCUMENTO" },
    { id: "3", cedula: "V-18.111.222", nombre: "Miguel Torres", licencia: "5ta", vence: "2024-01-10", estado: "VETADO_BOLIPUERTOS" },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase">
            Gestor de Flota y Personal
          </h1>
          <p className="text-foreground-muted font-mono mt-1 text-sm">
            Control de equipos y autorizaciones en garita
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-lg border-border shadow-sm overflow-hidden">
         <div className="flex border-b border-border">
            <button 
               onClick={() => setActiveTab("vehiculos")}
               className={`flex-1 py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 ${activeTab === 'vehiculos' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-foreground-muted hover:bg-slate-50'}`}
            >
               <Truck size={18} /> Vehículos y Chasis
            </button>
            <button 
               onClick={() => setActiveTab("choferes")}
               className={`flex-1 py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 ${activeTab === 'choferes' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-foreground-muted hover:bg-slate-50'}`}
            >
               <Users size={18} /> Choferes Autorizados
            </button>
         </div>

         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                  <input type="text" placeholder={`Buscar ${activeTab}...`} className="pl-9 pr-4 py-2 border rounded w-full font-mono text-sm focus:border-primary focus:outline-none" />
               </div>
               <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Plus size={16} /> Agregar {activeTab === 'vehiculos' ? 'Placa' : 'Chofer'}
               </button>
            </div>

            {activeTab === "vehiculos" && (
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-y border-border">
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Placa</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Tipo</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Ejes/Cap</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Venc. RCV / Seguro</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Estado (Garita)</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest text-right">Acción</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {vehiculos.map(v => (
                           <tr key={v.placa} className={`hover:bg-slate-50/50 ${v.estado === 'ALERTA' ? 'bg-yellow-50/30' : ''}`}>
                              <td className="p-3 font-mono font-bold text-secondary text-base">{v.placa}</td>
                              <td className="p-3 font-mono text-xs">{v.tipo}</td>
                              <td className="p-3 text-sm text-foreground-muted">{v.ejes} ejes | {v.capacidad} ton</td>
                              <td className="p-3 font-mono text-sm">
                                 {v.estado === 'ALERTA' ? (
                                    <span className="text-amber-600 flex items-center gap-1 font-bold">
                                       <AlertTriangle size={14} /> {v.seguro_vence}
                                    </span>
                                 ) : (v.seguro_vence)}
                              </td>
                              <td className="p-3">
                                 {v.estado === 'ACTIVO' ? (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold tracking-wider">OK</span>
                                 ) : (
                                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold tracking-wider">POR VENCER</span>
                                 )}
                              </td>
                              <td className="p-3 text-right">
                                 <button className="text-primary hover:underline text-sm font-bold">Editar</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {activeTab === "choferes" && (
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-y border-border">
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Cédula</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Nombre Completo</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Vencimiento Licencia</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Autorización Bolipuertos</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest">Status Garita</th>
                           <th className="p-3 text-xs font-bold text-foreground-muted uppercase tracking-widest text-right">Acción</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {choferes.map(c => (
                           <tr key={c.id} className={`hover:bg-slate-50/50 ${c.estado !== 'ACTIVO' ? 'bg-red-50/20' : ''}`}>
                              <td className="p-3 font-mono font-bold text-secondary">{c.cedula}</td>
                              <td className="p-3 text-sm font-bold">{c.nombre}</td>
                              <td className="p-3 font-mono text-sm">
                                 {c.estado === 'ALERTA_DOCUMENTO' ? (
                                    <span className="text-amber-600 flex items-center gap-1 font-bold">
                                       <AlertTriangle size={14} /> {c.vence}
                                    </span>
                                 ) : (c.vence)}
                              </td>
                              <td className="p-3">
                                 {c.estado === 'VETADO_BOLIPUERTOS' ? (
                                    <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><ShieldAlert size={14}/> Acceso Bloqueado</span>
                                 ) : (
                                    <span className="text-green-600 font-bold text-xs flex items-center gap-1"><CheckCircle size={14}/> Aprobado BPD</span>
                                 )}
                              </td>
                              <td className="p-3">
                                 {c.estado === 'ACTIVO' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Habilitado</span>}
                                 {c.estado === 'ALERTA_DOCUMENTO' && <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Doc. Vencido</span>}
                                 {c.estado === 'VETADO_BOLIPUERTOS' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Vetado</span>}
                              </td>
                              <td className="p-3 text-right">
                                 <button className="text-primary hover:underline text-sm font-bold">Editar</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
