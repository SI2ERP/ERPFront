import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import InventarioPage from './Modulo de Inventario/InventarioPage'
import VentasPage from './Modulo de Ventas'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/auth" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>

          {/* Ruta inventario */}
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path='/ventas' element={<VentasPage />} />

          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
