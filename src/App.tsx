import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth, canAccess } from "./utils/AuthContext";
import { ROLES } from "./utils/Permissions";

import Home from "./views/Home";
import Login from "./views/Login";
import InventarioPage from "./Modulo de Inventario/InventarioPage";

/* Función para ver permisos por rol y si el usuario está logueado */
function ProtectedRoute({ element, roles }: { element: JSX.Element; roles?: string[] }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  if (roles && !canAccess(user, roles)) {
    alert("No tienes permiso para acceder a esta sección");
    navigate("/");
    return null;
  }

  return element;
}

function App() {
  return (
    <div className="app">
      <main>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Login />} />
    
            {/* De momento al home solo pueden acceder usuarios logueados */}
            {/* Solo se pueden registrar usuarios existentes en public.empleado */}
            <Route path="/" element={<ProtectedRoute element={<Home />}/>} />

            {/* Ejemplo: ruta protegida para Inventario */}
            <Route
              path="/inventario"
              element={
                /* ProtectedRoute significa que revisa login, el campo roles los filtra por este */
                <ProtectedRoute 
                  element={<InventarioPage />}
                  roles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.EMPLEADO, ROLES.TESTING]}
                />
              }
            />
          </Routes>
        </AuthProvider>
      </main>
    </div>
  );
}

export default App;
