import { LogOut, ArrowLeft, BookText, UserRoundPlus } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
  const rol = usuario.id_rol

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    navigate("/")
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const goBack = () => {
    navigate(-1)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const goGenerarPresupuestos = () => {
    navigate("/generar-presupuestos")
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goGenerarFacturas = () => {
    navigate('/generar-facturas');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goRegistro = () => {
    navigate('/registrar');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <header className="bg-gradient-to-r from-[#F3EBD8] to-[#FBF6ED] border-b border-[#345A35] w-full shadow-md z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
          {location.pathname !== "/home" && (
            <button
              onClick={goBack}
              className="flex-shrink-0 cursor-pointer p-2.5 sm:p-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#2a4620] hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="w-14 h-10 sm:w-16 sm:h-12 md:w-20 md:h-14 flex items-center flex-shrink-0">
            <img src="/logo-sin-letras.png" alt="Logo La Maja" className="w-full h-auto object-contain" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#345A35] m-0 tracking-wide whitespace-nowrap">
            LA MAJA
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* REGISTRAR USUARIO - SOLO PARA rol === 1 */}
          {rol === 1 && location.pathname !== "/registrar" && (
            <button
              onClick={goRegistro}
              className="cursor-pointer flex items-center gap-2 sm:gap-2.5 flex-shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#2a4620] hover:shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base font-medium"
            >
              <UserRoundPlus className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline font-medium text-sm">Registrar usuario</span>
            </button>
          )}

          <button
            onClick={logout}
            className="cursor-pointer flex items-center gap-2 sm:gap-2.5 flex-shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#2a4620] hover:shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline font-medium text-sm">Cerrar Sesión</span>
          </button>

        </div>

      </div>

      {location.pathname === "/historial-presupuestos" && (
        <button
          onClick={goGenerarPresupuestos}
          className="cursor-pointer fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#345A35] text-white shadow-xl hover:shadow-2xl hover:scale-105 hover:from-[#345A35] hover:to-[#2a4620] transition-all duration-300 font-medium text-sm z-50"
        >
          <BookText className="w-5 h-5 flex-shrink-0" />
          <span className="hidden sm:inline">Generar Presupuestos</span>
        </button>
      )}

      {/* Botón flotante de facturas */}
      {location.pathname === '/historial-facturas' && (
        <button
          onClick={goGenerarFacturas}
          className="cursor-pointer fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-[#A1C084] text-[#345A35] shadow-lg hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors text-sm"
        >
          <BookText className="w-5 h-5 text-white" />
          <span className="hidden sm:inline font-medium text-sm text-white">Generar Facturas</span>
        </button>
      )}
    </header>
  )
}


