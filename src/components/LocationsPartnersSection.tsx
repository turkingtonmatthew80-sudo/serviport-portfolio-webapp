import { MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function LocationsPartnersSection() {
  return (
    <section className="min-h-[100dvh] flex flex-col justify-center py-16 md:py-24 px-4 md:px-6 bg-gray-50 border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col justify-center gap-16 lg:gap-24">
        {/* Locations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
            Nuestra Presencia
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[#0b1a2e] mb-6 leading-[1.15]">
            En los principales puertos del País
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            Cobertura comercial y física en los nodos marítimos más estratégicos de Venezuela.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white p-8 lg:p-12 border-t-4 border-[#00A9CE] shadow-sm flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-2xl bg-[#00A9CE]/10 border border-[#00A9CE]/20 flex items-center justify-center mb-6">
               <Navigation className="text-[#00A9CE] w-8 h-8" strokeWidth={2} />
             </div>
             <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Puerto Cabello</h3>
             <p className="text-gray-600 mb-6 text-lg leading-relaxed">Sede principal, operativa y logística. Núcleo de las operaciones del AGD y Serviport OS.</p>
           </div>
           
           <div className="bg-white p-8 lg:p-12 border-t-4 border-[#0b1a2e] shadow-sm flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-2xl bg-[#00A9CE]/10 border border-[#00A9CE]/20 flex items-center justify-center mb-6">
               <MapPin className="text-[#00A9CE] w-8 h-8" strokeWidth={2} />
             </div>
             <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">La Guaira</h3>
             <p className="text-gray-600 mb-6 text-lg leading-relaxed">Oficina comercial estratégica para atención a clientes y agenciamiento en la región capital.</p>
           </div>
        </div>
        
        <div className="mt-12 text-center flex justify-center">
          <Link to="/contacto" className="group bg-[#0b1a2e] text-white px-8 md:px-10 py-4 rounded font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-3 text-center text-sm md:text-base uppercase tracking-wider w-fit">
             VER UBICACIONES Y CONTACTOS
          </Link>
        </div>
      </motion.div>

      {/* Partners */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-white border p-12 lg:p-16 text-center shadow-sm"
      >
         <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
           Cooperación
         </div>
         <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[#0b1a2e] mb-6 leading-[1.15]">Nuestros Aliados</h2>
         <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 text-lg">
           A través de nuestra red de aliados comerciales, Serviport logra mantener la trazabilidad de la carga durante toda la cadena logística; lo cual nos permite ahorrar tiempo, disminuir costos y esfuerzo. Con el principal objetivo de ¡CRECER JUNTOS!
         </p>
         <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="text-2xl font-bold font-serif">SERVIPORT</div>
           <div className="text-2xl font-bold tracking-tighter">CCB</div>
           <div className="text-2xl font-black italic">ALMACENADORA SIRIUS</div>
           <div className="text-2xl font-medium tracking-widest text-[#00A9CE]">BOLIPUERTOS</div>
         </div>
      </motion.div>

      {/* Nuevos Proyectos */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-[#0b1a2e] text-white p-12 lg:p-16 rounded-2xl shadow-xl flex flex-col items-center text-center mt-16 md:mt-24"
      >
        <div className="w-full max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
            Futuro
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold mb-6 leading-[1.15]">Nuevos proyectos</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            Contáctanos para conocer sobre nuevos proyectos. Estamos expandiendo nuestras capacidades operativas y tecnológicas para atender la creciente demanda del comercio exterior venezolano.
          </p>
        </div>
        <div className="shrink-0">
          <Link to="/contacto" className="group bg-[#F7941D] text-white px-8 md:px-10 py-4 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-[#F7941D]/20 flex items-center justify-center gap-3 text-center text-sm md:text-base uppercase tracking-wider w-fit">
            CONTÁCTANOS
          </Link>
        </div>
      </motion.div>

      </div>
    </section>
  );
}
