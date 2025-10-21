import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import api from "../services/api"
import dayjs from "dayjs"
import Header from "../components/Header"
import { useNavigate } from 'react-router-dom';

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    const res = await api.get(`/ventas`);
    setFacturas(res.data);
  };

  const seleccionarFactura = async (id: number) => {
    const res = await getFacturaPorId(id);
    setFacturaSeleccionada(res.data.factura);
    setModoEdicion(false);
  };

  const handleEditar = async (e: any) => {
    e.preventDefault();
    await editarFactura(facturaSeleccionada.id_factura_venta, facturaSeleccionada);
    setModoEdicion(false);
    cargarFacturas();
  };

  const handleEliminar = async (id: number) => {
    await eliminarFactura(id);
    setFacturaSeleccionada(null);
    cargarFacturas();
  };

  const handleChange = (e: any) => {
    setFacturaSeleccionada({
      ...facturaSeleccionada,
      [e.target.name]: e.target.value
    });
  };

  return (
     <>
      <Header />
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facturas de Venta</h1>
        <button
          onClick={() => navigate('/crear-factura')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Factura
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <ul className="space-y-2">
            {facturas.map((factura: any) => (
              <li
                key={factura.id_factura_venta}
                onClick={() => seleccionarFactura(factura.id_factura_venta)}
                className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${
                  facturaSeleccionada?.id_factura_venta === factura.id_factura_venta
                    ? 'bg-gray-200'
                    : ''
                }`}
              >
                <div className="font-semibold">{factura.tipo}</div>
                <div>${factura.importe_total}</div>
                <div className="text-sm text-gray-500">
                  {new Date(factura.fecha).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          {facturaSeleccionada ? (
            <div className="p-4 border rounded shadow">
              {modoEdicion ? (
                <form onSubmit={handleEditar} className="space-y-4">
                  <input
                    name="tipo"
                    value={facturaSeleccionada.tipo}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="Tipo"
                  />
                  <input
                    name="importe_total"
                    value={facturaSeleccionada.importe_total}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="Importe"
                  />
                  <input
                    name="fecha"
                    type="date"
                    value={facturaSeleccionada.fecha.split('T')[0]}
                    onChange={handleChange}
                    className="input w-full"
                  />
                  <input
                    name="id_presupuesto"
                    value={facturaSeleccionada.id_presupuesto}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="ID Presupuesto"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn bg-green-600 text-white">
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoEdicion(false)}
                      className="btn bg-gray-400 text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">{facturaSeleccionada.tipo}</h2>
                  <p><strong>Importe:</strong> ${facturaSeleccionada.importe_total}</p>
                  <p><strong>Fecha:</strong> {new Date(facturaSeleccionada.fecha).toLocaleDateString()}</p>
                  <p><strong>ID Presupuesto:</strong> {facturaSeleccionada.id_presupuesto}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setModoEdicion(true)}
                      className="btn bg-yellow-500 text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(facturaSeleccionada.id_factura_venta)}
                      className="btn bg-red-600 text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Selecciona una factura para ver detalles</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

