import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FileText, Calendar, DollarSign, FilePlus2, BanknoteArrowUp } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import dayjs from "dayjs";

export default function GenerarFacturas() {
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<any | null>(null);
  const [totalFacturado, setTotalFacturado] = useState<number>(0);
  const [restante, setRestante] = useState<number>(0);
  const [factura, setFactura] = useState({
    tipo: "",
    fecha: dayjs().format("YYYY-MM-DD"),
    importe_total: "",
    id_presupuesto: "",
  });

  // Obtener presupuestos
  useEffect(() => {
    api
      .get("/presupuestos")
      .then((res) => setPresupuestos(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los presupuestos", "error"));
  }, []);

  const showAlert = (title: string, text: string, icon: "success" | "error" | "warning" | "info") => {
    Swal.fire({ title, text, icon, confirmButtonColor: "#345A35" });
  };

  // Cambiar presupuesto seleccionado y calcular totales
  const handlePresupuestoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFactura({ ...factura, id_presupuesto: id });

    if (!id) {
      setPresupuestoSeleccionado(null);
      setTotalFacturado(0);
      setRestante(0);
      return;
    }

    try {
      // Obtener presupuesto con facturas incluidas
      const res = await api.get(`/presupuestos/${id}`);
      const p = res.data;
      setPresupuestoSeleccionado(p);

      // Calcular total facturado
      const total = p.facturas?.reduce((acc: number, f: any) => acc + f.importe_total, 0) || 0;
      setTotalFacturado(total);

      // Calcular restante
      const disponible = (p.importe_total || 0) - total;
      setRestante(disponible);
    } catch (error) {
      console.error(error);
      setPresupuestoSeleccionado(null);
      setTotalFacturado(0);
      setRestante(0);
      Swal.fire("Error", "No se pudo obtener el presupuesto seleccionado", "error");
    }
  };

  const handleSubmit = async () => {
    if (!factura.tipo || !factura.fecha || !factura.importe_total || !factura.id_presupuesto) {
      return showAlert("Atención", "Complete todos los campos de la factura", "warning");
    }

    // Verificar que no supere el monto restante
    if (parseInt(factura.importe_total) > restante) {
      return showAlert("Error", "El importe supera el restante disponible del presupuesto.", "error");
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

      setTimeout(() => navigate("/facturas"), 1500);

      // Reiniciar campos
      setFactura({
        tipo: "",
        fecha: dayjs().format("YYYY-MM-DD"),
        importe_total: "",
        id_presupuesto: "",
      });
      setPresupuestoSeleccionado(null);
      setTotalFacturado(0);
      setRestante(0);
    } catch (error) {
      console.error(error);
      showAlert("Error", "No se pudo generar la factura", "error");
    }
  };

  // 🧮 Cálculo visual de datos
  const renderResumen = () => {
    if (!presupuestoSeleccionado) return null;

    return (
      <div className="mt-4 bg-[#F3EBD8]/70 border border-[#A1C084]/40 rounded-xl p-4 text-gray-800 font-medium space-y-1">
        <p>
          <strong>Importe Total Original:</strong>{" "}
          ${presupuestoSeleccionado?.importe_total?.toLocaleString("es-AR") || 0}
        </p>
        <p>
          <strong>Total Facturado:</strong>{" "}
          ${totalFacturado?.toLocaleString("es-AR") || 0}
        </p>
        <p>
          <strong>Restante por Facturar:</strong>{" "}
          ${restante?.toLocaleString("es-AR") || 0}
        </p>
      </div>
    );
  };

  return (
  <>
    <Header />
    <div className="min-h-screen w-full bg-[#F3EBD8] flex flex-col justify-start items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#A1C084]/40 p-8 sm:p-10">
        {/* Título */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#345A35] to-[#2a4a2b] bg-clip-text text-transparent mb-10 flex items-center gap-3 justify-center">
          <FileText size={36} className="text-[#345A35]" />
          Generar Facturas
        </h1>

        {/* Tipo */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700 text-sm flex items-center gap-2">
            <BanknoteArrowUp size={18} className="text-[#A1C084]" /> Tipo de factura
          </label>
          <select
            value={factura.tipo}
            onChange={(e) => setFactura({ ...factura, tipo: e.target.value })}
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none transition-all duration-200"
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
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none transition-all duration-200"
          />
        </div>

        {/* Presupuesto Asociado */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Presupuesto Asociado</label>
          <select
            value={factura.id_presupuesto}
            onChange={handlePresupuestoChange}
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none transition-all duration-200"
          >
            <option value="">Seleccionar presupuesto</option>
            {presupuestos.map((p) => (
              <option key={p.id_presupuesto} value={p.id_presupuesto}>
                #{p.id_presupuesto} – {p.cliente?.nombre} {p.cliente?.apellido} (${p.importe_total.toLocaleString("es-AR")})
              </option>
            ))}
          </select>

          {/* Resumen de Presupuesto */}
          {presupuestoSeleccionado && (
            <div className="mt-5 bg-[#F3EBD8]/70 border border-[#A1C084]/50 rounded-2xl p-5 text-gray-800 font-medium shadow-inner">
              <p>
                <strong>Importe Total Original:</strong>{" "}
                ${presupuestoSeleccionado?.importe_total?.toLocaleString("es-AR") || 0}
              </p>
              <p>
                <strong>Total Facturado:</strong>{" "}
                ${totalFacturado?.toLocaleString("es-AR") || 0}
              </p>
              <p>
                <strong>Restante por Facturar:</strong>{" "}
                ${restante?.toLocaleString("es-AR") || 0}
              </p>
            </div>
          )}
        </div>

        {/* Importe */}
        <div className="mb-10">
          <label className="block mb-2 font-semibold text-gray-700 text-sm flex items-center gap-2">
            <DollarSign size={18} className="text-[#A1C084]" /> Importe Total
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              type="number"
              value={factura.importe_total}
              onChange={(e) => setFactura({ ...factura, importe_total: e.target.value })}
              className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl pl-8 pr-4 py-3 w-full font-semibold text-lg transition-all duration-200"
            />
          </div>
        </div>

        {/* Botón con animación */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="cursor-pointer w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#345A35] to-[#274427] text-white font-bold rounded-full flex items-center justify-center gap-3
                       transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95"
          >
            <FilePlus2 size={22} className="animate-pulse-slow" />
            Guardar Factura
          </button>
        </div>
      </div>
    </div>
  </>
);

}
