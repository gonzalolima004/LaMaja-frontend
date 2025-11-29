import { useState, useEffect } from "react";
import api from "../services/api";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import Header from "../components/Header";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);

export default function HistorialCobros() {
    const [cobros, setCobros] = useState<any[]>([]);
    const [fechaFiltro, setFechaFiltro] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroPresupuesto, setFiltroPresupuesto] = useState("");
    const cobrosPorPagina = 5;

    const navigate = useNavigate();

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

    const goGenerarCobros = () => {
        navigate('/cargar-cobros');
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-[#F3EBD8] p-3 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-[#345A35] px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <h2 className="text-xl sm:text-3xl font-semibold text-white">
                                Historial de Cobros
                            </h2>



                            <div className="flex items-end gap-4">
                                {(fechaFiltro !== "" || filtroPresupuesto !== "") && (
                                    <button
                                        onClick={() => {
                                            setFechaFiltro("");
                                            setFiltroPresupuesto("");
                                        }}
                                        className="text-white font-semibold px-5 h-[42px] underline cursor-pointer hover:scale-[1.05]"
                                    >
                                        Ver todos
                                    </button>
                                )}


                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-white mb-1 text-center">
                                        Filtrar por N° de presupuesto
                                    </label>



                                    <input
                                        type="number"
                                        value={filtroPresupuesto}
                                        onChange={(e) => setFiltroPresupuesto(e.target.value)}
                                        placeholder="Ej: 4"
                                        className="bg-[#A1C084] text-[#345A35] hover:text-white font-semibold px-4 h-[42px]  rounded-lg border border-[#A1C084] shadow-md w-32  hover:bg-[#8fb571] hover:border-white transition w-50"
                                    />
                                </div>


                                {/* FILTRO POR FECHA */}
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-white mb-1 text-center">
                                        Filtrar por fecha
                                    </label>

                                    <input
                                        type="date"
                                        value={fechaFiltro}
                                        onChange={(e) => setFechaFiltro(e.target.value)}
                                        className="bg-[#A1C084] text-[#345A35] font-semibold px-3 h-[42px] rounded-lg border border-[#A1C084] shadow-md w-48 hover:bg-[#8fb571] hover:border-white hover:text-white transition cursor-pointer pl-8 relative"
                                    />
                                </div>
                                <button
                                    onClick={goGenerarCobros}
                                    className="cursor-pointer flex items-center gap-2 px-4 h-[42px] bg-[#A1C084] text-[#345A35] rounded-lg border border-[#A1C084] shadow-md font-semibold hover:bg-[#345A35] hover:text-white hover:border-white hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap transition-all duration-200">
                                    <DollarSign className="w-5 h-5 text-white hover:text-white transition-all font-bold" />
                                    Cargar cobros
                                </button>
                            </div>
                        </div>

                        {/* TABLA */}
                        <div className="w-full overflow-x-auto">
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
                                        const cliente = c.factura_venta?.presupuesto?.cliente;

                                        return (
                                            <tr key={c.id_cobro}>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">{c.id_cobro}</td>
                                                <td className="px-2 py-2 sm:px-4 sm:py-4">Presupuesto Nº {c.factura_venta.presupuesto.id_presupuesto}</td>


                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    Factura Nº {c.factura_venta.id_factura_venta} - {c.factura_venta.tipo}
                                                </td>


                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    {cliente.nombre} {cliente.apellido}
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    {c.metodo_pago?.nombre_metodo_pago}
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    ${c.importe_total}
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-4">
                                                    {dayjs.utc(c.fecha).format("DD/MM/YYYY")}
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* PAGINACIÓN */}
                            <div className="flex justify-center items-center gap-3 py-4 bg-[#F3EBD8]">
                                <button
                                    disabled={paginaActual === 1}
                                    onClick={() => setPaginaActual(paginaActual - 1)}
                                    className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white 
                  rounded disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer flex items-center disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <span className="font-semibold text-[#345A35]">
                                    {paginaActual} / {totalPaginas || 1}
                                </span>

                                <button
                                    disabled={paginaActual === totalPaginas}
                                    onClick={() => setPaginaActual(paginaActual + 1)}
                                    className="px-3 py-2 bg-[#A1C084] text-[#345A35] hover:bg-[#345a35] hover:text-white 
                  rounded disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer flex items-center disabled:cursor-not-allowed"
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
