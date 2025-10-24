
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Ir a la página de inventario
  const irAInventario = () => {
    navigate('/inventario'); 
  };

  // Ir a la página de compras
  const irACompras = () => {
    navigate('/compras');
  };

  return (
    <div className="home-container">
      <h1>Bienvenido al Mini-ERP</h1>
      <p>Selecciona el módulo al que deseas ingresar:</p>

      <div className="module-grid">
        {/* 1. Botón de Inventario (Aún sin navegación) */}
        <button className="module-button" onClick={irAInventario}>
          Inventario
        </button>

        {/* 2. Botones de otros módulos (Deshabilitados) */}
        <button className="module-button disabled" disabled>
          Ventas
        </button>

        <button className="module-button" onClick={irACompras}>
          Compras
        </button>

        <button className="module-button disabled" disabled>
          RRHH
        </button>
        
        <button className="module-button disabled" disabled>
          Logística/Despacho
        </button>
      </div>
    </div>
  );
};

export default Home;