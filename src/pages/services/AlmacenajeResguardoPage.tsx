import { ArrowRight, Container, ShieldCheck, ThermometerSnowflake, Grid } from "lucide-react";
import { Link } from "react-router-dom";

export function AlmacenajeResguardoPage() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="/services/almacenaje.jpeg" alt="Almacenaje y Resguardo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> Volver a Servicios
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Warehousing
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Almacenaje y Resguardo
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Instalaciones aduaneras de primer nivel con seguridad 24x7. Cuidamos su carga en AGD propio para una nacionalización segura.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">Infraestructura Propia en Puerto Cabello</h2>
            <div className="w-20 h-1 bg-[#00A9CE] mb-8 mx-auto"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
              La comodidad, seguridad y rapidez nos distinguen. Ofrecemos espacios especializados para cada tipo de carga, garantizando la trazabilidad exacta de su inventario durante la nacionalización o tránsito aduanero.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* AGD */}
            <div className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-[#0b1a2e]/10 rounded flex items-center justify-center mb-6">
                  <Grid className="text-[#0b1a2e]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Almacén General de Depósito (AGD)</h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  Espacio propio provisto de patios descubiertos (etiquetados alfabéticamente) y sistema de bloques, filas numeradas y niveles de apilamiento para contenedores llenos. Pensado para el resguardo de importaciones en el margen de la legislación Venezolana.
                </p>
                <ul className="space-y-3 text-sm text-gray-700 font-medium">
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Capacidad mayor al doble de un patio estándar.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Vaciado, llenado y embalaje de mercancías.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Generación de EIR y video-vigilancia 24x7.</li>
                </ul>
              </div>
              <div className="bg-[#0b1a2e] text-white p-4 text-center font-bold text-sm tracking-wider uppercase">
                Almacén Aduanero FCL
              </div>
            </div>

            {/* Vacíos */}
            <div className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow relative top-0 lg:-top-6">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
                  <Container className="text-[#00A9CE]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Almacén de Equipos Vacíos</h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  Zona física dedicada exclusivamente al acopio, inspección técnica, lavado y pre-apilamiento de contenedores vacíos para su despacho hacia puerto o cliente.
                </p>
                <ul className="space-y-3 text-sm text-gray-700 font-medium">
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Recepción y conformidad documental.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Reparaciones menores (Normas IICL).</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Limpieza de equipos previa al reembarque.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Conexión y pre-trip de unidades Reefer.</li>
                </ul>
              </div>
              <div className="bg-[#00A9CE] text-white p-4 text-center font-bold text-sm tracking-wider uppercase">
                Gestión de Vacíos y Reefers
              </div>
            </div>

            {/* Galpón Cerrado */}
            <div className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow">
              <div className="p-8 flex-1">
                <div className="w-14 h-14 bg-[#F7941D]/10 rounded flex items-center justify-center mb-6">
                  <ShieldCheck className="text-[#F7941D]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Galpón Cerrado (Breakbulk)</h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  Nuestras instalaciones techadas brindan protección adicional y control climático. Ideal para mercancía delicada, carga general suelta y carga de importación para proyectos que requieren protección.
                </p>
                <ul className="space-y-3 text-sm text-gray-700 font-medium">
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Posiciones numeradas para trazabilidad exacta.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Área para carga general, vehículos y mercancía delicada.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#0b1a2e] mt-1.5 shrink-0" /> Gestión especializada de contenedores segregados.</li>
                </ul>
              </div>
              <div className="bg-[#F7941D] text-black/80 p-4 text-center font-bold text-sm tracking-wider uppercase">
                Protección y Clima Controlado
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
