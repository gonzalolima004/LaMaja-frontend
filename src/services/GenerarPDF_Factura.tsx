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

  // === ENCABEZADO ===
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
  doc.text(
    `Fecha: ${new Date(factura.fecha).toLocaleDateString("es-AR")}`,
    margin + 35,
    currentY + 30
  );

  doc.setDrawColor(255, 255, 255);
  doc.line(
    margin,
    currentY + 38,
    doc.internal.pageSize.getWidth() - margin,
    currentY + 38
  );

  currentY += 55;

  // === DATOS DE LA FACTURA ===
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(
    margin,
    currentY,
    doc.internal.pageSize.getWidth() - margin * 2,
    40,
    3,
    3,
    "F"
  );
  doc.setDrawColor(52, 90, 53);
  doc.roundedRect(
    margin,
    currentY,
    doc.internal.pageSize.getWidth() - margin * 2,
    40,
    3,
    3,
    "S"
  );

  currentY += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(52, 90, 53);
  doc.text("Datos de la Factura", doc.internal.pageSize.getWidth() / 2, currentY, {
    align: "center",
  });

  currentY += 10;

  const facturaData = [
    `N° de Factura: ${factura.id_factura_venta}`,
    `Tipo: ${factura.tipo}`,
    `Fecha: ${new Date(factura.fecha).toLocaleDateString("es-AR")}`,
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  facturaData.forEach((line) => {
    doc.text(line, margin + 10, currentY);
    currentY += 7;
  });

  currentY += 10;

  // === DATOS DEL CLIENTE ===
  if (factura.presupuesto?.cliente) {
    const c = factura.presupuesto.cliente;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(52, 90, 53);
    doc.text("Datos del Cliente", doc.internal.pageSize.getWidth() / 2, currentY, {
      align: "center",
    });

    currentY += 10;

    const tableColumnCliente = ["Nombre", "Apellido", "DNI", "Dirección"];
    const tableRowsCliente = [
      [
        c.nombre,
        c.apellido,
        c.dni,
        c.direccion
      ],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [tableColumnCliente],
      body: tableRowsCliente,
      theme: "striped",
      headStyles: {
        fillColor: [52, 90, 53],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 11,
      },
      bodyStyles: {
        textColor: [60, 60, 60],
        fontSize: 10,
      },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // === DATOS DEL PRESUPUESTO ===
  if (factura.presupuesto) {
    const presupuesto = factura.presupuesto;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(52, 90, 53);
    doc.text("Datos del Presupuesto", doc.internal.pageSize.getWidth() / 2, currentY, {
      align: "center",
    });

    currentY += 10;

    const tableColumn = ["N° de Presupuesto", "Importe Total", "Fecha"];
    const tableRows = [
      [
        presupuesto.id_presupuesto,
        `$${presupuesto.importe_total.toLocaleString("es-AR")}`,
        new Date(presupuesto.fecha).toLocaleDateString("es-AR"),
      ],
    ];

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
      },
      bodyStyles: {
        textColor: [60, 60, 60],
        fontSize: 10,
      },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // === TOTAL ===
  doc.setFillColor(52, 90, 53);
  doc.roundedRect(
    doc.internal.pageSize.getWidth() - margin - 70,
    currentY + 10,
    70,
    15,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Total facturado: $${factura.importe_total.toLocaleString("es-AR")}`,
    doc.internal.pageSize.getWidth() - margin - 5,
    currentY + 20,
    { align: "right" }
  );

  doc.save(`factura_${factura.id_factura_venta}.pdf`);
};
