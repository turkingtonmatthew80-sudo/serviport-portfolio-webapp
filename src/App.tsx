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
import { NavieraPerfilOperativo } from "./pages/portal/roles/NavieraPerfilOperativo";
import { NavieraManifiestos } from "./pages/portal/roles/NavieraManifiestos";
import { NavieraWorkbenchEstiba } from "./pages/portal/roles/NavieraWorkbenchEstiba";
import { ImportadorDashboard } from "./pages/portal/roles/ImportadorDashboard";
import { ImportadorTracking } from "./pages/portal/roles/ImportadorTracking";
import { ImportadorFinanzas } from "./pages/portal/roles/ImportadorFinanzas";
import { ImportadorGarantias } from "./pages/portal/roles/ImportadorGarantias";
import { ExportadorDashboard } from "./pages/portal/roles/ExportadorDashboard";
import { ExportadorIngresos } from "./pages/portal/roles/ExportadorIngresos";
import { ExportadorEmbarque } from "./pages/portal/roles/ExportadorEmbarque";
import { ExportadorFacturacion } from "./pages/portal/roles/ExportadorFacturacion";
import { AgenteAduanaDashboard } from "./pages/portal/roles/AgenteAduanaDashboard";
import { AgenteAduanaExpediente } from "./pages/portal/roles/AgenteAduanaExpediente";
import { AgenteAduanaAforo } from "./pages/portal/roles/AgenteAduanaAforo";
import { AgenteAduanaReparos } from "./pages/portal/roles/AgenteAduanaReparos";
import { AgenteAduanaDespachos } from "./pages/portal/roles/AgenteAduanaDespachos";
import { TransportistaDashboard } from "./pages/portal/roles/TransportistaDashboard";
import { TransportistaMiFlota } from "./pages/portal/roles/TransportistaMiFlota";
import { TransportistaVbs } from "./pages/portal/roles/TransportistaVbs";
import { TransportistaEirs } from "./pages/portal/roles/TransportistaEirs";
import { ConsolidadorDashboard } from "./pages/portal/roles/ConsolidadorDashboard";
import { ConsolidadorDesconsolidacion } from "./pages/portal/roles/ConsolidadorDesconsolidacion";
import { ConsolidadorVaciado } from "./pages/portal/roles/ConsolidadorVaciado";
import { ConsolidadorLiberacion } from "./pages/portal/roles/ConsolidadorLiberacion";
import { ArmadorDashboard } from "./pages/portal/roles/ArmadorDashboard";
import { ArmadorCuentas } from "./pages/portal/roles/ArmadorCuentas";
import { ArmadorHusbandry } from "./pages/portal/roles/ArmadorHusbandry";
import { RoleGuard } from "./components/RoleGuard";

import { SuscripcionPage } from "./pages/portal/SuscripcionPage";
import { Directorio } from "./pages/Directorio";
import { VesselDetail } from "./pages/VesselDetail";

import { SuperadminDashboard } from "./pages/portal/roles/SuperadminDashboard";
import { SuperadminForensic } from "./pages/portal/roles/SuperadminForensic";
import { SuperadminSettings } from "./pages/portal/roles/SuperadminSettings";

import { GerenteDashboard } from "./pages/portal/roles/GerenteDashboard";
import { GerenteBerthPlanning } from "./pages/portal/roles/GerenteBerthPlanning";
import { GerenteExcepciones } from "./pages/portal/roles/GerenteExcepciones";
import { GerenteVbs } from "./pages/portal/roles/GerenteVbs";

import { WaterClerkDashboard } from "./pages/portal/roles/WaterClerkDashboard";
import { WaterClerkTally } from "./pages/portal/roles/WaterClerkTally";
import { WaterClerkGruas } from "./pages/portal/roles/WaterClerkGruas";

import { YardPlannerDashboard } from "./pages/portal/roles/YardPlannerDashboard";
import { YardPlannerOperadorGrua } from "./pages/portal/roles/YardPlannerOperadorGrua";

import { GateInspectorDashboard } from "./pages/portal/roles/GateInspectorDashboard";
import { ConciliacionBancariaDashboard } from "./pages/portal/roles/ConciliacionBancariaDashboard";
import { FDABuilderDashboard } from "./pages/portal/roles/FDABuilderDashboard";
import { ComplianceDeskDashboard } from "./pages/portal/roles/ComplianceDeskDashboard";
import { HusbandryBoardDashboard } from "./pages/portal/roles/HusbandryBoardDashboard";
import { HSEAlertsDashboard } from "./pages/portal/roles/HSEAlertsDashboard";

import { DigitalTwinDashboard } from "./pages/portal/roles/DigitalTwinDashboard";

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
             <Route path="forensic" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL"]}>
                   <SuperadminForensic />
                </AdminRoleGuard>
             } />
             <Route path="settings" element={
                <AdminRoleGuard allowedRoles={["GERENTE_GENERAL"]}>
                   <SuperadminSettings />
                </AdminRoleGuard>
             } />
             <Route path="digital-twin" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES", "GERENTE_GENERAL"]}>
                   <DigitalTwinDashboard />
                </AdminRoleGuard>
             } />
             <Route path="berth-planning" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES"]}>
                   <GerenteBerthPlanning />
                </AdminRoleGuard>
             } />
             <Route path="contingencias" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES"]}>
                   <GerenteExcepciones />
                </AdminRoleGuard>
             } />
             <Route path="vbs" element={
                <AdminRoleGuard allowedRoles={["GERENTE_OPERACIONES"]}>
                   <GerenteVbs />
                </AdminRoleGuard>
             } />
             <Route path="oficial-sof" element={
                <AdminRoleGuard allowedRoles={["OFICIAL_BUQUES"]}>
                   <WaterClerkDashboard />
                </AdminRoleGuard>
             } />
             <Route path="oficial-tarja" element={
                <AdminRoleGuard allowedRoles={["OFICIAL_BUQUES"]}>
                   <WaterClerkTally />
                </AdminRoleGuard>
             } />
             <Route path="oficial-gruas" element={
                <AdminRoleGuard allowedRoles={["OFICIAL_BUQUES"]}>
                   <WaterClerkGruas />
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
             <Route path="yard-planner" element={
                <AdminRoleGuard allowedRoles={["PLANIFICADOR_PATIO", "GERENTE_OPERACIONES"]}>
                  <YardPlannerDashboard />
                </AdminRoleGuard>
             } />
             <Route path="yard-vdi" element={
                <AdminRoleGuard allowedRoles={["PLANIFICADOR_PATIO"]}>
                  <YardPlannerOperadorGrua />
                </AdminRoleGuard>
             } />
             <Route path="gate" element={
                <AdminRoleGuard allowedRoles={["INSPECTOR_PUERTA", "GERENTE_OPERACIONES", "PLANIFICADOR_PATIO", "COORDINADOR_TRAFICO"]}>
                  <GateInspectorDashboard />
                </AdminRoleGuard>
             } />
             <Route path="buques" element={
                <AdminRoleGuard allowedRoles={["OFICIAL_BUQUES", "DESPACHADOR_BUQUES", "GERENTE_OPERACIONES"]}>
                  <HusbandryBoardDashboard />
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
                  <ConciliacionBancariaDashboard />
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
                  <FDABuilderDashboard />
                </AdminRoleGuard>
             } />
             <Route path="documentos" element={
                <AdminRoleGuard allowedRoles={["AGENTE_DOCUMENTACION", "GERENTE_OPERACIONES", "GERENTE_GENERAL", "OFICIAL_BUQUES"]}>
                  <ComplianceDeskDashboard />
                </AdminRoleGuard>
             } />
             <Route path="hse" element={
                <AdminRoleGuard allowedRoles={["SUPERVISOR_HSE", "GERENTE_OPERACIONES", "GERENTE_GENERAL"]}>
                  <HSEAlertsDashboard />
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
              path="naviera/perfil-operativo"
              element={
                <RoleGuard allowedRoles={["naviera"]}>
                  <NavieraPerfilOperativo />
                </RoleGuard>
              }
            />
            <Route
              path="naviera/manifiestos"
              element={
                <RoleGuard allowedRoles={["naviera"]}>
                  <NavieraManifiestos />
                </RoleGuard>
              }
            />
            <Route
              path="naviera/workbench-estiba"
              element={
                <RoleGuard allowedRoles={["naviera"]}>
                  <NavieraWorkbenchEstiba />
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
              path="importador/finanzas"
              element={
                <RoleGuard allowedRoles={["importador"]}>
                  <ImportadorFinanzas />
                </RoleGuard>
              }
            />
            <Route
              path="importador/garantias-vacios"
              element={
                <RoleGuard allowedRoles={["importador"]}>
                  <ImportadorGarantias />
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
            <Route
              path="exportador/facturacion"
              element={
                <RoleGuard allowedRoles={["exportador"]}>
                  <ExportadorFacturacion />
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
              path="aduana/expediente"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AgenteAduanaExpediente />
                </RoleGuard>
              }
            />
            <Route
              path="aduana/aforo"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AgenteAduanaAforo />
                </RoleGuard>
              }
            />
            <Route
              path="aduana/reparos"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AgenteAduanaReparos />
                </RoleGuard>
              }
            />
            <Route
              path="aduana/despachos"
              element={
                <RoleGuard allowedRoles={["agente_aduana"]}>
                  <AgenteAduanaDespachos />
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
              path="transportista/flota"
              element={
                <RoleGuard allowedRoles={["transportista"]}>
                  <TransportistaMiFlota />
                </RoleGuard>
              }
            />
            <Route
              path="transportista/vbs"
              element={
                <RoleGuard allowedRoles={["transportista"]}>
                  <TransportistaVbs />
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
              path="consolidador/desconsolidacion"
              element={
                <RoleGuard allowedRoles={["consolidador"]}>
                  <ConsolidadorDesconsolidacion />
                </RoleGuard>
              }
            />
            <Route
              path="consolidador/vaciado"
              element={
                <RoleGuard allowedRoles={["consolidador"]}>
                  <ConsolidadorVaciado />
                </RoleGuard>
              }
            />
            <Route
              path="consolidador/liberacion"
              element={
                <RoleGuard allowedRoles={["consolidador"]}>
                  <ConsolidadorLiberacion />
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
