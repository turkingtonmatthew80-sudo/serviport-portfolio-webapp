import { MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function LocationsPartnersSection() {
  return (
    <section className="w-full flex flex-col justify-center py-6 md:py-10 px-4 md:px-6 bg-gray-50 border-b border-gray-200 min-h-[auto] lg:min-h-[90vh]">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col justify-between h-full gap-4 lg:max-h-[750px]">
        {/* Locations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center gap-2"
      >
        <div className="text-center mb-2 md:mb-4">
          <div className="inline-block px-2 py-1 bg-[#00A9CE] text-white font-bold tracking-wider text-[10px] mb-1 md:mb-2 uppercase shadow-sm">
            Nuestra Presencia
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-[#0b1a2e] mb-2 leading-[1.15]">
            En los principales puertos del País
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-2 md:mb-4">
            Cobertura comercial y física en los nodos marítimos más estratégicos de Venezuela.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6 shrink-0">
           <div className="bg-white p-4 lg:p-6 border-t-4 border-[#00A9CE] shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-lg bg-[#00A9CE]/10 border border-[#00A9CE]/20 flex items-center justify-center mb-3">
               <Navigation className="text-[#00A9CE] w-5 h-5" strokeWidth={2} />
             </div>
             <h3 className="text-lg font-bold text-[#0b1a2e] mb-2">Puerto Cabello</h3>
             <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Sede principal, operativa y logística. Núcleo de las operaciones del AGD y Serviport OS.</p>
           </div>
           
           <div className="bg-white p-4 lg:p-6 border-t-4 border-[#0b1a2e] shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-lg bg-[#00A9CE]/10 border border-[#00A9CE]/20 flex items-center justify-center mb-3">
               <MapPin className="text-[#00A9CE] w-5 h-5" strokeWidth={2} />
             </div>
             <h3 className="text-lg font-bold text-[#0b1a2e] mb-2">La Guaira</h3>
             <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Oficina comercial estratégica para atención a clientes y agenciamiento en la región capital.</p>
           </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 shrink-0">
      {/* Partners */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-white border p-4 md:p-6 text-center shadow-sm w-full md:w-1/2 flex flex-col justify-center"
      >
         <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1a2e] mb-3 leading-[1.15]">Nuestros Aliados</h2>
         <p className="text-gray-600 leading-relaxed mb-4 text-xs md:text-sm max-w-sm mx-auto">
           A través de nuestra red comercial de aliados logramos mantener la trazabilidad para crecer juntos.
         </p>
         <div className="flex flex-wrap justify-center items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="text-sm font-bold font-serif">SERVIPORT</div>
           <div className="text-sm font-bold tracking-tighter">CCB</div>
           <div className="text-sm font-black italic">SIRIUS</div>
           <div className="text-sm font-medium tracking-widest text-[#00A9CE]">BOLIPUERTOS</div>
         </div>
      </motion.div>

      {/* Nuevos Proyectos */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-[#0b1a2e] text-white p-4 md:p-6 rounded-2xl shadow-xl flex flex-col items-center text-center justify-center w-full md:w-1/2"
      >
        <div className="w-full">
          <div className="inline-block px-2 py-1 bg-[#00A9CE] text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Futuro
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold mb-2 leading-[1.15]">Nuevos proyectos</h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
            Acompañanos en este proceso de expansión operativa y tecnológica para atender la creciente demanda.
          </p>
        </div>
        <div className="shrink-0 flex gap-2 w-full justify-center">
          <Link to="/contacto" className="group bg-[#F7941D] text-white px-4 py-2 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-[#F7941D]/20 text-xs md:text-sm uppercase tracking-wider w-fit">
            CONTACTAR
          </Link>
        </div>
      </motion.div>
      </div>

      </div>
    </section>
  );
}
