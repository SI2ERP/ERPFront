import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import InventarioPage from './Modulo de Inventario/InventarioPage'
import ComprasPage from './Modulo de Compras/ComprasPage'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          {/* Ruta inventario */}
          <Route path="/inventario" element={<InventarioPage />} />

          {/* Rutas del módulo de compras */}
          <Route path="/compras/*" element={<ComprasPage />} />

          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
