import { Outlet, useLocation, Link } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { FooterSection } from "./components/FooterSection";
import { ChevronRight } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const pathNames = location.pathname.split("/").filter((x) => x);

  const breadcrumbMap: Record<string, string> = {
    nosotros: "Nosotros",
    servicios: "Servicios",
    sectores: "Sectores",
    herramientas: "Herramientas",
    portal: "Portal B2B",
    noticias: "Noticias",
    contacto: "Contacto",
    "agenciamiento-naviero": "Agenciamiento Naviero",
    "operaciones-portuarias": "Operaciones Portuarias",
    "almacenaje-resguardo": "Almacenaje y Resguardo",
    "fletamento-maritimo": "Fletamento Marítimo",
    "transporte-mercancias": "Transporte de Mercancías",
    "servicios-al-buque": "Servicios al Buque",
    "responsabilidad-social": "Responsabilidad Social",
    terminos: "Términos y Condiciones",
    privacidad: "Política de Privacidad",
    "aspectos-legales": "Documentos Legales",
    historia: "Nuestra Historia",
    equipo: "Nuestro Equipo",
    red: "Red y Presencia",
    certificaciones: "Certificaciones",
    carreras: "Carreras",
    newsletter: "Boletín",
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background-muted font-sans text-foreground selection:bg-accent selection:text-white">
      <Navigation />

      {location.pathname !== "/" && (
        <div className="bg-secondary text-slate-300 py-3 px-4 md:px-6 shadow-inner text-[10px] md:text-sm font-medium">
          <div className="max-w-[1260px] mx-auto flex flex-wrap items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="hover:text-white transition-colors uppercase tracking-widest"
            >
              Inicio
            </Link>
            {pathNames.map((path, index) => {
              const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathNames.length - 1;
              const name =
                breadcrumbMap[path] ||
                path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

              return (
                <div key={name} className="flex items-center gap-1 md:gap-2">
                  <ChevronRight size={14} className="text-slate-500" />
                  {isLast ? (
                    <span className="text-primary font-bold uppercase tracking-widest">
                      {name}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="hover:text-white transition-colors uppercase tracking-widest"
                    >
                      {name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
