import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import OrdenCompraForm from './Modulo de Compras/OrdenCompraForm'
import ListaOrdenes from './Modulo de Compras/ListaOrdenes'
import VerOrdenCompra from './Modulo de Compras/VerOrdenCompra'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/compras/nueva-orden" element={<OrdenCompraForm />}></Route>
          <Route path="/compras/ordenes" element={<ListaOrdenes />}></Route>
          <Route path="/compras/ordenes/ver/:id" element={<VerOrdenCompra />}></Route>
          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
