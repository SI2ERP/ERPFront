import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import { Login_rrhh } from './Modulo de Recursos Humanos/Login_rrhh'
import { HomeAdmin_rrhh } from './Modulo de Recursos Humanos/Admin/HomeAdmin_rrhh'
import { HomeEmpleado_rrhh } from './Modulo de Recursos Humanos/Empleado/HomeEmpleado_rrhh'

import { AsignarRol } from './Modulo de Recursos Humanos/Admin/AsignarRol'
import { ListarEmpleados } from './Modulo de Recursos Humanos/Admin/ListarEmpleados'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {/* Acá añadan sus rutas con el url correspondiente */}

          <Route path="/rrhh/" element={<Login_rrhh/>}></Route>
          <Route path="/rrhh/admin/" element={<HomeAdmin_rrhh/>}></Route>
          <Route path="/rrhh/empleado/" element={<HomeEmpleado_rrhh/>}></Route>
          <Route path="/rrhh/admin/elegirEmpleado/" element={<ListarEmpleados />}></Route>

          <Route path="/rrhh/admin/elegirEmpleado/asignarRol/:idEmpleado" element={<AsignarRol />}></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
