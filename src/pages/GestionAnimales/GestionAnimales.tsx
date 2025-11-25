/* Testeados */
/* Crear animales*/
/* Editar animales*/
/* Borrar animales*/
/* Crear procedimientos*/
/* Borrar procedimientos*/



import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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

    const cargarAnimales = async () => {
        try {
            const res = await axios.get("http://localhost:3001/api/animales");
            setAnimales(res.data);
            setModoBusqueda(false);
            setAnimalEditando(null);
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
    }, []);

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

                <div className="flex items-center gap-2 mb-6">
                    <input
                        type="number"
                        value={busquedaId}
                        onChange={(e) => setBusquedaId(e.target.value)}
                        placeholder="Buscar por caravana"
                        className="border p-2 rounded bg-white"
                    />

                    <button
                        onClick={buscarAnimal}
                        className="bg-[#345A35] text-white px-4 py-2 rounded cursor-pointer transition hover:bg-[#2a4a2b] hover:scale-[1.05]"
                    >
                        Buscar
                    </button>


                    {modoBusqueda && (
                        <button onClick={cargarAnimales} className="pl-3 underline text-[#345A35] cursor-pointer hover:color-[#2a4a2b] hover:scale-[1.05]">
                            Ver todos
                        </button>
                    )}
                </div>

                <TablaAnimales
                    animales={animales}
                    onEditar={setAnimalEditando}
                    onEliminar={eliminarAnimal}
                    onVerProcedimientos={setAnimalProcedimiento}
                />

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
