import React, { useState, useEffect } from 'react';
import './Inventario.css';
import { getMovimientosLogistica, getAjustesManuales, type MovimientoLogistica, type AjusteManual , generarPDFMovimiento} from './inventario.service';

type TipoMovimiento = 'logistica' | 'ajustes';

const VistaMovimientos = () => {
    const [seccionActual, setSeccionActual] = useState<TipoMovimiento>('logistica');
    
    const [movimientosLogistica, setMovimientosLogistica] = useState<MovimientoLogistica[]>([]);
    const [ajustesManuales, setAjustesManuales] = useState<AjusteManual[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarDatosLogistica = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMovimientosLogistica();
            setMovimientosLogistica(data);
        } catch (err) {
            setError("Error al cargar los movimientos automáticos de Logística.");
        } finally {
            setLoading(false);
        }
    };

    const cargarDatosAjustes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAjustesManuales();
            setAjustesManuales(data);
        } catch (err) {
            setError("Error al cargar los ajustes manuales de Inventario.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (seccionActual === 'logistica') {
            cargarDatosLogistica();
        } else if (seccionActual === 'ajustes') {
            cargarDatosAjustes();
        }
    }, [seccionActual]);


    const formatFecha = (fecha: Date | string): string => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL');
    };

    // mostrar nombre completo del empleado
    const getNombreCompleto = (empleado: { nombre: string, apellido: string }) => {
        return `${empleado.nombre} ${empleado.apellido}`;
    };

    // Generar PDF

    type MovimientoData = MovimientoLogistica | AjusteManual; // Definición del tipo para uso local

    const handleGenerarPdf = (id: number, tipo: TipoMovimiento) => {
        let movimiento: MovimientoData | undefined;

        if (tipo === 'ajustes') {
            // Busca el ajuste manual por ID
            movimiento = ajustesManuales.find(a => a.id === id);
        } else {
            // Busca el movimiento de logística por ID
            movimiento = movimientosLogistica.find(m => m.id === id);
        }

        if (movimiento) {
            // Llama a la nueva función del servicio para generar el PDF serio
            generarPDFMovimiento(movimiento, tipo); 
        } else {
            // Mensaje de error si no se encuentra el registro
            alert("Error: No se encontró el registro para generar el PDF.");
        }
    };

    // --- Tabla de Movimientos Automáticos (Logística) ---

    const TablaLogistica = () => (
        <div className="tabla-wrapper">
            <table className="tabla-productos">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Producto</th>
                        <th>Encargado</th>
                        <th>Tipo Operación</th>
                        <th style={{ textAlign: 'center' }}>Cantidad</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientosLogistica.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No hay movimientos de Logística registrados.</td></tr>
                    ) : (
                        movimientosLogistica.map(mov => (
                            <tr key={mov.id}>
                                <td>{mov.producto.codigo}</td>
                                <td>{mov.producto.nombre}</td>
                                <td>{getNombreCompleto(mov.empleado)}</td> 
                                <td>
                                    <span style={{ color: mov.es_recepcion ? '#64ff64' : '#ff6464' }}>
                                        {mov.es_recepcion ? 'Ingreso' : 'Salida'}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {mov.es_recepcion ? '' : '-'}
                                    {mov.cantidad}
                                </td>
                                <td>{formatFecha(mov.fecha_movimiento)}</td>
                                <td>
                                    <button className="btn-retirar" onClick={() => handleGenerarPdf(mov.id, 'logistica')}>
                                        Generar PDF
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    // --- Tabla de Ajustes Manuales ---

    const TablaAjustes = () => (
        <div className="tabla-wrapper">
            <table className="tabla-productos">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Producto</th>
                        <th>Encargado</th>
                        <th>Observaciones</th>
                        <th style={{ textAlign: 'center' }}>Cantidad</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ajustesManuales.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No hay ajustes manuales registrados.</td></tr>
                    ) : (
                        ajustesManuales.map(ajuste => (
                            <tr key={ajuste.id}>
                                <td>{ajuste.producto.codigo}</td>
                                <td>{ajuste.producto.nombre}</td>
                                <td>{getNombreCompleto(ajuste.empleado)}</td> 
                                <td>{ajuste.observaciones}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span style={{ color: ajuste.cantidad >= 0 ? '#64ff64' : '#ff6464' }}>
                                        {ajuste.cantidad}
                                    </span>
                                </td>
                                <td>{formatFecha(ajuste.fechaAjuste)}</td>
                                <td>
                                    <button className="btn-retirar" onClick={() => handleGenerarPdf(ajuste.id, 'ajustes')}>
                                        Generar PDF
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    // --- Renderizado Principal ---

    return (
        <div className="vista-movimientos-historial" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5em', color: 'white' }}>Historial de Movimientos</h2>

            {/* Pestañas */}
            <div className="tabs-movimientos" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button 
                    className={seccionActual === 'logistica' ? 'btn-tab-active' : 'btn-tab'}
                    onClick={() => setSeccionActual('logistica')}
                >
                    Movimientos Automáticos (Logística)
                </button>
                <button 
                    className={seccionActual === 'ajustes' ? 'btn-tab-active' : 'btn-tab'}
                    onClick={() => setSeccionActual('ajustes')}
                >
                    Ajustes Manuales
                </button>
            </div>
            
            {error && <p className="error-mensaje">{error}</p>}

            {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando datos...</p>
            ) : (
                <>
                    {seccionActual === 'logistica' && <TablaLogistica />}
                    {seccionActual === 'ajustes' && <TablaAjustes />}
                </>
            )}
        </div>
    );
};

export default VistaMovimientos;