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
    <div className="min-h-screen bg-[#F3EBD8] flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#345A35] mb-6 relative">
        <img src="/logo.png" alt="Logo La Maja" className="w-16 h-16" />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-[#F3EBD8]">
          LA MAJA
        </h1>
      </header>

      {/* Formulario de registro */}
      <form
        onSubmit={handleRegister}
        className="bg-[#A1C084] w-96 rounded-2xl shadow-md flex flex-col items-center py-6 px-6 space-y-3"
      >
        <h2 className="text-lg font-semibold text-[#345A35] mb-2">Registro</h2>

        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 rounded-md border border-[#345A35] focus:outline-none"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          className="w-full p-2 rounded-md border border-[#345A35] focus:outline-none"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
          type="text"
          placeholder="DNI"
          className="w-full p-2 rounded-md border border-[#345A35] focus:outline-none"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
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
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <div className="w-full border-t border-[#345A35] my-3"></div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-[#F3EBD8] text-[#345A35] rounded-md py-2 hover:bg-[#e9dfc5] transition-colors"
        >
          Volver al Login
        </button>
      </form>
    </div>
  );
};

export default Register;
