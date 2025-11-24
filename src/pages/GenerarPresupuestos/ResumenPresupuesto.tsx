import { X, DollarSign } from "lucide-react"
import { useState } from "react"

export default function ResumenPresupuesto({
  presupuesto,
  setPresupuesto,
  onGuardar
}: any) {

  const [loading, setLoading] = useState(false);

  const GenerarPresupuestoClick = async () => {
    setLoading(true)
    await onGuardar()
    setLoading(false)
  }


  const eliminarAnimal = (detalle: any) => {
    const animal = presupuesto.animalesSeleccionados.find(
      (a: any) => a.id_animal === detalle.id_animal
    )
    if (!animal) return

    setPresupuesto((prev: any) => ({
      animalesSeleccionados: prev.animalesSeleccionados.filter(
        (a: any) => a.id_animal !== detalle.id_animal
      ),
      importe_total: prev.importe_total - animal.precio
    }))
  }

  return (
    <div className="lg:sticky lg:top-8 h-fit mr-15">

      <h2 className="text-2xl font-bold rounded-t-2xl p-3 bg-[#345A35] text-white text-center">
        Resumen del presupuesto
      </h2>

      <div className="bg-white shadow-xl">
        <div className="bg-[#345A35] p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Resumen</h3>
          <p className="text-white/80 text-sm">
            {presupuesto.animalesSeleccionados.length}{" "}
            {presupuesto.animalesSeleccionados.length === 1
              ? "animal seleccionado"
              : "animales seleccionados"}
          </p>
        </div>

        <div className="p-6">

          {presupuesto.animalesSeleccionados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <DollarSign size={48} className="text-gray-300" />
              </div>
              <span className="font-medium">No hay animales seleccionados</span>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto mb-6 pr-2">
                {presupuesto.animalesSeleccionados.map((detalle: any) => (
                  <div
                    key={detalle.id_animal}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-3 hover:shadow-md"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        Animal #{detalle.id_animal}
                      </div>
                      <div className="text-sm text-gray-600">{detalle.peso} kg</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">
                        ${detalle.precio.toLocaleString("es-AR")}
                      </span>

                      <button
                        onClick={() => eliminarAnimal(detalle)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <button
                  onClick={GenerarPresupuestoClick}
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-[#345A35] to-[#274427] text-white font-bold py-4 rounded-xl 
  ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
                >
                  {loading ? "Generando presupuesto..." : "Generar Presupuesto"}
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
