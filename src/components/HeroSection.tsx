import { Anchor, ShieldCheck, Ship, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100dvh-5rem)] flex flex-col bg-slate-100">
      <div className="relative w-full flex-1 flex flex-col">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src="https://player.vimeo.com/video/1197970936?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
          {/* Dark overlay gradient to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1a2e]/95 via-[#0b1a2e]/80 to-[#0b1a2e]/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl text-white mt-12 py-12 md:py-24"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              Soluciones de Logística Integral en Venezuela
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-10 leading-relaxed font-medium max-w-2xl">
              Desde el agenciamiento naviero hasta el almacenaje aduanero y el transporte nacional. Serviport es tu aliado estratégico en los principales puertos del país.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/herramientas" className="bg-[#00A9CE] text-white px-10 py-5 rounded font-bold hover:bg-[#008EBF] transition-colors shadow-md text-center text-lg">
                COTIZA CON NOSOTROS
              </Link>
              <Link to="/servicios" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded font-bold hover:bg-white/20 transition-colors text-center text-lg">
                NUESTROS SERVICIOS
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="w-full bg-[#1b1c20] relative z-20 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center px-4 md:border-r border-white/10 last:border-0 md:last:border-r-0">
              <Anchor size={32} strokeWidth={2.5} className="text-[#00A9CE] mb-4" />
              <span className="text-4xl font-extrabold text-white mb-2 tracking-tight">2</span>
              <span className="text-sm text-gray-400 font-medium">Puertos activos</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 md:border-r border-white/10 last:border-0 md:last:border-r-0">
              <ShieldCheck size={32} strokeWidth={2.5} className="text-[#00A9CE] mb-4" />
              <span className="text-4xl font-extrabold text-white mb-2 tracking-tight">15 <span className="text-3xl">+</span></span>
              <span className="text-sm text-gray-400 font-medium">Años de experiencia</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 md:border-r border-white/10 last:border-0 md:last:border-r-0">
              <Ship size={32} strokeWidth={2.5} className="text-[#00A9CE] mb-4" />
              <span className="text-4xl font-extrabold text-white mb-2 tracking-tight">6</span>
              <span className="text-sm text-gray-400 font-medium">Líneas de servicio</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <Box size={32} strokeWidth={2.5} className="text-[#00A9CE] mb-4" />
              <span className="text-4xl font-extrabold text-white mb-2 tracking-tight">60 <span className="text-3xl">+</span></span>
              <span className="text-sm text-gray-400 font-medium">Clientes corporativos B2B</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
