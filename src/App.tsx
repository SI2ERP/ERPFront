import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Venta from './views/Venta'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/venta" element={<Venta />}></Route>
          {/* Acá añadan sus rutas con el url correspondiente */}
        </Routes>
      </main>
    </div>
  )
}

export default App
