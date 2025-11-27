import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../components/Header";
import HistorialCobrosModal from "./HistorialCobrosModal";

// Tipos compactos
type Cliente = { nombre: string; apellido: string; dni: string; direccion: string };
type Presupuesto = { id_presupuesto: number; importe_total: number; fecha: string; cliente?: Cliente };
type Factura = {
  id_factura_venta: number;
  tipo: string;
  fecha: string;
  importe_total: number;
  presupuesto?: Presupuesto;
};

const METODOS = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Tarjeta de Crédito/Débito" },
  { id: 3, nombre: "Transferencia Bancaria" },
];

export default function Cobros() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cobros, setCobros] = useState<any[]>([]); // ⬅ se agregan cobros
  const [factura, setFactura] = useState<Factura | null>(null);
  const [metodo, setMetodo] = useState<number | null>(null);
  const [titular, setTitular] = useState("");
  const [modal, setModal] = useState(false);
  const [historial, setHistorial] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<number | "Todos">("Todos");

  useEffect(() => {
    const fetchData = async () => {
      const facturasRes = await axios.get("http://localhost:3001/api/facturas_venta");
      const cobrosRes = await axios.get("http://localhost:3001/api/cobros");

      setFacturas(facturasRes.data);
      setCobros(cobrosRes.data);
    };

    fetchData();
  }, []);

  // IDs de facturas que ya están cobradas
  const facturasCobradasIds = cobros.map((c) => c.id_factura_venta);

  const cobrar = async () => {
    if (!factura || !metodo)
      return Swal.fire("Faltan datos", "Selecciona factura y método de pago", "warning");

    try {
      const res = await axios.post("http://localhost:3001/api/cobros", {
        id_factura_venta: factura.id_factura_venta,
        id_metodo_pago: metodo,
        importe_total: factura.importe_total,
        titular,
      });

      Swal.fire("Cobro registrado", res.data.mensaje, "success");

      // Reseteo
      setFactura(null);
      setMetodo(null);
      setTitular("");

      const updatedCobros = await axios.get("http://localhost:3001/api/cobros");
      setCobros(updatedCobros.data);
    } catch {
      Swal.fire("Error", "No se pudo registrar el cobro", "error");
    }
  };

  const abrirHistorial = async () => {
    const res = await axios.get("http://localhost:3001/api/cobros");
    setHistorial(res.data);
    setModal(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EBD8" }}>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-4xl font-bold text-[#345A35]">Gestión de Cobros</h1>
          <button
            onClick={abrirHistorial}
            className="bg-[#345A35] text-white px-4 py-2 rounded cursor-pointer"
          >
            Ver historial de cobros
          </button>
        </div>

        {/* SELECT FACTURA */}
        <select
          className="p-3 rounded-md w-full border bg-white cursor-pointer"
          style={{ borderColor: "#345A35" }}
          value={factura?.id_factura_venta || ""}
          onChange={(e) =>
            setFactura(
              facturas.find((f) => f.id_factura_venta === Number(e.target.value)) || null
            )
          }
        >
          <option value="" disabled>Seleccioná una factura</option>

          {facturas
            .filter((f) => !facturasCobradasIds.includes(f.id_factura_venta)) // ⬅ FILTRO
            .map((f) => (
              <option key={f.id_factura_venta} value={f.id_factura_venta}>
                {`Factura N°${f.id_factura_venta} - Cliente: ${f.presupuesto?.cliente?.nombre} ${f.presupuesto?.cliente?.apellido} - ${f.tipo} - $${f.importe_total}`}
              </option>
            ))}
        </select>

        {/* CONTENIDO */}
        {factura && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* FACTURA */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow">
                <div className="p-3 text-white font-semibold" style={{ backgroundColor: "#345A35" }}>
                  🧾 Factura de Venta
                </div>
                <div className="p-5 text-[#345A35]">
                  <p><strong>N° de factura:</strong> {factura.id_factura_venta}</p>
                  <p><strong>Tipo:</strong> {factura.tipo}</p>
                  <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString()}</p>
                  <p className="font-bold mt-3">Importe: ${factura.importe_total}</p>
                </div>
              </div>

              {/* PRESUPUESTO */}
              {factura.presupuesto && (
                <div className="bg-white rounded-xl shadow">
                  <div className="p-3 text-white font-semibold" style={{ backgroundColor: "#345A35" }}>
                    📄 Presupuesto Asociado
                  </div>
                  <div className="p-5 text-[#345A35]">
                    <p><strong>N° de presupuesto:</strong> {factura.presupuesto.id_presupuesto}</p>
                    <p><strong>Fecha:</strong> {new Date(factura.presupuesto.fecha).toLocaleDateString()}</p>
                    <p><strong>Importe total:</strong> ${factura.presupuesto.importe_total}</p>
                  </div>
                </div>
              )}

              {/* CLIENTE */}
              {factura.presupuesto?.cliente && (
                <div className="bg-white rounded-xl shadow">
                  <div className="p-3 text-white font-semibold" style={{ backgroundColor: "#345A35" }}>
                    👤 Cliente
                  </div>
                  <div className="p-5 text-[#345A35]">
                    <p><strong>Nombre:</strong> {factura.presupuesto.cliente.nombre} {factura.presupuesto.cliente.apellido}</p>
                    <p><strong>DNI:</strong> {factura.presupuesto.cliente.dni}</p>
                    <p><strong>Dirección:</strong> {factura.presupuesto.cliente.direccion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="bg-white rounded-xl shadow h-fit">
              <div className="p-3 text-white font-semibold" style={{ backgroundColor: "#345A35" }}>
                💳 Método de Pago
              </div>

              <div className="p-5 text-[#345A35]">
                {METODOS.map((m) => (
                  <div
                    key={m.id}
                    className={`cursor-pointer p-3 rounded-md border flex justify-between mb-2 ${
                      metodo === m.id ? "border-[#345A35] bg-[#A1C084]/30" : "border-gray-300"
                    }`}
                    onClick={() => setMetodo(m.id)}
                  >
                    {m.nombre}
                    <input type="radio" checked={metodo === m.id} readOnly />
                  </div>
                ))}

                {(metodo === 2 || metodo === 3) && (
                  <input
                    className="p-2 border rounded w-full mt-3"
                    style={{ borderColor: "#345A35" }}
                    placeholder="Titular"
                    value={titular}
                    onChange={(e) => setTitular(e.target.value)}
                  />
                )}

                <button
                  onClick={cobrar}
                  className="w-full bg-[#345A35] text-white p-3 mt-6 rounded cursor-pointer"
                >
                  Confirmar Cobro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


      {modal && (
        <HistorialCobrosModal
          historial={historial}
          filtro={filtro}
          setFiltro={setFiltro}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
