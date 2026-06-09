import { MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CargoGlobe } from "./CargoGlobe";

export function LocationsPartnersSection() {
  return (
    <section className="w-full flex flex-col justify-center py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted border-b border-border">
      <div className="max-w-[1260px] mx-auto w-full flex flex-col gap-12 md:gap-16">
        {/* Locations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center gap-2"
        >
          <div className="text-center mb-2 md:mb-4">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-1 md:mb-2 uppercase shadow-sm">
              Nuestra Presencia
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 leading-[1.15]">
              En los principales puertos del País
            </h2>
            <p className="text-foreground-muted text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-8">
              Cobertura comercial y física en los nodos marítimos más
              estratégicos de Venezuela, conociendo el movimiento y comercio global en tiempo real.
            </p>
          </div>

          <CargoGlobe />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[250px] shrink-0 mt-8">
            <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden bg-background-muted shadow-sm border border-black/5 group">
              {/* Map for Puerto Cabello */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125556.70222079075!2d-68.08985175657388!3d10.457850505191068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e80614838b0d2d5%3A0xc66c1b353dd75618!2sPuerto%20Cabello%2C%20Carabobo!5e0!3m2!1sen!2sve!4v1716500000000!5m2!1sen!2sve"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-secondary via-secondary/40 to-transparent transition-opacity duration-700 opacity-90 group-hover:opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-5 md:p-8 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="text-primary w-6 h-6 md:w-8 md:h-8" />
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    Puerto Cabello
                  </h3>
                </div>
                <p className="text-slate-200 text-sm md:text-base max-w-sm leading-relaxed">
                  Sede principal, operativa y logística. Núcleo de las
                  operaciones del AGD y Serviport OS.
                </p>
              </div>
            </div>

            <div className="md:col-span-1 md:row-span-1 relative rounded-2xl overflow-hidden bg-background-muted shadow-sm border border-black/5 group">
              {/* Map for La Guaira */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125574.96695240213!2d-67.06176585144883!3d10.60533596541578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a5c3ba3b8f623%3A0x6b107eafde08cdec!2sLa%20Guaira%2C%20Vargas!5e0!3m2!1sen!2sve!4v1716500000000!5m2!1sen!2sve"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-secondary via-secondary/40 to-transparent transition-opacity duration-700 opacity-90 group-hover:opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-5 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="text-accent w-5 h-5" />
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    La Guaira
                  </h3>
                </div>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
                  Oficina comercial estratégica para atención a clientes.
                </p>
              </div>
            </div>

            <div className="md:col-span-1 md:row-span-1 relative rounded-2xl overflow-hidden bg-primary shadow-sm flex flex-col items-center justify-center text-center p-6 group hover:bg-secondary transition-colors duration-500">
              <Link
                to="/sobre-nosotros"
                className="absolute inset-0 z-10"
                aria-label="Conozca nuestra red"
              ></Link>
              <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                <Navigation className="text-white w-6 h-6 group-hover:text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nuestra Red</h3>
              <p className="text-white/80 text-sm max-w-[200px]">
                Conozca más sobre nuestra red de aliados y cobertura.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 shrink-0">
          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-background border p-4 md:p-6 text-center shadow-sm w-full md:w-1/2 flex flex-col justify-center"
          >
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 leading-[1.15]">
              Nuestros Aliados
            </h2>
            <p className="text-foreground-muted leading-relaxed mb-4 text-xs md:text-sm max-w-sm mx-auto">
              A través de nuestra red comercial de aliados logramos mantener la
              trazabilidad para crecer juntos.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-sm font-bold font-serif">SERVIPORT</div>
              <div className="text-sm font-bold tracking-tighter">CCB</div>
              <div className="text-sm font-black italic">SIRIUS</div>
              <div className="text-sm font-medium tracking-widest text-primary">
                BOLIPUERTOS
              </div>
            </div>
          </motion.div>

          {/* Nuevos Proyectos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-secondary text-white p-4 md:p-6 rounded-2xl shadow-xl flex flex-col items-center text-center justify-center w-full md:w-1/2"
          >
            <div className="w-full">
              <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
                Futuro
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold mb-2 leading-[1.15]">
                Nuevos proyectos
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
                Acompañanos en este proceso de expansión operativa y tecnológica
                para atender la creciente demanda.
              </p>
            </div>
            <div className="shrink-0 flex gap-2 w-full justify-center">
              <Link
                to="/contacto"
                className="group bg-accent text-white px-4 py-2 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-accent/20 text-xs md:text-sm uppercase tracking-wider w-fit"
              >
                CONTACTAR
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
