import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import api from "../../services/api"
import Header from "../../components/Header"
import FormularioCliente from "./FormularioCliente"
import ListaAnimales from "./ListaAnimales"
import ResumenPresupuesto from "./ResumenPresupuesto"
import { useNavigate } from "react-router-dom"

export default function GenerarPresupuestos() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario") || "{}")

    if (user.id_rol === 2) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tenés permisos para acceder a esta sección.",
        confirmButtonColor: "#345A35"
      })

      navigate("/home")  
    }
  }, [])

  const [animales, setAnimales] = useState<any[]>([])
  const [precioPorKg, setPrecioPorKg] = useState("")
  const [cliente, setCliente] = useState({ nombre: "", apellido: "", dni: "", direccion: "" })
  const [presupuesto, setPresupuesto] = useState({
    animalesSeleccionados: [] as any[],
    importe_total: 0
  })

  const showAlert = (title: string, text: string, icon: any) =>
    Swal.fire({ title, text, icon, confirmButtonColor: "#345A35" })

  useEffect(() => {
    api.get("/animales")
      .then(res => setAnimales(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los animales", "error"))
  }, [])

  const agregarAnimal = (animal: any) => {
    const precio = Number(precioPorKg)

    if (!precio || precio <= 0)
      return showAlert("Atención", "Ingrese un valor válido por kg", "warning")

    const detalle = { ...animal, precio: precio * animal.peso }

    setPresupuesto(prev => ({
      animalesSeleccionados: [...prev.animalesSeleccionados, detalle],
      importe_total: prev.importe_total + detalle.precio
    }))
  }

  const guardarPresupuesto = async () => {
    const { nombre, apellido, dni, direccion } = cliente

    if (!nombre || !apellido || !dni || !direccion)
      return showAlert("Atención", "Complete los datos del cliente", "warning")

    if (presupuesto.animalesSeleccionados.length === 0)
      return showAlert("Atención", "Seleccione al menos un animal", "warning")

    try {
      await api.post("/presupuestos", {
        importe_total: presupuesto.importe_total,
        fecha: new Date().toISOString(),
        cliente,
        detalles: presupuesto.animalesSeleccionados.map(a => ({
          id_animal: a.id_animal,
          precio: a.precio
        }))
      })

      showAlert("Éxito", "Presupuesto generado con éxito", "success")

      setCliente({ nombre: "", apellido: "", dni: "", direccion: "" })
      setPresupuesto({ animalesSeleccionados: [], importe_total: 0 })
      setPrecioPorKg("")

    } catch (err) {
      console.error(err)
      showAlert("Error", "Error al guardar presupuesto", "error")
    }
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#F3EBD8] p-6 md:p-8 max-w-8xl mx-auto">

        <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-[#345A35] to-[#2a4a2b] bg-clip-text text-transparent mb-5">
          Generar Presupuestos
        </h1>

        <FormularioCliente cliente={cliente} setCliente={setCliente} />

        <div className="grid lg:grid-cols-3 gap-8">
          <ListaAnimales
            animales={animales}
            precioPorKg={precioPorKg}
            setPrecioPorKg={setPrecioPorKg}
            presupuesto={presupuesto}
            agregarAnimal={agregarAnimal}
          />

          <ResumenPresupuesto
            presupuesto={presupuesto}
            setPresupuesto={setPresupuesto}
            onGuardar={guardarPresupuesto}
          />
        </div>
      </div>
    </>
  )
}
