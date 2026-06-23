import { useState, useEffect } from "react";
import { Clock, CheckCircle, Truck, Users, Key, AlertTriangle, ArrowRight, Download, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export function TransportistaVbs() {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preSelectedBic = searchParams.get('bic');

  const [date, setDate] = useState("2024-05-18");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
     contenedor: preSelectedBic || "",
     chofer: "",
     chuto: "",
     remolque: ""
  });

  const slots = [
    { id: "s1", time: "08:00 - 10:00", capacity: 50, booked: 50, isFull: true },
    { id: "s2", time: "10:00 - 12:00", capacity: 50, booked: 45, isFull: false },
    { id: "s3", time: "13:00 - 15:00", capacity: 50, booked: 12, isFull: false },
    { id: "s4", time: "15:00 - 17:00", capacity: 50, booked: 2, isFull: false },
  ];

  const contenedoresListos = [
     { bic: "MSKU8091232", type: "40_DRY" },
     { bic: "HLXU7718221", type: "20_REEFER" },
  ];

  const choferesActivos = [
     { id: "1", nombre: "José Pinto", cedula: "V-15.123.456" },
  ];

  const chutos = ["A123BC"];
  const remolques = ["R987ZZ"];

  const [qrCode, setQrCode] = useState<string | null>(null);

  const confirmBooking = () => {
     setQrCode("VBS-889812-XYZ-20240518");
     setStep(3);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase">
          VBS - Agendamiento de Citas Garita
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          Vehicle Booking System | Puerto Cabello (VE_PCL)
        </p>
      </div>

      {step === 1 && (
         <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border bg-slate-50">
               <h3 className="font-bold text-secondary font-mono tracking-widest uppercase text-sm">Paso 1: Seleccionar Ventana Horaria (Slot)</h3>
            </div>
            <div className="p-6">
               <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                     <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                     <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-9 pr-4 py-2 border rounded font-mono text-sm focus:outline-none focus:border-primary"
                     />
                  </div>
                  <p className="text-sm text-foreground-muted font-mono bg-blue-50 text-secondary px-3 py-1.5 rounded font-bold">Puerta: Importaciones (Gate 4)</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {slots.map(slot => (
                     <button
                        key={slot.id}
                        disabled={slot.isFull}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-4 border rounded-lg text-left transition-all ${
                           slot.isFull 
                              ? "bg-slate-100 border-slate-200 cursor-not-allowed opacity-60"
                              : selectedSlot === slot.id
                                 ? "bg-primary/5 border-primary shadow-[0_0_0_2px_rgba(30,58,138,0.2)]"
                                 : "bg-white border-slate-300 hover:border-primary/50"
                        }`}
                     >
                        <div className="flex justify-between items-center mb-2">
                           <Clock size={18} className={slot.isFull ? "text-slate-400" : "text-primary"} />
                           {slot.isFull && <span className="bg-red-100 text-red-800 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">Agotado</span>}
                        </div>
                        <p className={`font-mono text-lg font-bold mb-1 tracking-tight ${slot.isFull ? 'text-slate-500' : 'text-secondary'}`}>{slot.time}</p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1 mt-3">
                           <div className={`h-1.5 rounded-full ${slot.isFull ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}></div>
                        </div>
                        <p className="text-[11px] font-mono font-bold text-foreground-muted text-right tracking-widest">
                           {slot.booked}/{slot.capacity} CUPOS
                        </p>
                     </button>
                  ))}
               </div>

               <div className="mt-8 flex justify-end">
                  <button 
                     disabled={!selectedSlot}
                     onClick={() => setStep(2)}
                     className={`px-6 py-2 rounded font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors ${
                        selectedSlot ? 'bg-secondary text-white hover:bg-secondary/90' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                     }`}
                  >
                     Continuar <ArrowRight size={16} />
                  </button>
               </div>
            </div>
         </div>
      )}

      {step === 2 && (
         <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-secondary font-mono tracking-widest uppercase text-sm">Paso 2: Asignación de Recursos</h3>
               <span className="bg-primary/10 text-primary font-mono text-xs font-bold px-3 py-1 rounded border border-primary/20 tracking-wider">
                  SLOT: {slots.find(s => s.id === selectedSlot)?.time} ({date})
               </span>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold font-mono tracking-widest text-secondary uppercase mb-2">
                        1. Seleccione Contenedor (Solo Listos)
                     </label>
                     <select 
                        value={formData.contenedor}
                        onChange={(e) => setFormData({...formData, contenedor: e.target.value})}
                        className="w-full border border-slate-300 rounded p-3 text-secondary font-mono text-sm focus:border-primary focus:outline-none bg-emerald-50/30"
                     >
                        <option value="">-- SELECCIONE --</option>
                        {contenedoresListos.map(c => (
                           <option key={c.bic} value={c.bic}>{c.bic} ({c.type}) - LEVANTE OK</option>
                        ))}
                     </select>
                     {formData.contenedor && (
                        <p className="text-[11px] text-emerald-700 font-mono mt-2 bg-emerald-50 inline-block px-2 py-1 border border-emerald-200 rounded">
                           Validación SENIAT Exitosa. Listo para Gate-Out.
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="block text-xs font-bold font-mono tracking-widest text-secondary uppercase mb-2">
                        2. Chofer Asignado
                     </label>
                     <select 
                        value={formData.chofer}
                        onChange={(e) => setFormData({...formData, chofer: e.target.value})}
                        className="w-full border border-slate-300 rounded p-3 text-secondary font-mono text-sm focus:border-primary focus:outline-none"
                     >
                        <option value="">-- SELECCIONE --</option>
                        {choferesActivos.map(c => (
                           <option key={c.id} value={c.id}>{c.nombre} ({c.cedula})</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold font-mono tracking-widest text-secondary uppercase mb-2">
                        3. Placa del Chuto
                     </label>
                     <select 
                        value={formData.chuto}
                        onChange={(e) => setFormData({...formData, chuto: e.target.value})}
                        className="w-full border border-slate-300 rounded p-3 text-secondary font-mono text-sm focus:border-primary focus:outline-none"
                     >
                        <option value="">-- SELECCIONE --</option>
                        {chutos.map(c => (
                           <option key={c} value={c}>{c}</option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold font-mono tracking-widest text-secondary uppercase mb-2">
                        4. Placa del Remolque (Opcional)
                     </label>
                     <select 
                        value={formData.remolque}
                        onChange={(e) => setFormData({...formData, remolque: e.target.value})}
                        className="w-full border border-slate-300 rounded p-3 text-secondary font-mono text-sm focus:border-primary focus:outline-none"
                     >
                        <option value="">-- NINGUNO --</option>
                        {remolques.map(c => (
                           <option key={c} value={c}>{c}</option>
                        ))}
                     </select>
                  </div>

                  {formData.contenedor && formData.chofer && formData.chuto && (
                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                        <div className="flex items-start gap-2">
                           <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={16} />
                           <p className="text-xs text-yellow-800 font-mono leading-relaxed">
                              Al confirmar, el sistema de Bolipuertos reservará el cupo y le generará un Token QR indisoluble. Este Token será validado físicamente en la garita con la cédula del chofer.
                           </p>
                        </div>
                     </div>
                  )}

               </div>
               
            </div>

            <div className="p-6 border-t border-border bg-slate-50 flex justify-between items-center">
               <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border rounded font-bold uppercase tracking-widest text-sm text-foreground-muted hover:bg-white"
               >
                  Atrás
               </button>
               <button 
                  disabled={!formData.contenedor || !formData.chofer || !formData.chuto}
                  onClick={confirmBooking}
                  className={`px-6 py-2 rounded font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors ${
                     (formData.contenedor && formData.chofer && formData.chuto) ? 'bg-primary text-white hover:bg-primary/90 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
               >
                  <Key size={16} /> Generar Pase VBS
               </button>
            </div>
         </div>
      )}

      {step === 3 && qrCode && (
         <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-green-500 shadow-xl rounded-xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
               <div className="p-8 text-center flex flex-col items-center">
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                  <h2 className="text-2xl font-black text-secondary tracking-tight uppercase mb-1">Cita Confirmada</h2>
                  <p className="text-foreground-muted font-mono text-sm mb-8 tracking-widest">{qrCode}</p>

                  <div className="grid grid-cols-2 gap-4 w-full text-left bg-slate-50 p-6 rounded-lg font-mono text-sm border">
                     <div>
                        <p className="text-xs text-foreground-muted mb-1 uppercase font-bold tracking-wider">Fecha / Slot</p>
                        <p className="font-bold text-secondary text-base">{date} | {slots.find(s=>s.id===selectedSlot)?.time}</p>
                     </div>
                     <div>
                        <p className="text-xs text-foreground-muted mb-1 uppercase font-bold tracking-wider">Contenedor</p>
                        <p className="font-bold text-secondary text-base">{formData.contenedor}</p>
                     </div>
                     <div className="col-span-2 my-2 border-t border-dashed"></div>
                     <div>
                        <p className="text-xs text-foreground-muted mb-1 uppercase font-bold tracking-wider">Chofer</p>
                        <p className="font-bold">{choferesActivos.find(c=>c.id===formData.chofer)?.nombre}</p>
                        <p className="text-xs">{choferesActivos.find(c=>c.id===formData.chofer)?.cedula}</p>
                     </div>
                     <div>
                        <p className="text-xs text-foreground-muted mb-1 uppercase font-bold tracking-wider">Placas (Chuto / Remolque)</p>
                        <p className="font-bold">{formData.chuto} / {formData.remolque || "N/A"}</p>
                     </div>
                  </div>

                  <div className="mt-8 flex gap-4 w-full">
                     <button className="flex-1 border-2 border-secondary text-secondary hover:bg-slate-50 font-bold uppercase tracking-widest text-sm py-3 rounded flex items-center justify-center gap-2 transition-colors">
                        <Download size={18} /> IMPRIMIR PDF
                     </button>
                     <button 
                        onClick={() => { setStep(1); setSelectedSlot(null); }}
                        className="flex-1 bg-secondary text-white hover:bg-secondary/90 font-bold uppercase tracking-widest text-sm py-3 rounded flex items-center justify-center gap-2 transition-colors"
                     >
                        Agendar Otro
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
