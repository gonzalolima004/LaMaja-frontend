import { useState, useEffect } from "react";
import api from "../services/api";
import { Trash2, FileText } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { GenerarPDFPresupuesto } from "../services/GenerarPDFPresupuesto";

export default function HistorialPresupuestos() {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [nombresClientes, setNombresClientes] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const obtenerPresupuestos = async () => {
      try {
        const res = await api.get(`/presupuestos`);
        setPresupuestos(res.data);
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3EBD8] p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#345A35] px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center">
              <h2 className="text-xl sm:text-3xl font-semibold text-white text-center sm:text-left w-full">
                Historial de presupuestos
              </h2>
            </div>

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
                  {presupuestos.map((p, index) => (
                    <tr key={p.id_presupuesto}>
                      <td className="px-2 py-2 sm:px-4 sm:py-4">{index + 1}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        {nombresClientes[p.id_cliente] || "Cargando..."}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        ${p.importe_total}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        {new Date(p.fecha).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-4 flex justify-center">
                        <button
                          onClick={() => GenerarPDFPresupuesto(p)}
                          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md flex items-center text-xs sm:text-sm"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          PDF
                        </button>
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-4">
                        <button
                          onClick={() => eliminarPresupuesto(p.id_presupuesto)}
                          className="cursor-pointer text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-md inline-flex items-center text-xs sm:text-sm"
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

          </div>
        </div>
      </div>




    </>
  );
};
