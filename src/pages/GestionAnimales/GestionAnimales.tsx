/* Testeados */
/* Crear animales*/
/* Editar animales*/
/* Borrar animales*/
/* Crear procedimientos*/
/* Borrar procedimientos*/



import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../../components/Header";
import FormularioAnimal from "./FormularioAnimal";
import TablaAnimales from "./TablaAnimales";
import ProcedimientosModal from "./ProcedimientosModal";

export default function GestionAnimales() {
    const [animales, setAnimales] = useState<any[]>([]);
    const [animalEditando, setAnimalEditando] = useState(null);
    const [busquedaId, setBusquedaId] = useState("");
    const [modoBusqueda, setModoBusqueda] = useState(false);
    const [animalProcedimiento, setAnimalProcedimiento] = useState(null);
    const [orden, setOrden] = useState("none");
    const [paginaActual, setPaginaActual] = useState(1);
    const animalesPorPagina = 10;


    const cargarAnimales = async () => {
        try {
            const res = await axios.get("http://localhost:3001/api/animales");
            setAnimales(res.data);
            setModoBusqueda(false);
            setAnimalEditando(null);
            setPaginaActual(1);
        } catch {
            Swal.fire("Error", "Error al cargar animales.", "error");
        }
    };

    const eliminarAnimal = async (id: number) => {
        Swal.fire({
            title: "¿Eliminar?",
            text: "Esta acción es irreversible",
            icon: "warning",
            showCancelButton: true,
        }).then(async (r) => {
            if (r.isConfirmed) {
                await axios.delete(`http://localhost:3001/api/animales/${id}`);
                cargarAnimales();
            }
        });
    };

    const buscarAnimal = async () => {
        if (!busquedaId) return;

        const id = Number(busquedaId);

        try {
            const res = await axios.get(`http://localhost:3001/api/animales/${id}`);
            if (res.data?.animal) {
                setAnimales([res.data.animal]);
                setModoBusqueda(true);
            } else {
                Swal.fire("No encontrado", "No existe ese animal.", "info");
            }

        } catch {
            Swal.fire("Error", "No encontrado.", "error");
        }
    };

    useEffect(() => {
        cargarAnimales();
}, [busquedaId, orden]);


    const animalesOrdenados = [...animales].sort((a, b) => {
        switch (orden) {
            case "peso_mayor":
                return b.peso - a.peso;
            case "peso_menor":
                return a.peso - b.peso;
            case "fecha_mayor":
                return new Date(b.fecha_nacimiento).getTime() - new Date(a.fecha_nacimiento).getTime();
            case "fecha_menor":
                return new Date(a.fecha_nacimiento).getTime() - new Date(b.fecha_nacimiento).getTime();
            default:
                return 0;
        }
    });

    const animalesFiltrados = animalesOrdenados;

    const indexUltimo = paginaActual * animalesPorPagina;
    const indexPrimero = indexUltimo - animalesPorPagina;
    const animalesPaginados = animalesFiltrados.slice(indexPrimero, indexUltimo);

    const totalPaginas = Math.ceil(animalesFiltrados.length / animalesPorPagina);




    return (
        <div className="min-h-screen bg-[#F3EBD8]">
            <Header />

            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#345A35] mb-6">
                    Gestión de Animales
                </h1>

                <FormularioAnimal
                    animalEditando={animalEditando}
                    onAnimalGuardado={cargarAnimales}
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">

                    {/* INPUT + BOTÓN BUSCAR */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="number"
                            value={busquedaId}
                            onChange={(e) => setBusquedaId(e.target.value)}
                            placeholder="Buscar por caravana"
                            className="border p-2 rounded bg-white w-full sm:w-auto"
                        />

                        <button
                            onClick={buscarAnimal}
                            className="bg-[#345A35] text-white px-4 py-2 rounded cursor-pointer transition hover:bg-[#2a4a2b] hover:scale-[1.05]"
                        >
                            Buscar
                        </button>

                        {modoBusqueda && (
                            <button
                                onClick={cargarAnimales}
                                className="underline text-[#345A35] cursor-pointer hover:text-[#2a4a2b]"
                            >
                                Ver todos
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mt-2 sm:mt-0 md:ml-auto">
                        <label className="font-semibold text-[#345A35]">Ordenar por:</label>

                        <select
                            value={orden}
                            onChange={(e) => setOrden(e.target.value)}
                            className="border p-2 rounded bg-white cursor-pointer w-full sm:w-auto"
                        >
                            <option value="none">Sin orden</option>
                            <option value="peso_mayor">Peso (mayor a menor)</option>
                            <option value="peso_menor">Peso (menor a mayor)</option>
                            <option value="fecha_mayor">Fecha nacimiento (más reciente)</option>
                            <option value="fecha_menor">Fecha nacimiento (más antigua)</option>
                        </select>
                    </div>

                </div>




                <TablaAnimales
                    animales={animalesPaginados}
                    onEditar={setAnimalEditando}
                    onEliminar={eliminarAnimal}
                    onVerProcedimientos={setAnimalProcedimiento}
                />

                <div className="flex justify-center items-center gap-3 py-4">
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


                {animalProcedimiento && (
                    <ProcedimientosModal
                        animal={animalProcedimiento}
                        onClose={() => setAnimalProcedimiento(null)}
                    />
                )}
            </div>
        </div>
    );
}
