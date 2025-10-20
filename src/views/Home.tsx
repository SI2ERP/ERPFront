
import { Link } from "react-router-dom";

const Home = () => {
    return(
        <div style={{ 
            maxWidth: '1000px', 
            margin: '0 auto', 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        }}>
            <div style={{ 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '10px' }}>Bienvenido al ERP</h1>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>Sistema de Gestión Empresarial</p>
            </div>
            
            <div style={{ 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
                <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>Módulos Disponibles</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    
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
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link 
                                to="/compras/nueva-orden"
                                style={{ 
                                    display: 'inline-block',
                                    padding: '10px 20px',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                    fontSize: '14px'
                                }}
                            >
                                Nueva Orden de Compra
                            </Link>
                            <Link 
                                to="/compras/ordenes"
                                style={{ 
                                    display: 'inline-block',
                                    padding: '10px 20px',
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                    fontSize: '14px'
                                }}
                            >
                                Ver Órdenes
                            </Link>
                        </div>
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