import { Anchor, ShieldCheck, Ship, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate, useInView, useScroll } from "motion/react";
import { useEffect, useRef } from "react";

function Counter({ to }: { to: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration: 1.5, ease: "easeOut" });
    }
  }, [inView, count, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);

  return (
    <section className="w-full flex flex-col bg-[#0b1424]">
      <div className="relative w-full aspect-video flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <motion.div 
            style={{ y }}
            className="absolute -top-[15%] w-full h-[130%]"
          >
            <video 
              muted 
              autoPlay 
              loop 
              playsInline 
              preload="auto" 
              className="hero-video absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 object-cover opacity-80 pointer-events-none"
            >
              <source src="https://vimeo.com/1199224337?share=copy&fl=sv&fe=ci" type="video/webm" />
              <source src="https://player.vimeo.com/video/1197970936" type="video/mp4" />
            </video>
            {/* Subtle dark overlay gradient to make text readable but keep video bright */}
            <div className="absolute inset-0 bg-[#0b1a2e]/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1a2e]/80 via-[#0b1a2e]/40 to-transparent"></div>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 w-full flex flex-col justify-center my-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-4xl text-white pt-10 pb-4 md:py-0"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-black leading-[1.05] tracking-tight mb-2 md:mb-6 drop-shadow-xl"
            >
              <span className="block text-[5vw] md:text-4xl lg:text-[3rem] text-slate-200 mb-1 tracking-normal font-bold">
                Soluciones de
              </span>
              <span className="block text-[9vw] md:text-7xl lg:text-[6.5rem] text-white">
                Logística <span className="text-[#F7941D]">Integral</span>
              </span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-4 md:mb-10 max-w-2xl drop-shadow-lg"
            >
              <h2 className="text-[3.5vw] md:text-3xl text-[#00A9CE] font-bold block mb-2 md:mb-3 border-l-2 md:border-l-4 border-[#F7941D] pl-2 md:pl-4 bg-[#0b1a2e]/40 py-1 md:p-2 rounded-r-md w-fit">Tu carga, en manos expertas.</h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-2 md:gap-5"
            >
              <Link to="/herramientas" className="group bg-[#F7941D] text-white px-4 md:px-10 py-2 md:py-4 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-[#F7941D]/20 flex items-center justify-center gap-1 md:gap-3 text-center text-[10px] md:text-base uppercase tracking-wider w-fit">
                COTIZA CON NOSOTROS
                <motion.span
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </motion.span>
              </Link>
              <Link to="/servicios" className="group border-2 border-[#F7941D] text-[#F7941D] hover:text-white hover:bg-[#F7941D] px-4 md:px-10 py-1.5 md:py-4 rounded font-bold transition-colors flex items-center justify-center gap-1 md:gap-3 text-center text-[10px] md:text-base uppercase tracking-wider w-fit">
                NUESTROS SERVICIOS
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="w-full bg-[#0b1424] relative z-20 shrink-0 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-2 md:px-6 py-6 md:py-12">
          <div className="grid grid-cols-4 gap-2 md:gap-8">
            {[
              { icon: Anchor, value: 2, suffix: "", label: "Puertos" },
              { icon: ShieldCheck, value: 15, suffix: "+", label: "Años" },
              { icon: Ship, value: 6, suffix: "", label: "Líneas" },
              { icon: Box, value: 60, suffix: "+", label: "Clientes B2B" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                className="group flex flex-col items-center justify-start text-center px-1 md:px-4 md:border-r border-white/10 last:border-0 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#00A9CE]/10 flex items-center justify-center mb-3 md:mb-6 group-hover:bg-[#00A9CE]/20 transition-colors border border-[#00A9CE]/20 group-hover:border-[#F7941D]/30"
                >
                  <stat.icon className="w-5 h-5 md:w-7 md:h-7 text-[#00A9CE] group-hover:text-[#F7941D] transition-colors" strokeWidth={2} />
                </motion.div>
                <div className="text-2xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tight drop-shadow-md flex items-center justify-center">
                  <Counter to={stat.value} />
                  {stat.suffix && <span className="text-[#F7941D] ml-1">{stat.suffix}</span>}
                </div>
                <span className="text-[10px] md:text-sm text-slate-400 font-bold tracking-tight md:tracking-widest uppercase mt-1 md:mt-2 group-hover:text-slate-300 transition-colors leading-tight break-words">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
