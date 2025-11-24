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

  // Obtener todos los presupuestos al cargar
 useEffect(() => {
  api
    .get("/presupuestos")
    .then((res) => {
      const lista = res.data;

      // Filtrar presupuestos donde restante > 0
      const filtrados = lista.filter((p: any) => {
        const totalFacturado = (p.facturas || []).reduce(
          (acc: number, f: any) => acc + (f.importe_total || 0),
          0
        );
        const restante = p.importe_total - totalFacturado;
        return restante > 0;
      });

      setPresupuestos(filtrados);
    })
    .catch(() =>
      Swal.fire("Error", "No se pudieron cargar los presupuestos", "error")
    );
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
      const res = await api.get(`/presupuestos/${id}`);
      const p = res.data;
      setPresupuestoSeleccionado(p);

      // ✅ Calcular total facturado desde las facturas asociadas
      const total = (p.facturas || []).reduce((acc: number, f: any) => acc + (f.importe_total || 0), 0);
      setTotalFacturado(total);

      // ✅ Calcular restante correctamente
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

  // 🔹 Crear factura con validaciones
  const handleSubmit = async () => {
    if (!factura.tipo || !factura.fecha || !factura.importe_total || !factura.id_presupuesto) {
      return showAlert("Atención", "Complete todos los campos de la factura", "warning");
    }

    const importe = parseInt(factura.importe_total);
    if (isNaN(importe) || importe <= 0) {
      return showAlert("Error", "Ingrese un importe válido mayor a 0", "error");
    }

    // ✅ Validar que no supere el restante del presupuesto
    if (importe > restante) {
      return showAlert("Error", `El importe supera el restante disponible ($${restante.toLocaleString("es-AR")})`, "error");
    }

    try {
      const body = {
        tipo: factura.tipo,
        fecha: factura.fecha,
        importe_total: importe,
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

  // 🔹 Mostrar datos del presupuesto
  const renderResumen = () => {
    if (!presupuestoSeleccionado) return null;

    return (
      <div className="mt-4 bg-[#F3EBD8]/70 border border-[#A1C084]/40 rounded-xl p-4 text-gray-800 font-medium space-y-1">
        <p>
          <strong>Importe Total Original:</strong>{" "}
          ${presupuestoSeleccionado.importe_total?.toLocaleString("es-AR") || 0}
        </p>
        <p>
          <strong>Total Facturado:</strong>{" "}
          ${totalFacturado.toLocaleString("es-AR")}
        </p>
        <p className={restante <= 0 ? "text-red-600 font-semibold" : "text-green-700 font-semibold"}>
          <strong>Restante por Facturar:</strong>{" "}
          ${restante.toLocaleString("es-AR")}
        </p>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-[#F3EBD8] flex flex-col justify-start items-center p-6 md:p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#345A35] to-[#2a4a2b] bg-clip-text text-transparent mb-8 flex items-center gap-3">
            <FileText size={36} className="text-[#345A35]" />
            Generar Facturas
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Tipo */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700 text-sm flex items-center gap-2">
                <BanknoteArrowUp size={18} className="text-[#A1C084]" /> Tipo de factura
              </label>
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

            {/* Presupuesto Asociado */}
            <div className="mb-8">
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Presupuesto Asociado</label>
              <select
                value={factura.id_presupuesto}
                onChange={handlePresupuestoChange}
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
              >
                <option value="">Seleccionar presupuesto</option>
                {presupuestos.map((p) => (
                  <option key={p.id_presupuesto} value={p.id_presupuesto}>
                    #{p.id_presupuesto} - {p.cliente?.nombre} {p.cliente?.apellido} (${p.importe_total.toLocaleString("es-AR")})
                  </option>
                ))}
              </select>

              {renderResumen()}
            </div>

            {/* Importe */}
            <div className="mb-8">
              <label className="block mb-2 font-semibold text-gray-700 text-sm flex items-center gap-2">
                <DollarSign size={18} className="text-[#A1C084]" /> Importe Total
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={factura.importe_total}
                  onChange={(e) => setFactura({ ...factura, importe_total: e.target.value })}
                  className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl pl-8 pr-4 py-3 w-full font-semibold text-lg"
                />
              </div>
            </div>

            {/* Botón con animación */}
            <button
              onClick={handleSubmit}
              className="cursor-pointer w-full bg-gradient-to-r from-[#345A35] to-[#274427] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95"
            >
              <FilePlus2 size={20} />
              Guardar Factura
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
