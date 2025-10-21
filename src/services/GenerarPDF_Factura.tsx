import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFFactura = (factura: any) => {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const margin = 14;
  let currentY = margin;

  
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
  doc.text("Factura de Venta", margin + 35, currentY + 22);

  doc.setFontSize(9);
  doc.setTextColor(200, 220, 200);
  doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString("es-AR")}`, margin + 35, currentY + 30);

  
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 38, doc.internal.pageSize.getWidth() - margin, currentY + 38);

  currentY += 55;


  doc.setFillColor(248, 250, 248);
  doc.roundedRect(margin, currentY, doc.internal.pageSize.getWidth() - margin * 2, 45, 3, 3, "F");
  doc.setDrawColor(52, 90, 53);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, doc.internal.pageSize.getWidth() - margin * 2, 45, 3, 3, "S");

  currentY += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 90, 53);
  doc.text("Datos de la Factura", doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });

  currentY += 10;

  const facturaData = [
    `N° de Factura: ${factura.id_factura_venta}`,
    `Tipo: ${factura.tipo}`,
    `Fecha: ${new Date(factura.fecha).toLocaleDateString("es-AR")}`,
    `Presupuesto Asociado: ${factura.id_presupuesto}`,
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  facturaData.forEach((line) => {
    doc.text(line, margin + 10, currentY);
    currentY += 7;
  });

  currentY += 10;


  if (factura.cobros && factura.cobros.length > 0) {
    const tableColumn = ["N° Cobro", "Fecha", "Importe"];
    const tableRows: any[] = [];

    factura.cobros.forEach((c: any) => {
      tableRows.push([
        c.id_cobro,
        new Date(c.fecha).toLocaleDateString("es-AR"),
        `$${c.importe}`,
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
        0: { halign: "center" },
        1: { halign: "center" },
        2: { halign: "right", fontStyle: "bold", textColor: [52, 90, 53] },
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const currentPage = data.pageNumber;
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();


        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(`Página ${currentPage} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
        doc.text("La Maja - Ganado de Calidad", margin, pageHeight - 10, { align: "left" });
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }


  doc.setFillColor(52, 90, 53);
  doc.roundedRect(doc.internal.pageSize.getWidth() - margin - 70, currentY + 10, 70, 15, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `TOTAL: $${factura.importe_total.toLocaleString("es-AR")}`,
    doc.internal.pageSize.getWidth() - margin - 5,
    currentY + 20,
    { align: "right" }
  );

  doc.save(`factura_${factura.id_factura_venta}.pdf`);
};
