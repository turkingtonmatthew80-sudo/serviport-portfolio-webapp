import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Calculator, Monitor, Activity, ArrowRight } from "lucide-react";

export function ToolsPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();

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

  const handleTrackAndTrace = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/portal');
  };

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="bg-[#0b1a2e] text-white pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Monitor size={400} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-6 py-3 bg-[#00A9CE] text-white font-bold tracking-wider text-sm md:text-base mb-6 uppercase shadow-sm">
            Ecosistema Digital
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold leading-tight mb-6">
            Herramientas Digitales
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Monitorea información crítica sobre tus envíos, programa simulaciones operativas y solicita cotizaciones en tiempo real.
          </p>
        </div>
      </section>

      {/* TRACK & TRACE SECTION */}
      <section id="track" className="py-24 px-6 border-b border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
              <Search className="text-[#00A9CE]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">Seguimiento de Carga (Track & Trace)</h2>
            <div className="w-20 h-1 bg-[#00A9CE] mb-8"></div>
            <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
              Buscador público simplificado para rastrear contenedores en tiempo real. Ingresa el número de tu contenedor para conocer el estatus general y disponibilidad en el muelle o el Almacén General de Depósito.
            </p>
            
            <form onSubmit={handleTrackAndTrace} className="bg-white border-2 border-gray-100 p-2 rounded-lg flex shadow-sm focus-within:border-[#00A9CE] focus-within:ring-4 focus-within:ring-[#00A9CE]/10 transition-all max-w-lg">
              <input 
                type="text" 
                placeholder="Nº de Contenedor (Ej: ABCD1234567)" 
                className="w-full px-4 outline-none text-gray-700 font-mono text-lg uppercase placeholder:normal-case placeholder:font-sans" 
                required
              />
              <button 
                type="submit"
                className="bg-[#0b1a2e] text-white px-6 py-4 rounded font-bold hover:bg-[#00A9CE] transition-colors whitespace-nowrap"
              >
                RASTREAR
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D] animate-pulse"></span>
              Para trazabilidad completa con ubicación exacta, inicia sesión en Serviport OS.
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-50 p-8 rounded-lg border border-gray-100 relative">
              <div className="absolute top-0 right-0 p-6 text-gray-200">
                <Search size={100} />
              </div>
              <h4 className="text-lg font-bold text-[#0b1a2e] mb-6">Resultados Mostrados</h4>
              <ul className="space-y-4 relative z-10">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#00A9CE] shrink-0">1</div>
                  <div>
                    <h5 className="font-bold text-[#0b1a2e]">Estatus General</h5>
                    <p className="text-sm text-gray-600">En tránsito internacional, En puerto, En AGD, Retirado, Embarcado.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#00A9CE] shrink-0">2</div>
                  <div>
                    <h5 className="font-bold text-[#0b1a2e]">Ubicación</h5>
                    <p className="text-sm text-gray-600">Última ubicación conocida del contenedor reportada por el yard planner.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#00A9CE] shrink-0">3</div>
                  <div>
                    <h5 className="font-bold text-[#0b1a2e]">Fechas Estimadas</h5>
                    <p className="text-sm text-gray-600">Fecha estimada de disponibilidad (importación) o embarque (exportación).</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COTIZADOR EN LINEA */}
      <section id="quote" className="py-24 px-6 bg-gray-50 border-b border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
              <Calculator className="text-[#00A9CE]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-6">Cotizador en Línea</h2>
            <div className="w-20 h-1 bg-[#00A9CE] mb-8"></div>
            <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
              Herramienta avanzada de solicitudes comerciales para obtener tarifas de fletes, almacenaje aduanero, agenciamiento naviero o transporte terrestre logístico de manera rápida y eficiente.
            </p>
            <p className="text-gray-600 leading-relaxed font-medium mb-8">
              Adjunta manifiestos preliminares o requerimientos especiales y recibe una propuesta adaptada a tus necesidades operativas en un plazo de respuesta garantizado de 24 a 48 horas.
            </p>
            <button 
              onClick={() => navigate('/contacto')}
              className="flex items-center gap-3 bg-[#0b1a2e] text-white px-8 py-4 rounded font-bold hover:bg-[#00A9CE] transition-colors"
            >
              SOLICITAR COTIZACIÓN <ArrowRight size={20} />
            </button>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#0b1a2e] mb-2">Agenciamiento</h4>
               <p className="text-sm text-gray-500">Cotiza trámites de arribo, estadía y actas.</p>
             </div>
             <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#0b1a2e] mb-2">Almacenaje AGD</h4>
               <p className="text-sm text-gray-500">Cotiza custodia, nacionalización y vaciados.</p>
             </div>
             <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#0b1a2e] mb-2">Transporte</h4>
               <p className="text-sm text-gray-500">Distribución a todo el territorio nacional.</p>
             </div>
             <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#0b1a2e] mb-2">Husbandry</h4>
               <p className="text-sm text-gray-500">Víveres, agua, bunkering y provisiones portuarias.</p>
             </div>
          </div>
        </div>
      </section>

      {/* MONITOR OPERATIVO */}
      <section id="monitor" className="py-24 px-6 bg-[#0b1a2e] text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="w-16 h-16 bg-white/10 rounded flex items-center justify-center mb-6">
              <Activity className="text-[#00A9CE]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Monitor Operativo del Puerto</h2>
            <div className="w-20 h-1 bg-[#00A9CE] mb-8"></div>
            <p className="text-slate-300 text-lg leading-relaxed font-medium mb-6">
              Visualiza en tiempo real y a escala el estado de las operaciones portuarias en el Puerto de Puerto Cabello. Los clientes autorizados tienen acceso a diagramas 2D/3D procedurales para supervisar el movimiento de barcos, equipos pesados y estiba.
            </p>
            <ul className="text-slate-300 font-medium space-y-4 mb-8">
               <li className="flex items-center gap-3"><div className="w-2 h-2 rounded bg-[#00A9CE]" /> Puestos de atraque y buques posicionados.</li>
               <li className="flex items-center gap-3"><div className="w-2 h-2 rounded bg-[#00A9CE]" /> Nivel de ocupación general de patios.</li>
               <li className="flex items-center gap-3"><div className="w-2 h-2 rounded bg-[#00A9CE]" /> Esquema del Almacén General de Depósito.</li>
               <li className="flex items-center gap-3"><div className="w-2 h-2 rounded bg-[#00A9CE]" /> Simulación de tiempo acelerado (para clientes B2B).</li>
            </ul>
            <button 
              onClick={() => navigate('/portal')}
              className="bg-[#00A9CE] text-white px-8 py-4 rounded font-bold hover:bg-[#008EBF] transition-colors"
            >
              ACCEDER AL PORTAL B2B
            </button>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="aspect-video bg-[#050f1a] rounded border border-white/10 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-x-0 bottom-0 top-auto h-48 bg-gradient-to-t from-[#00A9CE]/20 to-transparent"></div>
               {/* Decorative grid pattern mimicking a digital radar */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
               <div className="relative z-10 flex flex-col items-center">
                 <Monitor size={64} className="text-[#00A9CE] mb-4 opacity-80" />
                 <span className="font-mono text-[#00A9CE] tracking-widest uppercase">Simulación Activa</span>
                 <p className="text-slate-500 mt-2 text-sm">Requiere credenciales comerciales B2B</p>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
