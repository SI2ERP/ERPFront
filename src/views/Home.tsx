
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const irACompras = () => {
    navigate('/compras');
  }

  const irARRHH = () => {
    navigate('/rrhh');
  }

  return (
    <div className="home-container">
      <h1>Bienvenido al Mini-ERP</h1>
      <p>Selecciona el módulo al que deseas ingresar:</p>

      <div className="module-grid">
        {/* Módulo de Compras */}
        <button className="module-button" onClick={irACompras}>
          Compras
        </button>

        {/* Módulo de RRHH */}
        <button className="module-button" onClick={irARRHH}>
          RRHH
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;