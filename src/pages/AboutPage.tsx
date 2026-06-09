import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Eye,
  Shield,
  CheckCircle2,
  MapPin,
  Building2,
  Anchor,
  Award,
  X,
  Map as MapIcon,
  ArrowRight,
  Clock,
  Users,
  Leaf,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

export function AboutPage() {
  const [activeMap, setActiveMap] = useState<string | null>(null);

  const values = [
    {
      name: "Profesionalidad",
      desc: "Cumplimiento de los más altos estándares técnicos y éticos en cada operación.",
    },
    {
      name: "Fiabilidad",
      desc: "Entrega de lo prometido dentro de los plazos acordados, con transparencia en la comunicación.",
    },
    {
      name: "Solidaridad",
      desc: "Trabajo en equipo interno y alianzas estratégicas para garantizar la cadena logística.",
    },
    {
      name: "Orientación al logro",
      desc: "Enfoque en resultados medibles y mejora continua de indicadores operativos.",
    },
    {
      name: "Pasión",
      desc: "Compromiso genuino con el sector marítimo y la logística de nuestros clientes.",
    },
    {
      name: "Lealtad",
      desc: "Relaciones comerciales a largo plazo basadas en la confianza mutua.",
    },
    {
      name: "Flexibilidad",
      desc: "Adaptación a las condiciones cambiantes del entorno portuario venezolano.",
    },
  ];

  const qualityPoints = [
    "Cumplimiento de la normativa venezolana e internacional en materia portuaria, aduanera y de seguridad.",
    "Gestión de riesgos operativos en estiba, manejo de maquinaria y transporte de carga.",
    "Capacitación continua del personal operativo y administrativo.",
    "Auditoría periódica de procesos bajo estándares ISO 9001:2015.",
  ];

  const mapData = {
    "puerto-cabello": {
      title: "Puerto Cabello, Carabobo",
      src: "https://maps.google.com/maps?q=Bolipuertos%20Puerto%20Cabello,%20Venezuela&t=&z=14&ie=UTF8&iwloc=&output=embed",
    },
    "la-guaira": {
      title: "La Guaira, Venezuela",
      src: "https://maps.google.com/maps?q=Multicentro%20Maiquetia,%20La%20Guaira,%20Venezuela&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  };

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 p-12 pointer-events-none"
        >
          <Anchor size={400} />
        </motion.div>

        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left"
        >
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Nuestro Horizonte
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold mb-4 md:mb-6 leading-[1.1] text-white">
            Navegando contigo
            <br />
            hacia el éxito
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Serviport Agentes Navieros, C.A. es el aliado logístico integral que
            garantiza la trazabilidad, seguridad y eficiencia de la cadena de
            suministro en los principales puertos de Venezuela.
          </p>
        </motion.div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center max-w-[1260px] mx-auto w-full"
        >
          <div className="lg:w-1/2">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Quiénes Somos
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 md:mb-4 leading-[1.15]">
              El Puerto a tu Alcance
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <div className="text-sm md:text-base text-foreground-muted leading-relaxed font-medium space-y-4">
              <p className="mb-6">
                <strong>Serviport Agentes Navieros, C.A.</strong> es una empresa
                venezolana especializada en agenciamiento naviero y servicios
                logísticos portuarios con sede principal en el{" "}
                <strong>Puerto de Puerto Cabello</strong>, el principal puerto
                contenerizado y de carga general de Venezuela.
              </p>
              <p className="mb-6">
                Contamos con infraestructura propia que incluye un Almacén
                General de Depósito (AGD), patio de contenedores vacíos,
                galpones techados para carga suelta, y una flota de equipos
                pesados y transporte terrestre.
              </p>
              <p>
                Nuestra oficina comercial en <strong>La Guaira</strong> nos
                permite mantener una cobertura estratégica en la región capital
                y atender con agilidad los requerimientos de importadores,
                exportadores, navieras y armadores que operan en los principales
                puertos del país.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
                className="w-full h-32 md:h-48 object-cover rounded-sm border border-black/5"
                alt="Port View 1"
              />
              <img
                src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80"
                className="w-full h-32 md:h-48 object-cover rounded-sm border border-black/5 translate-y-4 md:translate-y-8"
                alt="Port View 2"
              />
              <img
                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80"
                className="w-full h-32 md:h-48 object-cover rounded-sm border border-black/5"
                alt="Buque de Carga"
              />
              <div className="w-full h-32 md:h-48 rounded-sm translate-y-4 md:translate-y-8 bg-secondary border-t-2 border-primary p-4 md:p-6 flex flex-col justify-center shadow-lg">
                <span className="text-primary font-bold text-2xl md:text-4xl mb-1 md:mb-2">
                  24/7
                </span>
                <span className="text-white text-xs md:text-sm font-medium leading-tight">
                  Trazabilidad y operaciones sin interrupciones
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* QUICK LINKS BENTO GRID */}
      <section className="py-12 md:py-16 px-4 md:px-6 w-full flex justify-center bg-background border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 max-w-[1260px] mx-auto w-full">
          <Link
            to="/nosotros/historia"
            className="group bg-background-muted p-6 lg:p-8 rounded-sm border border-border hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-primary transition-colors">
              <Clock
                className="text-foreground group-hover:text-white"
                size={24}
              />
            </div>
            <h3 className="font-bold text-foreground text-xl mb-2 flex items-center justify-between">
              Historia{" "}
              <ArrowRight
                size={18}
                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </h3>
            <p className="text-sm text-foreground-muted font-medium">
              Desde nuestros inicios.
            </p>
          </Link>

          <Link
            to="/nosotros/equipo"
            className="group bg-background-muted p-6 lg:p-8 rounded-sm border border-border hover:border-secondary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-secondary transition-colors">
              <Users
                className="text-foreground group-hover:text-white"
                size={24}
              />
            </div>
            <h3 className="font-bold text-foreground text-xl mb-2 flex items-center justify-between">
              Equipo{" "}
              <ArrowRight
                size={18}
                className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </h3>
            <p className="text-sm text-foreground-muted font-medium">
              Líderes de la visión operativa.
            </p>
          </Link>

          <Link
            to="/nosotros/red"
            className="group bg-background-muted p-6 lg:p-8 rounded-sm border border-border hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-accent transition-colors">
              <MapPin
                className="text-foreground group-hover:text-white"
                size={24}
              />
            </div>
            <h3 className="font-bold text-foreground text-xl mb-2 flex items-center justify-between">
              Red{" "}
              <ArrowRight
                size={18}
                className="text-accent opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </h3>
            <p className="text-sm text-foreground-muted font-medium">
              Presencia estratégica en puertos.
            </p>
          </Link>

          <Link
            to="/nosotros/certificaciones"
            className="group bg-background-muted p-6 lg:p-8 rounded-sm border border-border hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-primary transition-colors">
              <Award
                className="text-foreground group-hover:text-white"
                size={24}
              />
            </div>
            <h3 className="font-bold text-foreground text-xl mb-2 flex items-center justify-between">
              Calidad{" "}
              <ArrowRight
                size={18}
                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </h3>
            <p className="text-sm text-foreground-muted font-medium">
              Certificaciones y normativas.
            </p>
          </Link>

          <Link
            to="/nosotros/carreras"
            className="group bg-background-muted p-6 lg:p-8 rounded-sm border border-border hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-primary transition-colors">
              <Briefcase
                className="text-foreground group-hover:text-white"
                size={24}
              />
            </div>
            <h3 className="font-bold text-foreground text-xl mb-2 flex items-center justify-between">
              Carreras{" "}
              <ArrowRight
                size={18}
                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </h3>
            <p className="text-sm text-foreground-muted font-medium">
              Buscamos talento portuario.
            </p>
          </Link>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="bg-background-muted py-12 md:py-16 lg:py-20 px-4 md:px-6 border-y border-border flex justify-center">
        <div className="max-w-[1260px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 lg:gap-12"
          >
            <div className="bg-background p-6 md:p-10 lg:p-12 border border-border/50 shadow-sm rounded-sm group hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6 md:mx-0 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-2 md:mb-4 uppercase tracking-tight">
                Nuestra Misión
              </h3>
              <p className="text-foreground-muted text-sm md:text-base leading-relaxed">
                Consolidarnos en el mercado venezolano e internacional como una
                organización capaz de brindar soluciones de logística integral
                para el transporte de mercancías.
              </p>
            </div>
            <div className="bg-background p-6 md:p-10 lg:p-12 border border-border/50 shadow-sm rounded-sm group hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6 md:mx-0 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <Eye className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-2 md:mb-4 uppercase tracking-tight">
                Nuestra Visión
              </h3>
              <p className="text-foreground-muted text-sm md:text-base leading-relaxed">
                Brindar servicios logísticos mediante soluciones factibles, con
                operaciones basadas en procesos y respuestas integrales que
                agreguen valor a los negocios de nuestros clientes y aliados,
                consolidando relaciones a largo plazo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center bg-background">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Código Ético
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 leading-[1.15]">
              Valores Corporativos
            </h2>
            <p className="text-foreground-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Fundamentos que rigen nuestra interacción diaria en las
              actividades portuarias y aduaneras.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-border p-6 md:p-8 rounded-sm bg-background-muted hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <Shield
                  className="text-primary opacity-80 group-hover:opacity-100 transition-opacity mb-4"
                  size={24}
                />
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {v.name}
                </h4>
                <p className="text-xs md:text-sm text-foreground-muted leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* POLÍTICA DE CALIDAD E ISO */}
      <section className="bg-secondary text-white py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1260px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
        >
          <div className="lg:w-1/2">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Control y Excelencia
            </div>
            <div className="w-12 h-12 bg-background/10 rounded flex items-center justify-center mb-4 md:mb-6">
              <Award size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 leading-[1.15]">
              Política de Calidad
            </h2>
            <h3 className="text-lg md:text-xl text-primary font-bold mb-4 md:mb-6 uppercase tracking-tight">
              Norma ISO 9001:2015
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-2xl">
              En Serviport, brindamos servicios integrales de logística
              portuaria y agenciamiento naviero de buques desde o hacia
              Venezuela, enfocados en el crecimiento constante de nuestros
              clientes, trabajadores y aliados. Cumplimos con todas las leyes,
              regulaciones y estándares aplicables, comprometiéndonos siempre a
              evaluar y actualizar nuestros procesos, velando por el comercio
              sostenible.
            </p>
            <button className="border border-primary/50 text-primary px-6 py-2.5 rounded font-bold hover:bg-primary hover:text-foreground transition-colors text-xs tracking-wider uppercase">
              VER CERTIFICACIONES
            </button>
          </div>
          <div className="lg:w-1/2 w-full space-y-3">
            <h4 className="text-sm font-bold mb-4 text-primary uppercase tracking-wider">
              Compromisos Específicos
            </h4>
            {qualityPoints.map((pt, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-background/5 p-4 md:p-5 rounded-sm border border-white/5 hover:bg-background/10 transition-colors"
              >
                <CheckCircle2
                  className="text-primary shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* NUESTRA RED */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center bg-background-muted border-t border-border">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Operatividad
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 leading-[1.15]">
              Nuestra Red
            </h2>
            <p className="text-foreground-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Presencia estratégica en los nodos marítimos principales para el
              control total de operaciones.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-4 md:gap-6"
          >
            {/* Puerto Cabello */}
            <div className="border border-black/5 bg-background flex flex-col h-full rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 md:h-56 bg-background-muted w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
                  alt="Puerto Cabello"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent flex flex-col justify-end p-5 md:p-6 opacity-90 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                    Puerto Cabello
                  </h3>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary">
                    Sede Principal, Operativa y Logística
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6 flex-1 flex flex-col bg-background">
                <p className="text-foreground-muted text-sm md:text-base leading-relaxed mb-6 flex-1">
                  Puerto Cabello es el núcleo de las operaciones de Serviport
                  OS. Aquí gestionamos agenciamiento naviero, operaciones de
                  estiba/desestiba, almacenaje en AGD, manejo de patio y
                  servicios al buque.
                </p>
                <button
                  onClick={() => setActiveMap("puerto-cabello")}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-border bg-background-muted text-foreground font-bold rounded hover:bg-primary hover:border-primary hover:text-white transition-colors duration-300 mt-auto text-xs uppercase tracking-wider"
                >
                  <MapIcon size={16} /> VER UBICACIÓN EN EL MAPA
                </button>
              </div>
            </div>

            {/* La Guaira */}
            <div className="border border-black/5 flex flex-col h-full rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 md:h-56 bg-background-muted w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80"
                  alt="La Guaira"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent flex flex-col justify-end p-5 md:p-6 opacity-90 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                    La Guaira
                  </h3>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-accent">
                    Oficina Comercial
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6 flex-1 flex flex-col bg-background">
                <p className="text-foreground-muted text-sm md:text-base leading-relaxed mb-6 flex-1">
                  Nuestra oficina comercial en Maiquetía/La Guaira atiende la
                  demanda de la región capital y central del país, facilitando
                  el contacto directo con importadores, exportadores y navieras.
                </p>
                <button
                  onClick={() => setActiveMap("la-guaira")}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-border bg-background-muted text-foreground font-bold rounded hover:bg-secondary hover:border-secondary hover:text-white transition-colors duration-300 mt-auto text-xs uppercase tracking-wider"
                >
                  <MapIcon size={16} /> VER UBICACIÓN EN EL MAPA
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAP MODAL */}
      <AnimatePresence>
        {activeMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/80 p-4 sm:p-6 backdrop-blur-sm"
            onClick={() => setActiveMap(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <MapPin className="text-primary" size={24} />
                  Ubicación: {mapData[activeMap as keyof typeof mapData].title}
                </h3>
                <button
                  onClick={() => setActiveMap(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-foreground-muted hover:text-accent"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="w-full h-[60vh] bg-background-muted">
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
