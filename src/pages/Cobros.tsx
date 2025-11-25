import { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import Header from "../components/Header";

interface Cliente {
  nombre: string;
  apellido: string;
  dni: string;
  direccion: string;
}

interface Presupuesto {
  id_presupuesto: number;
  importe_total: number;
  fecha: string;
  cliente?: Cliente;
}

interface FacturaVenta {
  id_factura_venta: number;
  importe_total: number;
  fecha: string;
  tipo: string;
  presupuesto?: Presupuesto;
}

interface MetodoPago {
  id_metodo_pago: number;
  nombre_metodo_pago: string;
}

interface Cobro {
  id_cobro: number;
  importe_total: number;
  fecha: string;
  id_metodo_pago: number;
  metodo_pago?: MetodoPago;
  factura_venta?: FacturaVenta;
}

export default function Cobros() {
  const [facturas, setFacturas] = useState<FacturaVenta[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaVenta | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);
  const [titular, setTitular] = useState('');
  const [importe, setImporte] = useState<number>(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [historialCobros, setHistorialCobros] = useState<Cobro[]>([]);
  const [filtroMetodo, setFiltroMetodo] = useState<number | 'Todos'>('Todos');

  const metodosPago = [
    { id_metodo_pago: 1, nombre_metodo_pago: 'Efectivo' },
    { id_metodo_pago: 2, nombre_metodo_pago: 'Tarjeta de Crédito/Débito' },
    { id_metodo_pago: 3, nombre_metodo_pago: 'Transferencia Bancaria' },
  ];

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/facturas_venta');
        setFacturas(res.data);
      } catch (error) {
        console.error('Error al cargar facturas', error);
      }
    };
    fetchFacturas();
  }, []);

  const handleFacturaSelect = (id: number) => {
    const factura = facturas.find(f => f.id_factura_venta === id) || null;
    setFacturaSeleccionada(factura);
    setImporte(factura ? factura.importe_total : 0);
  };

  const handleCobro = async () => {
    if (!facturaSeleccionada || !metodoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Debes seleccionar una factura y un método de pago.',
        confirmButtonColor: '#345A35',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/cobros', {
        importe_total: importe,
        id_metodo_pago: metodoSeleccionado,
        titular,
        id_factura_venta: facturaSeleccionada.id_factura_venta,
      });

      Swal.fire({
        icon: 'success',
        title: 'Cobro registrado',
        text: response.data.mensaje || 'El cobro se realizó correctamente.',
        confirmButtonColor: '#345A35',
      });

      setTitular('');
      setMetodoSeleccionado(null);
      setFacturaSeleccionada(null);
    } catch (error) {
      console.error('Error al registrar cobro', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el cobro. Inténtalo nuevamente.',
        confirmButtonColor: '#a11',
      });
    }
  };

  const abrirHistorialCobros = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/cobros');
      setHistorialCobros(res.data);
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al cargar historial de cobros', error);
    }
  };

  // 🔹 Ahora filtramos por id_metodo_pago, no por texto
  const cobrosFiltrados =
    filtroMetodo === 'Todos'
      ? historialCobros
      : historialCobros.filter((c) => c.id_metodo_pago === filtroMetodo);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3EBD8' }}>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-[#345A35] mb-6">Gestión de Cobros</h1>

        <div className="flex justify-between items-center mb-8">
          <p className="text-[#345A35]">Procesa el pago de la factura de venta</p>
          <button
            onClick={abrirHistorialCobros}
            className="bg-[#345A35] text-white px-4 py-2 rounded cursor-pointer transition hover:bg-[#2a4a2b] hover:scale-[1.05]"
          >
            Ver Historial de Pagos
          </button>
        </div>

        {/* SELECCIÓN DE FACTURA */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-2 text-[#345A35]">
            Seleccionar factura:
          </label>
          <select
            onChange={(e) => handleFacturaSelect(Number(e.target.value))}
            value={facturaSeleccionada?.id_factura_venta || ''}
            className="p-3 rounded-md w-full border focus:outline-none bg-white"
            style={{ borderColor: '#345A35' }}
          >
            <option value=""> Seleccioná una factura </option>
            {facturas.map((f) => (
              <option key={f.id_factura_venta} value={f.id_factura_venta}>
                {`Factura #${f.id_factura_venta} - ${f.tipo} - $${f.importe_total}`}
              </option>
            ))}
          </select>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {facturaSeleccionada && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* IZQUIERDA */}
            <div className="lg:col-span-2 space-y-6">
              {/* FACTURA */}
              <div className="bg-white rounded-xl shadow">
                <div
                  className="p-3 text-white font-semibold flex justify-between items-center"
                  style={{ backgroundColor: '#345A35' }}
                >
                  <span>🧾 Factura de Venta</span>
                  <span className="text-sm opacity-80">
                    {new Date(facturaSeleccionada.fecha).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-5 text-[#345A35]">
                  <p><strong>ID Factura:</strong> {facturaSeleccionada.id_factura_venta}</p>
                  <p><strong>Tipo:</strong> {facturaSeleccionada.tipo}</p>
                  <p><strong>Fecha:</strong> {new Date(facturaSeleccionada.fecha).toLocaleDateString()}</p>
                  <p className="text-lg mt-3 font-semibold">
                    Total: ${facturaSeleccionada.importe_total}
                  </p>
                </div>
              </div>

              {/* PRESUPUESTO */}
              {facturaSeleccionada.presupuesto && (
                <div className="bg-white rounded-xl shadow">
                  <div
                    className="p-3 text-white font-semibold"
                    style={{ backgroundColor: '#345A35' }}
                  >
                    📄 Presupuesto Asociado
                  </div>
                  <div className="p-5 text-[#345A35]">
                    <p><strong>N° Presupuesto:</strong> {facturaSeleccionada.presupuesto.id_presupuesto}</p>
                    <p><strong>Fecha:</strong> {new Date(facturaSeleccionada.presupuesto.fecha).toLocaleDateString()}</p>
                    <p><strong>Importe Total:</strong> ${facturaSeleccionada.presupuesto.importe_total}</p>
                  </div>
                </div>
              )}

              {/* CLIENTE */}
              {facturaSeleccionada.presupuesto?.cliente && (
                <div className="bg-white rounded-xl shadow">
                  <div
                    className="p-3 text-white font-semibold"
                    style={{ backgroundColor: '#345A35' }}
                  >
                    👤 Datos del Cliente
                  </div>
                  <div className="p-5 text-[#345A35] grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p><strong>Nombre:</strong> {facturaSeleccionada.presupuesto.cliente.nombre} {facturaSeleccionada.presupuesto.cliente.apellido}</p>
                    <p><strong>DNI:</strong> {facturaSeleccionada.presupuesto.cliente.dni}</p>
                    <p><strong>Dirección:</strong> {facturaSeleccionada.presupuesto.cliente.direccion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* DERECHA: MÉTODOS DE PAGO */}
            <div>
              <div className="bg-white rounded-xl shadow">
                <div
                  className="p-3 text-white font-semibold"
                  style={{ backgroundColor: '#345A35' }}
                >
                  💳 Método de Pago
                </div>
                <div className="p-5 space-y-3 text-[#345A35]">
                  <p className="text-sm">Selecciona cómo se realizó el pago:</p>

                  {metodosPago.map((m) => (
                    <div
                      key={m.id_metodo_pago}
                      onClick={() => setMetodoSeleccionado(m.id_metodo_pago)}
                      className={`cursor-pointer p-3 rounded-md border flex items-center justify-between transition ${
                        metodoSeleccionado === m.id_metodo_pago
                          ? 'border-[#345A35] bg-[#A1C084]/30'
                          : 'border-gray-300 hover:bg-[#F3EBD8]'
                      }`}
                    >
                      <span>{m.nombre_metodo_pago}</span>
                      <input
                        type="radio"
                        checked={metodoSeleccionado === m.id_metodo_pago}
                        readOnly
                        className="accent-[#345A35]"
                      />
                    </div>
                  ))}

                  {(metodoSeleccionado === 2 || metodoSeleccionado === 3) && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold mb-1">
                        Titular:
                      </label>
                      <input
                        type="text"
                        value={titular}
                        onChange={(e) => setTitular(e.target.value)}
                        placeholder="Nombre del titular"
                        className="p-2 w-full rounded-md border focus:outline-none"
                        style={{ borderColor: '#345A35' }}
                      />
                    </div>
                  )}

                  <div className="bg-[#A1C084]/20 rounded-md p-3 mt-4">
                    <p className="font-semibold mb-1">Resumen del Pago</p>
                    <p>
                      Monto a cobrar: <strong>${facturaSeleccionada.importe_total}</strong>
                    </p>
                  </div>

                  <button
                    onClick={handleCobro}
                    className="w-full bg-[#345A35] mt-7.5 text-white p-3 rounded cursor-pointer transition hover:bg-[#2a4a2b] hover:scale-[1.05]"
                  >
                    Confirmar Cobro
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL HISTORIAL DE PAGOS */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
            <div
              className="flex justify-between items-center p-4 text-white font-semibold"
              style={{ backgroundColor: '#345A35' }}
            >
              <h2>💰 Historial de Pagos</h2>
              <button onClick={() => setMostrarModal(false)}>
                <X size={22} className="hover:opacity-70" />
              </button>
            </div>

            <div className="p-4 text-[#345A35]">
              <div className="mb-4 flex items-center gap-3">
                <label className="font-semibold">Filtrar por método:</label>
                <select
                  value={String(filtroMetodo)}
                  onChange={(e) =>
                    setFiltroMetodo(
                      e.target.value === 'Todos'
                        ? 'Todos'
                        : Number(e.target.value)
                    )
                  }
                  className="border p-2 rounded-md"
                  style={{ borderColor: '#345A35' }}
                >
                  <option value="Todos">Todos</option>
                  {metodosPago.map((m) => (
                    <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                      {m.nombre_metodo_pago}
                    </option>
                  ))}
                </select>
              </div>

              {cobrosFiltrados.length === 0 ? (
                <p className="text-center py-4">No hay cobros registrados.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#A1C084]/40">
                      <th className="p-2 border">Fecha</th>
                      <th className="p-2 border">Método</th>
                      <th className="p-2 border">Importe</th>
                      <th className="p-2 border">Factura Cobrada</th>
                      <th className="p-2 border">Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cobrosFiltrados.map((cobro) => (
                      <tr key={cobro.id_cobro} className="text-center hover:bg-[#F3EBD8]">
                        <td className="p-2 border">
                          {new Date(cobro.fecha).toLocaleDateString()}
                        </td>
                        <td className="p-2 border">
                          {cobro.metodo_pago?.nombre_metodo_pago || '—'}
                        </td>
                        <td className="p-2 border">${cobro.importe_total}</td>
                        <td className="p-2 border">
                          {cobro.factura_venta
                            ? `Factura #${cobro.factura_venta.id_factura_venta} - ${cobro.factura_venta.tipo} - $${cobro.factura_venta.importe_total}`
                            : '—'}
                        </td>
                        <td className="p-2 border">
                          {cobro.factura_venta?.presupuesto?.cliente
                            ? `${cobro.factura_venta.presupuesto.cliente.nombre} ${cobro.factura_venta.presupuesto.cliente.apellido}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
