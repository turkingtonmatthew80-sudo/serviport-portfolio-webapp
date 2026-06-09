import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, Smartphone } from "lucide-react";

export function FooterSection() {
  return (
    <>
      {/* Actual Footer */}
      <footer className="bg-secondary text-white py-20">
        <div className="max-w-[1260px] mx-auto px-4 md:px-6 grid md:grid-cols-4 gap-12 lg:gap-16">
          {/* Col 1: Branding & Contact */}
          <div>
            <Link to="/" className="flex items-center mb-8">
              <img
                src="/logo.png"
                alt="Serviport Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="flex flex-col gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a
                  href="mailto:Gerenciacomercial@serviportve.com"
                  className="hover:text-white transition-colors break-all"
                >
                  Gerenciacomercial@serviportve.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <a
                  href="tel:+582123383957"
                  className="hover:text-white transition-colors"
                >
                  (+58) 212 3383957
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-accent shrink-0" />
                <a
                  href="tel:+5804242963458"
                  className="hover:text-white transition-colors"
                >
                  +58 0424 296 3458
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Main Links */}
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-300">
            <Link
              to="/"
              className="hover:text-orange-400 transition-colors w-fit"
            >
              Inicio
            </Link>
            <Link
              to="/nosotros"
              className="hover:text-orange-400 transition-colors w-fit"
            >
              Nosotros
            </Link>
            <Link
              to="/servicios"
              className="hover:text-orange-400 transition-colors w-fit"
            >
              Servicios
            </Link>
            <Link
              to="/sectores"
              className="hover:text-orange-400 transition-colors w-fit"
            >
              Sectores
            </Link>
            <Link
              to="/herramientas"
              className="hover:text-orange-400 transition-colors w-fit"
            >
              Herramientas
            </Link>
          </div>

          {/* Col 3: Portals */}
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-300">
            <Link
              target="_blank"
              to="/login"
              className="flex items-center justify-between bg-accent text-white px-4 py-3 rounded hover:bg-orange-500 transition-colors text-center font-bold"
            >
              Login Portal B2B
            </Link>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-between border border-slate-600 hover:border-primary hover:text-primary px-4 py-3 rounded text-center font-bold transition-all duration-300"
            >
              Sistema Administrativo
            </a>
          </div>

          {/* Col 4: Newsletter */}
          <div className="text-sm">
            <p className="text-slate-400 mb-6 leading-relaxed">
              Regístrate en nuestro boletín para recibir noticias, recursos
              portuarios y perspectivas directo en tu bandeja de entrada.
            </p>
            <Link
              to="/suscripcion-boletin"
              className="inline-block border border-slate-600 hover:border-accent hover:text-accent px-8 py-3 rounded text-white font-bold transition-all duration-300 text-center"
            >
              Suscribirse
            </Link>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="max-w-[1260px] mx-auto px-6 mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>
            © 2026 Serviport Agentes Navieros C.A. - Sitio web desarrollado por{" "}
            <a
              href="https://www.linkedin.com/in/matthew-turkington-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Matthew Turkington
            </a>
          </p>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link
              to="/terminos-y-condiciones"
              className="hover:text-slate-300 transition-colors text-center"
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/politica-de-privacidad"
              className="hover:text-slate-300 transition-colors text-center"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/documentos-legales"
              className="hover:text-slate-300 transition-colors text-center"
            >
              Documentos Legales
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
