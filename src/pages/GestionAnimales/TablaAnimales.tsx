import { Trash2, SquarePen, ClipboardList } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function TablaAnimales(props: any) {
    const { animales, onEliminar, onEditar, onVerProcedimientos } = props;
    const getEstadoColor = (estado: any) => {
        switch (estado) {
            case "Sano":
                return "text-green-600";
            case "Enfermo":
                return "text-red-600";
            case "En revisión":
                return "text-yellow-600";
            default:
                return "";
        }
    };

    const getEstadoBgColor = (estado: any) => {
    switch (estado) {
      case "Sano":
        return "bg-green-100 text-green-700"
      case "Enfermo":
        return "bg-red-100 text-red-700"
      case "En revisión":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

    return (
         <>
      <div className="md:hidden space-y-4">
        {animales.map((a: any) => (
          <div key={a.id_animal} className="bg-white border border-[#A1C084] rounded-lg shadow-md overflow-hidden">
            {/* Header de la card */}
            <div className="bg-[#345A35] px-4 py-3 flex justify-between items-center">
              <span className="text-white font-bold text-lg">Caravana #{a.id_animal}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoBgColor(a.estado)}`}>
                {a.estado}
              </span>
            </div>

            {/* Contenido de la card */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block">Sexo</span>
                  <span className="font-semibold text-[#345A35]">{a.sexo}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Peso</span>
                  <span className="font-semibold text-[#345A35]">{a.peso} kg</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Fecha Nac.</span>
                  <span className="font-semibold text-[#345A35]">
                    {dayjs.utc(a.fecha_nacimiento).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Vacunado</span>
                  <span className={`font-semibold ${a.vacunado ? "text-green-600" : "text-red-600"}`}>
                    {a.vacunado ? "Sí" : "No"}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onVerProcedimientos(a)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition cursor-pointer"
                >
                  <ClipboardList size={18} />
                  <span className="text-sm font-medium">Procedimientos</span>
                </button>
                <button
                  onClick={() => onEditar(a)}
                  className="bg-[#A1C084] text-[#345A35] p-2 rounded-lg hover:bg-[#8db06f] transition cursor-pointer"
                >
                  <SquarePen size={20} />
                </button>
                <button
                  onClick={() => onEliminar(a.id_animal)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <table className="hidden md:table w-full border border-[#A1C084] rounded-lg shadow-md">
        <thead className="bg-[#345A35] text-white">
          <tr>
            <th className="pl-2">Caravana</th>
            <th className="p-2">Sexo</th>
            <th className="p-2">Peso</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Fecha Nac.</th>
            <th className="p-2">Vacunado</th>
            <th className="p-2">Procedimientos</th>
            <th className="p-2">Editar y Eliminar</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {animales.map((a: any) => (
            <tr key={a.id_animal} className="border-t">
              <td className="p-2 text-center">{a.id_animal}</td>
              <td className="p-2 text-center">{a.sexo}</td>
              <td className="p-2 text-center">{a.peso}</td>
              <td className={`p-2 text-center font-semibold ${getEstadoColor(a.estado)}`}>{a.estado}</td>
              <td className="p-2 text-center">{dayjs.utc(a.fecha_nacimiento).format("DD/MM/YYYY")}</td>
              <td className="p-2 text-center">{a.vacunado ? "Sí" : "No"}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => onVerProcedimientos(a)}
                  className="bg-blue-500 text-white px-3 py-1 rounded transition cursor-pointer hover:bg-blue-600 hover:scale-[1.08]"
                >
                  <ClipboardList size={18} />
                </button>
              </td>
              <td className="p-2 flex justify-center gap-3">
                <button
                  onClick={() => onEditar(a)}
                  className="bg-[#A1C084] text-[#345A35] px-3 py-1 rounded transition cursor-pointer hover:bg-[#8db06f] hover:scale-[1.08]"
                >
                  <SquarePen size={18} />
                </button>
                <button
                  onClick={() => onEliminar(a.id_animal)}
                  className="bg-red-500 text-white px-3 py-1 rounded transition cursor-pointer hover:bg-red-600 hover:scale-[1.08]"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
    );
}
