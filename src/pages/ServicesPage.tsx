import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Anchor, ShieldCheck, Wrench, HardHat, Forklift, Box, Wind, Compass, Truck, Container, CheckCircle2, ArrowRight } from "lucide-react";

export function ServicesPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        // Adding a slight delay to ensure rendering is complete
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
      <section className="bg-[#0b1a2e] text-white pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Anchor size={400} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-6 py-3 bg-[#00A9CE] text-white font-bold tracking-wider text-sm md:text-base mb-6 uppercase shadow-sm">
            Nuestros Servicios
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight mb-6">
            Aportamos valor a la cadena <br className="hidden md:block" />logística de nuestros clientes
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Servicio integral en todas las etapas de la cadena logística portuaria.
          </p>
        </div>
      </section>

      <section className="py-12 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            Serviport te brinda un servicio integral que cubre todas las etapas de la cadena logística portuaria: desde la representación legal del buque ante autoridades venezolanas, pasando por la carga y descarga de mercancías, hasta el almacenaje aduanero y el transporte terrestre de distribución nacional.
          </p>
        </div>
      </section>

      {/* AGENCIAMIENTO NAVIERO */}
      <section id="agenciamiento-naviero" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-28">
                <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
                  <Anchor className="text-[#00A9CE]" size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">Agenciamiento Naviero</h2>
                <div className="w-20 h-1 bg-[#00A9CE] mb-8"></div>
                <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
                  Representación legal e integral de buques y protección estricta de intereses en puerto.
                </p>
                <Link to="/servicios/agenciamiento-naviero" className="inline-flex items-center gap-2 text-white bg-[#0b1a2e] px-6 py-3 rounded font-bold hover:bg-[#1a365d] transition-colors text-sm uppercase tracking-wider">
                  Ver Detalles <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/3 space-y-12">
              <div className="bg-white border border-gray-100 rounded p-8 md:p-10 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:border-[#00A9CE]/30 transition-colors">
                <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4 flex items-center gap-3">
                  <Anchor className="text-[#00A9CE]" size={24} /> Agentes Navieros Generales
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                  Serviport actúa como representante legal e integral de buques y motonaves ante las autoridades portuarias venezolanas: INEA, SENIAT y Bolipuertos S.A. Gestionamos todos los trámites de arribo, atraque, operaciones y zarpe.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Tramitación de aviso de arribo y manifiesto.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Coordinación de práctico, remolcadores y amarre.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Gestión de reconocimiento aduanero y actas.</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Liquidación de gastos portuarios (Disbursement Account).</li>
                  <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[#00A9CE] mt-1.5 shrink-0" /> Representación ante Cuarentena e INEA.</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-100 rounded p-8 md:p-10 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:border-[#00A9CE]/30 transition-colors">
                <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4 flex items-center gap-3">
                  <ShieldCheck className="text-[#00A9CE]" size={24} /> Agentes Protectores
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Resguardo estricto de los intereses de armadores y fletadores durante la estadía del buque en puerto. Serviport actúa como contraparte independiente que supervisa que todas las operaciones se ejecuten conforme a los términos del contrato de fletamento, protegiendo la economía del viaje y la integridad de la tripulación.
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded p-8 md:p-10 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:border-[#00A9CE]/30 transition-colors">
                <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4 flex items-center gap-3">
                  <Wrench className="text-[#00A9CE]" size={24} /> Servicios al Buque (Husbandry)
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                  Coordinación integral de servicios de reaprovisionamiento y asistencia durante la estadía del buque en el muelle.
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-[#0b1a2e] font-bold">
                   <span className="bg-slate-100 px-3 py-1.5 rounded">Suministro de víveres y agua</span>
                   <span className="bg-slate-100 px-3 py-1.5 rounded">Bunkering</span>
                   <span className="bg-slate-100 px-3 py-1.5 rounded">Asistencia en anclaje</span>
                   <span className="bg-slate-100 px-3 py-1.5 rounded">Atención médica</span>
                   <span className="bg-slate-100 px-3 py-1.5 rounded">Reparaciones menores</span>
                </div>
                <Link to="/servicios/servicios-al-buque" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-[#008EBF] transition-colors mt-8 text-sm uppercase tracking-wider">
                  Ver Detalles <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERACIONES PORTUARIAS */}
      <section id="operaciones-portuarias" className="bg-[#0b1a2e] text-white py-24 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-28">
                <div className="w-16 h-16 bg-[#00A9CE] rounded flex items-center justify-center mb-6">
                  <HardHat className="text-white" size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Operaciones Portuarias</h2>
                <div className="w-20 h-1 bg-[#00A9CE] mb-8"></div>
                <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8">
                  Maniobras eficientes con cuadrillas expertas y maquinaria propia de alta capacidad en el patio.
                </p>
                <Link to="/servicios/operaciones-portuarias" className="inline-flex items-center gap-2 text-[#0b1a2e] bg-[#00A9CE] px-6 py-3 rounded font-bold hover:bg-[#008EBF] hover:text-white transition-colors text-sm uppercase tracking-wider">
                  Ver Detalles <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/3 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded p-8 md:p-10 hover:bg-white/10 transition-colors">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Box className="text-[#00A9CE]" size={24} /> Estiba y Desestiba
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6 font-medium">
                  Operaciones de carga y descarga de navíos ejecutadas por cuadrillas profesionales de estibadores certificados, manejando contenedores llenos y vacíos, granel, general, refrigerada o peligrosa.
                </p>
                <div className="space-y-2 text-sm text-slate-200">
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-[#00A9CE]" size={16} /> Personal capacitado y calificado con certificado.</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-[#00A9CE]" size={16} /> Cobertura de póliza de seguro internacional.</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-[#00A9CE]" size={16} /> Historial impecable como operador de terminal.</div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-8 md:p-10 hover:bg-white/10 transition-colors">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Forklift className="text-[#00A9CE]" size={24} /> Manejo de Patio y Maquinaria
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6 font-medium">
                  Operaciones con equipos pesados de alta capacidad. Contamos con grúas móviles y grúas flotantes de hasta 100+ toneladas, reach stackers y montacargas para la manipulación precisa de carga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALMACENAJE Y RESGUARDO */}
      <section id="almacenaje-resguardo" className="py-24 px-6 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6 mx-auto">
              <Container className="text-[#00A9CE]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">Almacenaje y Resguardo</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium max-w-3xl mx-auto mb-8">
               Instalaciones aduaneras de primer nivel con seguridad 24x7 y manejo técnico.
            </p>
            <Link to="/servicios/almacenaje-resguardo" className="inline-flex items-center gap-2 text-white bg-[#00A9CE] px-6 py-3 rounded font-bold hover:bg-[#008EBF] transition-colors text-sm uppercase tracking-wider mx-auto">
              Ver Detalles <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 p-8 shadow-sm rounded-sm hover:shadow-xl transition-shadow border-t-4 border-[#0b1a2e]">
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Almacén General de Depósito (AGD)</h3>
              <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">
                Espacio propio provisto de patios descubiertos organizados en bloques alfabéticos, destinado al almacenamiento seguro y la nacionalización de mercancías bajo normativas vigentes.
              </p>
              <ul className="space-y-3 text-sm text-gray-700 border-t pt-6 border-gray-100">
                <li className="flex gap-2"><b>•</b> Capacidad doble de un patio estándar.</li>
                <li className="flex gap-2"><b>•</b> Vaciado y llenado de contenedores.</li>
                <li className="flex gap-2"><b>•</b> Video-vigilancia y resguardo 24x7.</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-100 p-8 shadow-sm rounded-sm hover:shadow-xl transition-shadow border-t-4 border-[#00A9CE]">
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Almacén de Equipos Vacíos</h3>
              <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">
                Zona dedicada al acopio, inspección técnica, lavado y reparaciones de contenedores, así como de conexiones especiales para reefer containers.
              </p>
              <ul className="space-y-3 text-sm text-gray-700 border-t pt-6 border-gray-100">
                <li className="flex gap-2"><b>•</b> Conformidad y Reporte de daños.</li>
                <li className="flex gap-2"><b>•</b> Reparaciones menores IICL.</li>
                <li className="flex gap-2"><b>•</b> Conexión y pre-trip para reefers.</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-100 p-8 shadow-sm rounded-sm hover:shadow-xl transition-shadow border-t-4 border-gray-300">
              <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Galpón Cerrado</h3>
              <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">
                Especialmente habilitado para mercancía delicada, carga general suelta y carga proyecto que requiera protección climática controlada.
              </p>
              <ul className="space-y-3 text-sm text-gray-700 border-t pt-6 border-gray-100">
                <li className="flex gap-2"><b>•</b> Control de humedad y cima.</li>
                <li className="flex gap-2"><b>•</b> Posiciones numeradas para trazabilidad.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FLETAMENTO Y TRANSPORTE */}
      <section className="py-24 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            
            <div id="fletamento-maritimo" className="scroll-mt-20 group cursor-default">
              <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6 group-hover:bg-[#00A9CE] transition-colors">
                <Compass className="text-[#00A9CE] group-hover:text-white transition-colors" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-6">Fletamento Marítimo</h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium mb-6">
                Intermediación y cotización de buques para el transporte de grandes volúmenes de carga y proyectos especiales. Conectamos a armadores y fletadores con la flota adecuada.
              </p>
              <ul className="space-y-2 text-gray-700 font-medium text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full" /> Carga a granel, líquida y contenedores.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full" /> Negociación de Voyage y Time Charter.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full" /> Asesoría en rutas óptimas y costos.</li>
              </ul>
              <Link to="/servicios/fletamento-maritimo" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-[#008EBF] transition-colors mt-8 text-sm uppercase tracking-wider">
                Ver Detalles <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>

            <div id="transporte-mercancias" className="scroll-mt-20 group cursor-default">
              <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6 group-hover:bg-[#00A9CE] transition-colors">
                <Truck className="text-[#00A9CE] group-hover:text-white transition-colors" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-6">Transporte de Mercancías</h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium mb-6">
                Flota de transporte terrestre propia para el traslado seguro y la distribución nacional. Cubrimos el último eslabón logístico desde el puerto hasta tu almacén en Venezuela.
              </p>
              <ul className="space-y-2 text-gray-700 font-medium text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full" /> Acarreo en zonas portuarias.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full" /> Transporte de carga general y especializada.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full" /> Servicio de escolta para cargas de alto valor.</li>
              </ul>
              <Link to="/servicios/transporte-mercancias" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-[#008EBF] transition-colors mt-8 text-sm uppercase tracking-wider">
                Ver Detalles <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
