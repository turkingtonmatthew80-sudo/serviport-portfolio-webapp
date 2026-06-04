import { ArrowRight, HeartHandshake, Leaf, ShieldAlert, Users, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function CSRPage() {
  const pillars = [
    {
      icon: ShieldAlert,
      color: "text-[#F7941D]",
      bg: "bg-[#F7941D]/10",
      title: "Seguridad y Salud Ocupacional",
      content: [
        "Protocolos estrictos de seguridad para todos los trabajadores portuarios.",
        "Capacitación continua en manejo de emergencias, primeros auxilios y prevención.",
        "Equipos de protección personal (EPP) de clase internacional.",
        "Programa integral de salud ocupacional con chequeos médicos periódicos preventivos."
      ]
    },
    {
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
      title: "Impacto y Medio Ambiente",
      content: [
        "Gestión responsable de los residuos generados en operaciones portuarias.",
        "Estricto control de derrames y despliegue de protocolos de contingencia ambiental.",
        "Uso eficiente de combustible en toda nuestra maquinaria y flota terrestre.",
        "Cumplimiento total de normas MARPOL y legislación ambiental de Venezuela."
      ]
    },
    {
      icon: Users,
      color: "text-[#00A9CE]",
      bg: "bg-[#00A9CE]/10",
      title: "Desarrollo Local y Comunitario",
      content: [
        "Empleo prioritario para residentes de Puerto Cabello y zonas aledañas.",
        "Programas de capacitación técnica y oficios portuarios para talento joven.",
        "Apoyo constante a diversas iniciativas comunitarias locales en salud e infraestructuras.",
        "Compromiso cívico con el desarrollo socio-económico regional del Estado Carabobo."
      ]
    },
    {
      icon: Scale,
      color: "text-[#0b1a2e]",
      bg: "bg-[#0b1a2e]/10",
      title: "Comercio Ético y Sostenible",
      content: [
        "Promoción y ejecución activa de prácticas de comercio justo y transparente.",
        "Colaboración estratégica con cadenas de proveedores locales enfocadas en sostenibilidad.",
        "Auditorías preventivas anti-corrupción y cumplimiento de regulaciones aduaneras.",
        "Transparencia garantizada en las cotizaciones y operaciones con nuestros aliados B2B."
      ]
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80" alt="Responsabilidad Social" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-emerald-900/85" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/nosotros" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> VOLVER A NOSOTROS
          </Link>
          <div className="inline-block px-4 py-2 bg-emerald-500 text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Programas RSE
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Compromiso con Venezuela
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 font-medium max-w-3xl leading-relaxed">
            Una estrategia logística líder debe ir acompañada de un firme sentido ético, ambiental y social en beneficio de todos.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <HeartHandshake className="text-emerald-700" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">Nuestros Cuatro Pilares Fundamentales</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              En Serviport, la responsabilidad social empresarial (RSE) no es una meta accesoria, forma parte del núcleo estructural del sistema operativo. Desarrollamos nuestras relaciones y espacios portuarios de manera responsable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {pillars.map((pillar, idx) => {
               const Icon = pillar.icon;
               return (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="bg-white p-10 shadow-lg border border-gray-100 rounded-sm hover:-translate-y-1 transition-transform"
                 >
                   <div className="flex items-center gap-5 mb-8">
                     <div className={`w-14 h-14 ${pillar.bg} rounded flex items-center justify-center shrink-0`}>
                       <Icon className={pillar.color} size={28} />
                     </div>
                     <h3 className="text-2xl font-bold text-[#0b1a2e]">{pillar.title}</h3>
                   </div>
                   <ul className="space-y-4">
                     {pillar.content.map((point, i) => (
                       <li key={i} className="flex items-start gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                         <p className="text-gray-700 leading-relaxed">{point}</p>
                       </li>
                     ))}
                   </ul>
                 </motion.div>
               );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
