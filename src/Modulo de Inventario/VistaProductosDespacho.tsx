import React, { useState, useEffect } from 'react';
import { getProductosPorDespachar, type ProductoPorDespachar } from './inventario.service'; 
import './Inventario.css'; 

const VistaProductosDespacho = () => {
    const [productosDespacho, setProductosDespacho] = useState<ProductoPorDespachar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarProductosDespacho = async () => {
        setLoading(true);
        try {
            const data = await getProductosPorDespachar();
            setProductosDespacho(data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar productos por despachar:", err);
            setError("No se pudo cargar la lista de productos pendientes de despacho.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductosDespacho();
    }, []);

    const formatFecha = (fecha: Date | string): string => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL'); 
    };

    if (loading) {
        return <p style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando productos para despacho...</p>;
    }

    if (error) {
        return <p className="error-mensaje" style={{ textAlign: 'center', padding: '2rem' }}>{error}</p>;
    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5em' }}>Productos Pendientes de Despacho</h2>

            {error && <p className="error-mensaje">{error}</p>}

            <div className="tabla-wrapper">

                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre del Producto</th>
                            <th>Cantidad a Despachar</th>
                            <th>Fecha de Registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosDespacho.length === 0 ? (
                            <tr>
                                
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                    No hay productos pendientes de despacho.
                                </td>
                            </tr>
                        ) : (
                            productosDespacho.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.producto.codigo}</td>
                                    <td>{item.producto.nombre}</td>
                                    <td style={{ textAlign: 'center' }}>{item.cantidad_por_despachar}</td>
                                    <td>{formatFecha(item.fecha_registro)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VistaProductosDespacho;