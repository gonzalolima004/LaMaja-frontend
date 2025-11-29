import { useState, useEffect } from "react";
import api from "../services/api";
import { Trash2, FileText, BookText, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { GenerarPDFPresupuesto } from "../services/GenerarPDFPresupuesto";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs";

dayjs.extend(utc);

export default function HistorialPresupuestos() {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [nombresClientes, setNombresClientes] = useState<{ [id: number]: string }>({});
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const presupuestosPorPagina = 5;


  const navigate = useNavigate();

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

  const goGenerarPresupuestos = () => {
    navigate("/generar-presupuestos");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="min-h-screen bg-[#F3EBD8] p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">

            {/* HEADER CON FILTRO */}
            <div className="bg-[#345A35] px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-6">

              <h2 className="text-xl sm:text-3xl font-semibold text-white w-full">
                Historial de presupuestos
              </h2>

              <div className="flex items-end gap-4">
                {fechaFiltro && (
                  <button
                    onClick={() => setFechaFiltro("")}
                    className="text-white font-semibold px-5 h-[42px] whitespace-nowrap underline hover:scale-[1.05] cursor-pointer">
                    Ver todos
                  </button>
                )}


                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-white mb-1 text-center">
                    Filtrar por fecha
                  </label>

                  <div className="relative h-[42px]">

                    <input
                      type="date"
                      value={fechaFiltro}
                      onChange={(e) => setFechaFiltro(e.target.value)}
                      className="bg-[#A1C084] text-[#345A35] font-semibold pl-5 pr-3 h-full rounded-lg border border-[#A1C084] shadow-md w-48 hover:bg-[#8fb571] hover:border-white hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                    />
                  </div>
                </div>



                <button
                  onClick={goGenerarPresupuestos}
                  className="cursor-pointer flex items-center gap-2 px-4 h-[42px] bg-[#A1C084] text-[#345A35] rounded-lg border border-[#A1C084] shadow-md font-semibold hover:bg-[#345A35] hover:text-white hover:border-white hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap transition-all duration-200">
                  <BookText className="w-5 h-5 text-white hover:text-white transition-all font-bold" />
                  Generar Presupuestos
                </button>

              </div>
            </div>

            {/* TABLA */}
            <div className="w-full overflow-x-auto">
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
                  className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white transition-all duration-200  rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>

              </div>


            </div>

          </div>
        </div>
      </div>
    </>
  );
}
