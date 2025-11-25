import { User } from "lucide-react"

export default function FormularioCliente({ cliente, setCliente }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-8 mb-8 border border-gray-100 max-w-7xl mx-auto mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User size={24} className="text-[#345A35]" /> Datos del Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nombre */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Nombre</label>
          <input
            type="text"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Apellido</label>
          <input
            type="text"
            value={cliente.apellido}
            onChange={(e) => setCliente({ ...cliente, apellido: e.target.value })}
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
          />
        </div>

        {/* DNI */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">DNI</label>
          <input
            type="text"
            inputMode="numeric"
            value={cliente.dni}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              if (value.length <= 9) {
                setCliente({ ...cliente, dni: value })
              }
            }}
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Dirección</label>
          <input
            type="text"
            value={cliente.direccion}
            onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
            className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
          />
        </div>

      </div>
    </div>
  )
}
