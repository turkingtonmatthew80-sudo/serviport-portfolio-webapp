import {
  ArrowLeft, ArrowRight,
  Truck,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export function TransporteMercanciasPage() {
  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/services/transporte.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors uppercase tracking-wider text-xs mb-6 mx-auto md:mx-0"
          >
            <ArrowLeft size={16}  /> Volver a Servicios
          </Link>
          <br />
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Inland Freight
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Transporte de Mercancías
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Flota terrestre propia para el traslado seguro y eficiente desde el
            puerto hacia todo el territorio nacional.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mb-6 mx-auto">
              <Truck className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              El eslabón final de su cadena logística
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-foreground-muted leading-relaxed text-lg">
              Ofrecemos soluciones punto a punto con nuestra propia flota de
              transporte y alianzas estratégicas para cubrir todo Venezuela.
              Desde la salida de su contenedor en Puerto Cabello hasta su
              almacén.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-border p-8 rounded-sm bg-background shadow-sm hover:shadow-lg transition-shadow bg-[linear-gradient(to_bottom,transparent_0%,#f8fafc_100%)]">
              <MapPin className="text-primary mb-6" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-4">
                Acarreo Portuario y Rutas Nacionales
              </h3>
              <p className="text-foreground-muted mb-6 text-sm leading-relaxed">
                Ejecutamos servicio de acarreo corto dentro de la zona portuaria
                de Puerto Cabello y el estado Carabobo, así como transporte a
                larga distancia abarcando Caracas, el Centro-Occidente y
                principales ciudades del país.
              </p>
            </div>

            <div className="border border-border p-8 rounded-sm bg-background shadow-sm hover:shadow-lg transition-shadow bg-[linear-gradient(to_bottom,transparent_0%,#f8fafc_100%)]">
              <PackageCheck className="text-foreground mb-6" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-4">
                Alquiler de Chasis y Equipos
              </h3>
              <p className="text-foreground-muted mb-6 text-sm leading-relaxed">
                Solucionamos requerimientos especiales con el alquiler de chasis
                porta-contenedores, incluyendo aquellos provistos de Genset
                (Generadores de energía) para mantener la cadena de frío
                ininterrumpida en cargas Reefer.
              </p>
            </div>

            <div className="border border-border p-8 rounded-sm bg-background shadow-sm hover:shadow-lg transition-shadow bg-[linear-gradient(to_bottom,transparent_0%,#f8fafc_100%)]">
              <ShieldCheck className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-4">
                Seguridad y Operación Digital
              </h3>
              <p className="text-foreground-muted mb-6 text-sm leading-relaxed">
                Integración con Serviport OS para la emisión digital de Órdenes
                de Carga y visualización de EIR (Equipment Interchange Receipt).
                Además brindamos esquema de escolta en carretera para cargas de
                muy alto valor e interés.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
