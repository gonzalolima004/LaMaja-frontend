import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = (presupuesto: any) => {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const margin = 14;
  let currentY = margin;

  // === Encabezado ===
  doc.setFillColor(52, 90, 53);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 50, "F");

  const logo = "/logo-sin-letras.png";
  doc.addImage(logo, "PNG", margin, currentY, 28, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("La Maja", margin + 35, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(220, 240, 220);
  doc.text("Presupuesto de ganado porcino", margin + 35, currentY + 22);

  doc.setFontSize(9);
  doc.setTextColor(200, 220, 200);
  doc.text(`Fecha: ${new Date(presupuesto.fecha).toLocaleDateString("es-AR")}`, margin + 35, currentY + 30);

  // Línea decorativa
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 38, doc.internal.pageSize.getWidth() - margin, currentY + 38);

  currentY += 55;

  // === Datos del cliente ===
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(margin, currentY, doc.internal.pageSize.getWidth() - margin * 2, 45, 3, 3, "F");
  doc.setDrawColor(52, 90, 53);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, doc.internal.pageSize.getWidth() - margin * 2, 45, 3, 3, "S");

  currentY += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 90, 53);
  doc.text("Datos del Cliente", doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });

  currentY += 10;
  const cliente = presupuesto.cliente;
  const clienteData = [
    `Nombre: ${cliente.nombre} ${cliente.apellido}`,
    `DNI: ${cliente.dni}`,
    `Dirección: ${cliente.direccion}`,
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  clienteData.forEach((line) => {
    doc.text(line, margin + 10, currentY);
    currentY += 7;
  });

  currentY += 10;

  // === Tabla de detalles ===
  const tableColumn = ["Caravana", "Sexo", "Peso", "Fecha Nac.", "Precio"];
  const tableRows: any[] = [];

  presupuesto.detalles.forEach((d: any) => {
    const a = d.animal;
    tableRows.push([
      a.id_animal,
      a.sexo,
      `${a.peso} kg`,
      new Date(a.fecha_nacimiento).toLocaleDateString("es-AR"),
      `$${d.precio}`,
    ]);
  });

  autoTable(doc, {
    startY: currentY,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [52, 90, 53],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 11,
      halign: "center",
    },
    bodyStyles: {
      textColor: [60, 60, 60],
      fontSize: 10,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 245],
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 30, halign: "center" },
      4: { cellWidth: 35, halign: "right", fontStyle: "bold", textColor: [52, 90, 53] },
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Línea separadora
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Página ${currentPage} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
      doc.text("La Maja - Ganado de Calidad", margin, pageHeight - 10, { align: "left" });
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || currentY;

  // === Total ===
  doc.setFillColor(52, 90, 53);
  doc.roundedRect(doc.internal.pageSize.getWidth() - margin - 70, finalY + 12, 70, 15, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `TOTAL: $${presupuesto.importe_total.toLocaleString("es-AR")}`,
    doc.internal.pageSize.getWidth() - margin - 5,
    finalY + 22,
    { align: "right" }
  );

  doc.save(`presupuesto_${cliente.nombre}_${cliente.apellido}.pdf`);
};
