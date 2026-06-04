import { ArrowRight, Compass, ShieldCheck, MapPin, Map as MapIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function NetworkPage() {
  const [activeMap, setActiveMap] = useState<string | null>(null);

  const mapData = {
    'puerto-cabello': {
      title: 'Puerto Cabello, Carabobo',
      src: 'https://maps.google.com/maps?q=Bolipuertos%20Puerto%20Cabello,%20Venezuela&t=&z=14&ie=UTF8&iwloc=&output=embed'
    },
    'la-guaira': {
      title: 'La Guaira, Venezuela',
      src: 'https://maps.google.com/maps?q=Multicentro%20Maiquetia,%20La%20Guaira,%20Venezuela&t=&z=15&ie=UTF8&iwloc=&output=embed'
    }
  };

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559297292-0b2a75225e?auto=format&fit=crop&q=80" alt="Nuestra Red de Puertos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/85" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/nosotros" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> VOLVER A NOSOTROS
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Nuestra Red
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            En los principales puertos del País
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Cobertura comercial y física en los nodos marítimos más estratégicos de Venezuela. Control total de tus operaciones donde más lo necesitas.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          
          {/* Puerto Cabello */}
          <div className="flex flex-col h-full bg-white shadow-xl rounded-sm overflow-hidden border border-gray-100 group">
            <div className="h-64 relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" alt="Puerto Cabello" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e]/90 via-[#0b1a2e]/40 to-transparent flex flex-col justify-end p-8">
                 <h2 className="text-3xl font-bold text-white mb-2">Puerto Cabello</h2>
                 <span className="text-sm font-bold uppercase tracking-widest text-[#00A9CE]">Sede Principal y Operativa</span>
               </div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-gray-600 leading-relaxed font-medium mb-8 text-lg">
                Puerto Cabello es el núcleo de las operaciones de Serviport OS. Aquí gestionamos agenciamiento naviero, operaciones de estiba/desestiba, almacenaje en AGD, manejo de patio y servicios al buque.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 mb-8">
                <h4 className="font-bold text-[#0b1a2e] mb-4 uppercase tracking-wider text-sm">Capacidad Instalada</h4>
                <ul className="space-y-3 test-sm text-gray-700">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full mt-1.5 shrink-0" /> Operamos en 11 de los 32 Puestos de Atraque del terminal.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full mt-1.5 shrink-0" /> 19 Patios de almacenamiento a cielo abierto.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full mt-1.5 shrink-0" /> 9 Almacenes techados (Galpones) para carga suelta.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full mt-1.5 shrink-0" /> Descarga directa a infraestructura de Silos de Bolipuertos.</li>
                </ul>
              </div>

              <button 
                onClick={() => setActiveMap('puerto-cabello')}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-[#0b1a2e] text-white font-bold py-4 px-6 rounded-sm hover:bg-[#1a365d] transition-colors uppercase text-sm tracking-wider"
              >
                <MapPin size={20} /> Ver Ubicación en Mapa
              </button>
            </div>
          </div>

          {/* La Guaira */}
          <div className="flex flex-col h-full bg-white shadow-xl rounded-sm overflow-hidden border border-gray-100 group">
            <div className="h-64 relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80" alt="La Guaira" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e]/90 via-[#0b1a2e]/40 to-transparent flex flex-col justify-end p-8">
                 <h2 className="text-3xl font-bold text-white mb-2">La Guaira</h2>
                 <span className="text-sm font-bold uppercase tracking-widest text-[#F7941D]">Oficina Comercial</span>
               </div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-gray-600 leading-relaxed font-medium mb-8 text-lg">
                Nuestra oficina comercial en Maiquetía/La Guaira atiende la demanda de la región capital y central del país.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 mb-8">
                <h4 className="font-bold text-[#0b1a2e] mb-4 uppercase tracking-wider text-sm">Enfoque Comercial</h4>
                <ul className="space-y-3 test-sm text-gray-700">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#F7941D] rounded-full mt-1.5 shrink-0" /> Facilitamos el contacto directo con importadores y exportadores de la capital.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#F7941D] rounded-full mt-1.5 shrink-0" /> Enlace de representación comercial para navieras internacionales.</li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#F7941D] rounded-full mt-1.5 shrink-0" /> Operaciones de enlace en el principal puerto contenerizado del país.</li>
                </ul>
              </div>

              <button 
                onClick={() => setActiveMap('la-guaira')}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-white border-2 border-[#0b1a2e] text-[#0b1a2e] font-bold py-4 px-6 rounded-sm hover:bg-[#0b1a2e] hover:text-white transition-colors uppercase text-sm tracking-wider"
              >
                <MapPin size={20} /> Ver Ubicación en Mapa
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* MAP MODAL */}
      <AnimatePresence>
        {activeMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1a2e]/80 p-4 sm:p-6 backdrop-blur-sm"
            onClick={() => setActiveMap(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-[#0b1a2e] flex items-center gap-3">
                  <MapPin className="text-[#00A9CE]" size={24} />
                  Ubicación: {mapData[activeMap as keyof typeof mapData].title}
                </h3>
                <button 
                  onClick={() => setActiveMap(null)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-[#F7941D]"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="w-full h-[60vh] bg-slate-100">
                <iframe 
                  src={mapData[activeMap as keyof typeof mapData].src} 
                  title={`Mapa de ${mapData[activeMap as keyof typeof mapData].title}`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
