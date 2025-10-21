import { LogOut, ArrowLeft, BookText } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const goGenerarPresupuestos = () => {
    navigate('/presupuestos/generar');
  };
  const goGenerarFacturas = () => {
  navigate("/generar-factura");
};


  return (
    <header className="bg-[#F3EBD8] border-b-2 border-[#345A35] w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3 sm:p-4 md:px-6 md:py-2">
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {location.pathname !== '/home' && (
            <button
              onClick={goBack}
              className="cursor-pointer p-2 sm:p-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#A1C084] hover:text-[#345A35] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="w-12 h-10 sm:w-16 sm:h-12 md:w-20 md:h-16 flex items-center">
            <img
              src="/logo-sin-letras.png"
              alt="Logo La Maja"
              className="w-full h-auto"
            />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#345A35] m-0">
            LA MAJA
          </h1>
        </div>

        <button
          onClick={logout}
          className="cursor-pointer flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#A1C084] hover:text-[#345A35] transition-colors text-xs sm:text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden xs:inline md:inline font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Botón flotante de presupuestos */}
      {location.pathname === '/presupuestos' && (
        <button
          onClick={goGenerarPresupuestos}
          className="cursor-pointer fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-[#A1C084] text-[#345A35] shadow-lg hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors text-sm"
        >
          <BookText className="w-5 h-5 text-white" />
          <span className="hidden sm:inline font-medium text-sm text-white">Generar Presupuestos</span>
        </button>
      )}
       {/* Botón flotante de facturas */}
      {location.pathname === '/facturas' && (
        <button
          onClick={goGenerarFacturas}
          className="cursor-pointer fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-[#A1C084] text-[#345A35] shadow-lg hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors text-sm"
        >
          <BookText className="w-5 h-5 text-white" />
          <span className="hidden sm:inline font-medium text-sm text-white">Generar Facturas</span>
        </button>
      )}
    </header>
  );
};

export default Header;
