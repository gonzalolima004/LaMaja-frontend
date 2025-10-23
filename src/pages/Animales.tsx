import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, SquarePen, ArrowLeftToLine, ClipboardList } from "lucide-react";
import Header from "../components/Header";

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

// BOTÓN VOLVER
function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="bg-[#345A35] text-white px-4 py-2 rounded hover:bg-[#2a4a2b] flex items-center gap-2 fixed top-24 left-6 z-40"
    >
      <ArrowLeftToLine size={18} />
    </button>
  );
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
    try {
      if (animalEditando) {
        await axios.put(
          `http://localhost:3001/api/animales/${animalEditando.id_animal}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3001/api/animales", formData);
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
      alert("Error al guardar el animal");
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
      className="bg-[#A1C084] p-6 rounded-2xl shadow-md mb-8"
    >
      <h2 className="text-xl font-semibold text-[#345A35] mb-4">
        {animalEditando ? "Editar Animal" : "Registrar Animal"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold text-[#345A35] mb-1">Sexo</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Seleccionar sexo</option>
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
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-[#345A35] mb-1">Estado de salud</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Seleccionar estado</option>
            <option value="Sano">Sano</option>
            <option value="Enfermo">Enfermo</option>
            <option value="En revisión">En revisión</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-[#345A35] mb-1">Fecha de nacimiento</label>
          <input
            name="fecha_nacimiento"
            type="date"
            value={formatDateInput(formData.fecha_nacimiento)}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            name="vacunado"
            type="checkbox"
            checked={formData.vacunado}
            onChange={handleChange}
          />
          <label className="font-semibold text-[#345A35]">Vacunado</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-[#345A35] text-white px-6 py-2 rounded hover:bg-[#2a4a2b] flex items-center gap-2"
      >
        {animalEditando ? <><SquarePen size={18} /> Actualizar</> : <>Guardar</>}
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
      const res = await axios.get(
        `http://localhost:3001/api/procedimientos`
      );
      const filtrar = res.data.filter(
        (p: Procedimiento) => p.id_animal === animal.id_animal
      );
      setProcedimientos(filtrar);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuardar = async () => {
    if (!tipo || !fecha) return alert("Debe completar todos los campos");
    try {
      await axios.post("http://localhost:3001/api/procedimientos", {
        tipo,
        fecha,
        id_animal: animal.id_animal!,
      });
      setTipo("");
      setFecha("");
      cargarProcedimientos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el procedimiento");
    }
  };

  useEffect(() => {
    cargarProcedimientos();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F3EBD8] bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg">
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
            className="bg-[#345A35] text-white px-4 py-2 rounded hover:bg-[#2a4a2b]"
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
          className="mt-4 text-sm underline text-[#345A35]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// TABLA DE ANIMALES
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
      case "Sano": return "text-green-600";
      case "Enfermo": return "text-red-600";
      case "En revisión": return "text-yellow-600";
      default: return "text-gray-800";
    }
  };

  return (
    <table className="w-full border border-[#A1C084] rounded-lg shadow-md">
      <thead className="bg-[#345A35] text-white">
        <tr>
          <th className="p-2">ID</th>
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
            <td className={`p-2 text-center font-semibold ${getEstadoColor(animal.estado)}`}>
              {animal.estado}
            </td>
            <td className="p-2 text-center">
              {new Date(animal.fecha_nacimiento).toLocaleDateString("es-ES")}
            </td>
            <td className="p-2 text-center">{animal.vacunado ? "Sí" : "No"}</td>
            <td className="p-2 flex justify-center gap-2">
              <button
                onClick={() => onEditar(animal)}
                className="bg-[#A1C084] text-[#345A35] px-3 py-1 rounded hover:bg-[#8db06f]"
              >
                <SquarePen size={16} />
              </button>
              <button
                onClick={() => onEliminar(animal.id_animal!)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => onVerProcedimientos(animal)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <ClipboardList size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// PÁGINA PRINCIPAL
export default function AnimalesPage() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [animalEditando, setAnimalEditando] = useState<Animal | null>(null);
  const [busquedaId, setBusquedaId] = useState<string>("");
  const [modoBusqueda, setModoBusqueda] = useState<boolean>(false);
  const [animalProcedimiento, setAnimalProcedimiento] = useState<Animal | null>(null);

  const cargarAnimales = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/animales");
      setAnimales(res.data);
      setAnimalEditando(null);
      setModoBusqueda(false);
    } catch (error) {
      console.error(error);
      alert("Error al cargar animales");
    }
  };

  const eliminarAnimal = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/animales/${id}`);
      cargarAnimales();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar animal");
    }
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
        alert("No se encontró un animal con ese ID");
      }
    } catch (error) {
      console.error(error);
      alert("No se encontró un animal con ese ID");
    }
  };

  useEffect(() => {
    cargarAnimales();
  }, []);

  return (
    <div className="min-h-screen bg-[#F3EBD8]">
      <Header />
      <div className="max-w-5xl mx-auto p-6 pt-32 relative">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6 text-[#345A35]">Gestión de Animales</h1>

        <AnimalForm
          animalEditando={animalEditando}
          onAnimalGuardado={cargarAnimales}
        />

        <div className="flex items-center gap-2 mb-6">
          <input
            type="number"
            placeholder="Buscar por ID"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            className="border p-2 rounded"
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
              className="text-sm text-[#345A35] underline"
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
