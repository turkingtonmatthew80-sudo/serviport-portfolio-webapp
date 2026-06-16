import { useState, useEffect } from "react";
import { Ship, Package, Navigation, Search, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

interface ExportBooking {
  id: string;
  bookingRef: string;
  destination: string;
  vessel: string;
  seniatStatus: string;
  patioStatus: string;
  docsClosingDate: string;
}

export function ExportadorDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ExportBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
     const fetchBookings = async () => {
        try {
           const snap = await getDocs(query(collection(db, "export_bookings")));
           setBookings(snap.docs.map(d => ({id: d.id, ...d.data()}) as ExportBooking));
        } catch(e) {
           console.error(e);
        }
     };
     fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
      b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Exportador
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial} | RIF: {user?.rif}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground-muted font-mono tracking-widest">BOOKINGS ACTIVOS</p>
            <h3 className="text-3xl font-black text-secondary mt-1">{bookings.length}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <Ship className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground-muted font-mono tracking-widest">EN PATIO DE EXP.</p>
            <h3 className="text-3xl font-black text-secondary mt-1">{bookings.filter(b => b.patioStatus === 'EN PATIO').length}</h3>
          </div>
          <div className="bg-orange-50 p-3 rounded-full">
            <Package className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground-muted font-mono tracking-widest">EMBARCADOS (MES)</p>
            <h3 className="text-3xl font-black text-secondary mt-1">0</h3>
          </div>
          <div className="bg-emerald-50 p-3 rounded-full">
            <Navigation className="text-emerald-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">BOOKINGS Y EMBARQUES</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar Booking, Destino..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
             {filteredBookings.length === 0 ? (
               <div className="p-8 text-center border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm">
                 No hay bookings de exportación registrados.
               </div>
             ) : (
                filteredBookings.map(b => (
                   <div key={b.id} className="border border-slate-200 p-4 bg-slate-50 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <p className="font-bold text-secondary font-mono text-sm">{b.bookingRef}</p>
                        <p className="text-xs text-foreground-muted">Destino: {b.destination} • Buque: {b.vessel}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                           <span className={`${b.seniatStatus === 'PERMISO SENIAT LISTO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest`}>{b.seniatStatus}</span>
                           <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">{b.patioStatus}</span>
                        </div>
                     </div>
                     <div className="text-left md:text-right">
                       <p className="text-xs text-foreground-muted font-mono mb-1">Cierre Documental:</p>
                       <p className="text-sm font-bold text-orange-600 font-mono">{b.docsClosingDate}</p>
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
