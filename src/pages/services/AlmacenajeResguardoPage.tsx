import {
  ArrowLeft, ArrowRight,
  Container,
  ShieldCheck,
  ThermometerSnowflake,
  Grid,
} from "lucide-react";
import { Link } from "react-router-dom";

export function AlmacenajeResguardoPage() {
  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/services/almacenaje.jpeg"
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
            Warehousing
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Almacenaje y Resguardo
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Instalaciones aduaneras de primer nivel con seguridad 24x7. Cuidamos
            su carga en AGD propio para una nacionalización segura.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full bg-background-muted/50">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              Infraestructura Propia en Puerto Cabello
            </h2>
            <div className="w-20 h-1 bg-primary mb-8 mx-auto"></div>
            <p className="text-foreground-muted text-lg leading-relaxed">
              La comodidad, seguridad y rapidez nos distinguen. Ofrecemos
              espacios especializados para cada tipo de carga, garantizando la
              trazabilidad exacta de su inventario durante la nacionalización o
              tránsito aduanero.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* AGD */}
            <div className="bg-background rounded-sm shadow-lg overflow-hidden border border-border flex flex-col hover:shadow-xl transition-shadow">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-secondary/10 rounded flex items-center justify-center mb-6">
                  <Grid className="text-foreground" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Almacén General de Depósito (AGD)
                </h3>
                <p className="text-foreground-muted leading-relaxed mb-6 text-sm">
                  Espacio propio provisto de patios descubiertos (etiquetados
                  alfabéticamente) y sistema de bloques, filas numeradas y
                  niveles de apilamiento para contenedores llenos. Pensado para
                  el resguardo de importaciones en el margen de la legislación
                  Venezolana.
                </p>
                <ul className="space-y-3 text-sm text-foreground-muted font-medium">
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{" "}
                    Capacidad mayor al doble de un patio estándar.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{" "}
                    Vaciado, llenado y embalaje de mercancías.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{" "}
                    Generación de EIR y video-vigilancia 24x7.
                  </li>
                </ul>
              </div>
              <div className="bg-secondary text-white p-4 text-center font-bold text-sm tracking-wider uppercase">
                Almacén Aduanero FCL
              </div>
            </div>

            {/* Vacíos */}
            <div className="bg-background rounded-sm shadow-lg overflow-hidden border border-border flex flex-col hover:shadow-xl transition-shadow relative top-0 lg:-top-6">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center mb-6">
                  <Container className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Almacén de Equipos Vacíos
                </h3>
                <p className="text-foreground-muted leading-relaxed mb-6 text-sm">
                  Zona física dedicada exclusivamente al acopio, inspección
                  técnica, lavado y pre-apilamiento de contenedores vacíos para
                  su despacho hacia puerto o cliente.
                </p>
                <ul className="space-y-3 text-sm text-foreground-muted font-medium">
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Recepción y conformidad documental.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Reparaciones menores (Normas IICL).
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Limpieza de equipos previa al reembarque.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Conexión y pre-trip de unidades Reefer.
                  </li>
                </ul>
              </div>
              <div className="bg-primary text-white p-4 text-center font-bold text-sm tracking-wider uppercase">
                Gestión de Vacíos y Reefers
              </div>
            </div>

            {/* Galpón Cerrado */}
            <div className="bg-background rounded-sm shadow-lg overflow-hidden border border-border flex flex-col hover:shadow-xl transition-shadow">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-accent/10 rounded flex items-center justify-center mb-6">
                  <ShieldCheck className="text-accent" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Galpón Cerrado (Breakbulk)
                </h3>
                <p className="text-foreground-muted leading-relaxed mb-6 text-sm">
                  Nuestras instalaciones techadas brindan protección adicional y
                  control climático. Ideal para mercancía delicada, carga
                  general suelta y carga de importación para proyectos que
                  requieren protección.
                </p>
                <ul className="space-y-3 text-sm text-foreground-muted font-medium">
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Posiciones numeradas para trazabilidad exacta.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Área para carga general, vehículos y mercancía delicada.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{" "}
                    Gestión especializada de contenedores segregados.
                  </li>
                </ul>
              </div>
              <div className="bg-accent text-black/80 p-4 text-center font-bold text-sm tracking-wider uppercase">
                Protección y Clima Controlado
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
