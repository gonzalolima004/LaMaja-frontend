import { FileText, PawPrint, ShoppingCart, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3EBD8]">
      
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto md:p-8">

        <Link to="/presupuestos"
          className="flex flex-col items-center justify-center bg-[#A1C084] border-2 border-[#345A35] rounded-lg p-6 md:p-12 min-h-[180px] md:min-h-[220px] hover:bg-[#345A35] hover:text-[#F3EBD8] transition-all group">

          <FileText className="w-12 h-12 md:w-16 md:h-16 text-[#345A35] mb-4 group-hover:text-[#F3EBD8] transition-colors" />

          <h2 className="text-xl md:text-2xl font-semibold text-[#345A35] text-center group-hover:text-[#F3EBD8]">
            Presupuestos
          </h2>
        </Link>

        <Link to="/animales"
          className="flex flex-col items-center justify-center bg-[#A1C084] border-2 border-[#345A35] rounded-lg p-6 md:p-12 min-h-[180px] md:min-h-[220px] hover:bg-[#345A35] hover:text-[#F3EBD8] transition-all group">

          <PawPrint className="w-12 h-12 md:w-16 md:h-16 text-[#345A35] mb-4 group-hover:text-[#F3EBD8] transition-colors" />

          <h2 className="text-xl md:text-2xl font-semibold text-[#345A35] text-center group-hover:text-[#F3EBD8]">
            Animales
          </h2>
        </Link>

        <Link to="/facturas"
          className="flex flex-col items-center justify-center bg-[#A1C084] border-2 border-[#345A35] rounded-lg p-6 md:p-12 min-h-[180px] md:min-h-[220px] hover:bg-[#345A35] hover:text-[#F3EBD8] transition-all group">

          <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-[#345A35] mb-4 group-hover:text-[#F3EBD8] transition-colors" />

          <h2 className="text-xl md:text-2xl font-semibold text-[#345A35] text-center group-hover:text-[#F3EBD8]">
            Ventas
          </h2>
        </Link>

        <Link to="/cobros"
          className="flex flex-col items-center justify-center bg-[#A1C084] border-2 border-[#345A35] rounded-lg p-6 md:p-12 min-h-[180px] md:min-h-[220px] hover:bg-[#345A35] hover:text-[#F3EBD8] transition-all group">

          <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-[#345A35] mb-4 group-hover:text-[#F3EBD8] transition-colors" />

          <h2 className="text-xl md:text-2xl font-semibold text-[#345A35] text-center group-hover:text-[#F3EBD8]">
            Cobros
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Home;