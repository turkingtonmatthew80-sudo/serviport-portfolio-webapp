import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export function ServicesSection() {
  const services = [
    { 
      title: "Agenciamiento Naviero", 
      path: "/servicios/agenciamiento-naviero",
      image: "/services/agenciamiento.png",
      description: "Representación legal e integral de tu buque ante INEA, SENIAT y autoridades portuarias venezolanas."
    },
    { 
      title: "Operaciones Portuarias", 
      path: "/servicios/operaciones-portuarias",
      image: "/services/operaciones.png",
      description: "Estiba y desestiba con cuadrillas profesionales. Operamos grúas móviles y maquinaria de alta capacidad para cualquier tipo de carga."
    },
    { 
      title: "Almacenaje y Resguardo", 
      path: "/servicios/almacenaje-resguardo",
      image: "/services/almacenaje.jpeg",
      description: "Protegemos su carga en nuestro propio Almacén General de Depósito para la nacionalización segura de mercancías."
    },
    { 
      title: "Fletamento Marítimo", 
      path: "/servicios/fletamento-maritimo",
      image: "/services/fletamento.png",
      description: "Intermediación de buques para el transporte de grandes volúmenes de carga o desarrollo de proyectos industriales especiales."
    },
    { 
      title: "Transporte de Mercancías", 
      path: "/servicios/transporte-mercancias",
      image: "/services/transporte.png",
      description: "Llevamos la mercancía desde o hacia el puerto con nuestra eficiente red logística de transporte en todo el territorio nacional."
    },
    { 
      title: "Servicios al Buque", 
      path: "/servicios/servicios-al-buque",
      image: "/services/buque.png",
      description: "Atendemos de manera oportuna todas las necesidades de la tripulación y de la embarcación durante el atraque: bunkering, víveres, agua, etc."
    }
  ];

  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section className="min-h-[100dvh] flex flex-col justify-center py-10 px-6 bg-[#0b1a2e] relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00A9CE]/5 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
      
      <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Text Content & Service List */}
          <div className="lg:w-7/12 w-full flex flex-col justify-center">
            <div className="mb-2">
              <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
                Soluciones Integrales
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                Nuestros Servicios
              </h2>
              <p className="text-slate-300 mb-4 leading-relaxed text-base md:text-lg pb-4 border-b border-white/10">
                Serviport es tu socio logístico ideal en Venezuela. Nuestro equipo de expertos brinda operaciones integrales desde la atención en muelle y estiba, hasta la administración del Almacén General de Depósito.
              </p>
            </div>

            <div className="space-y-1">
              {services.map((service, idx) => (
                <Link 
                  to={service.path}
                  key={idx} 
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className={`flex flex-col py-2 px-3 transition-all duration-300 cursor-pointer group rounded-lg ${
                    hoveredIndex === idx ? "bg-white/10 shadow-md border-l-4 border-[#00A9CE]" : "hover:bg-white/5 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ArrowRight size={18} strokeWidth={2.5} className={`transition-all duration-300 ${hoveredIndex === idx ? "text-[#00A9CE] translate-x-1.5" : "text-slate-500 group-hover:text-slate-400"}`} />
                    <span className={`text-base md:text-lg font-bold transition-colors ${hoveredIndex === idx ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                      {service.title}
                    </span>
                  </div>
                  
                  {/* Expandable description on hover */}
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-400 text-sm leading-relaxed pl-[30px] font-medium pr-4">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </div>

            <Link to="/servicios" className="flex items-center gap-2 text-[#00A9CE] font-bold hover:text-[#008EBF] transition-colors uppercase tracking-wider text-sm md:text-base mt-6 w-fit">
              <ArrowRight size={20} strokeWidth={2.5} /> TODOS NUESTROS SERVICIOS
            </Link>
          </div>

          {/* Dynamic Image Display */}
          <div className="lg:w-5/12 w-full mt-8 lg:mt-0">
            <div className="w-full h-full relative overflow-hidden rounded-xl shadow-2xl border border-white/10 group cursor-pointer transition-colors duration-500 hover:border-[#00A9CE]/50 min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={hoveredIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={services[hoveredIndex].image}
                  alt={services[hoveredIndex].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e] via-[#0b1a2e]/40 to-transparent opacity-90" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-10 h-1.5 bg-[#00A9CE] mb-4" />
                    <h3 className="text-balance text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                      {services[hoveredIndex].title}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
