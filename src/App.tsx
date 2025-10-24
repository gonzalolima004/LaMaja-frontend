import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Animales  from './pages/Animales'
import VerificadorToken from './services/VerificadorToken'
import Cobros from './pages/Cobros'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* rutas protegidas */}
        <Route element={<VerificadorToken />}>
          <Route path="/home" element={<Home />} />
           <Route path="/animales" element={<Animales />} />
            <Route path="/cobros" element={<Cobros />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
