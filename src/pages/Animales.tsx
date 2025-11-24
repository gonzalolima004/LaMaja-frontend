import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, SquarePen, ClipboardList } from "lucide-react";
import Header from "../components/Header";
import Swal from "sweetalert2";

// Tipos
interface Animal {
  id_animal?: number;
  sexo: string;
  peso: number;
  estado: string;
  fecha_nacimiento: Date;
  vacunado: boolean;
}

interface Procedimiento {
  id_procedimiento_veterinario?: number;
  tipo: string;
  fecha: string;
  id_animal: number;
}

// FORMULARIO ANIMAL
function AnimalForm({
  animalEditando,
  onAnimalGuardado,
}: {
  animalEditando: Animal | null;
  onAnimalGuardado: () => void;
}) {
  const [formData, setFormData] = useState<Animal>(
    animalEditando || {
      sexo: "",
      peso: NaN,
      estado: "",
      fecha_nacimiento: new Date(),
      vacunado: false,
    }
  );

  useEffect(() => {
    if (animalEditando) {
      setFormData({
        ...animalEditando,
        peso: Number(animalEditando.peso),
        fecha_nacimiento: new Date(animalEditando.fecha_nacimiento),
      });
    }
  }, [animalEditando]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else if (name === "fecha_nacimiento") {
      setFormData({ ...formData, [name]: new Date(value) });
    } else if (name === "peso") {
      setFormData({ ...formData, [name]: value === "" ? NaN : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (
      !formData.sexo ||
      isNaN(formData.peso) ||
      !formData.estado ||
      !formData.fecha_nacimiento
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos antes de guardar.",
      });
      return;
    }

    try {
      if (animalEditando) {
        await axios.put(
          `http://localhost:3001/api/animales/${animalEditando.id_animal}`,
          formData
        );
        Swal.fire({
          icon: "success",
          title: "Animal actualizado",
          text: "Los datos del animal fueron actualizados correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post("http://localhost:3001/api/animales", formData);
        Swal.fire({
          icon: "success",
          title: "Animal registrado",
          text: "El animal se registró correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      onAnimalGuardado();
      setFormData({
        sexo: "",
        peso: NaN,
        estado: "",
        fecha_nacimiento: new Date(),
        vacunado: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el animal.",
      });
    }
  };

  const formatDateInput = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-[#A1C084]"
    >
      <h2 className="text-xl font-semibold text-[#345A35] mb-4">
        {animalEditando ? "Editar Animal" : "Registrar Animal"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col cursor-pointer">
          <label className="font-semibold text-[#345A35] mb-1">Sexo</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="p-2 border rounded cursor-pointer"
          >
            <option value="" disabled>Seleccionar sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-[#345A35] mb-1">Peso (kg)</label>
          <input
            name="peso"
            type="number"
            placeholder="Ingrese el peso"
            value={isNaN(formData.peso) ? "" : formData.peso}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col cursor-pointer">
          <label className="font-semibold text-[#345A35] mb-1">
            Estado de salud
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="p-2 border rounded cursor-pointer"
          >
            <option value="" disabled>Seleccionar estado</option>
            <option value="Sano">Sano</option>
            <option value="Enfermo">Enfermo</option>
            <option value="En revisión">En revisión</option>
          </select>
        </div>

        <div className="flex flex-col cursor-pointer">
          <label className="font-semibold text-[#345A35] mb-1">
            Fecha de nacimiento
          </label>
          <input
            name="fecha_nacimiento"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={formatDateInput(formData.fecha_nacimiento)}
            onChange={handleChange}
            className="p-2 border rounded cursor-pointer"
          />
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            name="vacunado"
            type="checkbox"
            checked={formData.vacunado}
            onChange={handleChange}
          />
          <span className="font-semibold text-[#345A35]">Vacunado</span>
        </label>

      </div>

      <button
        type="submit"
        className="mt-4 bg-[#345A35] text-white px-6 py-2 rounded hover:bg-[#2a4a2b] flex items-center gap-2 cursor-pointer"
      >
        {animalEditando ? (
          <>
            <SquarePen size={18} /> Actualizar
          </>
        ) : (
          <>Guardar</>
        )}
      </button>
    </form>
  );
}

// MODAL PROCEDIMIENTOS
function ProcedimientoModal({
  animal,
  onClose,
}: {
  animal: Animal;
  onClose: () => void;
}) {
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([]);

  const cargarProcedimientos = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/procedimientos`);
      const filtrar = res.data.filter(
        (p: Procedimiento) => p.id_animal === animal.id_animal
      );
      setProcedimientos(filtrar);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuardar = async () => {
    if (!tipo || !fecha) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debe completar todos los campos antes de guardar el procedimiento.",
      });
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/procedimientos", {
        tipo,
        fecha,
        id_animal: animal.id_animal!,
      });
      setTipo("");
      setFecha("");
      cargarProcedimientos();
      Swal.fire({
        icon: "success",
        title: "Procedimiento guardado",
        text: "El procedimiento se registró correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el procedimiento.",
      });
    }
  };

  useEffect(() => {
    cargarProcedimientos();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F3EBD8]/90 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg border border-[#A1C084]">
        <h2 className="text-2xl font-semibold text-[#345A35] mb-4">
          Procedimientos de {animal.sexo} #{animal.id_animal}
        </h2>

        <div className="space-y-3">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Describa el procedimiento realizado"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleGuardar}
            className="bg-[#345A35] text-white px-4 py-2 rounded hover:bg-[#2a4a2b] w-full"
          >
            Guardar Procedimiento
          </button>
        </div>

        <h3 className="text-lg font-semibold mt-5 mb-2 text-[#345A35]">
          Historial
        </h3>

        <ul className="max-h-40 overflow-y-auto border rounded p-2 text-sm">
          {procedimientos.map((p) => (
            <li key={p.id_procedimiento_veterinario} className="mb-1">
              <strong>{new Date(p.fecha).toLocaleDateString("es-ES")}:</strong>{" "}
              {p.tipo}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-5 bg-[#A1C084] text-[#345A35] px-4 py-2 rounded hover:bg-[#8db06f] w-full font-semibold transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// TABLA DE ANIMALES (CON TOOLTIP)
function AnimalTable({
  animales,
  onEliminar,
  onEditar,
  onVerProcedimientos,
}: {
  animales: Animal[];
  onEliminar: (id: number) => void;
  onEditar: (animal: Animal) => void;
  onVerProcedimientos: (animal: Animal) => void;
}) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Sano":
        return "text-green-600";
      case "Enfermo":
        return "text-red-600";
      case "En revisión":
        return "text-yellow-600";
      default:
        return "text-gray-800";
    }
  };

  return (
    <table className="w-full border border-[#A1C084] rounded-lg shadow-md">
      <thead className="bg-[#345A35] text-white">
        <tr>
          <th className="p-2">Caravana</th>
          <th className="p-2">Sexo</th>
          <th className="p-2">Peso</th>
          <th className="p-2">Estado</th>
          <th className="p-2">Fecha Nac.</th>
          <th className="p-2">Vacunado</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>

      <tbody className="bg-white">
        {animales.map((animal) => (
          <tr key={animal.id_animal} className="border-t">
            <td className="p-2 text-center">{animal.id_animal}</td>
            <td className="p-2 text-center">{animal.sexo}</td>
            <td className="p-2 text-center">{animal.peso}</td>

            <td
              className={`p-2 text-center font-semibold ${getEstadoColor(
                animal.estado
              )}`}
            >
              {animal.estado}
            </td>

            <td className="p-2 text-center">
              {new Date(animal.fecha_nacimiento).toLocaleDateString("es-ES")}
            </td>

            <td className="p-2 text-center">
              {animal.vacunado ? "Sí" : "No"}
            </td>

            <td className="p-2 flex justify-center gap-3">

              {/* EDITAR */}
              <div className="relative group">
                <button
                  onClick={() => onEditar(animal)}
                  className="bg-[#A1C084] text-[#345A35] px-3 py-1 rounded hover:bg-[#8db06f]"
                >
                  <SquarePen size={18} />
                </button>

                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                  opacity-0 group-hover:opacity-100 transition pointer-events-none
                  bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Editar
                </span>
              </div>

              {/* ELIMINAR */}
              <div className="relative group">
                <button
                  onClick={() => onEliminar(animal.id_animal!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <Trash2 size={18} />
                </button>

                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                  opacity-0 group-hover:opacity-100 transition pointer-events-none
                  bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Eliminar
                </span>
              </div>

              {/* PROCEDIMIENTOS */}
              <div className="relative group">
                <button
                  onClick={() => onVerProcedimientos(animal)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  <ClipboardList size={18} />
                </button>

                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                  opacity-0 group-hover:opacity-100 transition pointer-events-none
                  bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Procedimientos
                </span>
              </div>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// PÁGINA PRINCIPAL
export default function Animales() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [animalEditando, setAnimalEditando] = useState<Animal | null>(null);
  const [busquedaId, setBusquedaId] = useState<string>("");
  const [modoBusqueda, setModoBusqueda] = useState<boolean>(false);
  const [animalProcedimiento, setAnimalProcedimiento] = useState<Animal | null>(
    null
  );

  const cargarAnimales = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/animales");
      setAnimales(res.data);
      setAnimalEditando(null);
      setModoBusqueda(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al cargar los animales.",
      });
    }
  };

  const eliminarAnimal = async (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El animal se eliminará permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#345A35",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/api/animales/${id}`);
          cargarAnimales();
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El animal fue eliminado correctamente.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al eliminar el animal.",
          });
        }
      }
    });
  };

  const buscarAnimalPorId = async () => {
    if (!busquedaId) return;
    try {
      const res = await axios.get(
        `http://localhost:3001/api/animales/${busquedaId}`
      );
      if (res.data) {
        const animalEncontrado: Animal = {
          ...res.data,
          fecha_nacimiento: new Date(res.data.fecha_nacimiento),
        };
        setAnimales([animalEncontrado]);
        setModoBusqueda(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontró un animal con esa caravana.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró un animal con esa caravana.",
      });
    }
  };

  useEffect(() => {
    cargarAnimales();
  }, []);

  return (
    <div className="min-h-screen bg-[#F3EBD8]">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#345A35]">
          Gestión de Animales
        </h1>

        <AnimalForm
          animalEditando={animalEditando}
          onAnimalGuardado={cargarAnimales}
        />

        <div className="flex items-center gap-2 mb-6">
          <input
            type="number"
            placeholder="Buscar por caravana"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            className="cursor-pointer border p-2 rounded bg-white"
          />
          <button
            onClick={buscarAnimalPorId}
            className="bg-[#345A35] text-white px-4 py-2 rounded hover:bg-[#2a4a2b]"
          >
            Buscar
          </button>
          {modoBusqueda && (
            <button
              onClick={cargarAnimales}
              className="text-sm text-[#345A35] underline cursor-pointer"
            >
              Ver todos
            </button>
          )}
        </div>

        <AnimalTable
          animales={animales}
          onEliminar={eliminarAnimal}
          onEditar={setAnimalEditando}
          onVerProcedimientos={setAnimalProcedimiento}
        />

        {animalProcedimiento && (
          <ProcedimientoModal
            animal={animalProcedimiento}
            onClose={() => setAnimalProcedimiento(null)}
          />
        )}
      </div>
    </div>
  );
}
