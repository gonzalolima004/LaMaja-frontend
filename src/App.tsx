import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import VerificadorToken from './services/VerificadorToken'
import Presupuestos from './pages/Presupuestos'
import GenerarPresupuestos from './pages/GenerarPresupuestos'
import Facturas from './pages/Facturas'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* rutas protegidas */}
        <Route element={<VerificadorToken />}>
          <Route path="/home" element={<Home />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/presupuestos/generar" element={<GenerarPresupuestos />} />
          <Route path="/facturas" element={<Facturas />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
