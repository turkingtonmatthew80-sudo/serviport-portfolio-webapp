import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export function LegalDocsPage() {
  return (
    <div className="w-full bg-background-muted min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-background/10 rounded-full flex items-center justify-center mb-4 md:mb-6 md:mx-0 mx-auto">
            <Scale className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Documentos Legales
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Información fiscal y corporativa de Serviport Agentes Navieros, C.A.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="bg-background p-6 md:p-12 shadow-sm border border-border/50 rounded-sm">
            <div className="prose prose-lg text-foreground-muted max-w-none">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Información Financiera
              </h3>
              <p className="mb-4">
                <strong>Régimen de facturación fiscal venezolano:</strong>{" "}
                Serviport emite facturas con doble denominación en Bolívares
                (VES) y Dólares estadounidenses (USD) según la tasa oficial
                diaria del Banco Central de Venezuela (BCV).
              </p>
              <p className="mb-4">
                <strong>Tasa de cambio:</strong> Introducida manualmente en el
                sistema cada día por el administrador. Si no se carga, se usa
                automáticamente la del día anterior. Toda interfaz y factura
                muestra ambos valores.
              </p>
              <p className="mb-8">
                <strong>Moneda base de operación:</strong> Bolívar venezolano
                (VES). Referencia constante: USD.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Documentos Fiscales Incluidos
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-8">
                <li>
                  <strong>Factura Fiscal:</strong> Con RIF de Serviport, número
                  de control, y datos fiscales completos.
                </li>
                <li>
                  <strong>Proforma Invoice:</strong> Para aprobación previa del
                  cliente.
                </li>
                <li>
                  <strong>Disbursement Account:</strong> Liquidación de gastos
                  del armador.
                </li>
                <li>
                  <strong>Comprobantes de servicios prestados.</strong>
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Datos Registrales
              </h3>
              <p className="mb-8">
                <strong>Razón Social:</strong> Serviport Agentes Navieros, C.A.
                <br />
                <strong>RIF:</strong> J-50161779-1
                <br />
                <strong>Dirección Principal:</strong> Puerto de Puerto Cabello,
                Terminal Marítima, Estado Carabobo, Venezuela.
                <br />
                <strong>Oficina Comercial:</strong> Multicentro Maiquetía, Piso
                2, Oficina 20, Parroquia Maiquetía, La Guaira, Venezuela.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-foreground transition-colors uppercase tracking-wider text-sm"
              >
                <ArrowLeft size={18}  /> VOLVER AL INICIO
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
