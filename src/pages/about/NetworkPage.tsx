import {
  ArrowLeft, ArrowRight,
  Compass,
  ShieldCheck,
  MapPin,
  Map as MapIcon,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function NetworkPage() {
  const [activeMap, setActiveMap] = useState<string | null>(null);

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
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80"
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
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Nuestra Red
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            En los principales puertos del País
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Cobertura comercial y física en los nodos marítimos más estratégicos
            de Venezuela. Control total de tus operaciones donde más lo
            necesitas.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 relative flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 w-full">
          {/* Puerto Cabello */}
          <div className="flex flex-col h-full bg-background shadow-xl rounded-sm overflow-hidden border border-border group">
            <div className="h-64 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
                alt="Puerto Cabello"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent flex flex-col justify-end p-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Puerto Cabello
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                  Sede Principal y Operativa
                </span>
              </div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-foreground-muted leading-relaxed font-medium mb-8 text-lg">
                Puerto Cabello es el núcleo de las operaciones de Serviport OS.
                Aquí gestionamos agenciamiento naviero, operaciones de
                estiba/desestiba, almacenaje en AGD, manejo de patio y servicios
                al buque.
              </p>

              <div className="bg-background-muted p-6 rounded-sm border border-border mb-8">
                <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">
                  Capacidad Instalada
                </h4>
                <ul className="space-y-3 test-sm text-foreground-muted">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />{" "}
                    Operamos en 11 de los 32 Puestos de Atraque del terminal.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />{" "}
                    19 Patios de almacenamiento a cielo abierto.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />{" "}
                    9 Almacenes techados (Galpones) para carga suelta.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />{" "}
                    Descarga directa a infraestructura de Silos de Bolipuertos.
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveMap("puerto-cabello")}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-secondary text-white font-bold py-4 px-6 rounded-sm hover:bg-blue-900 transition-colors uppercase text-sm tracking-wider"
              >
                <MapPin size={20} /> Ver Ubicación en Mapa
              </button>
            </div>
          </div>

          {/* La Guaira */}
          <div className="flex flex-col h-full bg-background shadow-xl rounded-sm overflow-hidden border border-border group">
            <div className="h-64 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80"
                alt="La Guaira"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent flex flex-col justify-end p-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  La Guaira
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest text-accent">
                  Oficina Comercial
                </span>
              </div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-foreground-muted leading-relaxed font-medium mb-8 text-lg">
                Nuestra oficina comercial en Maiquetía/La Guaira atiende la
                demanda de la región capital y central del país.
              </p>

              <div className="bg-background-muted p-6 rounded-sm border border-border mb-8">
                <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">
                  Enfoque Comercial
                </h4>
                <ul className="space-y-3 test-sm text-foreground-muted">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />{" "}
                    Facilitamos el contacto directo con importadores y
                    exportadores de la capital.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />{" "}
                    Enlace de representación comercial para navieras
                    internacionales.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />{" "}
                    Operaciones de enlace en el principal puerto contenerizado
                    del país.
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveMap("la-guaira")}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-background border-2 border-secondary text-foreground font-bold py-4 px-6 rounded-sm hover:bg-secondary hover:text-white transition-colors uppercase text-sm tracking-wider"
              >
                <MapPin size={20} /> Ver Ubicación en Mapa
              </button>
            </div>
          </div>
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
