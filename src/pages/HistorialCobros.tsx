import { useState, useEffect } from "react";
import api from "../services/api";
import { ChevronLeft, ChevronRight, User, Calendar, CreditCard } from "lucide-react";
import Header from "../components/Header";
import HeaderHistorial from "../components/HeaderHistorial";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function HistorialCobros() {
    const [cobros, setCobros] = useState<any[]>([]);
    const [fechaFiltro, setFechaFiltro] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroPresupuesto, setFiltroPresupuesto] = useState("");
    const cobrosPorPagina = 5;


    useEffect(() => {
        const obtenerCobros = async () => {
            try {
                const res = await api.get(`/cobros`);
                setCobros(res.data);
            } catch (error) {
                console.error("Error al obtener los cobros:", error);
            }
        };
        obtenerCobros();
    }, []);

    const toLocalDateString = (fechaISO: string) => {
        return dayjs.utc(fechaISO).format("YYYY-MM-DD");
    };

    const cobrosFiltrados = cobros.filter((c) => {
        if (fechaFiltro) {
            const fechaLocal = toLocalDateString(c.fecha);
            if (fechaLocal !== fechaFiltro) return false;
        }

        if (filtroPresupuesto) {
            const nroPresupuesto = c.factura_venta?.presupuesto?.id_presupuesto;

            if (!nroPresupuesto) return false;

            if (nroPresupuesto.toString() !== filtroPresupuesto) return false;
        }

        return true;
    });



    const indexUltimo = paginaActual * cobrosPorPagina;
    const indexPrimero = indexUltimo - cobrosPorPagina;
    const cobrosPaginados = cobrosFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(cobrosFiltrados.length / cobrosPorPagina);

    useEffect(() => {
        setPaginaActual(1);
    }, [fechaFiltro]);


    return (
        <>
            <Header />

            <div className="min-h-screen bg-[#F3EBD8] p-3 sm:p-6">
                <div className="max-w-7xl mx-auto">

                    <div className="rounded-lg shadow-lg overflow-hidden">
                        
                    <HeaderHistorial
  fechaFiltro={fechaFiltro}
  setFechaFiltro={setFechaFiltro}
  filtroPresupuesto={filtroPresupuesto}
  setFiltroPresupuesto={setFiltroPresupuesto}
/>




                        <div className="w-full overflow-x-auto hidden md:block">
                            <table className="min-w-full lg:w-full text-center text-white text-sm sm:text-base table-auto">
                                <thead className="bg-[#A1C084]">
                                    <tr>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">N°</th>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">Presupuesto</th>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">Datos de la factura</th>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">Cliente</th>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">Método</th>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">Importe</th>
                                        <th className="px-2 py-2 sm:px-4 sm:py-3">Fecha</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-[#A1C084] divide-y divide-gray-200 font-bold">
                                    {cobrosPaginados.map((c) => {
                                        const cliente = c.factura_venta?.presupuesto?.cliente
                                        return (
                                            <tr key={c.id_cobro}>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">{c.id_cobro}</td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    Presupuesto Nº {c.factura_venta.presupuesto.id_presupuesto}
                                                </td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    Factura Nº {c.factura_venta.id_factura_venta} - {c.factura_venta.tipo}
                                                </td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    {cliente?.nombre} {cliente?.apellido}
                                                </td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">{c.metodo_pago?.nombre_metodo_pago}</td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">${c.importe_total}</td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">{dayjs.utc(c.fecha).format("DD/MM/YYYY")}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINACIÓN */}
                        <div className="flex justify-center items-center gap-3 py-4 bg-[#F3EBD8]">
                            <button
                                disabled={paginaActual === 1}
                                onClick={() => setPaginaActual(paginaActual - 1)}
                                className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white rounded disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer flex items-center disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <span className="font-semibold text-[#345A35]">
                                {paginaActual} / {totalPaginas || 1}
                            </span>

                            <button
                                disabled={paginaActual === totalPaginas}
                                onClick={() => setPaginaActual(paginaActual + 1)}
                                className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white rounded disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer flex items-center disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="md:hidden bg-[#F3EBD8] p-3 space-y-3">
                            {cobrosPaginados.map((c) => {
                                const cliente = c.factura_venta?.presupuesto?.cliente
                                return (
                                    <div
                                        key={c.id_cobro}
                                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                    >
                                        <div className="bg-[#345A35] px-4 py-3 flex justify-between items-center">
                                            <span className="text-white font-bold text-lg">Cobro N°{c.id_cobro}</span>
                                            <span className="bg-[#A1C084] text-[#345A35] font-bold px-3 py-1 rounded-full text-sm">
                                                ${c.importe_total.toLocaleString("es-AR")}
                                            </span>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2 text-[#345A35]">
                                                <User className="w-5 h-5" />
                                                <span className="font-semibold">
                                                    {cliente?.nombre} {cliente?.apellido}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-[#F3EBD8] rounded-lg p-3">
                                                    <div className="text-[#345A35]/70 text-xs mb-1">Presupuesto</div>
                                                    <div className="text-[#345A35] font-bold">
                                                        Nº {c.factura_venta.presupuesto.id_presupuesto}
                                                    </div>
                                                </div>

                                                <div className="bg-[#F3EBD8] rounded-lg p-3">
                                                    <div className="text-[#345A35]/70 text-xs mb-1">Factura</div>
                                                    <div className="text-[#345A35] font-bold">
                                                        Nº {c.factura_venta.id_factura_venta} - {c.factura_venta.tipo}
                                                    </div>
                                                </div>

                                                <div className="bg-[#F3EBD8] rounded-lg p-3">
                                                    <div className="text-[#345A35]/70 text-xs mb-1 flex items-center gap-1">
                                                        <CreditCard className="w-3 h-3" /> Método
                                                    </div>
                                                    <div className="text-[#345A35] font-bold">{c.metodo_pago?.nombre_metodo_pago}</div>
                                                </div>

                                                <div className="bg-[#F3EBD8] rounded-lg p-3">
                                                    <div className="text-[#345A35]/70 text-xs mb-1 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> Fecha
                                                    </div>
                                                    <div className="text-[#345A35] font-bold">{dayjs.utc(c.fecha).format("DD/MM/YYYY")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
