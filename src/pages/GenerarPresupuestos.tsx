"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Plus, X, Calendar, DollarSign, User } from "lucide-react"
import api from "../services/api"
import dayjs from "dayjs"
import Header from "../components/Header"

export default function AnimalBudgetSelector() {
  const [animales, setAnimales] = useState<any[]>([])
  const [precioPorKg, setPrecioPorKg] = useState("")
  const [presupuesto, setPresupuesto] = useState({ animalesSeleccionados: [] as any[], importe_total: 0 })
  const [cliente, setCliente] = useState({ nombre: "", apellido: "", dni: "", direccion: "" })

  useEffect(() => {
    api.get("/animales")
      .then(res => setAnimales(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los animales", "error"))
  }, [])

  const showAlert = (title: string, text: string, icon: "success" | "error" | "warning" | "info") => {
    Swal.fire({ title, text, icon, confirmButtonColor: "#345A35" })
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3EBD8] p-6 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#345A35] to-[#2a4a2b] bg-clip-text text-transparent mb-8">
          Generar Presupuestos
        </h1>

        {/* Datos Cliente */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User size={24} className="text-[#345A35]" /> Datos del Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm capitalize">nombre</label>
              <input
                type="text"
                value={cliente.nombre}
                onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm capitalize">apellido</label>
              <input
                type="text"
                value={cliente.apellido}
                onChange={e => setCliente({ ...cliente, apellido: e.target.value })}
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
              />
            </div>

            {/* DNI - limitado a 9 dígitos */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm capitalize">dni</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={cliente.dni}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, "") // Elimina caracteres no numéricos
                  if (value.length <= 9) {
                    setCliente({ ...cliente, dni: value })
                  }
                }}
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm capitalize">direccion</label>
              <input
                type="text"
                value={cliente.direccion}
                onChange={e => setCliente({ ...cliente, direccion: e.target.value })}
                className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl px-4 py-3 w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Precio por KG */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
          <label className="block mb-3 font-bold text-gray-800 text-lg flex items-center gap-2">
            <DollarSign size={24} className="text-[#A1C084]" /> Precio por KG
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              type="number"
              value={precioPorKg}
              onChange={e => setPrecioPorKg(e.target.value)}
              className="border-2 border-gray-200 focus:border-[#A1C084] focus:ring-2 focus:ring-[#A1C084]/30 rounded-xl pl-8 pr-4 py-3 w-full font-semibold text-lg"
            />
          </div>
        </div>

        {/* Resto del componente igual */}
        {/* Lista de Animales + Presupuesto */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 p-3 bg-[#345A35] rounded-t-2xl text-white text-center">Animales Disponibles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {animales.map(animal => {
                const seleccionado = presupuesto.animalesSeleccionados.some(a => a.id_animal === animal.id_animal)
                return (
                  <div
                    key={animal.id_animal}
                    className={`group relative bg-white rounded-xl p-5 transition-all duration-300 ${
                      seleccionado ? "ring-2 ring-[#A1C084] shadow-lg shadow-[#A1C084]/20" : "shadow-md hover:shadow-xl hover:-translate-y-1"
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
                      {dayjs(animal.fecha_nacimiento).format("DD/MM/YYYY")}
                    </div>
                    {!seleccionado ? (
                      <button
                        onClick={() => {
                          const precio = parseFloat(precioPorKg)
                          if (!precio || precio <= 0) return showAlert("Atención", "Ingrese un valor válido por kg", "warning")
                          const detalle = { ...animal, precio: precio * animal.peso }
                          setPresupuesto(prev => ({
                            animalesSeleccionados: [...prev.animalesSeleccionados, detalle],
                            importe_total: prev.importe_total + detalle.precio
                          }))
                        }}
                        className="w-full bg-[#345A35] hover:bg-[#2a4a2b] text-white font-semibold py-2.5 rounded-lg flex justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Plus size={18} /> Agregar
                      </button>
                    ) : (
                      <div className="w-full bg-[#A1C084] text-white font-semibold py-2.5 rounded-lg text-center">
                        ✓ Agregado
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Presupuesto */}
          <div className="lg:sticky lg:top-8 h-fit">
            <h2 className="text-3xl font-bold rounded-t-2xl p-3 bg-[#345A35] text-white text-center">Presupuesto</h2>
            <div className="bg-white shadow-xl">
              <div className="bg-[#345A35] p-6 text-white">
                <h3 className="font-bold text-lg mb-1">Resumen</h3>
                <p className="text-white/80 text-sm">
                  {presupuesto.animalesSeleccionados.length}{" "}
                  {presupuesto.animalesSeleccionados.length === 1 ? "animal seleccionado" : "animales seleccionados"}
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
                      {presupuesto.animalesSeleccionados.map(detalle => (
                        <div
                          key={detalle.id_animal}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-3 hover:shadow-md"
                        >
                          <div>
                            <div className="font-semibold text-gray-800">Animal #{detalle.id_animal}</div>
                            <div className="text-sm text-gray-600">{detalle.peso} kg</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold">${detalle.precio.toLocaleString("es-AR")}</span>
                            <button
                              onClick={() => {
                                const animal = presupuesto.animalesSeleccionados.find(a => a.id_animal === detalle.id_animal)
                                if (!animal) return
                                setPresupuesto(prev => ({
                                  animalesSeleccionados: prev.animalesSeleccionados.filter(a => a.id_animal !== detalle.id_animal),
                                  importe_total: prev.importe_total - animal.precio
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-gray-200 pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600 font-semibold text-lg">Total:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#A1C084] to-[#8fb070] bg-clip-text text-transparent">
                          ${presupuesto.importe_total.toLocaleString("es-AR")}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          if (!cliente.nombre || !cliente.apellido || !cliente.dni || !cliente.direccion)
                            return showAlert("Atención", "Complete los datos del cliente", "warning")
                          if (presupuesto.animalesSeleccionados.length === 0)
                            return showAlert("Atención", "Seleccione al menos un animal", "warning")
                          try {
                            const body = {
                              importe_total: presupuesto.importe_total,
                              fecha: new Date().toISOString(),
                              cliente,
                              detalles: presupuesto.animalesSeleccionados.map(a => ({
                                id_animal: a.id_animal,
                                precio: a.precio
                              })),
                            }
                            await api.post("/presupuestos", body)
                            showAlert("Éxito", "Presupuesto guardado con éxito", "success")
                            setCliente({ nombre: "", apellido: "", dni: "", direccion: "" })
                            setPresupuesto({ animalesSeleccionados: [], importe_total: 0 })
                            setPrecioPorKg("")
                          } catch (err) {
                            console.error(err)
                            showAlert("Error", "Error al guardar presupuesto", "error")
                          }
                        }}
                        className="w-full bg-gradient-to-r from-[#345A35] to-[#274427] text-white font-bold py-4 rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Guardar Presupuesto
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
