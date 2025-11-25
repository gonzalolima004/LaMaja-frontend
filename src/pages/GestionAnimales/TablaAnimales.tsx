import { Trash2, SquarePen, ClipboardList } from "lucide-react";

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

    return (
        <table className="w-full border border-[#A1C084] rounded-lg shadow-md">
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
                        <td className={`p-2 text-center font-semibold ${getEstadoColor(a.estado)}`}>
                            {a.estado}
                        </td>
                        <td className="p-2 text-center">
                            {new Date(a.fecha_nacimiento).toLocaleDateString("es-ES")}
                        </td>
                        <td className="p-2 text-center">{a.vacunado ? "Sí" : "No"}</td>
                        <td className="p-2 text-center">
                            <button onClick={() => onVerProcedimientos(a)} className="bg-blue-500 text-white px-3 py-1 rounded transition cursor-pointer hover:bg-blue-600 hover:scale-[1.08]">
                                <ClipboardList size={18} />
                            </button>

                        </td>


                        <td className="p-2 flex justify-center gap-3">

                            <button onClick={() => onEditar(a)} className="bg-[#A1C084] text-[#345A35] px-3 py-1 rounded transition cursor-pointer hover:bg-[#8db06f] hover:scale-[1.08]">
                                <SquarePen size={18} />
                            </button>


                            <button onClick={() => onEliminar(a.id_animal)} className="bg-red-500 text-white px-3 py-1 rounded transition cursor-pointer hover:bg-red-600 hover:scale-[1.08]">
                                <Trash2 size={18} />
                            </button>


                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
