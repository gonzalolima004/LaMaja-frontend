import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FileText, Calendar, DollarSign, FilePlus2 } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom"
import Header from "../components/Header";
import dayjs from "dayjs";

export default function GenerarFacturas() {
  const navigate = useNavigate()
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [factura, setFactura] = useState({
    tipo: "",
    fecha: dayjs().format("YYYY-MM-DD"),
    importe_total: "",
    id_presupuesto: "",
  });

  useEffect(() => {
    api.get("/presupuestos")
      .then((res) => setPresupuestos(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los presupuestos", "error"));
  }, []);

  const showAlert = (title: string, text: string, icon: "success" | "error" | "warning" | "info") => {
    Swal.fire({ title, text, icon, confirmButtonColor: "#345A35" });
  };

  const handleSubmit = async () => {
    if (!factura.tipo || !factura.fecha || !factura.importe_total || !factura.id_presupuesto) {
      return showAlert("Atención", "Complete todos los campos de la factura", "warning");
    }

    try {
      const body = {
        tipo: factura.tipo,
        fecha: factura.fecha,
        importe_total: parseInt(factura.importe_total),
        id_presupuesto: parseInt(factura.id_presupuesto),
      };

      await api.post("/facturas_venta", body);
      showAlert("Éxito", "Factura generada correctamente", "success");
      
        setTimeout(() => {
        navigate("/facturas") 
      }, 1500)
      // Reiniciar campos
      setFactura({
        tipo: "",
        fecha: dayjs().format("YYYY-MM-DD"),
        importe_total: "",
        id_presupuesto: "",
      });
    } catch (error) {
      console.error(error);
      showAlert("Error", "No se pudo generar la factura", "error");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3EBD8] p-6 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#345A35] to-[#2a4a2b] bg-clip-text text-transparent mb-8 flex items-center gap-3">
          <FileText size={36} className="text-[#345A35]" />
          Generar Facturas
        </h1>

        {/* Formulario principal */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Tipo */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Tipo de Factura</label>
            <select
              value={factura.tipo}
              onChange={(e) => setFactura({ ...factura, tipo: e.target.value })}
              className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Factura A">Factura A</option>
              <option value="Factura B">Factura B</option>
              <option value="Factura C">Factura C</option>
            </select>
          </div>

          {/* Fecha */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700 text-sm flex items-center gap-2">
              <Calendar size={18} className="text-[#A1C084]" /> Fecha de Emisión
            </label>
            <input
              type="date"
              value={factura.fecha}
              onChange={(e) => setFactura({ ...factura, fecha: e.target.value })}
              className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
            />
          </div>

          {/* Importe */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700 text-sm flex items-center gap-2">
              <DollarSign size={18} className="text-[#A1C084]" /> Importe Total
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                value={factura.importe_total}
                onChange={(e) => setFactura({ ...factura, importe_total: e.target.value })}
                placeholder="Ej: 150000"
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl pl-8 pr-4 py-3 w-full font-semibold text-lg"
              />
            </div>
          </div>

          {/* Presupuesto Asociado */}
          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Presupuesto Asociado</label>
            <select
              value={factura.id_presupuesto}
              onChange={(e) => setFactura({ ...factura, id_presupuesto: e.target.value })}
              className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
            >
              <option value="">Seleccionar presupuesto</option>
              {presupuestos.map((p) => (
                <option key={p.id_presupuesto} value={p.id_presupuesto}>
                  #{p.id_presupuesto} - Cliente: {p.cliente?.nombre} {p.cliente?.apellido} (${p.importe_total.toLocaleString("es-AR")})
                </option>
              ))}
            </select>
          </div>

          {/* Botón */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#345A35] to-[#274427] text-white font-bold py-4 rounded-xl hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <FilePlus2 size={20} />
            Guardar Factura
          </button>
        </div>
      </div>
    </>
  );
}
