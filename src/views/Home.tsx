import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { hasPermission, type Role } from "../utils/Permissions";

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  if (!user) return null;

  const irARRHH = () => {
    if (!user) return;
    console.log("a ver: ",user.rol);
    // 1. ADMIN → admin RRHH
    if (user.rol === "ADMIN") {
      console.log("entra a admin");
      navigate("/rrhh/admin/");
      return;
    }

    // 2. JEFE → ruta jefe con id departamento
    if (/^JEFE_/i.test(user.rol)) {
      const idDepto = user.id_departamento || null;
      console.log("Entra a jefe");
      if (!idDepto) {
        console.warn("El usuario jefe no tiene id_departamento definido");
        navigate("/");
        return;
      }

      navigate(`/rrhh/jefe/mis-empleados/${idDepto}`);
      return;
    }

    // 3. Cualquier usuario puede entrar a rrhh, pero entrará como empleado
    console.log("entra a empleado");
    navigate("/rrhh/empleado/");
  };

  const irAInventario = () => {
    navigate("/inventario");
  };

  const irAVentas = () => {
    navigate("/ventas");
  };

  const irACompras = () => {
    navigate('/compras');
  };

  const handleLogout = () => {
    logout();
  };


  return (
    <div className="home-container">
      <h1>Bienvenido al Mini-ERP</h1>
      <p>Selecciona el módulo al que deseas ingresar:</p>

      <div className="module-grid">
        {hasPermission(user.rol as Role, "puedeVerInventario") && (
          <button className="module-button" onClick={irAInventario}>
            Inventario
          </button>
        )}

        {hasPermission(user.rol as Role, "puedeVerVentas") && (
          <button className="module-button" onClick={irAVentas}>
            Ventas
          </button>
        )}

        {hasPermission(user.rol as Role, "puedeVerRRHH") && (
          <button className="module-button" onClick={irARRHH}>
            RRHH
          </button>
        )}

        {hasPermission(user.rol as Role, "puedeVerCompras") && (
          <button className="module-button" onClick={irACompras}>
            Compras
          </button>
        )}

        {hasPermission(user.rol as Role, "puedeVerLogistica") && (
          <button className="module-button disabled" disabled>
            Logística/Despacho
          </button>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
