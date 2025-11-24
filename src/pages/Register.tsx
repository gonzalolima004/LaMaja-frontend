import * as React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import Header from "../components/Header";

const Register: React.FC = () => {
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");
  const [idRol, setIdRol] = React.useState<number>(1);
  const [matricula, setMatricula] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !apellido || !dni || !email || !contrasena) {
      Swal.fire("Campos incompletos", "Por favor completa todos los campos.", "warning");
      return;
    }

    if (dni.length !== 8) {
      Swal.fire("DNI inválido", "El DNI debe tener exactamente 8 números.", "warning");
      return;
    }

    if (idRol === 2 && !matricula) {
      Swal.fire("Falta la matrícula", "Debes ingresar la matrícula si el rol es Veterinario.", "warning");
      return;
    }

    try {
      setLoading(true);

      const data: any = {
        nombre,
        apellido,
        dni,
        email,
        contrasena,
        id_rol: idRol,
      };

      if (idRol === 2) data.matricula = matricula;

      const response = await api.post("/usuarios/registrar", data);

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

      <div
        className="fixed inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: "url('/hermosa-naturaleza-retro-con-campo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <Header />

      <div className="flex-1 flex items-center justify-center w-full relative z-10 py-2">
        <form
          onSubmit={handleRegister}
          className="bg-[#A1C084]/90 backdrop-blur-sm w-full max-w-md 
             rounded-3xl shadow-2xl flex flex-col items-center 
             py-4 px-6 space-y-3 mx-4"
        >
          <h2 className="text-2xl font-semibold text-[#F3EBD8] mb-2 italic">Registrar nuevo usuario</h2>

          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35] pl-6"
            value={nombre}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,30}$/.test(val)) setNombre(val);
            }}
            required
          />

          {/* Apellido */}
          <input
            type="text"
            placeholder="Apellido"
            className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35] pl-6"
            value={apellido}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,30}$/.test(val)) setApellido(val);
            }}
            required
          />

          {/* DNI */}
          <input
            type="text"
            placeholder="DNI"
            maxLength={8}
            className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35] pl-6"
            value={dni}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,8}$/.test(val)) setDni(val);
            }}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35] pl-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            maxLength={20}
            className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35] pl-6"
            value={contrasena}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 20) setContrasena(val);
            }}
            required
          />


          {/* Selección de Rol */}
          <select
            value={idRol}
            onChange={(e) => setIdRol(Number(e.target.value))}
            className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] border-2 border-[#345A35]/50 focus:ring-2 focus:ring-[#345A35] font-semibold pl-5 pr-10"
          >
            <option value={1}>Encargado</option>
            <option value={2}>Veterinario</option>
          </select>

          {/* Matrícula */}
          {idRol === 2 && (
            <input
              type="text"
              placeholder="Matrícula"
              className="w-full p-2 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/60 focus:outline-none focus:ring-2 focus:ring-[#345A35] pl-6"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              required
            />
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-[#F3EBD8] text-[#345A35] rounded-full py-3 mt-4 font-semibold hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>


        </form>
      </div>
    </div>
  );

};

export default Register;
