import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import comprasService, { type OrdenCompraResponse } from './comprasService';
import './ListaOrdenes.css';

const ListaOrdenes: React.FC = () => {
  // Hook para navegación y autenticación
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [ordenes, setOrdenes] = useState<OrdenCompraResponse[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState<Set<number>>(new Set());
  const [eliminandoSeleccionadas, setEliminandoSeleccionadas] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | 'warning'>('success');
  const [contadorSinStock, setContadorSinStock] = useState<number>(0);

  // Verificar si el usuario es Jefe de Compras (tiene permisos para aprobar/rechazar/eliminar)
  const esJefeCompras = user?.rol === 'JEFE_COMPRAS' || user?.rol === 'ADMIN' || user?.rol === 'GERENTE' || user?.rol === 'TESTING';

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Llamar al logout del contexto
    logout();
  };

  useEffect(() => {
    cargarOrdenes();
    cargarContadorSinStock();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setCargando(true);
      const ordenesData = await comprasService.obtenerOrdenes();
      setOrdenes(ordenesData);
      setError('');
    } catch (error: any) {
      console.error('Error al cargar órdenes:', error);
      console.error('Detalles del error:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      const mensajeError = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          'Error al cargar las órdenes. Por favor, intenta nuevamente.';
      
      setError(`Error ${error.response?.status || ''}: ${mensajeError}`);
    } finally {
      setCargando(false);
    }
  };

  const cargarContadorSinStock = async () => {
    try {
      const contador = await comprasService.obtenerContadorProductosSinStock();
      setContadorSinStock(contador);
    } catch (error) {
      console.error('Error al cargar contador de productos sin stock:', error);
      setContadorSinStock(0);
    }
  };

  const cambiarEstadoOrden = async (id: number, nuevoEstado: string) => {
    try {
      // Enviar el estado en mayúsculas como espera el backend
      const estadoEnMayusculas = nuevoEstado.toUpperCase();
      
      await comprasService.actualizarOrden(id, { estado: estadoEnMayusculas as any });
      setOrdenes(ordenes.map(orden => 
        orden.id_orden_compra === id 
          ? { ...orden, estado: estadoEnMayusculas as any }
          : orden
      ));
      
      // Mostrar mensaje de éxito
      const accion = estadoEnMayusculas === 'APROBADA' ? 'aprobada' : 'rechazada';
      const mensajeEstado = `Orden ${accion} correctamente${estadoEnMayusculas === 'APROBADA' ? '. Ahora debe gestionar el pago en Gestión de Pagos.' : ''}`;
      mostrarMensaje(mensajeEstado, 'success');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarMensaje('Error al cambiar el estado de la orden', 'error');
    }
  };

  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' | 'warning' = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setMensaje('');
    }, 5000);
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
        
        // Remover de seleccionadas si estaba seleccionada
        setOrdenesSeleccionadas(prev => {
          const nuevasSeleccionadas = new Set(prev);
          nuevasSeleccionadas.delete(id);
          return nuevasSeleccionadas;
        });
        
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

  const toggleSeleccionOrden = (id: number) => {
    setOrdenesSeleccionadas(prev => {
      const nuevasSeleccionadas = new Set(prev);
      if (nuevasSeleccionadas.has(id)) {
        nuevasSeleccionadas.delete(id);
      } else {
        nuevasSeleccionadas.add(id);
      }
      return nuevasSeleccionadas;
    });
  };

  const toggleSeleccionarTodas = () => {
    const todasSeleccionadas = ordenesSeleccionadas.size === ordenesFiltradas.length && ordenesFiltradas.length > 0;
    
    if (todasSeleccionadas) {
      // Deseleccionar todas
      setOrdenesSeleccionadas(new Set());
    } else {
      // Seleccionar todas las filtradas
      const idsVisibles = ordenesFiltradas.map(orden => orden.id_orden_compra);
      setOrdenesSeleccionadas(new Set(idsVisibles));
    }
  };

  const eliminarSeleccionadas = async () => {
    const cantidadSeleccionadas = ordenesSeleccionadas.size;
    
    if (cantidadSeleccionadas === 0) {
      alert('No hay órdenes seleccionadas para eliminar.');
      return;
    }

    if (confirm(`¿Está seguro de que desea eliminar ${cantidadSeleccionadas} orden(es) seleccionada(s)? Esta acción no se puede deshacer.`)) {
      try {
        setEliminandoSeleccionadas(true);
        
        // Eliminar todas las órdenes seleccionadas
        const promesasEliminacion = Array.from(ordenesSeleccionadas).map(id => 
          comprasService.eliminarOrden(id)
        );
        
        await Promise.all(promesasEliminacion);
        
        // Actualizar la lista local
        setOrdenes(ordenes.filter(orden => !ordenesSeleccionadas.has(orden.id_orden_compra)));
        
        // Limpiar selecciones
        setOrdenesSeleccionadas(new Set());
        
        alert(`${cantidadSeleccionadas} orden(es) eliminada(s) exitosamente`);
      } catch (error) {
        console.error('Error al eliminar órdenes seleccionadas:', error);
        alert(`Error al eliminar algunas órdenes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setEliminandoSeleccionadas(false);
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
      case 'completada': return 'estado-completada';
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
      {/* Header con navegación y cerrar sesión */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f8c8d'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#95a5a6'}
        >
          ← Volver al Menú Principal
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
            {user?.nombre} {user?.apellido || ''}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="lista-ordenes-header">
        <h2>Órdenes de Compra</h2>
        <div className="acciones-header">
          <button 
            onClick={() => navigate('/compras/nueva')}
            className="btn-nueva-orden"
          >
            + Nueva Orden
          </button>
          <button
            onClick={() => navigate('/compras/productos-sin-stock')}
            className="btn-productos-sin-stock"
          >
             Productos Sin Stock
             {contadorSinStock > 0 && (
               <span className="badge-contador">{contadorSinStock}</span>
             )}
          </button>

          {/* Botón para Solicitudes de Nuevos Productos - Solo JEFE_COMPRAS */}
          {esJefeCompras && (
            <button
              onClick={() => navigate('/compras/solicitudes-nuevos-productos')}
              className="btn-solicitudes-nuevos"
            >
              Solicitudes Nuevos Productos
            </button>
          )}
          
          {/* Botón para acceder a Gestión de Pagos - Solo JEFE_COMPRAS */}
          {esJefeCompras && (
            <button
              onClick={() => navigate('/compras/pagos-proveedores')}
              className="btn-pagos-proveedores"
            >
              Gestion de Pagos
            </button>
          )}
          
          {/* Solo JEFE_COMPRAS puede eliminar múltiples órdenes */}
          {esJefeCompras && ordenesSeleccionadas.size > 0 && (
            <button 
              onClick={eliminarSeleccionadas}
              className="btn-eliminar-seleccionadas"
              disabled={eliminandoSeleccionadas}
            >
              {eliminandoSeleccionadas ? 'Eliminando...' : `🗑 Eliminar ${ordenesSeleccionadas.size} seleccionada(s)`}
            </button>
          )}
          
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-estado"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
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

      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          {mensaje}
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
                {/* Solo mostrar checkbox si es JEFE_COMPRAS */}
                {esJefeCompras && (
                  <th className="checkbox-columna">
                    <input
                      type="checkbox"
                      checked={ordenesSeleccionadas.size === ordenesFiltradas.length && ordenesFiltradas.length > 0}
                      onChange={toggleSeleccionarTodas}
                      title="Seleccionar/Deseleccionar todas"
                    />
                  </th>
                )}
                <th>Proveedor</th>
                <th>Empleado</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((orden) => (
                <tr key={orden.id_orden_compra} className={ordenesSeleccionadas.has(orden.id_orden_compra) ? 'fila-seleccionada' : ''}>
                  {/* Solo mostrar checkbox si es JEFE_COMPRAS */}
                  {esJefeCompras && (
                    <td className="checkbox-columna">
                      <input
                        type="checkbox"
                        checked={ordenesSeleccionadas.has(orden.id_orden_compra)}
                        onChange={() => toggleSeleccionOrden(orden.id_orden_compra)}
                      />
                    </td>
                  )}
                  <td>{orden.proveedor_nombre || 'N/A'}</td>
                  <td>{orden.empleado_nombre || 'N/A'}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>
                    <span className={`estado-badge ${getEstadoClase(orden.estado)}`}>
                      {orden.estado ? orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1).toLowerCase() : 'Sin estado'}
                    </span>
                  </td>
                  <td className="acciones-columna">
                    <button
                      onClick={() => navigate(`/compras/ver/${orden.id_orden_compra}`)}
                      className="btn-ver"
                      title="Ver orden completa"
                    >
                      👁 Ver
                    </button>
                    
                    {/* Solo JEFE_COMPRAS, ADMIN, GERENTE pueden aprobar/rechazar */}
                    {esJefeCompras && orden.estado.toLowerCase() === 'pendiente' && (
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
                    
                    {/* Solo JEFE_COMPRAS, ADMIN, GERENTE pueden eliminar */}
                    {esJefeCompras && (
                      <button
                        onClick={() => eliminarOrden(orden.id_orden_compra)}
                        className="btn-eliminar"
                        title="Eliminar orden"
                        disabled={eliminando === orden.id_orden_compra}
                      >
                        {eliminando === orden.id_orden_compra ? 'Eliminando...' : '🗑 Eliminar'}
                      </button>
                    )}
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
          <span className="numero">{ordenes.length}</span>
          <span className="etiqueta">Total</span>
        </div>
        {ordenesSeleccionadas.size > 0 && (
          <div className="estadistica estadistica-seleccionadas">
            <span className="numero">{ordenesSeleccionadas.size}</span>
            <span className="etiqueta">Seleccionadas</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaOrdenes;