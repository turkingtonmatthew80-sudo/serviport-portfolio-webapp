import { ArrowRight, Truck, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function TransporteMercanciasPage() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="/services/transporte.png" alt="Transporte de Mercancías" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> Volver a Servicios
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Inland Freight
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Transporte de Mercancías
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Flota terrestre propia para el traslado seguro y eficiente desde el puerto hacia todo el territorio nacional.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6 mx-auto">
              <Truck className="text-[#00A9CE]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">El eslabón final de su cadena logística</h2>
            <div className="w-20 h-1 bg-[#00A9CE] mx-auto mb-6"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Ofrecemos soluciones punto a punto con nuestra propia flota de transporte y alianzas estratégicas para cubrir todo Venezuela. Desde la salida de su contenedor en Puerto Cabello hasta su almacén.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-100 p-8 rounded-sm bg-white shadow-sm hover:shadow-lg transition-shadow bg-[linear-gradient(to_bottom,transparent_0%,#f8fafc_100%)]">
              <MapPin className="text-[#00A9CE] mb-6" size={32} />
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Acarreo Portuario y Rutas Nacionales</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Ejecutamos servicio de acarreo corto dentro de la zona portuaria de Puerto Cabello y el estado Carabobo, así como transporte a larga distancia abarcando Caracas, el Centro-Occidente y principales ciudades del país.
              </p>
            </div>

            <div className="border border-gray-100 p-8 rounded-sm bg-white shadow-sm hover:shadow-lg transition-shadow bg-[linear-gradient(to_bottom,transparent_0%,#f8fafc_100%)]">
              <PackageCheck className="text-[#0b1a2e] mb-6" size={32} />
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Alquiler de Chasis y Equipos</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Solucionamos requerimientos especiales con el alquiler de chasis porta-contenedores, incluyendo aquellos provistos de Genset (Generadores de energía) para mantener la cadena de frío ininterrumpida en cargas Reefer.
              </p>
            </div>

            <div className="border border-gray-100 p-8 rounded-sm bg-white shadow-sm hover:shadow-lg transition-shadow bg-[linear-gradient(to_bottom,transparent_0%,#f8fafc_100%)]">
              <ShieldCheck className="text-[#F7941D] mb-6" size={32} />
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Seguridad y Operación Digital</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Integración con Serviport OS para la emisión digital de Órdenes de Carga y visualización de EIR (Equipment Interchange Receipt). Además brindamos esquema de escolta en carretera para cargas de muy alto valor e interés.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
