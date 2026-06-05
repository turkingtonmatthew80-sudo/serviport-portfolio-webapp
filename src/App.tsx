import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { PortalLayout } from './layouts/PortalLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AgenciamientoNavieroPage } from './pages/services/AgenciamientoNavieroPage';
import { OperacionesPortuariasPage } from './pages/services/OperacionesPortuariasPage';
import { AlmacenajeResguardoPage } from './pages/services/AlmacenajeResguardoPage';
import { FletamentoMaritimoPage } from './pages/services/FletamentoMaritimoPage';
import { TransporteMercanciasPage } from './pages/services/TransporteMercanciasPage';
import { ServiciosBuquePage } from './pages/services/ServiciosBuquePage';
import { SectorsPage } from './pages/SectorsPage';
import { ToolsPage } from './pages/ToolsPage';
import { HistoryPage } from './pages/about/HistoryPage';
import { NetworkPage } from './pages/about/NetworkPage';
import { CSRPage } from './pages/about/CSRPage';
import { CertificationsPage } from './pages/about/CertificationsPage';
import { TeamPage } from './pages/about/TeamPage';
import { CareersPage } from './pages/about/CareersPage';
import { VacanciesPage } from './pages/about/VacanciesPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LegalDocsPage } from './pages/LegalDocsPage';
import { NewsletterPage } from './pages/NewsletterPage';
import { ContactPage } from './pages/ContactPage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';

import { LoginPage } from './pages/LoginPage';
import { B2BRegisterPage } from './pages/B2BRegisterPage';
import { PortalIndexRoute } from './pages/portal/PortalIndexRoute';
import { NavieraDashboard } from './pages/portal/roles/NavieraDashboard';
import { ImportadorDashboard } from './pages/portal/roles/ImportadorDashboard';
import { RoleGuard } from './components/RoleGuard';

import { SuscripcionPage } from './pages/portal/SuscripcionPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="nosotros/historia" element={<HistoryPage />} />
          <Route path="nosotros/red" element={<NetworkPage />} />
          <Route path="nosotros/responsabilidad-social" element={<CSRPage />} />
          <Route path="nosotros/certificaciones" element={<CertificationsPage />} />
          <Route path="nosotros/equipo" element={<TeamPage />} />
          <Route path="nosotros/carreras" element={<CareersPage />} />
          <Route path="nosotros/carreras/vacantes" element={<VacanciesPage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="servicios/agenciamiento-naviero" element={<AgenciamientoNavieroPage />} />
          <Route path="servicios/operaciones-portuarias" element={<OperacionesPortuariasPage />} />
          <Route path="servicios/almacenaje-resguardo" element={<AlmacenajeResguardoPage />} />
          <Route path="servicios/fletamento-maritimo" element={<FletamentoMaritimoPage />} />
          <Route path="servicios/transporte-mercancias" element={<TransporteMercanciasPage />} />
          <Route path="servicios/servicios-al-buque" element={<ServiciosBuquePage />} />
          <Route path="sectores" element={<SectorsPage />} />
          <Route path="noticias" element={<NewsPage />} />
          <Route path="noticias/:articleId" element={<NewsArticlePage />} />
          <Route path="herramientas" element={<ToolsPage />} />
          <Route path="terminos-y-condiciones" element={<TermsPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="politica-de-privacidad" element={<PrivacyPage />} />
          <Route path="documentos-legales" element={<LegalDocsPage />} />
          <Route path="suscripcion-boletin" element={<NewsletterPage />} />
        </Route>
        
        {/* Auth & Portal Routes via separate layout */}
        <Route path="login" element={<LoginPage />} />
        <Route path="registro-b2b" element={<B2BRegisterPage />} />
        <Route path="portal" element={<PortalLayout />}>
          {/* Index redirect to user's first role */}
          <Route index element={<PortalIndexRoute />} />
          
          {/* Naviera */}
          <Route path="naviera/dashboard" element={<RoleGuard allowedRoles={['naviera']}><NavieraDashboard /></RoleGuard>} />
          <Route path="naviera/port-calls" element={<RoleGuard allowedRoles={['naviera']}><div className="p-8"><h2 className="text-xl font-bold">Port Calls</h2>Módulo Naviera en desarrollo</div></RoleGuard>} />
          <Route path="naviera/proformas" element={<RoleGuard allowedRoles={['naviera']}><div className="p-8"><h2 className="text-xl font-bold">Proformas</h2>Módulo Naviera en desarrollo</div></RoleGuard>} />

          {/* Importador */}
          <Route path="importador/dashboard" element={<RoleGuard allowedRoles={['importador']}><ImportadorDashboard /></RoleGuard>} />
          <Route path="importador/tracking" element={<RoleGuard allowedRoles={['importador']}><div className="p-8"><h2 className="text-xl font-bold">Trazabilidad AGD</h2>Módulo Importador en desarrollo</div></RoleGuard>} />
          <Route path="importador/retiros" element={<RoleGuard allowedRoles={['importador']}><div className="p-8"><h2 className="text-xl font-bold">Retiros</h2>Módulo Importador en desarrollo</div></RoleGuard>} />

          {/* General (accessible by anyone logged in) */}
          <Route path="suscripcion" element={<SuscripcionPage />} />
          
          {/* Fallback for other modules to prevent 404s */}
          <Route path=":rol/dashboard" element={<RoleGuard><div className="p-8"><h2 className="text-xl font-bold">Dashboard</h2>Módulo en desarrollo</div></RoleGuard>} />
          <Route path=":rol/:modulo" element={<RoleGuard><div className="p-8"><h2 className="text-xl font-bold capitalize">Módulo B2B</h2>Vistas operativas en desarrollo</div></RoleGuard>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
