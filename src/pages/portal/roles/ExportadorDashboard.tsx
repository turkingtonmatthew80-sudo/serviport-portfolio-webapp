import { useState, useEffect } from "react";
import { Ship, Package, Navigation, Search, CheckCircle, Clock, AlertTriangle, Scale } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface ExportBooking {
  id: string;
  puertoDestino: string;
  cantidadTeus: number;
  tipoIsoRequerido: string;
  estado: string;
  cargoCutOff: string;
}

interface Contenedor {
  numeroBic: string;
  bookingExportacionId: string;
  estadoFisicoExport: string; // 'EMPTY_RELEASED', 'STUFFING_AT_PLANT', 'FULL_GATE_IN', 'IN_YARD_EXPORT', 'LOADED_ON_VESSEL'
  pesoVgmKg: number | null;
  selectividadSeniat: string | null;
}

interface Inspeccion {
  contenedorBic: string;
  estado: string;
}

export function ExportadorDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ExportBooking[]>([]);
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
     // Wait until user is loaded and ensure user represents an exportador
     if (!user?.rif) return;

     const fetchData = async () => {
        try {
           // Instead of full relational join, we use parallel queries for simplicity in development
           // 1. Get user UUID from empresas table using RIF
           const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
           const empData = await empRes.json();
           if (!empData || empData.length === 0) return;
           const exportadorId = empData[0].id;

           // 2. Get Bookings
           const bkgRes = await fetch(`/api/sql/bookingsExportacion?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'exportadorId', value: exportadorId }])));
           const bkgData = await bkgRes.json();
           setBookings(bkgData || []);

           // 3. Get Containers and Inspections
           if (bkgData && bkgData.length > 0) {
              const contRes = await fetch(`/api/sql/contenedores`);
              const contData = await contRes.json();
              const bkgIds = bkgData.map((b: any) => b.id);
              const relatedContainers = contData.filter((c: any) => bkgIds.includes(c.bookingExportacionId));
              setContenedores(relatedContainers);

              const insRes = await fetch(`/api/sql/inspeccionesGnb`);
              setInspecciones(await insRes.json());
           }
        } catch(e) {
           console.error(e);
        }
     };
     fetchData();
     
     // Setup polling for live updates
     const interval = setInterval(fetchData, 10000);
     return () => clearInterval(interval);
  }, [user]);

  const filteredBookings = bookings.filter(b => 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.puertoDestino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCutOffRemaining = (cutOffDate: string) => {
    if (!cutOffDate) return { label: 'Sin Asignar', isCritical: false, rolledOver: false };
    const diff = new Date(cutOffDate).getTime() - Date.now();
    if (diff < 0) return { label: 'ROLLED OVER', isCritical: true, rolledOver: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return { label: `${hours}h restantes`, isCritical: hours < 48, rolledOver: false };
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Torre de Control de Exportación
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial} | RIF: {user?.rif}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">RESERVAS ACTIVAS (BOOKINGS)</h3>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm">
                  Sin reservas activas. Solicite espacio en el módulo de Bookings.
                </div>
              ) : (
                bookings.map(b => {
                  const cutOff = getCutOffRemaining(b.cargoCutOff);
                  return (
                    <div key={b.id} className={`border p-4 rounded flex flex-col md:flex-row justify-between gap-4 ${cutOff.rolledOver ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <p className="font-bold text-secondary font-mono text-xs mb-1">BKG: {b.id}</p>
                        <p className="text-sm font-medium">Destino: {b.puertoDestino || 'N/A'}</p>
                        <p className="text-xs text-foreground-muted font-mono">{b.cantidadTeus}x {b.tipoIsoRequerido}</p>
                      </div>
                      <div className="text-left md:text-right flex flex-col justify-center">
                        <span className="text-xs text-foreground-muted font-mono uppercase font-bold tracking-widest mb-1">{b.estado}</span>
                        <div className={`px-2 py-1 flex items-center justify-center gap-2 rounded text-xs font-mono font-bold ${cutOff.rolledOver ? 'bg-red-600 text-white' : cutOff.isCritical ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                          <Clock size={12} />
                          CUT-OFF: {cutOff.label}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">SEMÁFORO DE APROBACIONES (MULTI-AGENCIA)</h3>
            <div className="space-y-4">
              {contenedores.length === 0 ? (
                <div className="text-slate-500 font-mono text-xs text-center p-4">No hay contenedores vinculados.</div>
              ) : (
                contenedores.map(c => {
                   const insp = inspecciones.find(i => i.contenedorBic === c.numeroBic);
                   const isVgmOk = c.pesoVgmKg != null && c.pesoVgmKg > 0;
                   const isGnbOk = insp?.estado === 'CLEARED_FOR_EXPORT';
                   const isSeniatOk = c.selectividadSeniat === 'VERDE';
                   const isReady = isVgmOk && isGnbOk && isSeniatOk;

                   return (
                     <div key={c.numeroBic} className="border border-slate-200 rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                           <div className="font-mono text-sm font-bold">{c.numeroBic}</div>
                           <div className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest ${isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                             {isReady ? 'ACTO PARA EMBARQUE' : c.estadoFisicoExport || 'EN TRÁNSITO'}
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                           <div className={`flex items-center gap-2 text-xs font-mono p-2 border rounded ${isVgmOk ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>
                             {isVgmOk ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                             <span>PESAJE VGM</span>
                           </div>
                           <div className={`flex items-center gap-2 text-xs font-mono p-2 border rounded ${isGnbOk ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>
                             {isGnbOk ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                             <span>GNB ANTIDROGAS</span>
                           </div>
                           <div className={`flex items-center gap-2 text-xs font-mono p-2 border rounded ${isSeniatOk ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>
                             {isSeniatOk ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                             <span>PERMISO SENIAT</span>
                           </div>
                        </div>
                     </div>
                   );
                })
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
           <div className="bg-slate-900 border border-slate-800 p-6 shadow-sm text-white">
              <h3 className="text-slate-400 font-mono text-xs font-bold tracking-widest mb-4">ACCIONES RÁPIDAS</h3>
              <div className="space-y-3">
                 <a href="/portal/exportador/embarque" className="block w-full text-center bg-blue-600 hover:bg-blue-500 py-3 rounded font-mono text-sm font-bold transition-colors">
                   + SOLICITAR BOOKING
                 </a>
                 <button className="block w-full text-center bg-slate-800 hover:bg-slate-700 py-3 rounded font-mono text-sm font-bold text-slate-300 transition-colors">
                   DECLARAR VGM
                 </button>
                 <button className="block w-full text-center bg-slate-800 hover:bg-slate-700 py-3 rounded font-mono text-sm font-bold text-slate-300 transition-colors">
                   SUBIR DOCUMENTOS
                 </button>
              </div>
           </div>

           <div className="bg-white border border-border p-6 shadow-sm">
             <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">ESTADO DE EQUIPOS</h3>
             <ul className="space-y-3 font-mono text-sm border-t border-b border-border py-4 my-4">
                <li className="flex justify-between">
                   <span className="text-slate-500">Vacíos (Empty Released)</span>
                   <span className="font-bold">{contenedores.filter(c => c.estadoFisicoExport === 'EMPTY_RELEASED').length}</span>
                </li>
                <li className="flex justify-between">
                   <span className="text-slate-500">Llenando en Planta</span>
                   <span className="font-bold">{contenedores.filter(c => c.estadoFisicoExport === 'STUFFING_AT_PLANT').length}</span>
                </li>
                <li className="flex justify-between">
                   <span className="text-slate-500">En Patio Puerto</span>
                   <span className="font-bold">{contenedores.filter(c => ['FULL_GATE_IN', 'IN_YARD_EXPORT'].includes(c.estadoFisicoExport)).length}</span>
                </li>
             </ul>
             <p className="text-xs text-foreground-muted font-mono leading-relaxed">
               Si la inspección GNB no se completa antes del cargo cut-off, el equipo sufrirá un "Roll-Over".
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
