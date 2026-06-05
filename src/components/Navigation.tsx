import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight, Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GlobalSearch } from "./GlobalSearch";

export const megaMenuData = {
  nosotros: {
    title: "Nosotros",
    path: "/nosotros",
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80",
    description: "Conoce nuestra trayectoria, valores e infraestructura propia en los puertos de Venezuela.",
    links: [
      { label: "Quiénes Somos", path: "/nosotros" },
      { label: "Nuestra Historia", path: "/nosotros/historia" },
      { label: "Nuestro Equipo", path: "/nosotros/equipo" },
      { label: "Red / Presencia", path: "/nosotros/red" },
      { label: "Certificaciones", path: "/nosotros/certificaciones" },
      { label: "Responsabilidad Social", path: "/nosotros/responsabilidad-social" },
      { label: "Carreras", path: "/nosotros/carreras" }
    ]
  },
  servicios: {
    title: "Servicios",
    path: "/servicios",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80",
    description: "Servicios logísticos integrales en todas las fases clave de la cadena portuaria y del comercio exterior.",
    links: [
      { label: "Agenciamiento Naviero", path: "/servicios/agenciamiento-naviero" },
      { label: "Operaciones Portuarias", path: "/servicios/operaciones-portuarias" },
      { label: "Almacenaje y Resguardo", path: "/servicios/almacenaje-resguardo" },
      { label: "Fletamento Marítimo", path: "/servicios/fletamento-maritimo" },
      { label: "Transporte de Mercancías", path: "/servicios/transporte-mercancias" },
      { label: "Servicios al Buque", path: "/servicios/servicios-al-buque" }
    ]
  },
  sectores: {
    title: "Sectores",
    path: "/sectores",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&q=80",
    description: "Soluciones de transporte y agenciamiento especializadas por sector y tipo de carga.",
    links: [
      { label: "Carga Contenerizada (FCL/LCL)", path: "/sectores#contenerizada" },
      { label: "Carga a Granel", path: "/sectores#granel" },
      { label: "Carga General y Suelta", path: "/sectores#general" },
      { label: "Carga Refrigerada y Peligrosa", path: "/sectores#refrigerada" },
    ]
  },
  herramientas: {
    title: "Herramientas",
    path: "/herramientas",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    description: "Herramientas digitales avanzadas para clientes B2B, permitiendo visibilidad y control.",
    links: [
      { label: "Seguimiento de Carga", path: "/herramientas#track" },
      { label: "Cotizador en Línea", path: "/herramientas#quote" },
      { label: "Monitor Operativo del Puerto", path: "/herramientas#monitor" },
    ]
  },
  noticias: {
    title: "Noticias",
    path: "/noticias",
    image: "https://images.unsplash.com/photo-1559297292-0b2a75225e?auto=format&fit=crop&q=80",
    description: "Actualizaciones operativas, noticias corporativas y artículos de opinión del sector marítimo y logístico.",
    links: [
      { label: "Noticias Recientes", path: "/noticias" },
      { label: "Blog Corporativo", path: "/noticias#blog" },
      { label: "Avisos Operativos", path: "/noticias#avisos" },
      { label: "Casos de Éxito", path: "/noticias#casos" },
    ]
  },
  contacto: {
    title: "Contacto",
    path: "/contacto",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80",
    description: "Mantente en contacto y encuentra el canal adecuado para tu requerimiento.",
    links: [
      { label: "Hacer una Consulta", path: "/contacto#formulario" },
      { label: "Oficinas y Teléfonos", path: "/contacto#direcciones" },
      { label: "Buscar una Carrera", path: "/nosotros/carreras" }
    ]
  }
};

type MenuKey = keyof typeof megaMenuData;

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (menu: MenuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMenuClick = () => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="w-full bg-white text-gray-700 h-20 flex justify-between items-center z-50 relative border-b border-gray-100" onMouseLeave={handleMouseLeave}>
      <div className="flex h-full items-center px-4 md:px-6">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden mr-4 text-gray-700 p-1"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link tracking-tight="true" to="/" className="h-full flex items-center py-2 md:py-4 relative z-10">
          <img 
            src="/logo.png" 
            alt="Serviport Logo" 
            className="h-10 md:h-full w-auto object-contain" 
          />
        </Link>
      </div>
      
      <div className="hidden md:flex items-center h-full gap-8 font-bold text-sm">
        {(Object.keys(megaMenuData) as MenuKey[]).map((key) => (
          <div 
            key={key}
            className="h-full flex items-center relative"
            onMouseEnter={() => handleMouseEnter(key)}
          >
            <Link 
              to={`/${key}`} 
              className={`flex items-center h-full px-2 transition-colors ${activeMenu === key ? 'text-[#00A9CE]' : 'hover:text-[#00A9CE]'}`}
              onClick={handleMenuClick}
            >
              {key.toUpperCase()}
            </Link>
            {activeMenu === key && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00A9CE]"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="px-4 md:px-6 flex items-center h-full gap-2 md:gap-4">
        <GlobalSearch />
        <button onClick={() => navigate('/login')} className="bg-[#00A9CE] md:bg-[#0b1a2e] text-white px-4 md:px-6 py-2 md:py-2.5 rounded font-bold hover:bg-[#008EBF] md:hover:bg-slate-800 transition-colors shadow-sm text-xs md:text-sm whitespace-nowrap">
          PORTAL B2B
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-0 w-full bg-[#0b1a2e] border-t border-white/10 shadow-2xl overflow-y-auto md:hidden"
            style={{ maxHeight: 'calc(100vh - 80px)' }}
          >
            <div className="flex flex-col py-4">
              {(Object.keys(megaMenuData) as MenuKey[]).map((key) => (
                <div key={key} className="border-b border-white/10 last:border-0">
                  <div className="px-6 py-4 font-bold text-white text-lg flex items-center justify-between">
                    <Link to={megaMenuData[key].path} onClick={handleMenuClick} className="flex-1">
                      {key.toUpperCase()}
                    </Link>
                  </div>
                  <div className="px-8 pb-4 flex flex-col gap-3">
                    {megaMenuData[key].links.map((link, idx) => (
                      <Link 
                        key={idx} 
                        to={link.path}
                        onClick={handleMenuClick}
                        className="text-slate-300 hover:text-white transition-colors py-1 flex items-center gap-2 text-sm"
                      >
                        <ChevronRight size={14} className="text-[#F7941D]" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega Menu Overlay (Desktop) */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute top-20 left-0 w-full bg-[#0b1a2e] border-t border-white/10 shadow-2xl overflow-hidden"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1400px] mx-auto p-12 lg:p-16 flex flex-col md:flex-row gap-12 lg:gap-16 relative">
              <button 
                onClick={() => setActiveMenu(null)}
                className="absolute top-8 right-8 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase transition-colors"
              >
                Close <X size={20} />
              </button>
              
              <div className="md:w-1/3">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-4 h-1 bg-[#F7941D]"></div>
                  <Link 
                    to={megaMenuData[activeMenu].path} 
                    onClick={handleMenuClick}
                    className="text-3xl lg:text-4xl font-bold text-white hover:text-[#00A9CE] transition-colors border-b-2 border-white/20 pb-1"
                  >
                    {megaMenuData[activeMenu].title}
                  </Link>
                </div>
                
                <div className="flex flex-col gap-6">
                  {megaMenuData[activeMenu].links.map((link, idx) => (
                    <Link 
                      key={idx} 
                      to={link.path}
                      onClick={handleMenuClick}
                      className="text-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="md:w-2/3 flex flex-col md:flex-row gap-8">
                <div className="md:w-3/5 h-48 md:h-auto rounded overflow-hidden">
                  <img 
                    src={megaMenuData[activeMenu].image} 
                    alt={megaMenuData[activeMenu].title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-3 h-1 bg-[#F7941D]"></div>
                     <span className="text-xl lg:text-2xl font-bold text-white">{megaMenuData[activeMenu].title}</span>
                  </div>
                  <p className="text-slate-400 text-base lg:text-lg leading-relaxed">
                    {megaMenuData[activeMenu].description}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

