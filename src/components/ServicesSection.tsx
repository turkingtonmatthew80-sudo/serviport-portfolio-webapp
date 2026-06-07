import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // There are 6 items, so 0 to 1 should be split into 6 segments
    const sections = services.length;
    // We want index to be from 0 to 5.
    // e.g. latest = 0.99 => 0.99 * 6 = 5.94 -> Math.floor -> 5
    // except if latest === 1, it might jump out of bounds, so clamp it
    const index = Math.min(Math.floor(latest * sections), sections - 1);
    
    // We only update if the index is non-negative and actually changed
    // Sometimes latest can be < 0 slightly on overscroll, so clamp to 0
    const clampedIndex = Math.max(0, index);
    
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
    }
  });

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-[#0b1a2e]">
      <div className="sticky top-0 min-h-screen flex flex-col justify-center py-4 lg:py-10 px-4 md:px-6 overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00A9CE]/5 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
        
          <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-stretch pt-12 md:pt-16 lg:pt-0">
            {/* Text Content & Service List */}
            <div className="lg:w-7/12 w-full flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-2"
              >
                <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
                  Soluciones Integrales
                </div>
                <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white mb-3 md:mb-6 leading-[1.15]">
                  Nuestros Servicios
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3 md:mb-5 pb-3 md:pb-5 border-b border-white/10">
                  Serviport es tu socio logístico ideal en Venezuela. Nuestro equipo de expertos brinda operaciones integrales desde la atención en muelle y estiba, hasta la administración del Almacén General de Depósito.
                </p>
              </motion.div>

              <div className="space-y-0.5 md:space-y-1">
                {services.map((service, idx) => (
                  <Link 
                    to={service.path}
                    key={idx} 
                    className={`flex flex-col py-1 md:py-1.5 px-2 transition-all duration-300 cursor-pointer group rounded-lg ${
                      activeIndex === idx ? "bg-white/10 shadow-md border-l-4 border-[#00A9CE]" : "hover:bg-white/5 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <ArrowRight size={16} strokeWidth={2.5} className={`transition-all duration-300 md:w-[18px] md:h-[18px] ${activeIndex === idx ? "text-[#00A9CE] translate-x-1.5" : "text-slate-500 group-hover:text-slate-400"}`} />
                      <span className={`text-sm md:text-lg font-bold transition-colors ${activeIndex === idx ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                        {service.title}
                      </span>
                    </div>
                    
                    {/* Expandable description on active */}
                    <AnimatePresence>
                      {activeIndex === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 2 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-slate-400 text-xs leading-snug md:leading-relaxed pl-[28px] md:pl-[30px] font-medium pr-2">
                            {service.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Link to="/servicios" className="group border-2 border-[#F7941D] text-[#F7941D] hover:text-white hover:bg-[#F7941D] px-6 md:px-10 py-2.5 md:py-4 rounded font-bold transition-colors flex items-center justify-center gap-2 md:gap-3 text-center text-xs md:text-base uppercase tracking-wider w-fit mt-4 md:mt-6">
                  TODOS NUESTROS SERVICIOS
                  <motion.span className="inline-block transition-transform group-hover:translate-x-1"><ArrowRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} /></motion.span>
                </Link>
              </motion.div>
            </div>

            {/* Dynamic Image Display */}
            <div className="lg:w-5/12 w-full mt-2 lg:mt-0 lg:h-auto h-[25vh] md:h-[35vh] min-h-[180px] md:min-h-[300px]">
              <div className="w-full h-full relative overflow-hidden rounded-xl shadow-2xl border border-white/10 group cursor-pointer transition-colors duration-500 hover:border-[#00A9CE]/50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={services[activeIndex].image}
                    alt={services[activeIndex].title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e] via-[#0b1a2e]/40 to-transparent opacity-90" />
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pb-4 md:pb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-8 h-1 bg-[#00A9CE] mb-2" />
                      <h3 className="text-balance text-xl md:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                        {services[activeIndex].title}
                      </h3>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
