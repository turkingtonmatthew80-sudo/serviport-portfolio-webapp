import { Anchor, ShieldCheck, Ship, Box } from "lucide-react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useScroll,
} from "motion/react";
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
    <section className="w-full flex flex-col bg-secondary-dark">
      {/* Hero Video & Content with Fixed Aspect Ratio */}
      <div className="relative w-full aspect-video bg-secondary-dark overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-80 pointer-events-none"
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source
              src="https://player.vimeo.com/video/1197970936"
              type="video/mp4"
            />
          </video>
          {/* Subtle dark overlay gradient to make text readable but keep video bright */}
          <div className="absolute inset-0 bg-secondary/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent"></div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center pt-24 pb-8 md:pt-0 md:pb-48">
          <div className="max-w-[1260px] w-full mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="max-w-[100%] text-white py-1 md:py-4"
            >
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-black leading-[1.05] tracking-tight mb-2 md:mb-5 drop-shadow-xl"
              >
                <span className="block text-[clamp(1.1rem,2.5vw,3rem)] md:text-[clamp(1.5rem,3.5vw,3.5rem)] text-slate-200 mb-0.5 md:mb-1 tracking-normal font-bold">
                  Soluciones de
                </span>
                <span className="block text-[clamp(1.5rem,4.5vw,5rem)] md:text-[clamp(2rem,6vw,7rem)] text-white">
                  Logística <span className="text-accent">Integral</span>
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-2 md:mb-8 max-w-2xl drop-shadow-lg"
              >
                <h2 className="text-[clamp(1.2rem,2vw,2rem)] md:text-[clamp(1.5rem,3vw,3rem)] text-accent italic font-semibold block mb-1 md:mb-3 w-fit">
                  Tu carga, en manos expertas.
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-row gap-2 md:gap-5"
              >
                <Link
                  to="/herramientas"
                  className="group bg-accent text-white px-6 md:px-10 py-3 md:py-4 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 md:gap-3 text-center text-xs md:text-base uppercase tracking-wider w-fit"
                >
                  COTIZA
                  <motion.span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </motion.span>
                </Link>
                <Link
                  to="/servicios"
                  className="group border-2 border-accent text-accent hover:text-white hover:bg-accent px-6 md:px-10 py-3 md:py-4 rounded font-bold transition-colors flex items-center justify-center gap-2 md:gap-3 text-center text-xs md:text-base uppercase tracking-wider w-fit"
                >
                  SERVICIOS
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="w-full bg-secondary-dark relative z-20 shrink-0 border-t border-white/5 py-4 md:py-6 lg:py-8">
        <div className="max-w-[1260px] mx-auto px-2 md:px-6">
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
                  className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mb-1 md:mb-3 group-hover:bg-primary/20 transition-colors border border-primary/20 group-hover:border-accent/30"
                >
                  <stat.icon
                    className="w-4 h-4 md:w-6 md:h-6 text-primary group-hover:text-accent transition-colors"
                    strokeWidth={2}
                  />
                </motion.div>
                <div className="text-[clamp(1.5rem,4vw,3.5rem)] font-black text-white mb-0.5 md:mb-2 tracking-tight drop-shadow-md flex items-center justify-center leading-none">
                  <Counter to={stat.value} />
                  {stat.suffix && (
                    <span className="text-accent ml-0.5 md:ml-1">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <span className="text-[clamp(0.6rem,1vw,0.875rem)] text-slate-400 font-bold tracking-tight md:tracking-widest uppercase md:mt-1 group-hover:text-slate-300 transition-colors leading-tight break-words">
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
