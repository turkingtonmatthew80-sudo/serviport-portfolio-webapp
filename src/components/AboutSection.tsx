import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutSection() {
  const containers = [
    { 
      value: "11", 
      label: "Puestos de atraque gestionados simultáneamente para atender buques",
      theme: "bg-[#005b9f]",
      stripeColor: "rgba(0,0,0,0.1)",
      textAccent: "text-[#005b9f]",
      decalColor: "text-white/40",
      branding: "SERVIPORT MARITIME",
      isReefer: false
    },
    { 
      value: "19", 
      label: "Patios operativos para el manejo seguro de su carga",
      theme: "bg-[#F7941D]",
      stripeColor: "rgba(0,0,0,0.08)",
      textAccent: "text-[#F7941D]",
      decalColor: "text-[#0b1a2e]/30",
      branding: "HEAVY CARGO",
      isReefer: false
    },
    { 
      value: "A-Z", 
      label: "Bloques organizados en nuestro Almacén General de Depósito",
      theme: "bg-[#0b6348]",
      stripeColor: "rgba(0,0,0,0.15)",
      textAccent: "text-[#0b6348]",
      decalColor: "text-white/30",
      branding: "AGD LOGISTICS",
      isReefer: false
    },
    { 
      value: "24/7", 
      label: "Almacén de vacíos con especialidad en reparación y conexión reefer",
      theme: "bg-[#e2e8f0]",
      stripeColor: "rgba(0,0,0,0.05)",
      textAccent: "text-slate-600",
      decalColor: "text-slate-400",
      branding: "REEFER SERVICES",
      isReefer: true
    },
    { 
      value: "100+", 
      label: "Equipos pesados y maquinarias portuarias de alta capacidad",
      theme: "bg-[#e11d48]",
      stripeColor: "rgba(0,0,0,0.15)",
      textAccent: "text-[#e11d48]",
      decalColor: "text-white/30",
      branding: "MACHINERY",
      isReefer: false
    },
    { 
      value: "15+", 
      label: "Años de experiencia operando ininterrumpidamente en puertos",
      theme: "bg-[#facc15]",
      stripeColor: "rgba(0,0,0,0.1)",
      textAccent: "text-[#d97706]",
      decalColor: "text-[#0b1a2e]/30",
      branding: "EXPERIENCE",
      isReefer: false
    },
    { 
      value: "24h", 
      label: "Tiempo de respuesta comercial garantizado para requerimientos B2B",
      theme: "bg-[#0b1a2e]",
      stripeColor: "rgba(255,255,255,0.05)",
      textAccent: "text-[#0b1a2e]",
      decalColor: "text-white/20",
      branding: "B2B EXPRESS",
      isReefer: false
    }
  ];

  const companies = [
    { 
      name: "Marubeni", 
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Marubeni_Logo.svg",
      className: "scale-[1.2]"
    },
    { 
      name: "MOL", 
      logoUrl: "/logos/mol.jpg",
      className: "scale-100"
    },
    { 
      name: "GLOVIS", 
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Hyundai_Glovis_logo.svg",
      className: "scale-110"
    },
    { 
      name: "TORM", 
      logoUrl: "/logos/torm.png",
      className: "scale-150"
    },
    { 
      name: "MAERSK", 
      logoUrl: "/logos/maersk.jpg",
      className: "scale-125"
    },
    { 
      name: "MSC", 
      logoUrl: "/logos/msc.jpg",
      className: "scale-[1.4]"
    },
    { 
      name: "CMA CGM", 
      logoUrl: "/logos/810251.png",
      className: "scale-150 mix-blend-multiply"
    },
    { 
      name: "COSCO", 
      logoUrl: "/logos/images.png",
      className: "scale-150 mix-blend-multiply"
    },
    { 
      name: "Hapag-Lloyd", 
      logoUrl: "/logos/hapag.png",
      className: "scale-[1.4]"
    },
    { 
      name: "ONE", 
      logoUrl: "/logos/one.png",
      className: "scale-125 mix-blend-multiply"
    },
    { 
      name: "EVERGREEN", 
      logoUrl: "/logos/evergreen.png",
      className: "scale-[2.5]"
    },
    { 
      name: "HMM", 
      logoUrl: "/logos/hmm.jpg",
      className: "scale-[1.7] mix-blend-multiply"
    },
    { 
      name: "ZIM", 
      logoUrl: "/logos/zim.png",
      className: "scale-150"
    },
    { 
      name: "NYK Line", 
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/66/Nippon_Yusen_logo.svg",
      className: "scale-110"
    },
    { 
      name: "K LINE", 
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/K_Line_logo.svg",
      className: "scale-125"
    },
  ];

  const allLogos = [...companies, ...companies].map((company, idx) => (
    <div key={`${company.name}-${idx}`} className="shrink-0 flex items-center justify-center min-w-[200px] h-24 px-8">
      <img 
        src={company.logoUrl} 
        alt={company.name}
        referrerPolicy="no-referrer"
        className={`max-h-16 w-full object-contain transition-all duration-300 contrast-125 hover:scale-110 ${company.className || ''}`}
        title={company.name}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            e.currentTarget.nextElementSibling.classList.remove('hidden');
          }
        }}
      />
      <span className="hidden font-bold text-xl text-slate-800 uppercase tracking-widest text-center whitespace-nowrap">
        {company.name}
      </span>
    </div>
  ));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % containers.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [containers.length]);

  return (
    <section className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 gap-y-12 bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-16 items-center flex-1">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:w-[50%] flex flex-col justify-center"
          >
            <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm w-fit">
              Navegando Contigo Hacia el Éxito
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[#0b1a2e] mb-6 leading-[1.15]">
              Agenciamiento, estiba, almacenaje y transporte: su cadena logística asegurada de puerto a puerta
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              En Serviport, brindamos servicios integrales de logística portuaria y agenciamiento naviero de buques desde o hacia Venezuela, enfocados en el crecimiento constante de nuestros clientes, trabajadores y aliados, cumpliendo con todas las leyes y regulaciones aplicables.
            </p>

            <Link to="/nosotros" className="group bg-[#F7941D] text-white px-8 md:px-10 py-4 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-[#F7941D]/20 flex items-center justify-center gap-3 text-center text-sm md:text-base uppercase tracking-wider w-fit">
              CONOCE MÁS SOBRE NOSOTROS
              <motion.span className="inline-block transition-transform group-hover:translate-x-1"><ArrowRight size={20} strokeWidth={2.5} /></motion.span>
            </Link>
          </motion.div>

          {/* Right Content - Animated Shipping Container Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-[50%] flex perspective-1000 w-full max-w-xl mx-auto lg:mx-0"
          >
            <div className="w-full h-[400px] md:h-[480px] lg:h-[500px] shadow-2xl relative overflow-hidden rounded-sm group transform-gpu border border-black/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 60, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-0 ${containers[currentIndex].theme} flex flex-col justify-center items-center`}
              >
                {/* 3D Corrugation Effect - Vector Flat Style */}
                <div 
                  className="absolute inset-0 z-0" 
                  style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 32px, ${containers[currentIndex].stripeColor} 32px, ${containers[currentIndex].stripeColor} 64px)` }} 
                />
                
                {/* Container Top & Bottom Reinforcement Bars (Flat Style) */}
                <div className="absolute top-0 inset-x-0 h-4 bg-black/10 z-10" />
                <div className="absolute top-4 inset-x-0 h-1 bg-black/20 z-10" />
                <div className="absolute bottom-0 inset-x-0 h-6 bg-black/20 z-10" />
                <div className="absolute bottom-6 inset-x-0 h-1 bg-black/30 z-10" />
                
                {/* Side Pillers */}
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/10 z-10" />
                <div className="absolute top-0 bottom-0 right-0 w-4 bg-black/20 z-10" />
                <div className="absolute top-0 bottom-0 left-4 w-1 bg-black/20 z-10" />
                <div className="absolute top-0 bottom-0 right-4 w-1 bg-black/30 z-10" />

                {/* Reefer Details (Only for Reefer theme) */}
                {containers[currentIndex].isReefer && (
                  <div className="absolute bottom-10 right-6 w-24 h-32 bg-white border-2 border-slate-300 rounded-sm shadow-sm flex flex-col gap-1 p-2 z-10">
                    <div className="h-6 bg-slate-800 rounded-sm w-full flex items-center px-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] animate-pulse" />
                    </div>
                    <div className="flex-1 flex gap-1 mt-1">
                       <div className="w-1/2 h-full bg-[#00A9CE]/10 border border-[#00A9CE]/30"></div>
                       <div className="w-1/2 h-full bg-[#00A9CE]/10 border border-[#00A9CE]/30"></div>
                    </div>
                  </div>
                )}

                {/* Decal - Branding */}
                <div className={`absolute top-10 left-8 font-black tracking-[0.2em] text-sm md:text-base ${containers[currentIndex].decalColor} z-10 uppercase font-sans`}>
                  {containers[currentIndex].branding}
                </div>

                {/* Decal - Tech Specs */}
                <div className={`absolute top-10 right-8 font-mono font-bold text-[10px] md:text-xs ${containers[currentIndex].decalColor} text-right leading-tight z-10`}>
                  MAX. GR. <br/>
                  32,500 KG <br/>
                  71,650 LB <br/>
                  <span className="opacity-70 mt-1 block">
                    TARE <br/>
                    3,800 KG
                  </span>
                </div>

                {/* Container Serial Number */}
                <div className={`absolute top-24 left-8 font-mono font-bold text-lg ${containers[currentIndex].decalColor} z-10`}>
                  {containers[currentIndex].isReefer ? `SVRU 392184 7` : `SVDZ ${currentIndex+1}05834 ${currentIndex+2}`}
                </div>

                {/* Flat Vector Warning Decal */}
                <div className="absolute bottom-12 left-10 w-12 h-12 bg-[#F7941D] border-2 border-black/20 flex flex-col items-center justify-center z-10 opacity-90 hidden md:flex rounded-sm">
                  <div className="font-black text-black/60 text-xs leading-none">
                    12
                  </div>
                  <div className="font-bold text-black/60 text-[8px] leading-none mt-1">
                    MAX
                  </div>
                </div>

                {/* Content */}
                <div className={`relative z-20 flex flex-col justify-center items-center h-full max-w-[320px] px-4`}>
                  <div className="bg-white w-[280px] h-[220px] flex flex-col justify-center items-center px-6 py-6 text-center rounded-sm shadow-xl transform -rotate-1 transition-transform hover:rotate-0 border-b-4 border-black/10">
                    <span className={`text-6xl font-black mb-2 block font-sans tracking-tight ${containers[currentIndex].textAccent}`}>
                      {containers[currentIndex].value}
                    </span>
                    <span className="font-bold text-xs md:text-sm text-slate-600 block leading-relaxed uppercase tracking-tight">
                      {containers[currentIndex].label}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Carousel Indicators */}
            <div className="flex gap-3 absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
              {containers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded ${
                    currentIndex === idx 
                      ? "w-10 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                      : "w-4 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Show container ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trusted By Leaders - Full Width Marquee */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pt-8 overflow-hidden w-full max-w-[1400px] mx-auto"
      >
        <div className="inline-block px-3 py-1.5 bg-[#00A9CE] text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
          Con la confianza de líderes globales
        </div>
        <div className="relative flex overflow-x-hidden group bg-white py-10 shadow-sm border border-gray-100 rounded-sm">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
            className="flex items-center gap-16 md:gap-24 shrink-0 pr-16 md:pr-24 transition-all duration-700"
          >
            {allLogos}
          </motion.div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
