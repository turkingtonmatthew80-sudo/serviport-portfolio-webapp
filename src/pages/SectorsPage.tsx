import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Droplets, PackageOpen, Snowflake, AlertTriangle, Blocks } from "lucide-react";

export function SectorsPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&q=80')] bg-cover bg-center text-white relative">
        <div className="absolute inset-0 bg-[#0b1a2e]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e] to-transparent"></div>
        <div className="pt-28 pb-32 px-6 max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-6 py-3 bg-[#00A9CE] text-white font-bold tracking-wider text-sm md:text-base mb-6 uppercase shadow-sm">
            Especialización Operativa
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold leading-tight mb-6 tracking-tight text-white drop-shadow-lg">
            Sectores Industriales
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-medium max-w-3xl leading-relaxed drop-shadow">
            Capacidad comprobada para atender diferentes tipos de carga con protocolos específicos, maquinaria especializada y personal calificado.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 bg-[#0b1a2e] px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="md:w-1/3 shrink-0">
             <div className="text-[#00A9CE] flex gap-4">
                <Box size={40} strokeWidth={1.5} />
                <Droplets size={40} strokeWidth={1.5} />
                <PackageOpen size={40} strokeWidth={1.5} />
                <Snowflake size={40} strokeWidth={1.5} />
             </div>
          </div>
          <p className="md:w-2/3 text-xl text-slate-300 leading-relaxed font-medium">
            Entendemos que cada sector industrial requiere un trato único. Serviport está capacitada y certificada para atender la diversidad de la demanda logística venezolana, garantizando integridad y eficiencia.
          </p>
        </div>
      </section>

      {/* SECTORES GRID */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="grid md:grid-cols-2 gap-12">
            {/* CARGA CONTENERIZADA */}
            <div id="contenerizada" className="bg-white p-10 border border-gray-100 rounded shadow-sm hover:shadow-xl hover:border-[#00A9CE]/30 transition-all group scroll-mt-24">
              <div className="w-16 h-16 bg-[#00A9CE]/10 text-[#00A9CE] group-hover:bg-[#00A9CE] group-hover:text-white transition-colors rounded flex items-center justify-center mb-8">
                <Blocks size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Carga Contenerizada (FCL / LCL)</h3>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                Soluciones de importación y exportación para carga consolidada (LCL) y contenedor completo (FCL).
              </p>
              <ul className="text-sm font-medium text-gray-700 space-y-3">
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#F7941D]" /> Gestión de gate-in y gate-out.</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#F7941D]" /> Reconocimiento aduanero.</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#F7941D]" /> Almacenaje en AGD y entrega final.</li>
              </ul>
            </div>

            {/* CARGA A GRANEL */}
            <div id="granel" className="bg-white p-10 border border-gray-100 rounded shadow-sm hover:shadow-xl hover:border-[#00A9CE]/30 transition-all group scroll-mt-24">
              <div className="w-16 h-16 bg-[#00A9CE]/10 text-[#00A9CE] group-hover:bg-[#00A9CE] group-hover:text-white transition-colors rounded flex items-center justify-center mb-8">
                <Droplets size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Carga a Granel (Bulk Cargo)</h3>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                Operación de descarga directa de granos y cereales destinados a la infraestructura de silos del puerto.
              </p>
              <ul className="text-sm font-medium text-gray-700 space-y-3">
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#F7941D]" /> Registro de toneladas métricas por shipment.</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#F7941D]" /> Coordinación directa a silos de Bolipuertos.</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#F7941D]" /> Retiro coordinado con camiones de clientes.</li>
              </ul>
            </div>
          </div>

          {/* CARGA GENERAL Y SUELTA */}
          <div id="general" className="bg-white p-10 border border-gray-100 rounded shadow-sm flex flex-col md:flex-row gap-10 hover:shadow-xl hover:border-[#00A9CE]/30 transition-all group scroll-mt-24">
            <div className="md:w-1/3 flex flex-col justify-center">
              <div className="w-16 h-16 bg-[#0b1a2e] text-white rounded flex items-center justify-center mb-6">
                <PackageOpen size={32} />
              </div>
              <h3 className="text-3xl font-extrabold text-[#0b1a2e] mb-2">Carga General y Suelta</h3>
              <span className="text-[#00A9CE] font-bold tracking-widest text-sm uppercase">Breakbulk / Proyectos</span>
            </div>
            <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-100 md:pl-10 pt-6 md:pt-0 flex flex-col justify-center">
              <p className="text-gray-600 text-lg leading-relaxed font-medium mb-6">
                Manejo especializado de piezas de gran tamaño, maquinaria pesada y mercancías delicadas con resguardo en galpón techado.
              </p>
              <div className="flex flex-wrap gap-3">
                 <span className="bg-gray-100 text-gray-700 px-4 py-2 font-bold text-sm rounded">Embalaje especial</span>
                 <span className="bg-gray-100 text-gray-700 px-4 py-2 font-bold text-sm rounded">Trincado y manipulación</span>
                 <span className="bg-gray-100 text-gray-700 px-4 py-2 font-bold text-sm rounded">Equipos de alta capacidad</span>
                 <span className="bg-gray-100 text-gray-700 px-4 py-2 font-bold text-sm rounded">Posiciones de galpón exactas</span>
              </div>
            </div>
          </div>

          <div id="refrigerada" className="grid md:grid-cols-2 gap-12 scroll-mt-24">
            {/* CARGA REFRIGERADA */}
            <div className="bg-[#0b1a2e] text-white p-10 rounded shadow-md border-t-4 border-[#00A9CE] hover:-translate-y-1 transition-transform">
              <div className="mb-6">
                <Snowflake className="text-[#00A9CE]" size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Carga Refrigerada</h3>
              <p className="text-slate-300 leading-relaxed font-medium mb-6">
                Infraestructura y conocimiento para mantener la cadena de frío sin interrupciones durante el almacenaje portuario y nacionalización.
              </p>
              <ul className="text-sm font-medium text-slate-200 space-y-3">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE]" /> Conexión continua de contenedores reefers.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE]" /> Monitoreo y mantenimiento especializado.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE]" /> Pre-trip inspections (PTI) y soporte técnico.</li>
              </ul>
            </div>

            {/* CARGA PELIGROSA */}
            <div className="bg-white border-2 border-[#F7941D]/20 p-10 rounded shadow-md hover:border-[#F7941D]/50 hover:-translate-y-1 transition-all">
              <div className="mb-6">
                <AlertTriangle className="text-[#F7941D]" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Carga Peligrosa</h3>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                La seguridad es nuestra prioridad. Mantenemos el más alto rigor técnico, segregación y monitoreo para mercancias controladas.
              </p>
              <ul className="text-sm font-medium text-gray-700 space-y-3">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#F7941D]" /> Manejo bajo Código IMDG internacional.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#F7941D]" /> Cumplimiento de regulaciones nacionales.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#F7941D]" /> Protocolos de seguridad certificados.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
