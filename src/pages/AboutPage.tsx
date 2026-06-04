import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Eye, Shield, CheckCircle2, MapPin, Building2, Anchor, Award, X, Map as MapIcon, ArrowRight, Clock, Users, Leaf, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutPage() {
  const [activeMap, setActiveMap] = useState<string | null>(null);

  const values = [
    { name: "Profesionalidad", desc: "Cumplimiento de los más altos estándares técnicos y éticos en cada operación." },
    { name: "Fiabilidad", desc: "Entrega de lo prometido dentro de los plazos acordados, con transparencia en la comunicación." },
    { name: "Solidaridad", desc: "Trabajo en equipo interno y alianzas estratégicas para garantizar la cadena logística." },
    { name: "Orientación al logro", desc: "Enfoque en resultados medibles y mejora continua de indicadores operativos." },
    { name: "Pasión", desc: "Compromiso genuino con el sector marítimo y la logística de nuestros clientes." },
    { name: "Lealtad", desc: "Relaciones comerciales a largo plazo basadas en la confianza mutua." },
    { name: "Flexibilidad", desc: "Adaptación a las condiciones cambiantes del entorno portuario venezolano." }
  ];

  const qualityPoints = [
    "Cumplimiento de la normativa venezolana e internacional en materia portuaria, aduanera y de seguridad.",
    "Gestión de riesgos operativos en estiba, manejo de maquinaria y transporte de carga.",
    "Capacitación continua del personal operativo y administrativo.",
    "Auditoría periódica de procesos bajo estándares ISO 9001:2015."
  ];

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
      <section className="bg-[#0b1a2e] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 p-12 pointer-events-none"
        >
          <Anchor size={400} />
        </motion.div>
        
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80" alt="Background" className="w-full h-full object-cover" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="inline-block px-6 py-3 bg-[#00A9CE] text-white font-bold tracking-wider text-sm md:text-base mb-6 uppercase shadow-sm">
            Nuestro Horizonte
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold leading-tight mb-8">
            Navegando contigo<br/>hacia el éxito
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Serviport Agentes Navieros, C.A. es el aliado logístico integral que garantiza la trazabilidad, seguridad y eficiencia de la cadena de suministro en los principales puertos de Venezuela.
          </p>
        </motion.div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-16 items-center"
        >
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">El Puerto a tu Alcance</h2>
            <div className="w-20 h-1 bg-[#00A9CE] mb-8"></div>
            <div className="prose prose-lg text-gray-600 leading-relaxed font-medium">
              <p className="mb-6">
                <strong>Serviport Agentes Navieros, C.A.</strong> es una empresa venezolana especializada en agenciamiento naviero y servicios logísticos portuarios con sede principal en el <strong>Puerto de Puerto Cabello</strong>, el principal puerto contenerizado y de carga general de Venezuela.
              </p>
              <p className="mb-6">
                Contamos con infraestructura propia que incluye un Almacén General de Depósito (AGD), patio de contenedores vacíos, galpones techados para carga suelta, y una flota de equipos pesados y transporte terrestre.
              </p>
              <p>
                Nuestra oficina comercial en <strong>La Guaira</strong> nos permite mantener una cobertura estratégica en la región capital y atender con agilidad los requerimientos de importadores, exportadores, navieras y armadores que operan en los principales puertos del país.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" className="w-full h-48 object-cover rounded-sm shadow-md" alt="Port View 1" />
               <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80" className="w-full h-48 object-cover rounded-sm shadow-md translate-y-8" alt="Port View 2" />
               <img src="https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&q=80" className="w-full h-48 object-cover rounded-sm shadow-md" alt="Containers" />
               <div className="w-full h-48 rounded-sm shadow-md translate-y-8 bg-[#0b1a2e] p-6 flex flex-col justify-center">
                 <span className="text-[#00A9CE] font-bold text-4xl mb-2">24/7</span>
                 <span className="text-white font-medium">Trazabilidad y operaciones sin interrupciones</span>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* QUICK LINKS BENTO GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
           <Link to="/nosotros/historia" className="group bg-slate-50 p-6 lg:p-8 rounded-sm border border-gray-100 hover:border-[#00A9CE] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-[#00A9CE] transition-colors">
               <Clock className="text-[#0b1a2e] group-hover:text-white" size={24} />
             </div>
             <h3 className="font-bold text-[#0b1a2e] text-xl mb-2 flex items-center justify-between">Historia <ArrowRight size={18} className="text-[#00A9CE] opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
             <p className="text-sm text-gray-500 font-medium">Desde nuestros inicios.</p>
           </Link>

           <Link to="/nosotros/equipo" className="group bg-slate-50 p-6 lg:p-8 rounded-sm border border-gray-100 hover:border-[#0b1a2e] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-[#0b1a2e] transition-colors">
               <Users className="text-[#0b1a2e] group-hover:text-white" size={24} />
             </div>
             <h3 className="font-bold text-[#0b1a2e] text-xl mb-2 flex items-center justify-between">Equipo <ArrowRight size={18} className="text-[#0b1a2e] opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
             <p className="text-sm text-gray-500 font-medium">Líderes de la visión operativa.</p>
           </Link>

           <Link to="/nosotros/red" className="group bg-slate-50 p-6 lg:p-8 rounded-sm border border-gray-100 hover:border-[#F7941D] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-[#F7941D] transition-colors">
               <MapPin className="text-[#0b1a2e] group-hover:text-white" size={24} />
             </div>
             <h3 className="font-bold text-[#0b1a2e] text-xl mb-2 flex items-center justify-between">Red <ArrowRight size={18} className="text-[#F7941D] opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
             <p className="text-sm text-gray-500 font-medium">Presencia estratégica en puertos.</p>
           </Link>

           <Link to="/nosotros/certificaciones" className="group bg-slate-50 p-6 lg:p-8 rounded-sm border border-gray-100 hover:border-[#008EBF] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-[#008EBF] transition-colors">
               <Award className="text-[#0b1a2e] group-hover:text-white" size={24} />
             </div>
             <h3 className="font-bold text-[#0b1a2e] text-xl mb-2 flex items-center justify-between">Calidad <ArrowRight size={18} className="text-[#008EBF] opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
             <p className="text-sm text-gray-500 font-medium">Certificaciones y normativas.</p>
           </Link>

           <Link to="/nosotros/carreras" className="group bg-slate-50 p-6 lg:p-8 rounded-sm border border-gray-100 hover:border-[#00A9CE] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-[#00A9CE] transition-colors">
               <Briefcase className="text-[#0b1a2e] group-hover:text-white" size={24} />
             </div>
             <h3 className="font-bold text-[#0b1a2e] text-xl mb-2 flex items-center justify-between">Carreras <ArrowRight size={18} className="text-[#00A9CE] opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
             <p className="text-sm text-gray-500 font-medium">Buscamos talento portuario.</p>
           </Link>
         </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="bg-gray-50 py-24 px-6 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 text-center md:text-left"
          >
            <div className="bg-white p-10 lg:p-14 border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.04)] rounded-sm group hover:border-[#00A9CE]/30 transition-colors">
              <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-8 mx-auto md:mx-0 group-hover:bg-[#00A9CE] group-hover:text-white transition-colors duration-500">
                <Target size={32} className="text-[#00A9CE] group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0b1a2e] mb-4 uppercase tracking-wide">Nuestra Misión</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Consolidarnos en el mercado venezolano e internacional como una organización capaz de brindar soluciones de logística integral para el transporte de mercancías.
              </p>
            </div>
            <div className="bg-white p-10 lg:p-14 border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.04)] rounded-sm group hover:border-[#00A9CE]/30 transition-colors">
              <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-8 mx-auto md:mx-0 group-hover:bg-[#00A9CE] group-hover:text-white transition-colors duration-500">
                <Eye size={32} className="text-[#00A9CE] group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0b1a2e] mb-4 uppercase tracking-wide">Nuestra Visión</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Brindar servicios logísticos mediante soluciones factibles, con operaciones basadas en procesos y respuestas integrales que agreguen valor a los negocios de nuestros clientes y aliados, consolidando relaciones a largo plazo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-4">Valores Corporativos</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fundamentos que rigen nuestra interacción diaria en las actividades portuarias y aduaneras.
          </p>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {values.map((v, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-gray-100 p-8 rounded-sm bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Shield className="text-[#00A9CE] mb-4" size={28} />
              <h4 className="text-xl font-bold text-[#0b1a2e] mb-3">{v.name}</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* POLÍTICA DE CALIDAD E ISO */}
      <section className="bg-[#0b1a2e] text-white py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center"
        >
          <div className="lg:w-1/2">
             <div className="w-16 h-16 rounded-full bg-[#00A9CE] flex items-center justify-center mb-8">
               <Award size={32} className="text-white" />
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Política de Calidad</h2>
             <h3 className="text-xl text-[#00A9CE] font-medium mb-8">Norma ISO 9001:2015</h3>
             <p className="text-slate-300 text-lg leading-relaxed mb-8">
               En Serviport, brindamos servicios integrales de logística portuaria y agenciamiento naviero de buques desde o hacia Venezuela, enfocados en el crecimiento constante de nuestros clientes, trabajadores y aliados. Cumplimos con todas las leyes, regulaciones y estándares aplicables, comprometiéndonos siempre a evaluar y actualizar nuestros procesos, velando por el comercio sostenible.
             </p>
             <button className="border-2 border-[#00A9CE] text-[#00A9CE] px-8 py-3 rounded font-bold hover:bg-[#00A9CE] hover:text-white transition-colors duration-300">
               SABER MÁS SOBRE CERTIFICACIONES
             </button>
          </div>
          <div className="lg:w-1/2 w-full space-y-4">
             <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Compromisos Específicos</h4>
             {qualityPoints.map((pt, i) => (
                <div key={i} className="flex gap-4 items-start bg-white/5 p-6 rounded-sm border border-white/10 hover:bg-white/10 transition-colors">
                  <CheckCircle2 className="text-[#00A9CE] shrink-0 mt-0.5" size={24} />
                  <p className="text-slate-200 font-medium leading-relaxed">{pt}</p>
                </div>
             ))}
          </div>
        </motion.div>
      </section>

      {/* NUESTRA RED */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-4">Nuestra Red</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Presencia estratégica en los nodos marítimos principales para el control total de operaciones.
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Puerto Cabello */}
          <div className="border border-gray-200 bg-white flex flex-col h-full rounded-sm overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="h-56 bg-slate-100 w-full overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1559297292-0b2a75225e?auto=format&fit=crop&q=80" alt="Puerto Cabello" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e]/80 to-transparent flex flex-col justify-end p-6">
                 <h3 className="text-3xl font-bold text-white mb-2">Puerto Cabello</h3>
                 <span className="text-sm font-bold uppercase tracking-widest text-[#00A9CE]">Sede Principal, Operativa y Logística</span>
               </div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-gray-600 leading-relaxed font-medium mb-8 flex-1">
                Puerto Cabello es el núcleo de las operaciones de Serviport OS. Aquí gestionamos agenciamiento naviero, operaciones de estiba/desestiba, almacenaje en AGD, manejo de patio y servicios al buque. La Terminal Marítima de Puerto Cabello, administrada por Bolipuertos S.A., es el puerto multipropósito más importante de Venezuela, con 32 puestos de atraque, patios extensos y silos para carga a granel.
              </p>
              <button 
                onClick={() => setActiveMap('puerto-cabello')} 
                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-[#00A9CE] text-[#00A9CE] font-bold rounded hover:bg-[#00A9CE] hover:text-white transition-colors duration-300 mt-auto"
              >
                <MapIcon size={20} /> VER UBICACIÓN EN EL MAPA
              </button>
            </div>
          </div>

          {/* La Guaira */}
          <div className="border border-gray-200 bg-white flex flex-col h-full rounded-sm overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="h-56 bg-slate-100 w-full overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80" alt="La Guaira" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e]/80 to-transparent flex flex-col justify-end p-6">
                 <h3 className="text-3xl font-bold text-white mb-2">La Guaira</h3>
                 <span className="text-sm font-bold uppercase tracking-widest text-[#f59e0b]">Oficina Comercial</span>
               </div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-gray-600 leading-relaxed font-medium mb-8 flex-1">
                Nuestra oficina comercial en Maiquetía/La Guaira atiende la demanda de la región capital y central del país, facilitando el contacto directo con importadores, exportadores y navieras que operan en el puerto de La Guaira, el principal puerto contenerizado del país con la terminal dedicada de Bolipuertos.
              </p>
              <button 
                onClick={() => setActiveMap('la-guaira')} 
                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-[#0b1a2e] text-[#0b1a2e] font-bold rounded hover:bg-[#0b1a2e] hover:text-white transition-colors duration-300 mt-auto"
              >
                <MapIcon size={20} /> VER UBICACIÓN EN EL MAPA
              </button>
            </div>
          </div>
        </motion.div>
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
