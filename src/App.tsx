import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import { useAuth, canAccess } from "./utils/AuthContext";
import { ROLES } from "./utils/Permissions";

import Home from "./views/Home";
import Login from "./views/Login";
import InventarioPage from "./Modulo de Inventario/InventarioPage";
import VentasPage from "./Modulo de Ventas";
// ===== Logística pages (integrated into main App) =====
import LogisticaApp from "./Modulo de Logistica/LogisticaApp";

// ==== RRHH ====
import { HomeAdmin_rrhh } from "./Modulo de Recursos Humanos/Admin/HomeAdmin_rrhh";
import { HomeEmpleado_rrhh } from "./Modulo de Recursos Humanos/Empleado/HomeEmpleado_rrhh";
import { GestionEmpleados_rrhh } from "./Modulo de Recursos Humanos/Admin/GestionEmpleados_rrhh";
import { EstadoEmpleados_rrhh } from "./Modulo de Recursos Humanos/Admin/EstadoEmpleados_rrhh";
import { NuevoEmpleado_rrhh } from "./Modulo de Recursos Humanos/Admin/NuevoEmpleado_rrhh";
import { AsignarRol } from "./Modulo de Recursos Humanos/Admin/AsignarRol";
import { ListarEmpleados } from "./Modulo de Recursos Humanos/Admin/ListarEmpleados";
import { ListarEmpleadosSinCuenta } from "./Modulo de Recursos Humanos/Admin/ListarEmpleadosSinCuenta";
import { SolicitarAusencia } from "./Modulo de Recursos Humanos/Empleado/SolicitarAusencia";
import { JefeMisEmpleados_rrhh } from "./Modulo de Recursos Humanos/Empleado/JefeMisEmpleados_rrhh";
import { JefeSolicitarBaja_rrhh } from "./Modulo de Recursos Humanos/Empleado/JefeSolicitarBaja_rrhh";
import { AdminSolicitudesBaja_rrhh } from "./Modulo de Recursos Humanos/Admin/AdminSolicitudesBaja_rrhh";
import { VerEstadoSolicitudes } from "./Modulo de Recursos Humanos/Empleado/VerEstadoSolicitudes";
import { GestionarSolicitudes } from "./Modulo de Recursos Humanos/Admin/GestionarSolicitudes";
import type { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
  roles?: string[];
}

/**
 * ProtectedRoute del ERP
 */
function ProtectedRoute({ element, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    window.location.replace("/auth");
    return null;
  }

  if (roles && !canAccess(user, roles)) {
    //alert("No tienes permiso para acceder a esta sección");
    window.location.replace("/");
    return null;
  }

  return element;
}

export default function App() {
  return (
    <div className="app">
      <main>
        <AuthProvider>
          <Routes>
            {/* LOGIN GENERAL */}
            <Route path="/auth" element={<Login />} />

            {/* HOME general */}
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />

            <Route path="*" element={<ProtectedRoute element={<Home />} />} />

            {/* ================== INVENTARIO ================== */}
            <Route
              path="/inventario"
              element={
                <ProtectedRoute
                  element={<InventarioPage />}
                  roles={[
                    ROLES.ADMIN,
                    ROLES.GERENTE,
                    ROLES.EMPLEADO,
                    ROLES.TESTING,
                  ]}
                />
              }
            />

            {/* ================== VENTAS ================== */}
            <Route
              path="/ventas"
              element={
                <ProtectedRoute
                  element={<VentasPage />}
                  roles={[
                    ROLES.ADMIN,
                    ROLES.GERENTE,
                    ROLES.EMPLEADO,
                    ROLES.TESTING,
                  ]}
                />
              }
            />

            {/* ================== LOGÍSTICA ================== */}
            <Route
              path="/logistica/*"
              element={
                <ProtectedRoute
                  element={<LogisticaApp />}
                  roles={[
                    ROLES.EMPLEADO_LOGISTICA,
                    ROLES.TRANSPORTISTA,
                    ROLES.JEFE_LOGISTICA,
                  ]}
                />
              }
            />

            {/* ================ RRHH EMPLEADO ================= */}
            <Route
              path="/rrhh/empleado"
              element={
                <ProtectedRoute
                  element={<HomeEmpleado_rrhh />}
                  roles={[
                    ROLES.EMPLEADO,
                    ROLES.EMPLEADO_GENERAL,
                    ROLES.EMPLEADO_COMPRAS,
                    ROLES.EMPLEADO_VENTAS,
                    ROLES.EMPLEADO_LOGISTICA,
                    ROLES.EMPLEADO_AREA,
                    ROLES.EMPLEADO_INVENTARIO,
                  ]}
                />
              }
            />

            <Route
              path="/rrhh/empleado/solicitarAusencia"
              element={
                <ProtectedRoute
                  element={<SolicitarAusencia />}
                  roles={[
                    ROLES.EMPLEADO,
                    ROLES.EMPLEADO_GENERAL,
                    ROLES.EMPLEADO_COMPRAS,
                    ROLES.EMPLEADO_VENTAS,
                    ROLES.EMPLEADO_LOGISTICA,
                    ROLES.EMPLEADO_AREA,
                    ROLES.EMPLEADO_INVENTARIO,
                  ]}
                />
              }
            />

            <Route
              path="/rrhh/empleado/estadoSolicitud"
              element={
                <ProtectedRoute
                  element={<VerEstadoSolicitudes />}
                  roles={[
                    ROLES.EMPLEADO,
                    ROLES.EMPLEADO_GENERAL,
                    ROLES.EMPLEADO_COMPRAS,
                    ROLES.EMPLEADO_VENTAS,
                    ROLES.EMPLEADO_LOGISTICA,
                    ROLES.EMPLEADO_AREA,
                    ROLES.EMPLEADO_INVENTARIO,
                  ]}
                />
              }
            />

            {/* ================ RRHH ADMIN ================= */}
            <Route
              path="/rrhh/admin"
              element={
                <ProtectedRoute
                  element={<HomeAdmin_rrhh />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/gestionSolicitudes"
              element={
                <ProtectedRoute
                  element={<GestionarSolicitudes />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/elegirEmpleado"
              element={
                <ProtectedRoute
                  element={<ListarEmpleados />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/gestion-empleados"
              element={
                <ProtectedRoute
                  element={<GestionEmpleados_rrhh />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/gestion-empleados/nuevo-empleado"
              element={
                <ProtectedRoute
                  element={<NuevoEmpleado_rrhh />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/estado-empleados"
              element={
                <ProtectedRoute
                  element={<EstadoEmpleados_rrhh />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/elegirEmpleado/asignarRol/:idEmpleado"
              element={
                <ProtectedRoute
                  element={<AsignarRol />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/crearCuentaDeTrabajo"
              element={
                <ProtectedRoute
                  element={<ListarEmpleadosSinCuenta />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            <Route
              path="/rrhh/admin/solicitudes-baja"
              element={
                <ProtectedRoute
                  element={<AdminSolicitudesBaja_rrhh />}
                  roles={[ROLES.ADMIN]}
                />
              }
            />

            {/* ================ RRHH JEFE ================= */}
            <Route
              path="/rrhh/jefe/mis-empleados/:idDepto"
              element={
                <ProtectedRoute
                  element={<JefeMisEmpleados_rrhh />}
                  roles={[
                    ROLES.JEFE_DEPARTAMENTO, //este tmb por si acaso xd
                    ROLES.JEFE_AREA, //x2
                    ROLES.JEFE_COMPRAS,
                    ROLES.JEFE_LOGISTICA,
                    ROLES.JEFE_VENTAS,
                    ROLES.JEFE_INVENTARIO,
                    ROLES.JEFE_RRHH,
                  ]}
                />
              }
            />

            <Route
              path="/rrhh/jefe/solicitar-baja/:idEmpleado"
              element={
                <ProtectedRoute
                  element={<JefeSolicitarBaja_rrhh />}
                  roles={[
                    ROLES.JEFE_DEPARTAMENTO, //este tmb por si acaso xd
                    ROLES.JEFE_AREA, //x2
                    ROLES.JEFE_COMPRAS,
                    ROLES.JEFE_LOGISTICA,
                    ROLES.JEFE_VENTAS,
                    ROLES.JEFE_INVENTARIO,
                    ROLES.JEFE_RRHH,
                  ]}
                />
              }
            />
          </Routes>
        </AuthProvider>
      </main>
    </div>
  );
}
