import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RutaProtegida({ element, roles }: any) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  if (!usuario || !usuario.id_rol) {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "Debes iniciar sesión para continuar.",
      confirmButtonColor: "#345A35"
    });

    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(usuario.id_rol)) {
    Swal.fire({
      icon: "warning",
      title: "Permisos insuficientes",
      text: "No tienes permiso para acceder a esta sección.",
      confirmButtonColor: "#345A35"
    });

    return <Navigate to="/home" replace />;
  }

  return element;
}
