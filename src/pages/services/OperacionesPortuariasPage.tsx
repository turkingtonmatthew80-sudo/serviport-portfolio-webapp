import { ArrowRight, CheckCircle2, HardHat, Forklift, Box } from "lucide-react";
import { Link } from "react-router-dom";

export function OperacionesPortuariasPage() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="/services/operaciones.png" alt="Operaciones Portuarias" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> Volver a Servicios
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Port Operations
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Operaciones Portuarias
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Estiba, desestiba y manejo de patio con cuadrillas profesionales y maquinaria de alta capacidad.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
                <Box className="text-[#00A9CE]" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-4">Estiba y Desestiba</h2>
              <div className="w-16 h-1 bg-[#00A9CE] mb-6"></div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ejecutamos operaciones de carga y descarga de navíos con cuadrillas profesionales de estibadores certificados. Serviport maneja todo tipo de carga garantizando los más altos estándares de seguridad y eficiencia en el puerto.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-sm p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-6">Tipos de carga que manejamos:</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={18} /> <span className="text-gray-700">Contenedores llenos (FCL) y vacíos.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={18} /> <span className="text-gray-700">Carga a granel (granos, cereales) a silos.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={18} /> <span className="text-gray-700">Carga general y suelta (breakbulk).</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={18} /> <span className="text-gray-700">Carga refrigerada (reefers).</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={18} /> <span className="text-gray-700">Carga peligrosa bajo normas IMDG.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={18} /> <span className="text-gray-700">Buques Ro-Ro y cargas proyectos.</span></li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative rounded-xl overflow-hidden shadow-2xl h-[400px]">
              <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" alt="Maquinaria de Patio" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="w-16 h-16 bg-[#F7941D]/10 rounded flex items-center justify-center mb-6">
                <Forklift className="text-[#F7941D]" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-4">Manejo de Patio y Maquinaria</h2>
              <div className="w-16 h-1 bg-[#F7941D] mb-6"></div>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Realizamos operaciones con equipos pesados de alta capacidad en el terminal portuario, garantizando agilidad en el movimiento de contenedores y carga sobredimensionada.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="bg-[#0b1a2e] text-white p-2 rounded shrink-0"><HardHat size={20} /></div>
                  <div>
                    <h4 className="font-bold text-[#0b1a2e]">Grúas Inteligentes</h4>
                    <p className="text-sm text-gray-600">Grúas móviles y flotantes con capacidad desde 25 hasta más de 100 toneladas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-[#0b1a2e] text-white p-2 rounded shrink-0"><Forklift size={20} /></div>
                  <div>
                    <h4 className="font-bold text-[#0b1a2e]">Reach Stackers y Montacargas</h4>
                    <p className="text-sm text-gray-600">Equipamiento robusto para el apilamiento de contenedores y manejo de carga general/paletizada.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-[#0b1a2e] text-white p-2 rounded shrink-0"><Box size={20} /></div>
                  <div>
                    <h4 className="font-bold text-[#0b1a2e]">Alquiler de Aparejos</h4>
                    <p className="text-sm text-gray-600">Alquiler de aparejos de estiba, chasis con genset y maquinaria complementaria porta contenedores.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
