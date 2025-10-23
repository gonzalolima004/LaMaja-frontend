import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

const RestablecerContraseña = () => {
  const { token } = useParams(); // 👈 obtiene el token desde la URL
  const navigate = useNavigate();

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevaContrasena || !confirmarContrasena) {
      Swal.fire("Campos incompletos", "Por favor completa ambos campos.", "warning");
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/usuarios/restablecer", {
        token,
        nuevaContrasena,
      });

      Swal.fire("¡Éxito!", response.data.message, "success");
      navigate("/"); // redirige al login
    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      const mensaje =
        err.response?.data?.error || "Error al restablecer la contraseña.";
      Swal.fire("Error", mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EBD8] flex flex-col justify-center items-center">
      <div className="bg-[#A1C084]/90 p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-[#345A35] mb-6 italic">
          Restablecer contraseña
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="p-4 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/70 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            className="p-4 rounded-full bg-[#F3EBD8] text-[#345A35] placeholder:text-[#345A35]/70 focus:outline-none focus:ring-2 focus:ring-[#345A35]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#345A35] text-[#F3EBD8] rounded-full py-3 font-semibold text-lg hover:bg-[#F3EBD8] hover:text-[#345A35] transition-colors disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestablecerContraseña;
