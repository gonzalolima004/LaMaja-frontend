import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import RestablecerContraseña from "./pages/RestablecerContraseña";
import Home from './pages/Home'
import Animales  from './pages/Animales'
import VerificadorToken from './services/VerificadorToken'
import Cobros from './pages/Cobros'
import Presupuestos from './pages/Presupuestos'
import GenerarPresupuestos from './pages/GenerarPresupuestos'
import Facturas from './pages/Facturas'
import GenerarFacturas from './pages/GenerarFactura'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restablecer/:token" element={<RestablecerContraseña />} />

        {/* rutas protegidas */}
          <Route element={<VerificadorToken />}>
          <Route path="/home" element={<Home />} />

          <Route path="/animales" element={<Animales />} />
          <Route path="/cobros" element={<Cobros />} />

          <Route path="/animales" element={<Animales />} />
          <Route path="/cobros" element={<Cobros />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/presupuestos/generar" element={<GenerarPresupuestos />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/facturas/generar" element={<GenerarFacturas />} />

        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
