import { useState, useEffect } from "react";
import { Users, FileText, Download, TrendingUp, Calendar, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { db } from "../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { generatePayrollPDF } from "../lib/pdfGenerator";
import { motion } from "motion/react";

interface EmployeePayroll {
  id: string;
  name: string;
  role: string;
  baseSalary: number; // USD
  cestaTicket: number; // USD eq
  bonoProductividad: number; // USD
  deducciones: {
    ivss: number;
    faov: number;
    paroForzoso: number;
  }; // %
  horasExtra: number;
  netoUSD: number;
  netoVES: number;
}

export function AdminNomina() {
  const { adminUser } = useAdminAuth();
  const [employees, setEmployees] = useState<EmployeePayroll[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(36.45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [month] = useState("Junio 2026");

  useEffect(() => {
    // Simulated load from real employees and TOS productivity
    const mockData: EmployeePayroll[] = [
      { id: "EMP-01", name: "Carlos Mendoza", role: "Inspector de Puerta", baseSalary: 120, cestaTicket: 40, bonoProductividad: 15, deducciones: { ivss: 4, faov: 1, paroForzoso: 0.5 }, horasExtra: 0, netoUSD: 0, netoVES: 0 },
      { id: "EMP-02", name: "Luis Perez", role: "Estibador", baseSalary: 100, cestaTicket: 40, bonoProductividad: 45, deducciones: { ivss: 4, faov: 1, paroForzoso: 0.5 }, horasExtra: 10, netoUSD: 0, netoVES: 0 },
      { id: "EMP-03", name: "Ana Gomez", role: "Oficial de Buques", baseSalary: 150, cestaTicket: 40, bonoProductividad: 20, deducciones: { ivss: 4, faov: 1, paroForzoso: 0.5 }, horasExtra: 5, netoUSD: 0, netoVES: 0 },
      { id: "EMP-04", name: "Mario Ruiz", role: "Planificador de Patio", baseSalary: 160, cestaTicket: 40, bonoProductividad: 25, deducciones: { ivss: 4, faov: 1, paroForzoso: 0.5 }, horasExtra: 0, netoUSD: 0, netoVES: 0 },
    ];

    // Calculate Nets
    const calculated = mockData.map(emp => {
      // Very basic Venezuelan payroll simulation
      const basePlusBonus = emp.baseSalary + emp.bonoProductividad + (emp.horasExtra * 2);
      const totalDeduccionesPct = emp.deducciones.ivss + emp.deducciones.faov + emp.deducciones.paroForzoso;
      const deduccionMonto = basePlusBonus * (totalDeduccionesPct / 100);
      const netoUSD = basePlusBonus + emp.cestaTicket - deduccionMonto;
      
      return {
        ...emp,
        netoUSD: parseFloat(netoUSD.toFixed(2)),
        netoVES: parseFloat((netoUSD * exchangeRate).toFixed(2))
      };
    });

    setEmployees(calculated);
  }, [exchangeRate]);

  const handleGenerateConsolidated = () => {
    setIsProcessing(true);
    setTimeout(() => {
       setIsProcessing(false);
       alert("Pre-nómina enviada al Banco con éxito.");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
         <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
               <Users className="text-primary" size={32} />
               Nómina y Recursos Humanos
            </h2>
            <p className="text-foreground-muted font-mono mt-1">
               Tropicalización Contable Venezolana • Período: {month}
            </p>
         </div>
         <div className="text-right bg-white p-3 border border-slate-200 rounded shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase mb-1">Tasa BCV Aplicada</p>
            <p className="text-xl font-black text-secondary font-mono">{exchangeRate.toFixed(2)} Bs/USD</p>
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm p-6">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
               <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase">Cierre de Período</h3>
               <p className="text-xs text-foreground-muted font-mono mt-1">Se integran automáticamente horas extra y productividad TOS</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <button onClick={handleGenerateConsolidated} disabled={isProcessing} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded text-xs uppercase tracking-widest transition-colors shadow-sm">
                  {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                  CIERRE CONSOLIDADO
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b-2 border-slate-200">
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase">Colaborador</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase text-right">Sueldo Base ($)</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase text-right">Bonos/Productividad ($)</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase text-right">Cesta Ticket ($ eq)</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase text-right">Deducciones de Ley (%)</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-800 uppercase text-right font-bold bg-slate-50">NETO (USD)</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-800 uppercase text-right font-bold bg-slate-50">NETO (VES)</th>
                     <th className="py-3 px-2 font-mono tracking-widest text-[10px] text-slate-400 uppercase text-center">Recibo PDF</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => (
                     <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-2">
                           <p className="font-bold text-secondary text-sm">{emp.name}</p>
                           <p className="text-[10px] text-slate-500 font-mono mt-0.5">{emp.role}</p>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-sm text-slate-600">{emp.baseSalary.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-sm text-emerald-600 font-bold">+{emp.bonoProductividad.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-sm text-slate-600">{emp.cestaTicket.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right">
                           <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded">
                              -{(emp.deducciones.ivss + emp.deducciones.faov + emp.deducciones.paroForzoso).toFixed(1)}%
                           </span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-[15px] font-black text-secondary bg-slate-50/50">${emp.netoUSD.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-[15px] font-bold text-slate-600 bg-slate-50/50">Bs. {emp.netoVES.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center">
                           <button 
                              onClick={() => generatePayrollPDF(emp)}
                              className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Descargar Recibo de Pago"
                           >
                              <Download size={18} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
