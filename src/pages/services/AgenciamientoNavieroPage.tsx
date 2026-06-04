import { Anchor, CheckCircle2, ShieldCheck, Ship, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AgenciamientoNavieroPage() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="/services/agenciamiento.png" alt="Agenciamiento Naviero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> Volver a Servicios
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Shipping Agency
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Agenciamiento Naviero
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Representación legal e integral de tu buque ante INEA, SENIAT y autoridades portuarias venezolanas.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-12">
              <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-md">
                <div className="w-12 h-12 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
                  <Anchor className="text-[#00A9CE]" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-[#0b1a2e] mb-4">Agentes Navieros Generales</h2>
                <div className="w-12 h-1 bg-[#00A9CE] mb-6"></div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Serviport actúa como representante legal e integral de buques y motonaves ante las autoridades portuarias venezolanas: INEA (Instituto Nacional de los Espacios Acuáticos), SENIAT (Aduana) y Bolipuertos S.A. Gestionamos todos los trámites de arribo, atraque, operaciones y zarpe, asegurando el cumplimiento normativo y la agilidad portuaria.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-1" size={18} /> <span className="text-gray-700">Tramitación de aviso de arribo y manifiesto de carga.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-1" size={18} /> <span className="text-gray-700">Coordinación de práctico, remolcadores y amarre.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-1" size={18} /> <span className="text-gray-700">Gestión de reconocimiento aduanero y actas de inspección.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-1" size={18} /> <span className="text-gray-700">Liquidación de gastos portuarios y emisión de Disbursement Account.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-1" size={18} /> <span className="text-gray-700">Representación ante organismos de control (Cuarentena, INEA).</span></li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-md">
                <div className="w-12 h-12 bg-[#0b1a2e]/10 rounded flex items-center justify-center mb-6">
                  <ShieldCheck className="text-[#0b1a2e]" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-[#0b1a2e] mb-4">Agentes Protectores</h2>
                <div className="w-12 h-1 bg-[#0b1a2e] mb-6"></div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Ofrecemos resguardo estricto de los intereses de armadores y fletadores durante la estadía del buque en puerto. Serviport actúa como contraparte independiente que supervisa que todas las operaciones se ejecuten conforme a los términos del contrato de fletamento.
                </p>
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm text-sm text-gray-700 italic border-l-4 border-l-[#F7941D]">
                  "Protegemos la economía de su viaje y la integridad de la tripulación en los principales puertos venezolanos."
                </div>
              </div>

              <div className="bg-[#0b1a2e] text-white rounded-sm p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4">¿Necesitas optimizar tu estadía en puerto?</h3>
                <p className="text-slate-300 mb-8">
                  Solicita una cotización o ingresa a Serviport OS para coordinar el próximo Port Call.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/herramientas" className="bg-[#00A9CE] font-bold px-6 py-3 text-center rounded-sm hover:bg-[#008EBF] transition-colors whitespace-nowrap">
                    Cotizar Servicio
                  </Link>
                  <Link to="/portal" className="bg-white/10 font-bold px-6 py-3 text-center rounded-sm hover:bg-white/20 transition-colors whitespace-nowrap">
                    Acceder al Portal B2B
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
