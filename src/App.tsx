import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import VerificadorToken from './services/VerificadorToken'
import Presupuestos from './pages/Presupuestos'
import GenerarPresupuestos from './pages/GenerarPresupuestos'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* rutas protegidas */}
        <Route element={<VerificadorToken />}>
          <Route path="/home" element={<Home />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/presupuestos/generar" element={<GenerarPresupuestos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
