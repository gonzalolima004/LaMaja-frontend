import { useLocation, useNavigate } from "react-router-dom";
import { DollarSign, BookText } from "lucide-react";

interface Props {
  fechaFiltro: string;
  setFechaFiltro: (v: string) => void;

  filtroPresupuesto?: string;
  setFiltroPresupuesto?: (v: string) => void;
}

export default function HeaderHistorial({
  fechaFiltro,
  setFechaFiltro,
  filtroPresupuesto,
  setFiltroPresupuesto
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const config = {
    "/historial-cobros": {
      title: "Historial de cobros",
      showFiltroPresupuesto: true,
      botonTexto: "Cargar cobros",
      botonIcono: <DollarSign className="w-4 h-4 text-white" />,
      botonAccion: () => navigate("/cargar-cobros"),
    },

    "/historial-facturas": {
      title: "Historial de facturas",
      showFiltroPresupuesto: true,
      botonTexto: "Generar Facturas",
      botonIcono: <BookText className="w-5 h-5 text-white" />,
      botonAccion: () => navigate("/generar-facturas"),
    },

    "/historial-presupuestos": {
      title: "Historial de presupuestos",
      showFiltroPresupuesto: false,
      botonTexto: "Generar Presupuestos",
      botonIcono: <BookText className="w-5 h-5 text-white" />,
      botonAccion: () => navigate("/generar-presupuestos"),
    },
  }[location.pathname];

  if (!config) return null;

  const {
    title,
    showFiltroPresupuesto,
    botonTexto,
    botonIcono,
    botonAccion
  } = config;

  const mostrarBotonVerTodos =
    fechaFiltro !== "" ||
    (showFiltroPresupuesto && filtroPresupuesto !== "");

  return (
    <div className="bg-[#345A35] px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-6">

      {/* TÍTULO */}
      <h2 className="text-xl sm:text-3xl font-semibold text-white text-center sm:text-left w-full">
        {title}
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 w-full md:w-auto">

        {/* BOTÓN VER TODOS */}
        {mostrarBotonVerTodos && (
          <button
            onClick={() => {
              setFechaFiltro("");
              if (showFiltroPresupuesto && setFiltroPresupuesto)
                setFiltroPresupuesto("");
            }}
            className="text-white font-semibold px-4 h-[38px] underline cursor-pointer hover:scale-[1.05] text-sm sm:text-base w-40 text-center whitespace-nowrap">
            Ver todos
          </button>
        )}

        {/* FILTRO PRESUPUESTO AUTOMÁTICO */}
        {showFiltroPresupuesto && (
          <div className="flex flex-col items-center">
            <label className="text-sm md:text-xs font-semibold text-white mb-2 text-center">
              Filtrar por N° presupuesto
            </label>

            <div className="relative h-[42px]">
              <input
                type="string"
                value={filtroPresupuesto}
                onChange={(e) =>
                  setFiltroPresupuesto && setFiltroPresupuesto(e.target.value)
                }
                placeholder="Ej: 4"
                className="bg-[#A1C084] text-[#345A35] font-semibold pl-5 pr-3 h-full rounded-lg border border-[#A1C084] shadow-md w-40 sm:w-48 hover:bg-[#8fb571] hover:border-white hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* FILTRO FECHA */}
        <div className="flex flex-col items-center">
          <label className="text-sm md:text-xs font-semibold text-white mb-2 text-center">
            Filtrar por fecha
          </label>

          <div className="relative h-[42px]">
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="bg-[#A1C084] text-[#345A35] font-semibold pl-5 pr-3 h-full rounded-lg border border-[#A1C084] shadow-md w-40 sm:w-48 hover:bg-[#8fb571] hover:border-white hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            />
          </div>
        </div>

        {/* BOTÓN ACCIÓN */}
        <button
          onClick={botonAccion}
          className="cursor-pointer flex items-center gap-2 px-4 mt-3 h-[42px] bg-[#A1C084] text-[#345A35] rounded-lg border border-[#A1C084] shadow-md font-semibold hover:bg-[#345A35] hover:text-white hover:border-white hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap">
          {botonIcono}
          {botonTexto}
        </button>
      </div>
    </div>
  );
}
