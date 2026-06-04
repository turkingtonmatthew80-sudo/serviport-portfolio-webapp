import { ArrowRight, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export function LegalDocsPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <section className="bg-[#0b1a2e] pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Documentos Legales</h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium">
            Información fiscal y corporativa de Serviport Agentes Navieros, C.A.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
          <div className="prose prose-lg text-gray-600 max-w-none">
            
            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Información Financiera</h3>
            <p className="mb-4">
              <strong>Régimen de facturación fiscal venezolano:</strong> Serviport emite facturas con doble denominación en Bolívares (VES) y Dólares estadounidenses (USD) según la tasa oficial diaria del Banco Central de Venezuela (BCV).
            </p>
            <p className="mb-4">
              <strong>Tasa de cambio:</strong> Introducida manualmente en el sistema cada día por el administrador. Si no se carga, se usa automáticamente la del día anterior. Toda interfaz y factura muestra ambos valores.
            </p>
            <p className="mb-8">
              <strong>Moneda base de operación:</strong> Bolívar venezolano (VES). Referencia constante: USD.
            </p>

            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Documentos Fiscales Incluidos</h3>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li><strong>Factura Fiscal:</strong> Con RIF de Serviport, número de control, y datos fiscales completos.</li>
              <li><strong>Proforma Invoice:</strong> Para aprobación previa del cliente.</li>
              <li><strong>Disbursement Account:</strong> Liquidación de gastos del armador.</li>
              <li><strong>Comprobantes de servicios prestados.</strong></li>
            </ul>

            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Datos Registrales</h3>
            <p className="mb-8">
              <strong>Razón Social:</strong> Serviport Agentes Navieros, C.A.<br/>
              <strong>RIF:</strong> J-50161779-1<br/>
              <strong>Dirección Principal:</strong> Puerto de Puerto Cabello, Terminal Marítima, Estado Carabobo, Venezuela.<br/>
              <strong>Oficina Comercial:</strong> Multicentro Maiquetía, Piso 2, Oficina 20, Parroquia Maiquetía, La Guaira, Venezuela.
            </p>

          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
             <Link to="/" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-[#0b1a2e] transition-colors uppercase tracking-wider text-sm">
               <ArrowRight size={18} className="rotate-180" /> VOLVER AL INICIO
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
