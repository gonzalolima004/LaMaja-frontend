import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

export default function ProcedimientosModal(props: any) {
    const { animal, onClose } = props;


    const [tipo, setTipo] = useState("");
    const [fecha, setFecha] = useState("");
    const [procedimientos, setProcedimientos] = useState<any[]>([]);


    const cargar = async () => {
        const res = await axios.get("http://localhost:3001/api/procedimientos");
        setProcedimientos(res.data.filter((p: any) => p.id_animal === animal.id_animal));
    };

    const eliminarProcedimiento = async (id: any) => {
        Swal.fire({
            title: "¿Eliminar procedimiento?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#345A35",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3001/api/procedimientos/${id}`);
                    cargar(); // recargar la lista
                    Swal.fire("Eliminado", "El procedimiento fue eliminado.", "success");
                } catch {
                    Swal.fire("Error", "No se pudo eliminar el procedimiento.", "error");
                }
            }
        });
    };


    useEffect(() => {
        cargar();
    }, []);

    const guardar = async () => {
        if (!tipo || !fecha) {
            return Swal.fire("Error", "Faltan datos", "warning");
        }

        await axios.post("http://localhost:3001/api/procedimientos", {
            tipo,
            fecha,
            id_animal: animal.id_animal,
        });

        setTipo("");
        setFecha("");
        cargar();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[500px]">
                <h2 className="text-2xl font-semibold text-[#345A35] mb-4">
                    Procedimientos para caravana N°{animal.id_animal}
                </h2>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border p-2 rounded cursor-pointer"
                />

                <textarea
                    className="w-full border p-2 rounded mt-2"
                    placeholder="Descripción del procedimiento..."
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                />

                <button
  onClick={guardar}
  className="bg-[#345A35] text-white px-4 py-2 rounded w-full mt-3 cursor-pointer font-semibold transition hover:bg-[#2a4a2b] hover:scale-[1.02]"
>
  Guardar
</button>


                <h3 className="text-lg font-semibold mt-5 mb-2">Historial</h3>

                <ul className="max-h-40 overflow-y-autop-2 text-sm space-y-2">
                    {procedimientos.map((p) => (
                        <li
                            key={p.id_procedimiento_veterinario}
                            className="flex justify-between items-center bg-[#f8f8f8] p-2 rounded border"
                        >
                            <span>
                                <strong>{new Date(p.fecha).toLocaleDateString("es-ES")}:</strong> {p.tipo}
                            </span>

                            <button
                                onClick={() => eliminarProcedimiento(p.id_procedimiento_veterinario)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition flex items-center justify-center cursor-pointer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>


                <button
                    onClick={onClose}
                    className="mt-5 bg-[#A1C084] text-white px-4 py-2 rounded w-full cursor-pointer font-semibold transition hover:bg-[#8db06f] hover:scale-[1.02]"
                >
                    Cerrar
                </button>

            </div>
        </div>
    );
}
