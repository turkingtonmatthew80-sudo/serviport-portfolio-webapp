import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { FooterSection } from './components/FooterSection';
import { ChevronRight } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap: Record<string, string> = {
    'nosotros': 'Nosotros',
    'servicios': 'Servicios',
    'sectores': 'Sectores',
    'herramientas': 'Herramientas',
    'portal': 'Portal B2B'
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50 font-sans text-slate-900 selection:bg-[#F7941D] selection:text-white">
      <Navigation />
      
      {location.pathname !== '/' && (
        <div className="bg-[#0b1a2e] text-slate-300 py-3 px-6 shadow-inner text-sm font-medium">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            {pathNames.map((path, index) => {
              const routeTo = `/${pathNames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathNames.length - 1;
              const name = breadcrumbMap[path] || path;
              
              return (
                <div key={name} className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-slate-500" />
                  {isLast ? (
                    <span className="text-white font-bold">{name}</span>
                  ) : (
                    <Link to={routeTo} className="hover:text-white transition-colors">
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
