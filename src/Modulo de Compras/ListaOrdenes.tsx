import React, { useState, useEffect } from 'react';
import comprasService, { type OrdenCompraResponse } from './comprasService';
import './ListaOrdenes.css';

const ListaOrdenes: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompraResponse[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [eliminando, setEliminando] = useState<number | null>(null);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setCargando(true);
      const ordenesData = await comprasService.obtenerOrdenes();
      setOrdenes(ordenesData);
      setError('');
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      setError('Error al cargar las órdenes. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoOrden = async (id: number, nuevoEstado: string) => {
    try {
      // Convertir el estado a mayúsculas para que coincida con la BD
      const estadoEnMayusculas = nuevoEstado.toUpperCase();
      
      await comprasService.actualizarOrden(id, { estado: estadoEnMayusculas as any });
      setOrdenes(ordenes.map(orden => 
        orden.id_orden_compra === id 
          ? { ...orden, estado: estadoEnMayusculas as any }
          : orden
      ));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado de la orden');
    }
  };

  const eliminarOrden = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar esta orden de compra? Esta acción no se puede deshacer.')) {
      try {
        setEliminando(id); // Marcar que esta orden se está eliminando
        console.log(`Intentando eliminar orden con ID: ${id}`);
        
        await comprasService.eliminarOrden(id);
        console.log(`Orden ${id} eliminada exitosamente`);
        
        // Actualizar la lista local
        setOrdenes(ordenes.filter(orden => orden.id_orden_compra !== id));
        
        // Mostrar mensaje de éxito
        alert('Orden eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar orden:', error);
        alert(`Error al eliminar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setEliminando(null); // Limpiar el estado de eliminando
      }
    }
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoClase = (estado: string): string => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'pendiente': return 'estado-pendiente';
      case 'aprobada': return 'estado-aprobada';
      case 'rechazada': return 'estado-rechazada';
      case 'recibida': return 'estado-completada'; // Mapear 'recibida' como completada
      case 'completada': return 'estado-completada'; // Por compatibilidad
      default: return '';
    }
  };

  const ordenesFiltradas = filtroEstado 
    ? ordenes.filter(orden => orden.estado.toLowerCase() === filtroEstado.toLowerCase())
    : ordenes;

  if (cargando) {
    return (
      <div className="lista-ordenes-container">
        <div className="loading-container">
          <h2>Cargando órdenes...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-ordenes-container">
      <div className="lista-ordenes-header">
        <h2>Órdenes de Compra</h2>
        <div className="acciones-header">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-estado"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="recibida">Recibida</option>
          </select>
          <button 
            onClick={cargarOrdenes}
            className="btn-actualizar"
          >
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="mensaje-error">
          {error}
        </div>
      )}

      {ordenesFiltradas.length === 0 ? (
        <div className="sin-ordenes">
          <p>No hay órdenes de compra {filtroEstado && `con estado "${filtroEstado}"`}</p>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla-ordenes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Empleado</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((orden) => (
                <tr key={orden.id_orden_compra}>
                  <td>#{orden.id_orden_compra}</td>
                  <td>{orden.proveedor_nombre || 'N/A'}</td>
                  <td>{orden.empleado_nombre || 'N/A'}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>
                    <span className={`estado-badge ${getEstadoClase(orden.estado)}`}>
                      {orden.estado ? orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1).toLowerCase() : 'Sin estado'}
                    </span>
                  </td>
                  <td className="acciones-columna">
                    {orden.estado.toLowerCase() === 'pendiente' && (
                      <>
                        <button
                          onClick={() => cambiarEstadoOrden(orden.id_orden_compra, 'aprobada')}
                          className="btn-aprobar"
                          title="Aprobar orden"
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => cambiarEstadoOrden(orden.id_orden_compra, 'rechazada')}
                          className="btn-rechazar"
                          title="Rechazar orden"
                        >
                          ✗ Rechazar
                        </button>
                      </>
                    )}
                    {orden.estado.toLowerCase() === 'aprobada' && (
                      <button
                        onClick={() => cambiarEstadoOrden(orden.id_orden_compra, 'recibida')}
                        className="btn-completar"
                        title="Marcar como recibida"
                      >
                        ✓ Marcar Recibida
                      </button>
                    )}
                    <button
                      onClick={() => eliminarOrden(orden.id_orden_compra)}
                      className="btn-eliminar"
                      title="Eliminar orden"
                      disabled={eliminando === orden.id_orden_compra}
                    >
                      {eliminando === orden.id_orden_compra ? 'Eliminando...' : ' Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="estadisticas">
        <div className="estadistica">
          <span className="numero">{ordenes.filter(o => o.estado.toLowerCase() === 'pendiente').length}</span>
          <span className="etiqueta">Pendientes</span>
        </div>
        <div className="estadistica">
          <span className="numero">{ordenes.filter(o => o.estado.toLowerCase() === 'aprobada').length}</span>
          <span className="etiqueta">Aprobadas</span>
        </div>
        <div className="estadistica">
          <span className="numero">{ordenes.filter(o => ['recibida', 'completada'].includes(o.estado.toLowerCase())).length}</span>
          <span className="etiqueta">Recibidas</span>
        </div>
        <div className="estadistica">
          <span className="numero">{ordenes.length}</span>
          <span className="etiqueta">Total</span>
        </div>
      </div>
    </div>
  );
};

export default ListaOrdenes;