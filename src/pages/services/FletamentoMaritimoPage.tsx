import { ArrowRight, Compass, Ship, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function FletamentoMaritimoPage() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="/services/fletamento.png" alt="Fletamento Marítimo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> Volver a Servicios
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Chartering
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Fletamento Marítimo
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Intermediación y cotización de buques para el transporte de grandes volúmenes y proyectos a escala global.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
                <Compass className="text-[#00A9CE]" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-4">La ruta ideal para tu carga a gran escala</h2>
              <div className="w-16 h-1 bg-[#00A9CE] mb-6"></div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Serviport conecta a armadores y fletadores con la flota adecuada según el tipo de mercancía, ruta y condiciones requeridas. Facilitamos el arrendamiento (fletamento) de motonaves completas para el traslado eficaz y competitivo de grandes toneladas de materias primas o equipos sobredimensionados hasta o desde puertos venezolanos.
              </p>
              
              <div className="space-y-4 pt-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-50 border border-gray-100 p-2 rounded shrink-0 text-[#0b1a2e]">
                    <Ship size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] text-lg">Tipos de Carga</h4>
                    <p className="text-gray-600 text-sm mt-1">Buques especializados para carga a granel (sólida y líquida), carga refrigerada en flota dedicada, mercancía general, contenerizada y cargas proyecto (Heavy Lift).</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-gray-50 border border-gray-100 p-2 rounded shrink-0 text-[#0b1a2e]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] text-lg">Negociación y Contratos</h4>
                    <p className="text-gray-600 text-sm mt-1">Asesoría para modalidades de Time Charter y Voyage Charter, protegiendo financieramente la carga y logrando tarifas competitivas en el mercado mundial.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gray-50 border border-gray-100 p-8 md:p-10 rounded-sm">
              <h3 className="text-2xl font-bold text-[#0b1a2e] mb-6">Servicios de Chartering</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 border-b border-gray-200 pb-4">
                  <CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700 font-medium">Búsqueda rápida de tonelaje disponible y posición de buques a nivel global.</span>
                </li>
                <li className="flex items-start gap-3 border-b border-gray-200 pb-4">
                  <CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700 font-medium">Negociación de los términos y condiciones de flete (Charter Party).</span>
                </li>
                <li className="flex items-start gap-3 border-b border-gray-200 pb-4">
                  <CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700 font-medium">Coordinación directa de operaciones de embarque/desembarque.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700 font-medium">Asesoría integral en cálculo de tiempos, laytime, demoras y despachos.</span>
                </li>
              </ul>
              <Link to="/herramientas" className="mt-8 flex items-center justify-center gap-2 bg-[#0b1a2e] text-white font-bold py-3 px-6 rounded-sm hover:bg-slate-800 transition-colors uppercase text-sm tracking-wider w-full">
                Solicitar Cotización de Buque
              </Link>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
