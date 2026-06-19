import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight, ChevronDown, Menu, Moon, Sun } from "lucide-react";
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
  directorio: {
    title: "Directorio Marítimo",
    path: "/directorio",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80",
    description:
      "Catálogo global de infraestructura, navieras, aduanas y buques vinculados al transporte logístico.",
    links: [
      { label: "Catálogo Completo", path: "/directorio" },
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
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<number | null>(null);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenuExpansion = (key: string) => {
    setExpandedMobileMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
    setExpandedMobileMenus({});
  }, [location.pathname]);

  const containerStyles: Record<MenuKey, { theme: string; textColor: string }> = {
    nosotros: {
      theme: "bg-[#1e293b] hover:bg-[#1a2332] dark:bg-[#0f172a] dark:hover:bg-[#1e293b]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    servicios: {
      theme: "bg-[#0B5C75] hover:bg-[#084e63]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    sectores: {
      theme: "bg-[#f7941d] hover:bg-[#e38312]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    herramientas: {
      theme: "bg-[#1e293b] hover:bg-[#1a2332] dark:bg-[#0f172a] dark:hover:bg-[#1e293b]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    noticias: {
      theme: "bg-[#0284c7] hover:bg-[#0274af]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    directorio: {
      theme: "bg-[#1e293b] hover:bg-[#1a2332] dark:bg-[#0f172a] dark:hover:bg-[#1e293b]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    },
    contacto: {
      theme: "bg-[#f7941d] hover:bg-[#e38312]",
      textColor: "text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]"
    }
  };

  return (
    <nav
      className="w-full bg-background text-foreground h-20 flex justify-between items-center z-50 relative border-b border-border shadow-sm transition-colors duration-300"
      onMouseLeave={handleMouseLeave}
    >
      {/* Container row covering full bar width */}
      <div className="w-full h-full flex items-center justify-between">
        
        {/* LEFT FILLERS & LOGO PART */}
        <div className="flex h-full items-center pl-2 sm:pl-4 md:pl-6">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden mr-2 sm:mr-4 text-foreground hover:text-primary transition-colors p-2 focus:outline-none shrink-0"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo container without background wrapper, handles theme inversion beautifully */}
          <Link to="/" className="h-full flex items-center relative z-10 py-2 shrink-0">
            <img
              src="/logo.png"
              alt="Serviport Logo"
              className={`h-7 sm:h-9 md:h-12 w-auto object-contain transition-all duration-300 ${theme === "dark" ? "invert brightness-0 filter brightness-0 invert" : ""}`}
            />
          </Link>
        </div>

        {/* MIDDLE NAV LINKS - RECTANGULAR INTERACTIVE CONTAINERS */}
        <div className="hidden md:flex items-center h-full flex-grow max-w-[850px] px-4">
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
        <div className="flex h-full items-center gap-1 sm:gap-2 md:gap-4 pr-2 sm:pr-4 md:pr-6">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full text-foreground hover:bg-background-muted hover:text-primary transition-colors focus:outline-none shrink-0"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Search Trigger */}
          <div className="shrink-0 flex items-center">
            <GlobalSearch />
          </div>

          {/* Portal Button (Original Pill Style) */}
          <button
            onClick={() => navigate("/login")}
            className="clay-button-accent px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 rounded-xl text-[10px] sm:text-xs md:text-sm whitespace-nowrap uppercase tracking-wider shrink-0"
          >
            Portal
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-Out stacked as beautifully organized containers */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-0 w-full bg-slate-100 dark:bg-[#080d1a] border-t border-border dark:border-black/40 shadow-2xl overflow-y-auto md:hidden z-40 p-4 flex flex-col gap-3"
            style={{ maxHeight: "calc(100vh - 80px)" }}
          >
            {(Object.keys(megaMenuData) as MenuKey[]).map((key) => {
              const config = containerStyles[key];
              const isExpanded = !!expandedMobileMenus[key];
              return (
                <div
                  key={key}
                  className={`rounded border border-black/10 dark:border-black/30 shadow-md ${config.theme} relative overflow-hidden shrink-0`}
                >
                  {/* Crisp, Minimalist Flat Vector Corrugation Lines */}
                  <div className="absolute inset-0 flex justify-around px-4 pointer-events-none opacity-[0.08] dark:opacity-[0.14]">
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
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMobileMenuExpansion(key);
                      }}
                      className={`ml-2 p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all outline-none ${config.textColor}`}
                      aria-label="Toggle submenu"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="px-5 pb-4 flex flex-col gap-2 relative z-10 overflow-hidden"
                      >
                        {megaMenuData[key].links.map((link, idx) => (
                          <Link
                            key={idx}
                            to={link.path}
                            onClick={handleMenuClick}
                            className="text-white/95 hover:text-white duration-200 transition-all py-2.5 flex items-center gap-2 text-xs font-bold leading-none bg-white/10 dark:bg-black/30 shadow-inner border border-white/10 rounded px-3 active:scale-[0.98]"
                          >
                            <ChevronRight size={12} className="text-[#f7941d] shrink-0" />
                            {link.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
