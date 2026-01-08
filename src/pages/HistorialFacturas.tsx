import { useState, useEffect } from "react";
import api from "../services/api";
import { Trash2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import HeaderHistorial from "../components/HeaderHistorial";
import { generarPDFFactura } from "../services/GenerarPDF_Factura";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const HistorialFacturas = () => {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [filtroPresupuesto, setFiltroPresupuesto] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const facturasPorPagina = 5;


  useEffect(() => {
    const obtenerFacturas = async () => {
      try {
        const res = await api.get(`/facturas_venta`);

        const ordenados = res.data.sort(
          (a: any, b: any) => b.id_factura_venta - a.id_factura_venta
        );

        setFacturas(ordenados);

      } catch (error) {
        console.error("Error al obtener los Facturas:", error);
      }
    };
    obtenerFacturas();
  }, []);

  const eliminarFactura = (id_factura_venta: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Se eliminará esta factura permanentemente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/facturas_venta/${id_factura_venta}`);
          setFacturas((prev) =>
            prev.filter((f) => f.id_factura_venta !== id_factura_venta)
          );
          Swal.fire("Eliminada!", "La factura fue eliminada correctamente.", "success");
        } catch (error) {
          console.error("Error al eliminar la factura:", error);
          Swal.fire("Error", "No se pudo eliminar la factura.", "error");
        }
      }
    });
  };


  function toLocalDateString(fechaISO: string) {
    return dayjs.utc(fechaISO).format("YYYY-MM-DD");
  }

  const facturasFiltradas = facturas.filter((f) => {
    if (fechaFiltro) {
      const fechaLocal = toLocalDateString(f.fecha);
      if (fechaLocal !== fechaFiltro) return false;
    }

    if (filtroPresupuesto) {
      const nroPresupuesto = f.presupuesto?.id_presupuesto;
      if (!nroPresupuesto) return false;
      if (nroPresupuesto.toString() !== filtroPresupuesto) return false;
    }

    return true;
  });

  const indexUltimo = paginaActual * facturasPorPagina;
  const indexPrimero = indexUltimo - facturasPorPagina;

  const facturasPaginadas = facturasFiltradas.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3EBD8] p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">

          <div className="rounded-lg shadow-lg overflow-hidden">

          <HeaderHistorial
  fechaFiltro={fechaFiltro}
  setFechaFiltro={setFechaFiltro}
  filtroPresupuesto={filtroPresupuesto}
  setFiltroPresupuesto={setFiltroPresupuesto}
/>


            
            {/* TABLA */}
            <div className="w-full overflow-x-auto ">
              <table className="hidden md:table min-w-full text-white text-sm sm:text-base table-fixed">

                <thead className="bg-[#A1C084]">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-16">N°</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-25">Tipo</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-48">Presupuesto</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-32">Importe total</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-32">Total facturado</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-36">Restante por facturar</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-36">Importe de esta factura</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-28">Fecha</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-20">PDF</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-28">Acciones</th>
                  </tr>
                </thead>

                <tbody className="bg-[#A1C084] divide-y divide-gray-200 font-bold">
                  {facturasPaginadas.map((f) => {

                    const totalPresupuesto = f.presupuesto?.importe_total || 0;

                    const totalFacturado =
                      f.presupuesto?.facturas?.reduce(
                        (acc: number, fac: any) => acc + fac.importe_total,
                        0
                      ) || 0;

                    const restante = totalPresupuesto - totalFacturado;

                    return (
                      <tr key={f.id_factura_venta}>
                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">{f.id_factura_venta}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">{f.tipo}</td>

                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">
                          N°{f.presupuesto.id_presupuesto} - {f.presupuesto.cliente?.nombre} {f.presupuesto.cliente?.apellido}
                        </td>

                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center text-black font-bold">
                          ${totalPresupuesto.toLocaleString("es-AR")}
                        </td>

                        {/* TOTAL FACTURADO */}
                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center text-green-700 font-bold">
                          ${totalFacturado.toLocaleString("es-AR")}
                        </td>

                        {/* RESTANTE POR FACTURAR */}
                        <td
                          className={`px-2 py-2 sm:px-4 sm:py-4 text-center font-bold ${restante <= 0 ? "text-green-700" : "text-red-700"
                            }`}
                        >
                          ${restante.toLocaleString("es-AR")}
                        </td>

                        {/* IMPORTE DE ESTA FACTURA */}
                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">
                          ${f.importe_total.toLocaleString("es-AR")}
                        </td>

                        <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">
                          {dayjs.utc(f.fecha).format("DD/MM/YYYY")}
                        </td>

                        <td className="px-2 py-2 sm:px-4 sm:py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => generarPDFFactura(f)}
                              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md flex items-center text-xs sm:text-sm"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              PDF
                            </button>
                          </div>
                        </td>

                        <td className="px-2 py-2 sm:px-4 sm:py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => eliminarFactura(f.id_factura_venta)}
                              className="cursor-pointer text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-md inline-flex items-center text-xs sm:text-sm"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-center items-center gap-3 py-4 bg-[#F3EBD8]">

                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white transition-all duration-200 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="font-semibold text-[#345A35]">
                  {paginaActual} / {totalPaginas || 1}
                </span>

                <button
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white transition-all duration-200 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

              {/* TARJETAS PARA VISTA DE CELULAR*/}
              <div className="md:hidden flex flex-col gap-3 p-3 bg-[#345A35]">
                {facturasPaginadas.map((f) => {
                  const totalPresupuesto = f.presupuesto?.importe_total || 0;
                  const totalFacturado =
                    f.presupuesto?.facturas?.reduce(
                      (acc: number, fac: any) => acc + fac.importe_total,
                      0
                    ) || 0;

                  const restante = totalPresupuesto - totalFacturado;

                  return (
                    <div key={f.id_factura_venta} className="bg-[#A1C084] rounded-lg shadow-md p-4 border-[#345A35]">

                      {/* ENCABEZADO */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs text-white font-medium">Factura</span>
                          <p className="text-lg font-bold text-white">N°{f.id_factura_venta}</p>
                        </div>
                        <span className="bg-[#A1C084] text-white text-xs font-semibold px-2 py-1 rounded">
                          {dayjs.utc(f.fecha).format("DD/MM/YYYY")}
                        </span>
                      </div>

                      {/* PRESUPUESTO */}
                      <div className="mb-3">
                        <span className="text-xs text-white font-medium">Presupuesto</span>
                        <p className="font-semibold text-white">
                          N°{f.presupuesto?.id_presupuesto} - {f.presupuesto?.cliente?.nombre} {f.presupuesto?.cliente?.apellido}
                        </p>
                      </div>

                      {/* IMPORTE TOTAL DEL PRESUPUESTO */}
                      <div className="mb-2">
                        <span className="text-xs text-white font-medium">Total del presupuesto</span>
                        <p className="text-xl font-bold text-white">${totalPresupuesto.toLocaleString("es-AR")}</p>
                      </div>

                      {/* TOTAL FACTURADO */}
                      <div className="mb-2">
                        <span className="text-xs text-white font-medium">Total facturado</span>
                        <p className="text-lg font-bold text-green-700">${totalFacturado.toLocaleString("es-AR")}</p>
                      </div>

                      {/* RESTANTE */}
                      <div className="mb-4">
                        <span className="text-xs text-white font-medium">Restante por facturar</span>
                        <p
                          className={`text-lg font-bold ${restante <= 0 ? "text-green-700" : "text-red-700"}`}
                        >
                          ${restante.toLocaleString("es-AR")}
                        </p>
                      </div>

                      {/* IMPORTE DE ESTA FACTURA */}
                      <div className="mb-4">
                        <span className="text-xs text-white font-medium">Importe de esta factura</span>
                        <p className="text-xl font-bold text-white">${f.importe_total.toLocaleString("es-AR")}</p>
                      </div>

                      {/* BOTONES */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => generarPDFFactura(f)}
                          className="flex-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-md flex items-center justify-center text-sm font-medium"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Descargar PDF
                        </button>

                        <button
                          onClick={() => eliminarFactura(f.id_factura_venta)}
                          className="cursor-pointer text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2.5 rounded-md flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>


            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default HistorialFacturas;