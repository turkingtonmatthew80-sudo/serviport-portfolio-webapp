import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight, Menu, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GlobalSearch } from "./GlobalSearch";
import { useTheme } from "../contexts/ThemeContext";
import { ContainerUnit } from "./ContainerUnit";

export const megaMenuData = {
  nosotros: {
    title: "Nosotros",
    path: "/nosotros",
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80",
    description:
      "Conoce nuestra trayectoria, valores e infraestructura propia en los puertos de Venezuela.",
    links: [
      { label: "Quiénes Somos", path: "/nosotros" },
      { label: "Nuestra Historia", path: "/nosotros/historia" },
      { label: "Nuestro Equipo", path: "/nosotros/equipo" },
      { label: "Red / Presencia", path: "/nosotros/red" },
      { label: "Certificaciones", path: "/nosotros/certificaciones" },
      {
        label: "Responsabilidad Social",
        path: "/nosotros/responsabilidad-social",
      },
      { label: "Carreras", path: "/nosotros/carreras" },
    ],
  },
  servicios: {
    title: "Servicios",
    path: "/servicios",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80",
    description:
      "Servicios logísticos integrales en todas las fases clave de la cadena portuaria y del comercio exterior.",
    links: [
      {
        label: "Agenciamiento Naviero",
        path: "/servicios/agenciamiento-naviero",
      },
      {
        label: "Operaciones Portuarias",
        path: "/servicios/operaciones-portuarias",
      },
      {
        label: "Almacenaje y Resguardo",
        path: "/servicios/almacenaje-resguardo",
      },
      { label: "Fletamento Marítimo", path: "/servicios/fletamento-maritimo" },
      {
        label: "Transporte de Mercancías",
        path: "/servicios/transporte-mercancias",
      },
      { label: "Servicios al Buque", path: "/servicios/servicios-al-buque" },
    ],
  },
  sectores: {
    title: "Sectores",
    path: "/sectores",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80",
    description:
      "Soluciones de transporte y agenciamiento especializadas por sector y tipo de carga.",
    links: [
      {
        label: "Carga Contenerizada (FCL/LCL)",
        path: "/sectores#contenerizada",
      },
      { label: "Carga a Granel", path: "/sectores#granel" },
      { label: "Carga General y Suelta", path: "/sectores#general" },
      { label: "Carga Refrigerada y Peligrosa", path: "/sectores#refrigerada" },
    ],
  },
  herramientas: {
    title: "Herramientas",
    path: "/herramientas",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    description:
      "Herramientas digitales avanzadas para clientes B2B, permitiendo visibilidad y control.",
    links: [
      { label: "Seguimiento de Carga", path: "/herramientas#track" },
      { label: "Cotizador en Línea", path: "/herramientas#quote" },
      { label: "Monitor Operativo del Puerto", path: "/herramientas#monitor" },
    ],
  },
  noticias: {
    title: "Noticias",
    path: "/noticias",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80",
    description:
      "Actualizaciones operativas, noticias corporativas y artículos de opinión del sector marítimo y logístico.",
    links: [
      { label: "Noticias Recientes", path: "/noticias" },
      { label: "Blog Corporativo", path: "/noticias#blog" },
      { label: "Avisos Operativos", path: "/noticias#avisos" },
      { label: "Casos de Éxito", path: "/noticias#casos" },
    ],
  },
  contacto: {
    title: "Contacto",
    path: "/contacto",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80",
    description:
      "Mantente en contacto y encuentra el canal adecuado para tu requerimiento.",
    links: [
      { label: "Hacer una Consulta", path: "/contacto#formulario" },
      { label: "Oficinas y Teléfonos", path: "/contacto#direcciones" },
      { label: "Buscar una Carrera", path: "/nosotros/carreras" },
    ],
  },
};

type MenuKey = keyof typeof megaMenuData;

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const { theme, toggleTheme } = useTheme();

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

  const containerStyles: Record<MenuKey, { theme: string; textColor: string }> = {
    nosotros: {
      theme: "bg-[#f1f5f9] hover:bg-[#e2e8f0]",
      textColor: "text-slate-800"
    },
    servicios: {
      theme: "bg-[#0B5C75] hover:bg-[#084e63]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    sectores: {
      theme: "bg-[#ea580c] hover:bg-[#d97706]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    herramientas: {
      theme: "bg-[#1e293b] hover:bg-[#1a2332]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    noticias: {
      theme: "bg-[#0284c7] hover:bg-[#0274af]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    contacto: {
      theme: "bg-[#ea580c] hover:bg-[#d97706]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    }
  };

  return (
    <nav
      className="w-full bg-[#050B14] text-white h-20 flex justify-between items-center z-50 relative border-b border-black/40 shadow-lg"
      onMouseLeave={handleMouseLeave}
    >
      {/* Container row covering full bar width */}
      <div className="w-full h-full flex items-center justify-between overflow-hidden">
        
        {/* LEFT FILLERS & LOGO PART */}
        <div className="flex h-full items-center">
          {/* Infinite wide container wall on the left */}
          <div className="hidden xl:flex h-full items-center">
            <ContainerUnit theme="bg-[#0B5C75]" isDecorative />
            <ContainerUnit theme="bg-[#1e293b]" isDecorative className="hidden 2xl:flex" />
          </div>

          {/* Mobile menu trigger in a square safety container */}
          <div className="md:hidden h-full flex items-center">
            <ContainerUnit 
              isSquare
              theme={mobileMenuOpen ? "bg-[#ea580c]" : "bg-[#1e293b]"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="pointer-events-none">
                {mobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
              </div>
            </ContainerUnit>
          </div>

          {/* Logo container (Rectangular) with high-contrast light grey background */}
          <Link to="/" className="h-full block">
            <ContainerUnit
              theme="bg-[#f1f5f9]"
              className="w-[170px] md:w-[210px] h-full"
            >
              <img
                src="/logo.png"
                alt="Serviport Logo"
                className="h-8 md:h-10 w-auto object-contain px-2 opacity-100 transition-opacity"
              />
            </ContainerUnit>
          </Link>
        </div>

        {/* MIDDLE NAV LINKS - RECTANGULAR INTERACTIVE CONTAINERS */}
        <div className="hidden md:flex items-center h-full flex-grow max-w-[850px]">
          {(Object.keys(megaMenuData) as MenuKey[]).map((key) => {
            const config = containerStyles[key];
            const isActive = activeMenu === key || location.pathname.startsWith(`/${key}`);
            return (
              <ContainerUnit
                key={key}
                theme={config.theme}
                isActive={isActive}
                onMouseEnter={() => handleMouseEnter(key)}
              >
                <Link
                  to={`/${key}`}
                  className={`w-full h-full flex items-center justify-center font-black tracking-wider text-[11px] lg:text-xs xl:text-sm uppercase pointer-events-auto transition-colors ${config.textColor}`}
                  onClick={handleMenuClick}
                >
                  {megaMenuData[key].title}
                </Link>
              </ContainerUnit>
            );
          })}
        </div>

        {/* RIGHT ACTIONS SECTION */}
        <div className="flex h-full items-center">
          
          {/* Theme Toggle square container (styled as a reefer climate core unit) */}
          <ContainerUnit
            isSquare
            theme={theme === "light" ? "bg-[#f1f5f9]" : "bg-[#1e293b]"}
            onClick={toggleTheme}
          >
            <div className="pointer-events-none">
              {theme === "light" ? <Moon size={20} className="text-zinc-800" /> : <Sun size={20} className="text-amber-400" />}
            </div>
          </ContainerUnit>

          {/* Search trigger (Inside nested relative flex) */}
          <div className="h-full flex items-center">
            <GlobalSearch />
          </div>

          {/* B2B Portal button: customized safety-orange high cube container */}
          <ContainerUnit
            theme="bg-[#ea580c] hover:bg-[#d97706]"
            className="md:w-[130px] w-[86px] h-full"
            onClick={() => navigate("/login")}
          >
            <span className="font-sans font-black tracking-wider text-[9px] md:text-[11px] lg:text-xs text-white drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.7)] uppercase text-center leading-tight">
              PORTAL B2B
            </span>
          </ContainerUnit>

          {/* Infinite wide container wall on the right */}
          <div className="hidden xl:flex h-full items-center">
            <ContainerUnit theme="bg-[#1e293b]" isDecorative className="hidden 2xl:flex" />
            <ContainerUnit theme="bg-[#0284c7]" isDecorative />
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-Out stacked as beautifully organized containers */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-0 w-full bg-[#080d1a] border-t border-black/40 shadow-2xl overflow-y-auto md:hidden z-40 p-4 flex flex-col gap-3"
            style={{ maxHeight: "calc(100vh - 80px)" }}
          >
            {(Object.keys(megaMenuData) as MenuKey[]).map((key) => {
              const config = containerStyles[key];
              return (
                <div
                  key={key}
                  className={`rounded border border-black/30 shadow-md ${config.theme} relative overflow-hidden`}
                >
                  {/* Crisp, Minimalist Flat Vertical Corrugation Lines */}
                  <div className="absolute inset-0 flex justify-around px-4 pointer-events-none opacity-[0.14]">
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                  </div>
                  
                  <div className="px-5 py-4 font-black tracking-wider text-base flex items-center justify-between relative z-10">
                    <Link
                      to={megaMenuData[key].path}
                      onClick={handleMenuClick}
                      className={`flex-1 uppercase font-black font-sans leading-none tracking-wider ${config.textColor}`}
                    >
                      {megaMenuData[key].title}
                    </Link>
                  </div>

                  <div className="px-5 pb-4 flex flex-col gap-2 relative z-10">
                    {megaMenuData[key].links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        onClick={handleMenuClick}
                        className="text-white/90 hover:text-white duration-200 transition-transform py-2 flex items-center gap-2 text-xs font-bold leading-none bg-black/25 shadow-sm border border-white/5 rounded px-3"
                      >
                        <ChevronRight size={12} className="text-[#f59e0b] shrink-0" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
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
            className="hidden md:block absolute top-20 left-0 w-full bg-secondary border-t border-black/40 shadow-2xl overflow-hidden z-40"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1260px] mx-auto p-12 lg:p-16 flex flex-col md:flex-row gap-12 lg:gap-16 relative">
              <button
                onClick={() => setActiveMenu(null)}
                className="absolute top-8 right-8 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase transition-colors"
              >
                Close <X size={20} />
              </button>

              <div className="md:w-1/3">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-4 h-1 bg-accent"></div>
                  <Link
                    to={megaMenuData[activeMenu].path}
                    onClick={handleMenuClick}
                    className="text-3xl lg:text-4xl font-bold text-white hover:text-primary transition-colors border-b-2 border-white/20 pb-1"
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
                    <div className="w-3 h-1 bg-accent"></div>
                    <span className="text-xl lg:text-2xl font-bold text-white">
                      {megaMenuData[activeMenu].title}
                    </span>
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
