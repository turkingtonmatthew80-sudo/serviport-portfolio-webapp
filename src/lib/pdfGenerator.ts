import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateDisbursementAccountPDF(daData: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(11, 26, 46); // secondary theme color
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SERVIPORT", 14, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Agencia Naviera y Operador Portuario", 14, 32);

  doc.text("DISBURSEMENT ACCOUNT (DA)", 120, 25);
  doc.text(`Doc Ref: DA-${new Date().getTime().toString().substring(7)}`, 120, 32);

  // Vessel Info
  doc.setTextColor(15, 23, 42); // foreground
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detalles de la Escala", 14, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Buque: ${daData.vesselName || "SERVIPORT EXPRESS"}`, 14, 65);
  doc.text(`Puerto: ${daData.port || "Puerto Cabello"}`, 14, 72);
  doc.text(`Naviera/Armador: ${daData.owner || "Evergreen Marine"}`, 120, 65);
  doc.text(`Fecha Llegada: ${daData.eta || new Date().toLocaleDateString()}`, 120, 72);

  // Table
  const tableData = [
    ["1", "Derechos de Muelle (Bolipuertos)", "Port Dues", "$1,250.00"],
    ["2", "Servicio de Practicaje", "Pilotage", "$850.00"],
    ["3", "Remolcadores (x2)", "Towage", "$1,400.00"],
    ["4", "Cuadrilla de Estiba (Por Movimiento)", "Stevedoring", "$2,100.00"],
    ["5", "Avituallamiento Suministrado", "Ship Chandler", "$450.00"],
    ["6", "Honorarios de Agenciamiento", "Agency Fee", "$1,500.00"],
  ];
  
  // Custom rows if passed
  const rows = daData.items ? daData.items.map((i: any, index: number) => [
    (index + 1).toString(), i.desc, i.category, `$${i.amount.toFixed(2)}`
  ]) : tableData;

  autoTable(doc, {
    startY: 85,
    head: [["#", "Descripción del Cargo", "Categoría", "Monto (USD)"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [0, 169, 206], textColor: 255, halign: "left" }, // Primary theme
    styles: { font: "helvetica", fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      3: { halign: "right", cellWidth: 40 }
    }
  });

  // Footer / Totals
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL GENERAL:", 140, finalY + 15);
  
  const sum = (daData.items || []).reduce((acc: number, val: any) => acc + val.amount, 0);
  const total = sum > 0 ? sum : 7550; // default mock

  doc.text(`$${total.toFixed(2)} USD`, 175, finalY + 15);

  // Signatures
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.line(14, finalY + 40, 74, finalY + 40);
  doc.text("FIRMA AGENCIA NAVIERA", 18, finalY + 48);

  doc.line(120, finalY + 40, 180, finalY + 40);
  doc.text("APROBACIÓN ARMADOR (PORTAL)", 124, finalY + 48);
  doc.save(`DA_${daData.vesselName || "Buque"}_${new Date().getTime()}.pdf`);
}

export async function generatePayrollPDF(crew: any) {
  const doc = new jsPDF();
  
  doc.setFillColor(15, 23, 42); // foreground theme
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SERVIPORT", 14, 20);
  
  doc.setFontSize(14);
  doc.text("NÓMINA DE ESTIBA", 120, 20);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Cuadrilla: ${crew.name}`, 14, 45);
  doc.text(`Capataz (Líder): ${crew.leader}`, 14, 52);
  doc.text(`Buque Asignado: ${crew.vesselName || "N/A"}`, 120, 45);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 120, 52);
  doc.text(`Turno Asignado: ${crew.shift || "Desconocido"}`, 14, 59);

  // Fetch BCV Rate dynamically if needed
  let bcvRate = 36.50; // default mock

  // Mock calculation logic as requested "computan horas de turno y Movimientos por Hook"
  const totalHombres = crew.size;
  let bonificacionPorCaja = 15; // 15$ por contenedor
  
  // Night shift bonus
  const isNightShift = crew.shift && crew.shift.toLowerCase().includes("noche");
  if (isNightShift) {
    bonificacionPorCaja += 5; // $20 por contenedor (bono nocturno)
  }

  const movSugeridos = Math.floor(Math.random() * 80) + 20; 
  const totalGenerado = movSugeridos * bonificacionPorCaja;
  const pagoPorHombre = totalGenerado / totalHombres;

  autoTable(doc, {
    startY: 70,
    head: [["Concepto", "Cantidad", "Unidad", "Total (USD)"]],
    body: [
      [`Movimientos 'Por Hook' ${isNightShift ? '(Bono Nocturno)' : ''}`, movSugeridos.toString(), "Contenedores", `$${totalGenerado.toFixed(2)}`],
      ["Honorario Capataz (Fijo)", "1", "Turno", "$120.00"],
      ["Subtotal Estibadores", (totalHombres - 1).toString(), "Hombres", `$${(totalGenerado).toFixed(2)}`],
    ],
    theme: "striped",
    headStyles: { fillColor: [0, 169, 206] },
    styles: { font: "helvetica", fontSize: 9 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;

  doc.setFont("helvetica", "bold");
  doc.text(`PAGO ESTIMADO POR ESTIBADOR: $${pagoPorHombre.toFixed(2)} USD`, 14, finalY + 15);
  doc.setTextColor(0, 150, 0);
  doc.text(`EQUIVALENTE BCV (Tasa: ${bcvRate.toFixed(4)} VES): Bs. ${(pagoPorHombre * bcvRate).toFixed(2)}`, 14, finalY + 22);
  
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text("Este documento es de uso interno Serviport OS para el desembolso.", 14, finalY + 35);

  doc.save(`Recibo_Nomina_${crew.name}_${new Date().getTime()}.pdf`);
}

export function generateSecondaryManifestPDF(data: any) {
  const doc = new jsPDF();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MANIFIESTO SECUNDARIO DE CARGA CONSOLIDADA", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`CONSOLIDADOR NVOCC: ${data.consoName}`, 14, 35);
  doc.text(`MASTER B/L: ${data.masterBL}`, 14, 42);
  doc.text(`CONTENEDOR: ${data.containerId}`, 14, 49);
  doc.text(`FECHA DE DESCONSOLIDACIÓN: ${new Date().toLocaleDateString()}`, 14, 56);

  autoTable(doc, {
    startY: 65,
    head: [['House B/L', 'Consignatario Final', 'Descripción', 'Bultos / Peso']],
    body: data.houses.map((h: any) => [
      h.hbl,
      h.consignee,
      h.description,
      `${h.packages} / ${h.weight} Tons`
    ]),
    theme: 'grid',
    styles: { fontSize: 8, font: "helvetica" },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
  });

  doc.setFontSize(8);
  doc.text("Generado por Serviport OS", 14, (doc as any).lastAutoTable.finalY + 20);
  
  doc.save(`Manifiesto_Secundario_${data.masterBL}.pdf`);
}
