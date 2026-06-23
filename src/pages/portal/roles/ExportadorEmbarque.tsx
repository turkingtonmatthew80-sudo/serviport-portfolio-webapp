import { useState, useEffect } from "react";
import { Ship, Clock, CheckCircle, ArrowRight, Save, Navigation, Package } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ExportadorEmbarque() {
  const { user } = useAuth();
  const [navieras, setNavieras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [formData, setFormData] = useState({
    puertoDestino: "",
    navieraId: "",
    cantidadTeus: 1,
    tipoIsoRequerido: "20_DRY"
  });

  useEffect(() => {
    // Fetch Navieras
    const fetchNavieras = async () => {
      try {
        const res = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'isNaviera', value: true }])));
        const data = await res.json();
        setNavieras(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNavieras();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     try {
       // Get exportadorId
       const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user?.rif }])));
       const empData = await empRes.json();
       const exportadorId = empData[0]?.id;

       const res = await fetch('/api/exportador/booking/request', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           exportadorId,
           navieraId: formData.navieraId,
           puertoDestino: formData.puertoDestino,
           cantidadTeus: formData.cantidadTeus,
           tipoIsoRequerido: formData.tipoIsoRequerido
         })
       });
       
       if (res.ok) {
         setSuccessMsg("¡Booking solicitado exitosamente! La naviera ha sido notificada.");
         setFormData({ puertoDestino: "", navieraId: "", cantidadTeus: 1, tipoIsoRequerido: "20_DRY" });
       }
     } catch(err) {
       console.error(err);
     }
     setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Solicitar Espacio de Embarque</h2>
          <p className="text-foreground-muted text-sm mt-1">
            Reserve espacios en buques portacontenedores de las principales Líneas Navieras.
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white border border-border shadow-sm p-6">
            <h3 className="font-bold text-secondary text-sm tracking-widest font-mono mb-6 pb-2 border-b">DETALLES DE LA SOLICITUD</h3>
            
            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-mono flex items-center gap-2 rounded">
                 <CheckCircle size={16} />
                 {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 font-mono tracking-widest mb-1">PUERTO DE DESTINO</label>
                  <input required type="text" value={formData.puertoDestino} onChange={e => setFormData({...formData, puertoDestino: e.target.value})} placeholder="Ej. Rotterdam, Países Bajos" className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 font-mono tracking-widest mb-1">LÍNEA NAVIERA</label>
                  <select required value={formData.navieraId} onChange={e => setFormData({...formData, navieraId: e.target.value})} className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none bg-white">
                    <option value="" disabled>Seleccione Naviera</option>
                    {navieras.map(n => (
                      <option key={n.id} value={n.id}>{n.razonSocial} (RIF: {n.rif})</option>
                    ))}
                  </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 font-mono tracking-widest mb-1">CANTIDAD TEUS</label>
                    <input required type="number" min="1" max="100" value={formData.cantidadTeus} onChange={e => setFormData({...formData, cantidadTeus: parseInt(e.target.value)})} className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 font-mono tracking-widest mb-1">TIPO EQUIPO ISO</label>
                    <select required value={formData.tipoIsoRequerido} onChange={e => setFormData({...formData, tipoIsoRequerido: e.target.value})} className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none bg-white">
                      <option value="20_DRY">20' Dry (Estándar)</option>
                      <option value="40_DRY">40' Dry (Estándar)</option>
                      <option value="40_HC">40' High Cube</option>
                      <option value="20_REEFER">20' Refrigerado</option>
                      <option value="40_REEFER">40' Refrigerado</option>
                    </select>
                 </div>
               </div>

               <button disabled={loading} type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest font-mono text-sm py-3 rounded flex justify-center items-center gap-2 transition-colors">
                  {loading ? 'ENVIANDO SOLICITUD...' : <>ENVIAR SOLICITUD A NAVIERA <ArrowRight size={16}/></>}
               </button>
            </form>
         </div>

         <div className="space-y-6">
           <div className="bg-slate-50 border border-slate-200 p-6 rounded text-sm text-slate-600 font-mono leading-relaxed">
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2"><Navigation size={16}/> Asignación de Transporte Terrestre</h4>
              <p>Una vez que la Naviera apruebe su solicitud de reserva (Booking), usted podrá asignar en esta plataforma a la empresa de transporte terrestre encargada de retirar el contenedor vacío del puerto y, posteriormente, ingresar el contenedor lleno.</p>
           </div>
           
           <div className="bg-slate-50 border border-slate-200 p-6 rounded text-sm text-slate-600 font-mono leading-relaxed">
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2"><Package size={16}/> Permiso de Embarque SIDUNEA</h4>
              <p>El booking está condicionado a la aprobación de documentos por parte del SENIAT y la inspección antidrogas de la GNB al ingresar (Gate-In) el contenedor lleno en las instalaciones portuarias.</p>
           </div>
         </div>
       </div>
    </div>
  );
}
