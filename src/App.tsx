import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import { Login_rrhh } from './Modulo de Recursos Humanos/Login_rrhh'
import { HomeAdmin_rrhh } from './Modulo de Recursos Humanos/Admin/HomeAdmin_rrhh'
import { HomeEmpleado_rrhh } from './Modulo de Recursos Humanos/Empleado/HomeEmpleado_rrhh'
import { GestionEmpleados_rrhh } from "./Modulo de Recursos Humanos/Admin/GestionEmpleados_rrhh";
import { EstadoEmpleados_rrhh } from "./Modulo de Recursos Humanos/Admin/EstadoEmpleados_rrhh";

import { AsignarRol } from './Modulo de Recursos Humanos/Admin/AsignarRol'
import { ListarEmpleados } from './Modulo de Recursos Humanos/Admin/ListarEmpleados'
import { ProtectedRoute } from './Modulo de Recursos Humanos/ProtectedRoute'
import Unauthorized from './Modulo de Recursos Humanos/Unauthorized'
import { ListarEmpleadosSinCuenta } from './Modulo de Recursos Humanos/Admin/ListarEmpleadosSinCuenta'

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {/* Acá añadan sus rutas con el url correspondiente */}

          <Route path="/rrhh/" element={<Login_rrhh/>}></Route>
          <Route path="/rrhh/empleado/" element={<HomeEmpleado_rrhh/>}></Route>


          <Route path="/rrhh/admin/" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <HomeAdmin_rrhh/>
            </ProtectedRoute>
            }></Route>

          <Route path="/rrhh/admin/elegirEmpleado/" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <ListarEmpleados />
            </ProtectedRoute>
            }></Route>
          <Route path="/rrhh/admin/gestion-empleados" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <GestionEmpleados_rrhh />
            </ProtectedRoute>
            } />
          <Route path="/rrhh/admin/estado-empleados" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <EstadoEmpleados_rrhh />
            </ProtectedRoute>
            } />

          <Route path="/rrhh/admin/elegirEmpleado/asignarRol/:idEmpleado" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <AsignarRol />
            </ProtectedRoute>
            }></Route>

          <Route path="rrhh/admin/crearCuentaDeTrabajo" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <ListarEmpleadosSinCuenta />
            </ProtectedRoute>
          }></Route>

          <Route path='/unauthorized' element={
            <Unauthorized />
          }></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
