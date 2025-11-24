import { FileText, PawPrint, ShoppingCart, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {

  // Obtener usuario del login
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isRestricted = usuario?.id_rol === 2;

  // Clases para botones deshabilitados
  const disabledClasses =
    "bg-gray-300 border-gray-400 text-gray-500 pointer-events-none cursor-not-allowed";
  const enabledClasses =
    "bg-[#A1C084] border-[#345A35] hover:bg-[#345A35] hover:text-[#F3EBD8]";

  return (
    <div className="min-h-screen bg-[#F3EBD8]">

      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto md:p-8">

        {/* PRESUPUESTOS */}
        <Link
          to={isRestricted ? "#" : "/admin/historial-presupuestos"}
          className={`
            flex flex-col items-center justify-center rounded-lg p-6 md:p-12
            min-h-[180px] md:min-h-[220px] border-2 transition-all group
            ${isRestricted ? disabledClasses : enabledClasses}
          `}
        >
          <FileText
            className={`w-12 h-12 md:w-16 md:h-16 mb-4 
            ${isRestricted ? "text-gray-500" : "text-[#345A35] group-hover:text-[#F3EBD8]"}
          `}/>
          <h2 className="text-xl md:text-2xl font-semibold">Presupuestos</h2>
        </Link>

        {/* ANIMALES (SIEMPRE HABILITADO) */}
        <Link
          to="/animales"
          className="
            flex flex-col items-center justify-center bg-[#A1C084] border-2 border-[#345A35]
            rounded-lg p-6 md:p-12 min-h-[180px] md:min-h-[220px]
            hover:bg-[#345A35] hover:text-[#F3EBD8] transition-all group
          "
        >
          <PawPrint className="w-12 h-12 md:w-16 md:h-16 text-[#345A35] mb-4 group-hover:text-[#F3EBD8]" />
          <h2 className="text-xl md:text-2xl font-semibold">Animales</h2>
        </Link>

        {/* VENTAS */}
        <Link
          to={isRestricted ? "#" : "/ventas"}
          className={`
            flex flex-col items-center justify-center rounded-lg p-6 md:p-12
            min-h-[180px] md:min-h-[220px] border-2 transition-all group
            ${isRestricted ? disabledClasses : enabledClasses}
          `}
        >
          <ShoppingCart
            className={`w-12 h-12 md:w-16 md:h-16 mb-4
            ${isRestricted ? "text-gray-500" : "text-[#345A35] group-hover:text-[#F3EBD8]"}
          `}/>
          <h2 className="text-xl md:text-2xl font-semibold">Ventas</h2>
        </Link>

        {/* COBROS */}
        <Link
          to={isRestricted ? "#" : "/cobros"}
          className={`
            flex flex-col items-center justify-center rounded-lg p-6 md:p-12
            min-h-[180px] md:min-h-[220px] border-2 transition-all group
            ${isRestricted ? disabledClasses : enabledClasses}
          `}
        >
          <DollarSign
            className={`w-12 h-12 md:w-16 md:h-16 mb-4
            ${isRestricted ? "text-gray-500" : "text-[#345A35] group-hover:text-[#F3EBD8]"}
          `}/>
          <h2 className="text-xl md:text-2xl font-semibold">Cobros</h2>
        </Link>

      </div>
    </div>
  );
}
