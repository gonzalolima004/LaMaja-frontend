import { X } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const METODOS = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Tarjeta de Crédito/Débito" },
  { id: 3, nombre: "Transferencia Bancaria" },
];

interface ModalHistorialProps {
  historial: any[];
  filtro: number | "Todos";
  setFiltro: (f: number | "Todos") => void;
  onClose: () => void;
}

export default function HistorialCobrosModal({
  historial,
  filtro,
  setFiltro,
  onClose,
}: ModalHistorialProps) {
  const filtrados =
    filtro === "Todos"
      ? historial
      : historial.filter((c) => c.id_metodo_pago === filtro);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto shadow-lg">
        <div
          className="flex justify-between items-center p-4 text-white font-semibold text-center"
          style={{ backgroundColor: "#345A35" }}
        >
          <h2 className="text-2xl">Historial de Cobros</h2>
          <X size={22} className="cursor-pointer hover:opacity-70" onClick={onClose} />
        </div>

        <div className="p-4 text-[#345A35]">
          <select
            className="border p-2 rounded mb-3"
            style={{ borderColor: "#345A35" }}
            value={String(filtro)}
            onChange={(e) =>
              setFiltro(e.target.value === "Todos" ? "Todos" : Number(e.target.value))
            }
          >
            <option value="Todos">Todos</option>
            {METODOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          {filtrados.length === 0 ? (
            <p className="text-center py-4">No hay cobros registrados.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#A1C084]/40">
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Método</th>
                  <th className="p-2 border">Importe</th>
                  <th className="p-2 border">Factura</th>
                  <th className="p-2 border">Cliente</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((cobro) => (
                  <tr
                    key={cobro.id_cobro}
                    className="text-center hover:bg-[#F3EBD8]"
                  >
                    <td className="p-2 border">
                      {dayjs.utc(cobro.fecha).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-2 border">
                      {cobro.metodo_pago?.nombre_metodo_pago || "—"}
                    </td>
                    <td className="p-2 border">${cobro.importe_total}</td>
                    <td className="p-2 border">
                      {cobro.factura_venta
                        ? `Factura #${cobro.factura_venta.id_factura_venta} - ${cobro.factura_venta.tipo}`
                        : "—"}
                    </td>
                    <td className="p-2 border">
                      {cobro.factura_venta?.presupuesto?.cliente
                        ? `${cobro.factura_venta.presupuesto.cliente.nombre} ${cobro.factura_venta.presupuesto.cliente.apellido}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
