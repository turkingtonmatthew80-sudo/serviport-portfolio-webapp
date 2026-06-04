import { MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

export function LocationsPartnersSection() {
  return (
    <section className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center gap-16 lg:gap-24">
        {/* Locations */}
      <div>
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-[#00A9CE] text-white font-bold tracking-wider text-sm md:text-base mb-6 uppercase shadow-sm">
            Nuestra Presencia
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[#0b1a2e] mb-6 leading-[1.15]">
            En los principales puertos del País
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Cobertura comercial y física en los nodos marítimos más estratégicos de Venezuela.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white p-8 lg:p-12 border-t-4 border-[#00A9CE] shadow-sm flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-[#00A9CE]/10 text-[#00A9CE] rounded-full flex items-center justify-center mb-6">
               <Navigation size={32} />
             </div>
             <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Puerto Cabello</h3>
             <p className="text-slate-600 mb-6">Sede principal, operativa y logística. Núcleo de las operaciones del AGD y Serviport OS.</p>
           </div>
           
           <div className="bg-white p-8 lg:p-12 border-t-4 border-[#0b1a2e] shadow-sm flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
               <MapPin size={32} />
             </div>
             <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">La Guaira</h3>
             <p className="text-slate-600 mb-6">Oficina comercial estratégica para atención a clientes y agenciamiento en la región capital.</p>
           </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/contacto" className="inline-block bg-[#0b1a2e] text-white px-8 py-3.5 rounded font-bold hover:bg-slate-800 transition-colors uppercase text-sm tracking-wider shadow-sm">
             Ver ubicaciones y contactos
          </Link>
        </div>
      </div>

      {/* Partners */}
      <div className="bg-white border p-12 lg:p-16 text-center shadow-sm">
         <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-6">Nuestros Aliados</h2>
         <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
           A través de nuestra red de aliados comerciales, Serviport logra mantener la trazabilidad de la carga durante toda la cadena logística; lo cual nos permite ahorrar tiempo, disminuir costos y esfuerzo. Con el principal objetivo de ¡CRECER JUNTOS!
         </p>
         <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="text-2xl font-bold font-serif">SERVIPORT</div>
           <div className="text-2xl font-bold tracking-tighter">CCB</div>
           <div className="text-2xl font-black italic">ALMACENADORA SIRIUS</div>
           <div className="text-2xl font-medium tracking-widest text-[#00A9CE]">BOLIPUERTOS</div>
         </div>
      </div>

      {/* Nuevos Proyectos */}
      <div className="bg-[#0b1a2e] text-white p-12 lg:p-16 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Nuevos proyectos</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Contáctanos para conocer sobre nuevos proyectos. Estamos expandiendo nuestras capacidades operativas y tecnológicas para atender la creciente demanda del comercio exterior venezolano.
          </p>
        </div>
        <div className="shrink-0">
          <Link to="/contacto" className="inline-block bg-[#00A9CE] text-white px-8 py-4 rounded font-bold hover:bg-[#008EBF] transition-colors uppercase text-sm tracking-widest shadow-md">
            CONTÁCTANOS
          </Link>
        </div>
      </div>

      </div>
    </section>
  );
}
