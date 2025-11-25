
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { SquarePen } from "lucide-react";

export default function FormularioAnimal(props: any) {
  const { animalEditando, onAnimalGuardado } = props;
  const [formData, setFormData] = useState(
    animalEditando || {
      sexo: "",
      peso: "",
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

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else if (name === "fecha_nacimiento") {
      setFormData({ ...formData, fecha_nacimiento: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.sexo || !formData.peso || !formData.estado) {
      return Swal.fire("Campos incompletos", "Faltan datos", "warning");
    }

    try {
      if (animalEditando) {
        await axios.put(
          `http://localhost:3001/api/animales/${animalEditando.id_animal}`,
          formData
        );
        Swal.fire("Actualizado", "Animal actualizado", "success");
      } else {
        await axios.post("http://localhost:3001/api/animales", formData);
        Swal.fire("Registrado", "Animal registrado", "success");
      }

      onAnimalGuardado();
      setFormData({
        sexo: "",
        peso: "",
        estado: "",
        fecha_nacimiento: new Date(),
        vacunado: false,
      });
    } catch {
      Swal.fire("Error", "Error al guardar", "error");
    }
  };

  const formatDateInput = (date: any) => {
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
        {/* SEXO */}
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

        {/* PESO */}
        <div className="flex flex-col">
          <label className="font-semibold text-[#345A35] mb-1">Peso (kg)</label>
          <input
            name="peso"
            type="number"
            value={formData.peso}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* ESTADO */}
        <div className="flex flex-col cursor-pointer">
          <label className="font-semibold text-[#345A35] mb-1">Estado</label>
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

        {/* FECHA */}
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

        {/* VACUNADO */}
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

      {/* BOTÓN */}
      <button
  type="submit"
  className="mt-4 bg-[#345A35] text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer transition hover:bg-[#2a4a2b] hover:scale-[1.02]"
>
  {animalEditando ? <><SquarePen size={18}/> Actualizar</> : "Guardar"}
</button>

    </form>
  );
}
