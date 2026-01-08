import { useState, useEffect } from "react";
import api from "../services/api";
import { Trash2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import HeaderHistorial from "../components/HeaderHistorial";
import { GenerarPDFPresupuesto } from "../services/GenerarPDFPresupuesto";
import dayjs from "dayjs";
import utc from "dayjs";

dayjs.extend(utc);

export default function HistorialPresupuestos() {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [nombresClientes, setNombresClientes] = useState<{ [id: number]: string }>({});
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const presupuestosPorPagina = 5;

  useEffect(() => {
    const obtenerPresupuestos = async () => {
      try {
        const res = await api.get(`/presupuestos`);

        // ORDENAR LOS ÚLTIMOS PRIMERO
        const ordenados = res.data.sort(
          (a: any, b: any) => b.id_presupuesto - a.id_presupuesto
        );

        setPresupuestos(ordenados);

      } catch (error) {
        console.error("Error al obtener los presupuestos:", error);
      }
    };
    obtenerPresupuestos();
  }, []);


  useEffect(() => {
    const fetchNombresClientes = async () => {
      for (const p of presupuestos) {
        const id = p.id_cliente;
        if (!nombresClientes[id]) {
          try {
            const res = await api.get(`/clientes/${id}`);
            const nombreCompleto = `${res.data.cliente.nombre} ${res.data.cliente.apellido}`;
            setNombresClientes((prev) => ({ ...prev, [id]: nombreCompleto }));
          } catch (error) {
            console.error("Error al obtener el nombre del cliente:", error);
            setNombresClientes((prev) => ({ ...prev, [id]: "Desconocido" }));
          }
        }
      }
    };
    if (presupuestos.length > 0) {
      fetchNombresClientes();
    }
  }, [presupuestos]);

  const eliminarPresupuesto = (id_presupuesto: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Cuidado! Se eliminará todo lo relacionado a este presupuesto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/presupuestos/${id_presupuesto}`);
          setPresupuestos((prev) =>
            prev.filter((p) => p.id_presupuesto !== id_presupuesto)
          );
          Swal.fire("Eliminado!", "El presupuesto fue eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar el presupuesto:", error);
          Swal.fire("Error", "No se pudo eliminar el presupuesto.", "error");
        }
      }
    });
  };

  function toLocalDateString(fechaISO: string) {
    return dayjs.utc(fechaISO).format("YYYY-MM-DD");
  }

  const presupuestosFiltrados = presupuestos.filter((p) => {
    if (!fechaFiltro) return true;

    const fechaLocal = toLocalDateString(p.fecha);

    return fechaLocal === fechaFiltro;
  });

  const indexUltimo = paginaActual * presupuestosPorPagina;
  const indexPrimero = indexUltimo - presupuestosPorPagina;

  const presupuestosPaginados = presupuestosFiltrados.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(presupuestosFiltrados.length / presupuestosPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [fechaFiltro]);




  return (
    <>
      <Header />
      <div className="min-h-screen  bg-[#F3EBD8] p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">

          <div className="rounded-lg shadow-lg overflow-hidden">

            <HeaderHistorial
  fechaFiltro={fechaFiltro}
  setFechaFiltro={setFechaFiltro}
/>


            {/* TABLA */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="min-w-full lg:w-full text-center text-white text-sm sm:text-base table-auto">
                <thead className="bg-[#A1C084]">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">N°</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">Cliente</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">Importe Total</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">Fecha</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">PDF</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">Acciones</th>
                  </tr>
                </thead>

                <tbody className="bg-[#A1C084] divide-y divide-gray-200 font-bold">
                  {presupuestosPaginados.map((p) => (
                    <tr key={p.id_presupuesto}>
                      <td className="px-2 py-2 sm:px-4 sm:py-4">{p.id_presupuesto}</td>

                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        {nombresClientes[p.id_cliente] || "Cargando..."}
                      </td>

                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        ${p.importe_total}
                      </td>

                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        {dayjs.utc(p.fecha).format("DD/MM/YYYY")}
                      </td>

                      <td className="px-2 py-2 sm:px-4 sm:py-4 flex justify-center">
                        <button
                          onClick={() => GenerarPDFPresupuesto(p)}
                          className="
                            cursor-pointer bg-blue-500 hover:bg-blue-600
                            text-white px-2 py-1 rounded-md flex items-center
                            text-xs sm:text-sm
                          "
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          PDF
                        </button>
                      </td>

                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        <button
                          onClick={() => eliminarPresupuesto(p.id_presupuesto)}
                          className="
                            cursor-pointer text-red-700 bg-red-100 hover:bg-red-200
                            px-2 py-1 rounded-md inline-flex items-center
                            text-xs sm:text-sm
                          "
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* PAGINACIÓN */}
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
              {presupuestosPaginados.map((p) => (
                <div key={p.id_presupuesto} className="bg-[#A1C084] rounded-lg shadow-md p-4 border-[#345A35]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs text-white font-medium">Presupuesto</span>
                      <p className="text-lg font-bold text-white">N°{p.id_presupuesto}</p>
                    </div>
                    <span className="bg-[#A1C084] text-white text-xs font-semibold px-2 py-1 rounded">
                      {dayjs.utc(p.fecha).format("DD/MM/YYYY")}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs text-white font-medium">Cliente</span>
                    <p className="font-semibold text-white">{nombresClientes[p.id_cliente] || "Cargando..."}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs text-white font-medium">Importe Total</span>
                    <p className="text-xl font-bold text-white">${p.importe_total}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => GenerarPDFPresupuesto(p)}
                      className="flex-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-md flex items-center justify-center text-sm font-medium"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </button>
                    <button
                      onClick={() => eliminarPresupuesto(p.id_presupuesto)}
                      className="cursor-pointer text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2.5 rounded-md flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
