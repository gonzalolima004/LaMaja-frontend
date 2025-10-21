import * as React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [contrasena, setContrasena] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !contrasena) {
      Swal.fire("Campos incompletos", "Por favor completa todos los campos.", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/usuarios/login", { email, contrasena });
      const { token, usuario } = response.data;

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      Swal.fire("¡Bienvenido!", "Inicio de sesión exitoso.", "success");
      navigate("/home");
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      const mensaje = err.response?.data?.error || "Error al iniciar sesión. Inténtalo de nuevo.";
      Swal.fire("Error", mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#F3EBD8] flex flex-col items-center justify-center">
  
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#345A35] mb-6 relative">
        <img src="/logo.png" alt="Logo La Maja" className="w-16 h-16" />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-[#F3EBD8]">
            LA MAJA
        </h1>
    </header>


    {/* Contenedor del login */}
    <form
      onSubmit={handleLogin}
      className="bg-[#A1C084] w-80 rounded-2xl shadow-md flex flex-col items-center py-6 px-6 space-y-3"
    >
      <h2 className="text-lg font-semibold text-[#345A35] mb-2">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 rounded-md border border-[#345A35] focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="w-full p-2 rounded-md border border-[#345A35] focus:outline-none"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#345A35] text-[#F3EBD8] rounded-md py-2 mt-3 hover:bg-[#2c4b2b] transition-colors"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <div className="w-full border-t border-[#345A35] my-3"></div>

      <button
        type="button"
        onClick={() => navigate("/register")}
        className="w-full bg-[#F3EBD8] text-[#345A35] rounded-md py-2 hover:bg-[#e9dfc5] transition-colors"
      >
        Registrar
      </button>

      <button
        type="button"
        onClick={() =>
          Swal.fire("Recuperar contraseña", "Funcionalidad próximamente disponible.", "info")
        }
        className="w-full bg-[#F3EBD8] text-[#345A35] rounded-md py-2 hover:bg-[#e9dfc5] transition-colors"
      >
        Olvidé la contraseña
      </button>
    </form>
  </div>
);

};

export default Login;
