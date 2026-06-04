import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Anchor, CheckCircle2, ChevronRight, Building, ShieldCheck, CreditCard } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth, RoleId } from "../contexts/AuthContext";

const SERVICES = [
  { id: "naviera", name: "Naviera", desc: "Gestión de Port Calls y proformas" },
  { id: "armador", name: "Armador", desc: "Cuentas de liquidación y husbandry" },
  { id: "importador", name: "Importador (BCO)", desc: "Trazabilidad en AGD y retiros" },
  { id: "exportador", name: "Exportador", desc: "Ingreso al almacén y embarque" },
  { id: "agente_aduana", name: "Agente de Aduana", desc: "Consultas operativas y despachos" },
  { id: "transportista", name: "Transportista", desc: "Órdenes de carga y EIRs" }
];

export function B2BRegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Form State
  const [rif, setRif] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setError("");
      const success = await register({
        razonSocial,
        email,
        rif,
        roles: selectedServices as RoleId[]
      }, password);
      
      if (success) {
        navigate("/portal");
      } else {
        setError("El correo electrónico ya está registrado.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Anchor className="text-[#00A9CE] group-hover:text-[#F7941D] transition-colors" size={28} />
          <span className="text-xl font-black text-[#0b1a2e] tracking-tight uppercase">Servi<span className="text-[#00A9CE] group-hover:text-[#F7941D] transition-colors">port</span></span>
        </Link>
        <div className="text-sm text-gray-500 font-medium">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#00A9CE] hover:underline hover:text-[#F7941D]">Inicia sesión</Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Progress Sidebar */}
        <div className="w-full md:w-1/3 bg-[#0b1a2e] p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Registro B2B</h2>
          <div className="space-y-6">
            <div className={cn("flex items-start gap-3", step >= 1 ? "opacity-100" : "opacity-40")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold", step > 1 ? "bg-green-500 text-white" : step === 1 ? "bg-[#F7941D] text-white" : "bg-gray-700 text-gray-300")}>
                {step > 1 ? <CheckCircle2 size={16} /> : "1"}
              </div>
              <div>
                <p className="font-semibold text-sm mt-1.5">Servicios</p>
                <p className="text-xs text-gray-400 mt-1">Selecciona los módulos a contratar</p>
              </div>
            </div>
            
            <div className={cn("flex items-start gap-3", step >= 2 ? "opacity-100" : "opacity-40")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold", step > 2 ? "bg-green-500 text-white" : step === 2 ? "bg-[#F7941D] text-white" : "bg-gray-700 text-gray-300")}>
                {step > 2 ? <CheckCircle2 size={16} /> : "2"}
              </div>
              <div>
                <p className="font-semibold text-sm mt-1.5">Datos Fiscales</p>
                <p className="text-xs text-gray-400 mt-1">Información de la empresa y RIF</p>
              </div>
            </div>

            <div className={cn("flex items-start gap-3", step >= 3 ? "opacity-100" : "opacity-40")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold", step === 3 ? "bg-[#F7941D] text-white" : "bg-gray-700 text-gray-300")}>
                3
              </div>
              <div>
                <p className="font-semibold text-sm mt-1.5">Confirmación</p>
                <p className="text-xs text-gray-400 mt-1">Resumen de costos y activación</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <form onSubmit={handleNext}>
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#0b1a2e] flex items-center gap-2"><ShieldCheck className="text-[#00A9CE]" /> Selecciona tus Servicios</h3>
                  <p className="text-slate-500 text-sm mt-2">Selecciona los servicios que necesitas. Puedes ampliarlos después en el portal.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {SERVICES.map(srv => {
                    const isSelected = selectedServices.includes(srv.id);
                    return (
                      <div 
                        key={srv.id} 
                        onClick={() => toggleService(srv.id)}
                        className={cn(
                          "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200",
                          isSelected ? "border-[#00A9CE] bg-cyan-50/30" : "border-gray-200 hover:border-[#00A9CE]/50 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{srv.name}</span>
                          <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", isSelected ? "border-[#00A9CE] bg-[#00A9CE]" : "border-gray-300")}>
                            {isSelected && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{srv.desc}</p>
                      </div>
                    )
                  })}
                </div>
                
                <button 
                  type="submit" 
                  disabled={selectedServices.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-[#0b1a2e] text-white px-6 py-3.5 rounded-md font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#0b1a2e] flex items-center gap-2"><Building className="text-[#00A9CE]" /> Datos Fiscales</h3>
                  <p className="text-slate-500 text-sm mt-2">Ingresa los datos fiscales de tu empresa. Usaremos esta información para emitir facturas.</p>
                </div>
                
                <div className="space-y-5 mb-8">
                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">RIF Venezolano *</label>
                      <input type="text" required value={rif} onChange={e => setRif(e.target.value)} placeholder="J-12345678-9" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Razón Social *</label>
                      <input type="text" required value={razonSocial} onChange={e => setRazonSocial(e.target.value)} placeholder="Mi Empresa, C.A." className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dirección Fiscal *</label>
                    <input type="text" required placeholder="Av. Principal..." className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Representante Legal *</label>
                      <input type="text" required placeholder="Nombre completo" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico *</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@empresa.com" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña Acceso Portal *</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-gray-300 text-gray-700 px-6 py-3.5 rounded-md font-bold hover:bg-gray-50 transition-colors">
                    Atrás
                  </button>
                  <button type="submit" className="w-2/3 flex items-center justify-center gap-2 bg-[#0b1a2e] text-white px-6 py-3.5 rounded-md font-bold hover:bg-slate-800 transition-colors">
                    Continuar <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#0b1a2e] flex items-center gap-2"><CreditCard className="text-[#00A9CE]" /> Resumen de Suscripción</h3>
                  <p className="text-slate-500 text-sm mt-2">Revisa el resumen de tu suscripción y confirma la activación.</p>
                </div>
                
                <div className="bg-slate-50 border border-gray-200 rounded-xl p-6 mb-8">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-slate-600 font-medium">Plan Base (Acceso a portal)</span>
                      <span className="font-bold text-slate-800">Incluido</span>
                    </div>
                    {selectedServices.map(id => {
                      const s = SERVICES.find(x => x.id === id);
                      return (
                        <div key={id} className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                          <span className="text-slate-600">Servicio: {s?.name}</span>
                          <span className="font-medium text-slate-800">Simulado</span>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-slate-800">Total Mensual</span>
                    <span className="font-black text-2xl text-[#00A9CE]">$0.00</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1">* Simulación de costo</p>
                </div>

                <div className="flex items-start gap-3 mb-8">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-[#00A9CE] border-gray-300 rounded focus:ring-[#00A9CE]" />
                  <p className="text-sm text-gray-600 leading-tight">
                    Acepto los <Link to="/terminos-y-condiciones" className="text-[#00A9CE] hover:underline" target="_blank">Términos B2B</Link> y la <Link to="/politica-de-privacidad" className="text-[#00A9CE] hover:underline" target="_blank">Política de Privacidad</Link>. Entiendo que los servicios contratados se activarán tras la revisión de mis documentos.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="w-1/3 border border-gray-300 text-gray-700 px-6 py-3.5 rounded-md font-bold hover:bg-gray-50 transition-colors">
                    Atrás
                  </button>
                  <button type="submit" className="w-2/3 flex items-center justify-center gap-2 bg-[#F7941D] text-white px-6 py-3.5 rounded-md font-bold hover:bg-[#e0861a] transition-colors shadow-sm">
                    Confirmar y Activar 
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
