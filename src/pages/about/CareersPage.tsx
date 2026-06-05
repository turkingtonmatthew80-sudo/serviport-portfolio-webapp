import { ArrowRight, Compass, Users, TrendingUp, Presentation, Lightbulb, Briefcase, GraduationCap, Leaf, ShieldCheck, Scale, Award, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function CareersPage() {
  const atAGlance = [
    { number: "2", label: "Puertos Operativos" },
    { number: "19", label: "Patios de Almacenaje" },
    { number: "20+", label: "Años de Experiencia" },
    { number: "100+", label: "Colaboradores" }
  ];

  const values = [
    {
      icon: Compass,
      title: "Perspectiva Global",
      desc: "Conectamos a Venezuela con el mundo, viendo el panorama logístico completo más allá de los límites del puerto."
    },
    {
      icon: Users,
      title: "El Poder de las Personas",
      desc: "Nuestros cimientos se basan en la fuerza del conocimiento local, las relaciones humanas y la profesionalidad."
    },
    {
      icon: TrendingUp,
      title: "Progreso y Orientación al Logro",
      desc: "Somos visionarios de la logística portuaria y lideramos la industria hacia el cambio positivo constante."
    }
  ];

  const workingWithUs = [
    {
      icon: Presentation,
      title: "Diversidad e Inclusión",
      desc: "Orgullosos de contar con una fuerza laboral diversa. Creemos en la igualdad de oportunidades para todos los talentos del sector."
    },
    {
      icon: GraduationCap,
      title: "Aprendizaje y Desarrollo",
      desc: "Creemos en el desarrollo de nuestra gente. Proveemos formación, capacitación portuaria, mentoría y programas de liderazgo."
    },
    {
      icon: Leaf,
      title: "Sostenibilidad",
      desc: "Tenemos la obligación de usar nuestra red para ayudar a los clientes y aliados a conectarse con un futuro logístico más sustentable."
    },
    {
      icon: Award,
      title: "Reconocimiento y Recompensa",
      desc: "Sentirse valorado es vital. Celebramos los logros de nuestro equipo, la excelencia operativa y reconocemos el mérito del trabajo bien hecho."
    },
    {
      icon: Scale,
      title: "Ética y Cumplimiento",
      desc: "Operar éticamente es nuestra máxima prioridad. Transparencia, flexibilidad y cumplimiento de todas las normativas aduaneras en Venezuela."
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559297292-0b2a75225e?auto=format&fit=crop&q=80" alt="Equipo Serviport" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/90" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full text-center">
          <Link to="/nosotros" className="inline-flex items-center justify-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> VOLVER A NOSOTROS
          </Link>
          <br />
          <div className="inline-block px-4 py-2 bg-[#F7941D] text-white font-bold tracking-wider text-xs md:text-sm mb-6 uppercase rounded-sm">
            CARRERAS
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-tight mb-6 tracking-tight">
            Navegamos contigo<br/>hacia el futuro
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Siempre estamos buscando talento portuario comprometido con el futuro de Venezuela.
          </p>
        </div>
      </section>

      {/* OUR PEOPLE ARE OUR BUSINESS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-[#00A9CE]/10 text-[#00A9CE] font-bold tracking-wider text-sm uppercase rounded-sm mb-8 border border-[#00A9CE]/20">
            Nuestra Gente Es Nuestro Negocio
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0b1a2e] mb-8 leading-tight">
            En Serviport Agentes Navieros hemos construido una fuerza laboral diversa y de alto rendimiento que trabaja colaborativamente.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
            Valoramos a nuestra gente, y sabemos que su experiencia, profesionalismo y habilidades únicas nos han permitido estar donde estamos hoy. Seguimos creciendo en el mundo portuario y siempre estamos buscando talento apasionado por nuestra industria y por la entrega de un servicio logístico de excelencia, para llevar nuestras operaciones al siguiente nivel.
          </p>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="py-20 px-6 bg-[#0b1a2e]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-6 py-2 bg-[#00A9CE]/20 text-[#00A9CE] font-bold tracking-wider text-sm uppercase rounded-sm mb-12 border border-[#00A9CE]/30">
            De un Vistazo
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {atAGlance.map((item, idx) => (
              <div key={idx} className="text-center md:text-left border-l-2 border-[#00A9CE] pl-6 py-2">
                <div className="text-4xl md:text-6xl font-extrabold text-[#00A9CE] mb-2">{item.number}</div>
                <div className="text-slate-300 font-bold tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-6 py-2 bg-[#00A9CE]/10 text-[#00A9CE] font-bold tracking-wider text-sm uppercase rounded-sm mb-12 border border-[#00A9CE]/20">
            Nuestros Valores
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-[#00A9CE]/10 flex items-center justify-center mb-6">
                     <Icon className="text-[#00A9CE]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">{val.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* WORKING WITH US */}
      <section className="py-24 px-6 bg-white">
         <div className="max-w-7xl mx-auto">
          <div className="inline-block px-6 py-2 bg-[#00A9CE]/10 text-[#00A9CE] font-bold tracking-wider text-sm uppercase rounded-sm mb-12 border border-[#00A9CE]/20">
            Trabajando Con Nosotros
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {workingWithUs.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-[#00A9CE]/10 flex items-center justify-center mb-6">
                     <Icon className="text-[#00A9CE]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">{val.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              )
            })}
          </div>
         </div>
      </section>

      {/* VACANCIES CTA BANNER */}
      <section className="py-24 px-6 bg-[#0b1a2e] overflow-hidden relative">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
           <Briefcase size={300} className="text-white" strokeWidth={0.5} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-white">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Vacantes
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8 font-medium">
              ¿Estás interesado en trabajar con Serviport Agentes Navieros? Explora aquí nuestras vacantes operativas y corporativas actuales.
            </p>
            <Link to="/nosotros/carreras/vacantes" className="inline-flex items-center gap-3 bg-[#00A9CE] text-white font-bold py-4 px-8 rounded-sm hover:bg-[#008EBF] transition-colors uppercase tracking-wider text-sm">
              VER VACANTES ACTUALES <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
