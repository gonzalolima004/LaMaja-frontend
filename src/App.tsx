import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import RestablecerContraseña from "./pages/RestablecerContraseña";
import Home from './pages/Home'
import GestionAnimales from './pages/GestionAnimales/GestionAnimales';
import Presupuestos from './pages/HistorialPresupuestos'
import GenerarPresupuestos from './pages/GenerarPresupuestos/GenerarPresupuestos'
import Facturas from './pages/HistorialFacturas'
import GenerarFacturas from './pages/GenerarFactura'

import HistorialCobros from './pages/HistorialCobros';
import CargarCobros from './pages/CargarCobros'

import VerificadorToken from './services/VerificadorToken'
import RutaProtegida from './services/RutaProtegida'

/* Todo testeado, funciona perfecto */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/restablecer/:token" element={<RestablecerContraseña />} />


        {/* Rutas protegidas */}
        <Route element={<VerificadorToken />}>

          {/* rutas accesibles por cualquier rol */}
          <Route path="/home" element={<Home />} />
          <Route path="/gestion-animales" element={<GestionAnimales />} />


          {/* Rutas protegidas solo para rol encargado */}
          <Route path="/registrar"element= {<RutaProtegida roles={[1]} element={<Register />} />}/>

          <Route path="/historial-cobros"element= {<RutaProtegida roles={[1]} element={<HistorialCobros />} />}/>
          <Route path="/cargar-cobros"element= {<RutaProtegida roles={[1]} element={<CargarCobros />} />}/>

          <Route path="/historial-presupuestos" element={<RutaProtegida roles={[1]} element={<Presupuestos />} />}/>
          <Route path="/generar-presupuestos" element={<RutaProtegida roles={[1]} element={<GenerarPresupuestos />} />} />

          <Route path="/historial-facturas" element= {<RutaProtegida roles={[1]} element={<Facturas />} />} />
          <Route path="/generar-facturas" element={<RutaProtegida roles={[1]} element={<GenerarFacturas />} />} />
        </Route>

        {/* Redirección si la ruta no existe (/home si está logueado, sino a /) */}
        <Route path="*" element={<Navigate to="/home" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
