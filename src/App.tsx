import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import RestablecerContraseña from "./pages/RestablecerContraseña";
import Home from './pages/Home'
import Animales from './pages/Animales'
import Cobros from './pages/Cobros'
import Presupuestos from './pages/HistorialPresupuestos'
import GenerarPresupuestos from './pages/GenerarPresupuestos/GenerarPresupuestos'
import Facturas from './pages/Facturas'
import GenerarFacturas from './pages/GenerarFactura'

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
          <Route path="/animales" element={<Animales />} />


          {/* Rutas protegidas solo para rol encargado */}
          <Route path="/cobros"element= {<RutaProtegida roles={[1]} element={<Cobros />} />}/>
          <Route path="/registrar"element= {<RutaProtegida roles={[1]} element={<Register />} />}/>


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
