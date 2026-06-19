import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { PortalLayout } from "./layouts/PortalLayout";
import { AdminLayout, AdminRoleGuard } from "./layouts/AdminLayout";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { AgenciamientoNavieroPage } from "./pages/services/AgenciamientoNavieroPage";
import { OperacionesPortuariasPage } from "./pages/services/OperacionesPortuariasPage";
import { AlmacenajeResguardoPage } from "./pages/services/AlmacenajeResguardoPage";
import { FletamentoMaritimoPage } from "./pages/services/FletamentoMaritimoPage";
import { TransporteMercanciasPage } from "./pages/services/TransporteMercanciasPage";
import { ServiciosBuquePage } from "./pages/services/ServiciosBuquePage";
import { SectorsPage } from "./pages/SectorsPage";
import { ToolsPage } from "./pages/ToolsPage";
import { HistoryPage } from "./pages/about/HistoryPage";
import { NetworkPage } from "./pages/about/NetworkPage";
import { CSRPage } from "./pages/about/CSRPage";
import { CertificationsPage } from "./pages/about/CertificationsPage";
import { TeamPage } from "./pages/about/TeamPage";
import { CareersPage } from "./pages/about/CareersPage";
import { VacanciesPage } from "./pages/about/VacanciesPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { LegalDocsPage } from "./pages/LegalDocsPage";
import { NewsletterPage } from "./pages/NewsletterPage";
import { ContactPage } from "./pages/ContactPage";
import { NewsPage } from "./pages/NewsPage";
import { NewsArticlePage } from "./pages/NewsArticlePage";

import { LoginPage } from "./pages/LoginPage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminEmployees } from "./pages/AdminEmployees";
import { AdminAccountSettings } from "./pages/AdminAccountSettings";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminConfig } from "./pages/AdminConfig";
import { AdminAprobaciones } from "./pages/AdminAprobaciones";
import { AdminYard } from "./pages/AdminYard";
import { AdminGate } from "./pages/AdminGate";
import { AdminBuques } from "./pages/AdminBuques";
import { AdminContador } from "./pages/AdminContador";
import { AdminTrafico } from "./pages/AdminTrafico";
import { AdminDA } from "./pages/AdminDA";
import { AdminDocumentos } from "./pages/AdminDocumentos";
import { AdminHSE } from "./pages/AdminHSE";
import { AdminEstibador } from "./pages/AdminEstibador";
import { AdminCuadrillas } from "./pages/AdminCuadrillas";
import { AdminMonitoreoTOS } from "./pages/AdminMonitoreoTOS";
import { AdminRendimiento } from "./pages/AdminRendimiento";
import { AdminNomina } from "./pages/AdminNomina";
import { AdminScraperPanel } from "./pages/AdminScraperPanel";
import { AdminCatalogoBuques } from "./pages/AdminCatalogoBuques";
import { B2BRegisterPage } from "./pages/B2BRegisterPage";
import { PortalIndexRoute } from "./pages/portal/PortalIndexRoute";
import { NavieraDashboard } from "./pages/portal/roles/NavieraDashboard";
import { NavieraPortCalls } from "./pages/portal/roles/NavieraPortCalls";
import { NavieraProformas } from "./pages/portal/roles/NavieraProformas";
import { ImportadorDashboard } from "./pages/portal/roles/ImportadorDashboard";
import { ImportadorTracking } from "./pages/portal/roles/ImportadorTracking";
import { ImportadorRetiros } from "./pages/portal/roles/ImportadorRetiros";
import { ExportadorDashboard } from "./pages/portal/roles/ExportadorDashboard";
import { ExportadorIngresos } from "./pages/portal/roles/ExportadorIngresos";
import { ExportadorEmbarque } from "./pages/portal/roles/ExportadorEmbarque";
import { AgenteAduanaDashboard } from "./pages/portal/roles/AgenteAduanaDashboard";
import { AduanaConsultas } from "./pages/portal/roles/AduanaConsultas";
import { AduanaDespachos } from "./pages/portal/roles/AduanaDespachos";
import { TransportistaDashboard } from "./pages/portal/roles/TransportistaDashboard";
import { TransportistaOrdenes } from "./pages/portal/roles/TransportistaOrdenes";
import { TransportistaEirs } from "./pages/portal/roles/TransportistaEirs";
import { ConsolidadorDashboard } from "./pages/portal/roles/ConsolidadorDashboard";
import { ConsolidadorMaster } from "./pages/portal/roles/ConsolidadorMaster";
import { ConsolidadorHouse } from "./pages/portal/roles/ConsolidadorHouse";
import { ArmadorDashboard } from "./pages/portal/roles/ArmadorDashboard";
import { ArmadorCuentas } from "./pages/portal/roles/ArmadorCuentas";
import { ArmadorHusbandry } from "./pages/portal/roles/ArmadorHusbandry";
import { RoleGuard } from "./components/RoleGuard";

import { SuscripcionPage } from "./pages/portal/SuscripcionPage";
import { Directorio } from "./pages/Directorio";
import { VesselDetail } from "./pages/VesselDetail";

import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="nosotros" element={<AboutPage />} />
            <Route path="nosotros/historia" element={<HistoryPage />} />
            <Route path="nosotros/red" element={<NetworkPage />} />
            <Route path="nosotros/responsabilidad-social" element={<CSRPage />} />
            <Route
              path="nosotros/certificaciones"
              element={<CertificationsPage />}
            />
            <Route path="nosotros/equipo" element={<TeamPage />} />
            <Route path="nosotros/carreras" element={<CareersPage />} />
            <Route
              path="nosotros/carreras/vacantes"
              element={<VacanciesPage />}
            />
            <Route path="servicios" element={<ServicesPage />} />
            <Route
              path="servicios/agenciamiento-naviero"
              element={<AgenciamientoNavieroPage />}
            />
            <Route
              path="servicios/operaciones-portuarias"
              element={<OperacionesPortuariasPage />}
            />
            <Route
              path="servicios/almacenaje-resguardo"
              element={<AlmacenajeResguardoPage />}
            />
            <Route
              path="servicios/fletamento-maritimo"
              element={<FletamentoMaritimoPage />}
            />
            <Route
              path="servicios/transporte-mercancias"
              element={<TransporteMercanciasPage />}
            />
            <Route
              path="servicios/servicios-al-buque"
              element={<ServiciosBuquePage />}
            />
            <Route path="sectores" element={<SectorsPage />} />
            <Route path="noticias" element={<NewsPage />} />
            <Route path="noticias/:articleId" element={<NewsArticlePage />} />
            <Route path="herramientas" element={<ToolsPage />} />
            <Route path="directorio" element={<Directorio />} />
            <Route path="directorio/buque/:id" element={<VesselDetail />} />
            <Route path="terminos-y-condiciones" element={<TermsPage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="politica-de-privacidad" element={<PrivacyPage />} />
            <Route path="documentos-legales" element={<LegalDocsPage />} />
            <Route path="suscripcion-boletin" element={<NewsletterPage />} />
          </Route>

          {/* Auth & Portal Routes via separate layout */}
          <Route path="login" element={<LoginPage />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="registro-b2b" element={<B2BRegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="dashboard" replace />} />
             <Route path="cuenta" element={<AdminAccountSettings />} />
             <Route path="dashboard" element={
                <AdminRoleGuard>
                  <AdminDashboard />
                </AdminRoleGuard>
             } />
             <Route path="empleados" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL"]}>
                  <AdminEmployees />
                </AdminRoleGuard>
             } />
             <Route path="configuracion" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL"]}>
                  <AdminConfig />
                </AdminRoleGuard>
             } />
             <Route path="aprobaciones" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES", "AGENTE_DOCUMENTACION"]}>
                  <AdminAprobaciones />
                </AdminRoleGuard>
             } />
             <Route path="yard" element={
                <AdminRoleGuard allowedRoles={["PLANIFICADOR_PATIO", "GERENTE_OPERACIONES"]}>
                  <AdminYard />
                </AdminRoleGuard>
             } />
             <Route path="gate" element={
                <AdminRoleGuard allowedRoles={["INSPECTOR_PUERTA", "GERENTE_OPERACIONES", "PLANIFICADOR_PATIO", "COORDINADOR_TRAFICO"]}>
                  <AdminGate />
                </AdminRoleGuard>
             } />
             <Route path="buques" element={
                <AdminRoleGuard allowedRoles={["OFICIAL_BUQUES", "DESPACHADOR_BUQUES", "GERENTE_OPERACIONES"]}>
                  <AdminBuques />
                </AdminRoleGuard>
             } />
             <Route path="estibador" element={
                <AdminRoleGuard allowedRoles={["ESTIBADOR", "GERENTE_OPERACIONES"]}>
                  <AdminEstibador />
                </AdminRoleGuard>
             } />
             <Route path="cuadrillas" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES", "GERENTE_GENERAL"]}>
                  <AdminCuadrillas />
                </AdminRoleGuard>
             } />
             <Route path="monitoreo-tos" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES", "GERENTE_GENERAL", "PLANIFICADOR_PATIO", "OFICIAL_BUQUES"]}>
                  <AdminMonitoreoTOS />
                </AdminRoleGuard>
             } />
             <Route path="rendimiento" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES", "GERENTE_GENERAL", "ANALISTA_BI"]}>
                  <AdminRendimiento />
                </AdminRoleGuard>
             } />
             <Route path="contador" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL", "CONTADOR"]}>
                  <AdminContador />
                </AdminRoleGuard>
             } />
             <Route path="nomina" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL", "CONTADOR"]}>
                  <AdminNomina />
                </AdminRoleGuard>
             } />
             <Route path="trafico" element={
                <AdminRoleGuard allowedRoles={["COORDINADOR_TRAFICO", "GERENTE_OPERACIONES", "GERENTE_GENERAL"]}>
                  <AdminTrafico />
                </AdminRoleGuard>
             } />
             <Route path="da" element={
                <AdminRoleGuard allowedRoles={["FACTURADOR", "GERENTE_OPERACIONES", "GERENTE_GENERAL"]}>
                  <AdminDA />
                </AdminRoleGuard>
             } />
             <Route path="documentos" element={
                <AdminRoleGuard allowedRoles={["AGENTE_DOCUMENTACION", "GERENTE_OPERACIONES", "GERENTE_GENERAL", "OFICIAL_BUQUES"]}>
                  <AdminDocumentos />
                </AdminRoleGuard>
             } />
             <Route path="hse" element={
                <AdminRoleGuard allowedRoles={["SUPERVISOR_HSE", "GERENTE_OPERACIONES", "GERENTE_GENERAL"]}>
                  <AdminHSE />
                </AdminRoleGuard>
             } />
             <Route path="scraper-panel" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL"]}>
                  <AdminScraperPanel />
                </AdminRoleGuard>
             } />
             <Route path="catalogo-buques" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL", "OFICIAL_BUQUES", "AGENTE_DOCUMENTACION"]}>
                  <AdminCatalogoBuques />
                </AdminRoleGuard>
             } />
          </Route>

          <Route path="portal" element={<PortalLayout />}>
            {/* Index redirect to user's first role */}
            <Route index element={<PortalIndexRoute />} />

            {/* Naviera */}
            <Route
              path="naviera/dashboard"
              element={
                <RoleGuard allowedRoles={["naviera"]}>
                  <NavieraDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="naviera/port-calls"
              element={
                <RoleGuard allowedRoles={["naviera"]}>
                  <NavieraPortCalls />
                </RoleGuard>
              }
            />
            <Route
              path="naviera/proformas"
              element={
                <RoleGuard allowedRoles={["naviera"]}>
                  <NavieraProformas />
                </RoleGuard>
              }
            />

            {/* Importador */}
            <Route
              path="importador/dashboard"
              element={
                <RoleGuard allowedRoles={["importador"]}>
                  <ImportadorDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="importador/tracking"
              element={
                <RoleGuard allowedRoles={["importador"]}>
                  <ImportadorTracking />
                </RoleGuard>
              }
            />
            <Route
              path="importador/retiros"
              element={
                <RoleGuard allowedRoles={["importador"]}>
                  <ImportadorRetiros />
                </RoleGuard>
              }
            />

            {/* Exportador */}
            <Route
              path="exportador/dashboard"
              element={
                <RoleGuard allowedRoles={["exportador"]}>
                  <ExportadorDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="exportador/ingresos"
              element={
                <RoleGuard allowedRoles={["exportador"]}>
                  <ExportadorIngresos />
                </RoleGuard>
              }
            />
            <Route
              path="exportador/embarque"
              element={
                <RoleGuard allowedRoles={["exportador"]}>
                  <ExportadorEmbarque />
                </RoleGuard>
              }
            />

            {/* Agente de Aduana */}
            <Route
              path="aduana/dashboard"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AgenteAduanaDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="aduana/consultas"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AduanaConsultas />
                </RoleGuard>
              }
            />
            <Route
              path="aduana/despachos"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AduanaDespachos />
                </RoleGuard>
              }
            />

            {/* Transportista */}
            <Route
              path="transportista/dashboard"
              element={
                <RoleGuard allowedRoles={["transportista"]}>
                  <TransportistaDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="transportista/ordenes"
              element={
                <RoleGuard allowedRoles={["transportista"]}>
                  <TransportistaOrdenes />
                </RoleGuard>
              }
            />
            <Route
              path="transportista/eirs"
              element={
                <RoleGuard allowedRoles={["transportista"]}>
                  <TransportistaEirs />
                </RoleGuard>
              }
            />

            {/* Consolidador */}
            <Route
              path="consolidador/dashboard"
              element={
                <RoleGuard allowedRoles={["consolidador"]}>
                  <ConsolidadorDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="consolidador/master"
              element={
                <RoleGuard allowedRoles={["consolidador"]}>
                  <ConsolidadorMaster />
                </RoleGuard>
              }
            />
            <Route
              path="consolidador/house"
              element={
                <RoleGuard allowedRoles={["consolidador"]}>
                  <ConsolidadorHouse />
                </RoleGuard>
              }
            />

            {/* Armador */}
            <Route
              path="armador/dashboard"
              element={
                <RoleGuard allowedRoles={["armador"]}>
                  <ArmadorDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="armador/cuentas"
              element={
                <RoleGuard allowedRoles={["armador"]}>
                  <ArmadorCuentas />
                </RoleGuard>
              }
            />
            <Route
              path="armador/husbandry"
              element={
                <RoleGuard allowedRoles={["armador"]}>
                  <ArmadorHusbandry />
                </RoleGuard>
              }
            />

            {/* General (accessible by anyone logged in) */}
            <Route path="suscripcion" element={<SuscripcionPage />} />


          </Route>
        </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
