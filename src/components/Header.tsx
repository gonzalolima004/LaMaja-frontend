import { LogOut, ArrowLeft, UserRoundPlus, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol = usuario.id_rol;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    navigate(-1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goRegistro = () => {
    navigate("/registrar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="bg-gradient-to-r from-[#F3EBD8] to-[#FBF6ED] border-b border-[#345A35] w-full shadow-md z-30 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

          {/* IZQUIERDA */}
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

          {/* BOTONES EN DESKTOP */}
          <div className="hidden sm:flex items-center gap-3">
            {rol === 1 && location.pathname !== "/registrar" && (
              <button
                onClick={goRegistro}
                className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#2a4620] hover:shadow-lg transition-all duration-200 active:scale-95 text-base font-medium"
              >
                <UserRoundPlus className="w-5 h-5" />
                Registrar usuario
              </button>
            )}

            <button
              onClick={logout}
              className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#2a4620] hover:shadow-lg transition-all duration-200 active:scale-95 text-base font-medium"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>

          {/* MENU HAMBURGUESA SOLO MOBILE */}
          <button
            className="sm:hidden p-2 bg-[#345A35] rounded-lg text-[#F3EBD8]"
            onClick={() => setOpenMenu(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ===== OVERLAY ===== */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-20 sm:hidden"
          onClick={() => setOpenMenu(false)}
        />
      )}

      {/* ===== MENU SLIDE ===== */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#F3EBD8] shadow-xl transform z-30 sm:hidden p-5 transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cerrar */}
        <button
          className="mb-6 p-2 bg-[#345A35] text-[#F3EBD8] rounded-lg"
          onClick={() => setOpenMenu(false)}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Opciones */}
        <div className="flex flex-col gap-4">
          {rol === 1 && location.pathname !== "/registrar" && (
            <button
              onClick={() => {
                goRegistro();
                setOpenMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-[#345A35] text-[#F3EBD8] rounded-lg text-base font-medium"
            >
              <UserRoundPlus className="w-5 h-5" />
              Registrar usuario
            </button>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-3 bg-[#345A35] text-[#F3EBD8] rounded-lg text-base font-medium"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}
