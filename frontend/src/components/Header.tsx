import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-[#F3EBD8] border-b-2 border-[#345A35]">
      
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 md:px-6 md:py-2">

        <div className="flex items-center gap-3 md:gap-4">
          
          <div className="md:w-20 md:h-16">
            <img 
              src="/logo-sin-letras.png" 
              width={100} 
              height={64} 
            />
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-[#345A35] m-0">
            LA MAJA
          </h1>
        </div>

        <button className="cursor-pointer flex items-center gap-2 p-3 bg-[#345A35] text-[#F3EBD8] rounded-lg hover:bg-[#A1C084] hover:text-[#345A35] transition-colors" onClick={logout}>
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}

export default Header