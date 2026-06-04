import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function HistoryPage() {
  const timeline = [
    {
      year: "Fundación",
      title: "Nace Serviport Agentes Navieros",
      content: "Serviport Agentes Navieros, C.A. nace con la visión de brindar agenciamiento naviero profesional y operaciones logísticas en el principal puerto de Venezuela."
    },
    {
      year: "Expansión",
      title: "Expansión a La Guaira",
      content: "Apertura de oficina comercial en Maiquetía/La Guaira para atender la alta demanda de importación y exportación de la región capital y central."
    },
    {
      year: "Infraestructura",
      title: "Desarrollo de Infraestructura Propia",
      content: "Adquisición y desarrollo del Almacén General de Depósito (AGD) en Puerto Cabello, consolidando la capacidad de ofrecer servicios integrales de logística sin terceros."
    },
    {
      year: "Especialización",
      title: "Almacén de Vacíos y Reefers",
      content: "Inauguración de la zona especializada para contenedores vacíos, con nuevos servicios de lavado de unidades, reparación técnica bajo normas IICL y conexión eléctrica directa para reefers."
    },
    {
      year: "Calidad",
      title: "Certificación ISO 9001:2015",
      content: "Obtención de la certificación de calidad internacional, marcando un hito en nuestra profesionalización y comprometiendo a la empresa con un modelo de mejora continua auditable."
    },
    {
      year: "Tecnología",
      title: "Serviport OS",
      content: "Lanzamiento del portal B2B 'Serviport OS', el primer sistema operativo comercial pionero en la digitalización y trazabilidad en tiempo real de operaciones portuarias en Venezuela."
    },
    {
      year: "2026 - Presente",
      title: "El Horizonte Logístico",
      content: "Serviport continúa expandiendo sus capacidades operativas y tecnológicas, consolidándose como el aliado logístico integral y de confianza de referencia en los principales puertos venezolanos."
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&q=80" alt="Nuestra Historia" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/85" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/nosotros" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> VOLVER A NOSOTROS
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Línea de Tiempo Operativa
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Nuestra Historia
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Desde nuestros inicios como agentes navieros hasta convertirnos en líderes en digitalización y operaciones portuarias integrales.
          </p>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          
          <div className="relative border-l-4 border-[#0b1a2e] ml-4 md:ml-0 md:pl-10 space-y-16 pl-8 py-4">
            {timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[45px] md:-left-[60px] top-1 w-6 h-6 rounded-full bg-[#00A9CE] border-4 border-slate-50 flex items-center justify-center shadow-sm z-10">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>

                <div className="bg-white p-8 lg:p-10 border border-gray-100 shadow-md rounded-sm group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                     <Clock className="text-[#F7941D]" size={20} />
                     <span className="font-bold text-[#F7941D] tracking-wider uppercase text-sm">{item.year}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
