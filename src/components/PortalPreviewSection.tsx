import { Lock, BarChart, FileText, Anchor } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function PortalPreviewSection() {
  return (
    <section className="w-full flex flex-col justify-center py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted/50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="max-w-[1400px] w-full mx-auto bg-slate-900 border border-white/15 rounded-[2rem] overflow-hidden shadow-[10px_10px_35px_rgba(0,0,0,0.3),inset_4px_4px_12px_rgba(255,255,255,0.06),inset_-4px_-4px_12px_rgba(0,0,0,0.4)] relative flex flex-col justify-center transition-all duration-300 hover:scale-[1.01]"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Anchor size={400} />
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-4 md:p-6 lg:p-10 z-10 flex flex-col justify-center">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm w-fit">
              Módulo de Acceso Único
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-3 leading-[1.15]">
              Accede a Serviport OS
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4">
              Portal exclusivo para clientes B2B. Monitorea tus operaciones en
              tiempo real, gestiona documentos, aprueba proformas y coordina
              retiros de carga desde cualquier dispositivo.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <BarChart className="text-primary w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col justify-center pt-1">
                  <h4 className="text-white font-bold text-base mb-1">
                    Monitoreo en tiempo real
                  </h4>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Escalas de buques y trazabilidad de contenedores en el AGD.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FileText className="text-primary w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col justify-center pt-1">
                  <h4 className="text-white font-bold text-base mb-1">
                    Gestión documental digital
                  </h4>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Aprobación de proformas y descarga de facturas y
                    manifiestos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                to="/portal"
                className="clay-button-accent px-6 md:px-8 py-3 uppercase text-xs md:text-sm tracking-wider w-fit flex items-center justify-center gap-2 font-bold"
              >
                <Lock size={18} />
                INGRESAR AL PORTAL
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 bg-slate-900 border-t lg:border-t-0 lg:border-l border-white/5 p-4 md:p-6 lg:p-8 flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                ¿Eres nuevo en Serviport?
              </h3>
              <p className="text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
                Únete a nuestra red de clientes B2B. Selecciona los servicios
                logísticos que necesitas y activa tu suscripción de acceso al
                portal.
              </p>
              <ul className="text-slate-300 space-y-1 md:space-y-2 mb-6 text-[10px] md:text-xs">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>{" "}
                  Perfiles para Navieras, Armadores y BCOs.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>{" "}
                  Solicitudes de Port Calls y Husbandry.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>{" "}
                  Coordinación con Agentes de Aduana y Transportistas.
                </li>
              </ul>

              <Link
                to="/portal"
                className="clay-button-secondary px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs uppercase tracking-wider w-fit font-bold border border-white/5"
              >
                REGISTRO DE CLIENTE B2B
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
