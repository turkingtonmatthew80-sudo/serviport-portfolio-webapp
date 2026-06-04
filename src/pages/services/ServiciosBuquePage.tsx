import { ArrowRight, Wrench, Package, Droplets, HeartPulse, HardHat } from "lucide-react";
import { Link } from "react-router-dom";

export function ServiciosBuquePage() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="/services/buque.png" alt="Servicios al Buque" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> Volver a Servicios
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Husbandry Services
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Servicios al Buque
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Asistencia integral de "Husbandry" para el mantenimiento, aprovisionamiento y bienestar de su tripulación.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            <div className="lg:w-2/3">
              <div className="w-16 h-16 bg-[#0b1a2e]/10 rounded flex items-center justify-center mb-6">
                <Wrench className="text-[#0b1a2e]" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-4">Todo lo que su motonave necesita en puerto</h2>
              <div className="w-16 h-1 bg-[#0b1a2e] mb-8"></div>
              <p className="text-gray-600 leading-relaxed text-lg mb-10">
                El agenciamiento portuario no se detiene en la papelería legal; entendemos la importancia de cada minuto de estadía de su embarcación. Por ello, brindamos toda la supervisión y logística operativa (Husbandry) para atender los requerimientos técnicos y humanos de la tripulación con eficiencia para así evitar demoras o contratiempos.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex gap-4">
                  <Package className="text-[#00A9CE] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] text-lg mb-2">Víveres y Provisiones</h4>
                    <p className="text-gray-600 text-sm">Abastecimiento completo y fresco para la tripulación durante todo el itinerario marítimo estipulado.</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex gap-4">
                  <Droplets className="text-[#00A9CE] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] text-lg mb-2">Bunkering & Agua</h4>
                    <p className="text-gray-600 text-sm">Suministro rápido y normado de agua potable y reabastecimiento de combustible en puerto.</p>
                  </div>
                </div>

                <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex gap-4">
                  <HeartPulse className="text-[#00A9CE] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] text-lg mb-2">Asistencia a Tripulación</h4>
                    <p className="text-gray-600 text-sm">Gestión de atención médica de urgencia en clínicas locales y procesos de relevo de personal de mando.</p>
                  </div>
                </div>

                <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex gap-4">
                  <HardHat className="text-[#00A9CE] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] text-lg mb-2">Reparaciones en Sitio</h4>
                    <p className="text-gray-600 text-sm">Coordinación de talleres certificados para reparaciones de emergencia y recambio de repuestos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 w-full bg-[#0b1a2e] text-white p-8 rounded-sm shadow-lg sticky top-28">
              <h3 className="text-xl font-bold mb-4">Gestión B2B Directa</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Los Armadores con cuenta en <strong>Serviport OS</strong> pueden contratar directamente los servicios y provisiones durante el atraque, generando notificaciones inmediatas al departamento operativo.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-300">
                <li className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE]" /> Pre-aprobación del Discharge Account</li>
                <li className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE]" /> Notificación 24h a Operaciones</li>
                <li className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE]" /> Solicitud con carga de requisitos técnicos</li>
              </ul>
              <Link to="/portal" className="block w-full bg-[#00A9CE] text-white text-center font-bold py-3 px-4 rounded-sm hover:bg-[#008EBF] transition-colors uppercase text-sm tracking-widest">
                Ingreso al Portal
              </Link>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
