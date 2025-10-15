import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import OrdenCompraForm from './Modulo de Compras/OrdenCompraForm'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/compras/nueva-orden" element={<OrdenCompraForm />}></Route>
          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
