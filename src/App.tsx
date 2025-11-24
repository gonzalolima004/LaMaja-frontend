import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import VerificadorToken from './services/VerificadorToken'
import HistorialPresupuestos from './pages/HistorialPresupuestos'
import GenerarPresupuestos from './pages/GenerarPresupuestos/GenerarPresupuestos'
import RutaProtegida from './services/RutaProtegida'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* rutas protegidas */}
        <Route element={<VerificadorToken />}>

          {/* Home accesible para todos los roles */}
          <Route
            path="/admin/home"
            element={
              <RutaProtegida element={<Home />} />
            }
          />

          {/* historial-presupuestos solo rol 1 */}
          <Route
            path="/admin/historial-presupuestos"
            element={
              <RutaProtegida roles={[1]} element={<HistorialPresupuestos />} />
            }
          />

          {/* generar-presupuestos solo rol 1 */}
          <Route
            path="/admin/generar-presupuestos"
            element={
              <RutaProtegida roles={[1]} element={<GenerarPresupuestos />} />
            }
          />

        </Route>

        {/* si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
