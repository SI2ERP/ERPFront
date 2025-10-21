import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import InventarioPage from './Modulo de Inventario/InventarioPage'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          {/* Ruta inventario */}
          <Route path="/inventario" element={<InventarioPage />} />

          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
