import * as React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [contrasena, setContrasena] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = React.useState<string>("");

  const navigate = useNavigate();

  // === LOGIN ===
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

  // === RECUPERAR CONTRASEÑA ===
  const handlePasswordRecovery = async () => {
    if (!recoveryEmail) {
      Swal.fire("Campo vacío", "Por favor ingresa tu email.", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/usuarios/recuperar-contrasena", { email: recoveryEmail });

      Swal.fire(
        "Correo enviado",
        "Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.",
        "success"
      );
      setShowModal(false);
      setRecoveryEmail("");
    } catch (err: any) {
      console.error("Error al enviar correo:", err);
      const mensaje = err.response?.data?.error || "No se pudo enviar el correo. Inténtalo más tarde.";
      Swal.fire("Error", mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EBD8] flex flex-col">
      {/* HEADER */}
      <header className="w-full flex items-center px-8 py-4 bg-[#345A35]">
        <img
          src="/logo-sin-letras.png"
          alt="Logo La Maja"
          className="w-20 h-20 rounded-full bg-transparent"
        />
        <h1 className="flex-1 text-center ml-[-70px] text-5xl font-serif font-bold text-[#F3EBD8] tracking-wider">
          LA MAJA
        </h1>
      </header>

      {/* FORMULARIO LOGIN */}
      <div
        className="flex-1 flex justify-center items-start pt-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('public/vista-frontal-del-paisaje-con-vegetacion-y-cielo-despejado.jpg')",
        }}
      >
        <form
          onSubmit={handleLogin}
          className="bg-[#A1C084]/90 backdrop-blur-sm w-full max-w-md rounded-3xl shadow-2xl flex flex-col items-center py-8 px-10 space-y-4"
        >
          <h2 className="text-3xl font-semibold text-[#F3EBD8] mb-4 italic">Iniciar sesión</h2>

          <input
            type="email"
            placeholder="Email:"
            className="w-full p-4 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/70 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña:"
            className="w-full p-4 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/70 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-3/4 bg-[#F3EBD8] text-[#345A35] rounded-full py-3 mt-4 font-semibold text-lg hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="w-full border-t-2 border-[#345A35]/30 my-4"></div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="cursor-pointer w-3/4 bg-[#F3EBD8] text-[#345A35] rounded-full py-3 font-semibold text-lg hover:bg-[#345A35] hover:text-[#F3EBD8] transition-colors"
          >
            Registrar
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="italic cursor-pointer w-3/4 bg-[#345A35] text-[#F3EBD8] hover:text-[#345A35] rounded-full py-3 font-semibold text-lg hover:bg-[#F3EBD8] transition-colors"
          >
            Olvidé la contraseña
          </button>
        </form>
      </div>

      {/* MODAL DE RECUPERAR CONTRASEÑA */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F3EBD8] p-8 rounded-3xl shadow-2xl w-96 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-[#345A35] text-center mb-2">
              Recuperar contraseña
            </h3>
            <p className="text-[#345A35] text-sm text-center">
              Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <input
              type="email"
              placeholder="Tu email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="p-3 rounded-full bg-white text-[#345A35] border border-[#345A35]/40 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-full bg-gray-400 text-white font-semibold hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordRecovery}
                disabled={loading}
                className="px-4 py-2 rounded-full bg-[#345A35] text-[#F3EBD8] font-semibold hover:bg-[#A1C084] hover:text-[#345A35] transition-colors"
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
