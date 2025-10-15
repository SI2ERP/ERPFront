
import { Link } from "react-router-dom";

const Home = () => {
    return(
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Bienvenido al ERP</h1>
            <p>Sistema de Gestión Empresarial</p>
            
            <div style={{ marginTop: '30px' }}>
                <h2>Módulos Disponibles</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    
                    {/* Módulo de Compras */}
                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}> Módulo de Compras</h3>
                        <p style={{ marginBottom: '15px', color: '#666' }}>
                            Gestiona las órdenes de compra, proveedores y procesos de adquisición.
                        </p>
                        <Link 
                            to="/compras/nueva-orden"
                            style={{ 
                                display: 'inline-block',
                                padding: '10px 20px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            Nueva Orden de Compra
                        </Link>
                    </div>

                    {/* Otros módulos (placeholders) */}
                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: '0.6'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}> Módulo de Inventario</h3>
                        <p style={{ marginBottom: '15px', color: '#666' }}>
                            Control de stock y gestión de inventarios.
                        </p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px'
                        }}>
                            Próximamente
                        </span>
                    </div>

                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: '0.6'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}> Módulo de Ventas</h3>
                        <p style={{ marginBottom: '15px', color: '#666' }}>
                            Gestión de ventas, clientes y facturación.
                        </p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px'
                        }}>
                            Próximamente
                        </span>
                    </div>

                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: '0.6'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}> Recursos Humanos</h3>
                        <p style={{ marginBottom: '15px', color: '#666' }}>
                            Gestión de empleados, nóminas y recursos humanos.
                        </p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px'
                        }}>
                            Próximamente
                        </span>
                    </div>

                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: '0.6'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}> Módulo de Logística</h3>
                        <p style={{ marginBottom: '15px', color: '#666' }}>
                            Control de envíos, distribución y logística.
                        </p>
                        <span style={{ 
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            borderRadius: '4px'
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