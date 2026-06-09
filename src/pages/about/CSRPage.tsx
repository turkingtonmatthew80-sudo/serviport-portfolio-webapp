import {
  ArrowLeft, ArrowRight,
  HeartHandshake,
  Leaf,
  ShieldAlert,
  Users,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function CSRPage() {
  const pillars = [
    {
      icon: ShieldAlert,
      color: "text-accent",
      bg: "bg-accent/10",
      title: "Seguridad y Salud Ocupacional",
      content: [
        "Protocolos estrictos de seguridad para todos los trabajadores portuarios.",
        "Capacitación continua en manejo de emergencias, primeros auxilios y prevención.",
        "Equipos de protección personal (EPP) de clase internacional.",
        "Programa integral de salud ocupacional con chequeos médicos periódicos preventivos.",
      ],
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
        "Cumplimiento total de normas MARPOL y legislación ambiental de Venezuela.",
      ],
    },
    {
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      title: "Desarrollo Local y Comunitario",
      content: [
        "Empleo prioritario para residentes de Puerto Cabello y zonas aledañas.",
        "Programas de capacitación técnica y oficios portuarios para talento joven.",
        "Apoyo constante a diversas iniciativas comunitarias locales en salud e infraestructuras.",
        "Compromiso cívico con el desarrollo socio-económico regional del Estado Carabobo.",
      ],
    },
    {
      icon: Scale,
      color: "text-foreground",
      bg: "bg-secondary/10",
      title: "Comercio Ético y Sostenible",
      content: [
        "Promoción y ejecución activa de prácticas de comercio justo y transparente.",
        "Colaboración estratégica con cadenas de proveedores locales enfocadas en sostenibilidad.",
        "Auditorías preventivas anti-corrupción y cumplimiento de regulaciones aduaneras.",
        "Transparencia garantizada en las cotizaciones y operaciones con nuestros aliados B2B.",
      ],
    },
  ];

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <Link
            to="/nosotros"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors uppercase tracking-wider text-xs mb-6 mx-auto md:mx-0"
          >
            <ArrowLeft size={16}  /> VOLVER A NOSOTROS
          </Link>
          <br />

          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Compromiso con Venezuela
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Una estrategia logística líder debe ir acompañada de un firme
            sentido ético, ambiental y social en beneficio de todos.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full bg-background-muted">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <HeartHandshake className="text-emerald-700" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              Nuestros Cuatro Pilares Fundamentales
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
            <p className="text-foreground-muted leading-relaxed text-lg">
              En Serviport, la responsabilidad social empresarial (RSE) no es
              una meta accesoria, forma parte del núcleo estructural del sistema
              operativo. Desarrollamos nuestras relaciones y espacios portuarios
              de manera responsable.
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
                  className="bg-background p-10 shadow-lg border border-border rounded-sm hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div
                      className={`w-14 h-14 ${pillar.bg} rounded flex items-center justify-center shrink-0`}
                    >
                      <Icon className={pillar.color} size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {pillar.content.map((point, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                        <p className="text-foreground-muted leading-relaxed">{point}</p>
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
