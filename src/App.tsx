import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Venta from './Modulo de Ventas/views'
import Order from './Modulo de Ventas/views/Order'
import Client from './Modulo de Ventas/views/Client'
import Invoice from './Modulo de Ventas/views/Invoice'
import Report from './Modulo de Ventas/views/Report'
import Dashboard from './Modulo de Ventas/views/Dashboard'
import ClientView from './Modulo de Ventas/views/ClientView'


function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path='/cliente' element={<ClientView />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/ventas" element={<Venta />}>
            <Route index element={<Dashboard />}></Route>
            <Route path='pedidos' element={<Order />}></Route>
            <Route path='clientes' element={<Client />}></Route>
            <Route path='facturas' element={<Invoice />}></Route>
            <Route path='reportes' element={<Report />}></Route>
          </Route>
          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
