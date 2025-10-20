
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return(
        <div className="home-container">
            <div className="home-header">
                <h1 className="home-title">Bienvenido al ERP</h1>
                <p className="home-subtitle">Sistema de Gestión Empresarial</p>
            </div>
            
            <div className="home-content">
                <h2 className="modules-title">Módulos Disponibles</h2>
                
                <div className="modules-grid">
                    
                    {/* Módulo de Compras Activo */}
                    <div className="compras-section">
                        <h3>Módulo de Compras</h3>
                        <p>
                            Gestiona las órdenes de compra, proveedores y procesos de adquisición.
                        </p>
                        <div className="compras-links">
                            <Link to="/compras/nueva-orden" className="compras-link">
                                Nueva Orden de Compra
                            </Link>
                            <Link to="/compras/ordenes" className="compras-link">
                                Ver Órdenes
                            </Link>
                        </div>
                    </div>

                    {/* Otros módulos (próximamente) */}
                    <div className="module-card" style={{ opacity: 0.6 }}>
                        <h3>Módulo de Inventario</h3>
                        <p>Control de stock y gestión de inventarios.</p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            Próximamente
                        </span>
                    </div>

                    <div className="module-card" style={{ opacity: 0.6 }}>
                        <h3>Módulo de Ventas</h3>
                        <p>Gestión de ventas, clientes y facturación.</p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            Próximamente
                        </span>
                    </div>

                    <div className="module-card" style={{ opacity: 0.6 }}>
                        <h3>Recursos Humanos</h3>
                        <p>Gestión de empleados, nóminas y recursos humanos.</p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            Próximamente
                        </span>
                    </div>

                    <div className="module-card" style={{ opacity: 0.6 }}>
                        <h3>Módulo de Logística</h3>
                        <p>Control de envíos, distribución y logística.</p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            Próximamente
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;