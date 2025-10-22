import * as React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const Register: React.FC = () => {
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !apellido || !dni || !email || !contrasena) {
      Swal.fire("Campos incompletos", "Por favor completa todos los campos.", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/usuarios/registrar", {
        nombre,
        apellido,
        dni,
        email,
        contrasena,
        id_rol: 1,
      });

      Swal.fire("Registro exitoso", response.data.mensaje, "success");
      navigate("/");
    } catch (err: any) {
      console.error("Error al registrar:", err);
      const mensaje = err.response?.data?.error || "Error al registrar usuario.";
      Swal.fire("Error", mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EBD8] flex flex-col">
      <header className="w-full flex items-center px-8 py-4 bg-[#345A35] z-10">
        <img
          src="/logo-sin-letras.png"
          alt="Logo La Maja"
          className="w-20 h-20 rounded-full bg-transparent"
        />
        <h1 className="flex-1 text-center ml-[-70px] text-5xl font-serif font-bold text-[#F3EBD8] tracking-wider">
  LA MAJA
</h1>

      </header>
    <div
  className="fixed inset-0 z-0 w-full h-full"
  style={{
    backgroundImage: "url('/hermosa-naturaleza-retro-con-campo.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
></div>



      {/* Registration Form */}
      <div className="flex-1 flex items-center justify-center w-full relative z-10 py-8">
        <form
          onSubmit={handleRegister}
          className="bg-[#A1C084]/90 backdrop-blur-sm w-full max-w-md rounded-3xl shadow-2xl flex flex-col items-center py-8 px-8 space-y-4 mx-4"
        >
          <h2 className="text-2xl font-semibold text-[#F3EBD8] mb-2 italic">Registro</h2>

          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-3 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Apellido"
            className="w-full p-3 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="DNI"
            className="w-full p-3 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-[#F3EBD8] text-[#345A35] rounded-full py-3 mt-4 font-semibold hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <div className="w-full border-t border-[#F3EBD8]/50 my-2"></div>

           <button
                type="button"
                onClick={() => navigate("/login")}
                className="italic cursor-pointer w-3/4 bg-[#345A35] text-[#F3EBD8] hover:text-[#345A35] rounded-full py-3 font-semibold text-lg hover:bg-[#F3EBD8] transition-colors"
                >
                Volver al inicio de sesión
            </button>

        </form>
      </div>
    </div>
  )
};

export default Register;
