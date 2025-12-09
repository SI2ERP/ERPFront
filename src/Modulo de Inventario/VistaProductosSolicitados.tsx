import React, { useState, useEffect } from 'react';
import './Inventario.css';
import { getProductosSolicitados, type ProductoSolicitado} from './inventario.service';

const VistaProductosSolicitados = () => {
    const [solicitudes, setSolicitudes] = useState<ProductoSolicitado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarSolicitudes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProductosSolicitados();
            setSolicitudes(data); 
        } catch (err) {
            setError("Error al cargar la lista de productos solicitados. Verifique la conexión o el endpoint.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const formatFecha = (fecha: Date | string): string => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL');
    };
    
    // Determinar el display de estado basado en el booleano (estado_solicitud)
    const getEstadoDisplay = (estado_solicitud: boolean): { texto: string, style: React.CSSProperties } => {
        if (estado_solicitud) {
            // Muestra el estado TRUE como PROCESADO
            return { texto: 'PROCESADO', style: { color: '#64ff64', fontWeight: 'bold' } }; 
        }
        // Muestra el estado FALSE como PENDIENTE
        return { texto: 'PENDIENTE', style: { color: '#FFA500', fontWeight: 'bold' } }; 
    };

    return (
        <div className="vista-productos-solicitados" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5em', color: 'white' }}>Historial de Productos Solicitados</h2>

            {error && <p className="error-mensaje">{error}</p>}

            <div className="tabla-wrapper">
                {/* La tabla ahora tiene 5 columnas */}
                <table className="tabla-productos"> 
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Producto</th>
                            <th>Descripción</th>
                            <th>Fecha Solicitud</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando solicitudes</td></tr>
                        ) : solicitudes.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No hay solicitudes de productos registradas.</td></tr>
                        ) : (
                            solicitudes.map(s => {
                                const estadoInfo = getEstadoDisplay(s.estado_solicitud);
                                return (
                                    <tr key={s.id_solicitud}>
                                        <td>{s.id_solicitud}</td>
                                        <td>{s.nombre}</td>
                                        <td>{s.descripcion}</td>
                                        <td>{formatFecha(s.fecha_solicitud)}</td>
                                        <td style={estadoInfo.style}>
                                            {estadoInfo.texto}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default VistaProductosSolicitados;