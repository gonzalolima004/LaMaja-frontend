import { useState, useMemo } from "react"
import dayjs from "dayjs"
import { Calendar, DollarSign, Search } from "lucide-react"

export default function ListaAnimales({
  animales,
  precioPorKg,
  setPrecioPorKg,
  presupuesto,
  agregarAnimal
}: any) {

  const [busqueda, setBusqueda] = useState("")

  const animalesFiltrados = useMemo(() => {
    const q = busqueda.trim()
    return q ? animales.filter((a: any) => a.id_animal.toString().includes(q)) : animales
  }, [busqueda, animales])

  return (
    <div className="lg:col-span-2 ml-15 mr-15">

      <h2 className="text-2xl font-bold mb-6 p-3 bg-[#345A35] rounded-t-2xl text-white text-center">
        Animales Disponibles
      </h2>

      {/* PRECIO + BUSCADOR */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PRECIO POR KG */}
          <div>
            <label className="block mb-3 font-bold text-gray-800 text-lg flex items-center gap-2">
              <DollarSign size={24} className="text-[#A1C084]" /> Precio por KG
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>

              <input
                type="number"
                value={precioPorKg}
                onChange={(e) => setPrecioPorKg(e.target.value)}
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl pl-8 pr-4 py-3 w-full font-semibold text-lg"
              />
            </div>
          </div>

          {/* BUSCADOR */}
          <div>
            <label className="block mb-3 font-bold text-gray-800 text-lg flex items-center gap-2">
              <Search size={22} className="text-gray-600" /> Buscar por caravana
            </label>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Ej: 10"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border-2 border-gray-200 focus:border-[#345A35] focus:ring-2 
                focus:ring-[#345A35]/30 rounded-xl pl-10 pr-4 py-3 w-full outline-none"
              />
            </div>
          </div>

        </div>
      </div>

      {/* LISTA DE ANIMALES */}
      <div className="grid md:grid-cols-2 gap-6">
        {animalesFiltrados.length === 0 ? (
          <p className="text-gray-500 italic col-span-full text-center">
            No se encontraron animales con esa caravana.
          </p>
        ) : (
          animalesFiltrados.map((animal: any) => {
            const seleccionado = presupuesto.animalesSeleccionados.some(
              (a: any) => a.id_animal === animal.id_animal
            )

            return (
              <div
                key={animal.id_animal}
                className={`group relative bg-white rounded-xl p-5 transition-all duration-300 ${
                  seleccionado
                    ? "ring-2 ring-[#A1C084] shadow-lg shadow-[#A1C084]/20"
                    : "shadow-md hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div className="flex justify-between mb-3">
                  <div className="bg-[#345A35] text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                    Caravana: {animal.id_animal}
                  </div>

                  <div className="bg-amber-50 text-amber-700 font-semibold px-3 py-1.5 rounded-lg">
                    Peso: {animal.peso}kg
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar size={16} className="text-gray-400" />
                  Fecha nac. {dayjs(animal.fecha_nacimiento).format("DD/MM/YYYY")}
                </div>

                {!seleccionado ? (
                  <button
                    onClick={() => agregarAnimal(animal)}
                    className="w-full bg-[#345A35] hover:bg-[#2a4a2b] text-white font-semibold py-2.5 rounded-lg flex justify-center gap-2 transition-all cursor-pointer"
                  >
                    Agregar
                  </button>
                ) : (
                  <div className="w-full bg-[#A1C084] text-white font-semibold py-2.5 rounded-lg text-center">
                    ✓ Agregado
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
