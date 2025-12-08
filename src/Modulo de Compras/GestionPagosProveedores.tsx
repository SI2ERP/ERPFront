import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import comprasService, { type OrdenProveedor } from './comprasService';
import './GestionPagosProveedores.css';

const GestionPagosProveedores: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ordenes, setOrdenes] = useState<OrdenProveedor[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroPagado, setFiltroPagado] = useState<string>('');
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false);
  const [pagando, setPagando] = useState<number | null>(null);
  const [descargandoFactura, setDescargandoFactura] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | 'warning'>('success');
  const [mostrarDialogoConfirmacion, setMostrarDialogoConfirmacion] = useState<boolean>(false);
  const [ordenAConfirmar, setOrdenAConfirmar] = useState<number | null>(null);

  // Verificar si el usuario es Jefe de Compras
  const esJefeCompras = user?.rol === 'JEFE_COMPRAS' || user?.rol === 'ADMIN' || user?.rol === 'GERENTE' || user?.rol === 'TESTING';

  useEffect(() => {
    // Verificar permisos
    if (!esJefeCompras) {
      mostrarMensaje('No tienes permisos para acceder a esta sección', 'error');
      navigate('/compras');
      return;
    }

    cargarOrdenes();
  }, [mostrarHistorial]);

  const cargarOrdenes = async () => {
    try {
      setCargando(true);
      let ordenesData;
      
      if (mostrarHistorial) {
        ordenesData = await comprasService.obtenerOrdenesProveedores();
      } else {
        ordenesData = await comprasService.obtenerOrdenesProveedoresActivas();
      }
      
      setOrdenes(ordenesData);
      setError('');
    } catch (error: any) {
      console.error('Error al cargar órdenes de proveedores:', error);
      const mensajeError = error.message || 'Error al cargar las órdenes de proveedores';
      setError(mensajeError);
      mostrarMensaje(mensajeError, 'error');
    } finally {
      setCargando(false);
    }
  };

  const pagarOrden = async (idOcProveedor: number) => {
    setOrdenAConfirmar(idOcProveedor);
    setMostrarDialogoConfirmacion(true);
  };

  const confirmarPago = async () => {
    if (!ordenAConfirmar) return;

    try {
      setPagando(ordenAConfirmar);
      setMostrarDialogoConfirmacion(false);
      const resultado = await comprasService.pagarOrden(ordenAConfirmar);
      
      mostrarMensaje(resultado.mensaje, 'success');
      
      // Recargar toda la lista para asegurar que se actualice correctamente
      await cargarOrdenes();
    } catch (error: any) {
      console.error('Error al pagar orden:', error);
      const mensajeError = error.message || 'Error al marcar la orden como pagada';
      mostrarMensaje(mensajeError, 'error');
    } finally {
      setPagando(null);
      setOrdenAConfirmar(null);
    }
  };

  const cancelarPago = () => {
    setMostrarDialogoConfirmacion(false);
    setOrdenAConfirmar(null);
  };

  const descargarFactura = async (idOrdenCompra: number) => {
    try {
      setDescargandoFactura(idOrdenCompra);
      await comprasService.descargarFactura(idOrdenCompra);
      mostrarMensaje('Factura descargada correctamente', 'success');
    } catch (error: any) {
      console.error('Error al descargar factura:', error);
      const mensajeError = error.message || 'Error al descargar la factura';
      mostrarMensaje(mensajeError, 'error');
    } finally {
      setDescargandoFactura(null);
    }
  };

  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' | 'warning' = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    
    setTimeout(() => {
      setMensaje('');
    }, 5000);
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

  const formatearMoneda = (valor: string): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseFloat(valor));
  };

  const getEstadoClase = (estado: string): string => {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'ACEPTADA': return 'estado-aceptada';
      case 'RECHAZADA': return 'estado-rechazada';
      default: return '';
    }
  };

  const getPagoClase = (pagado: boolean): string => {
    return pagado ? 'pago-realizado' : 'pago-pendiente';
  };

  // Filtrar órdenes
  const ordenesFiltradas = ordenes.filter(orden => {
    const cumpleFiltroEstado = !filtroEstado || orden.estado_proveedor === filtroEstado;
    const cumpleFiltroPagado = !filtroPagado || 
      (filtroPagado === 'pagado' && orden.pago_realizado) ||
      (filtroPagado === 'pendiente' && !orden.pago_realizado);
    
    return cumpleFiltroEstado && cumpleFiltroPagado;
  });

  if (cargando) {
    return (
      <div className="gestion-pagos-container">
        <div className="loading-container">
          <h2>Cargando órdenes de proveedores...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-pagos-container">
      <div className="header-section">
        <button
          type="button"
          onClick={() => navigate('/compras')}
          className="btn-volver"
        >
          Volver a Lista de Ordenes
        </button>
        
        <h1>Gestion de Pagos a Proveedores</h1>

        <button 
          className={`btn-historial ${mostrarHistorial ? 'activo' : ''}`}
          onClick={() => setMostrarHistorial(!mostrarHistorial)}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            backgroundColor: mostrarHistorial ? '#7f8c8d' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {mostrarHistorial ? 'Ocultar Historial' : 'Ver Historial Completo'}
        </button>
      </div>

      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          <p>{mensaje}</p>
          <button onClick={() => setMensaje('')} className="btn-cerrar-mensaje">×</button>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={cargarOrdenes} className="btn-reintentar">
            Reintentar
          </button>
        </div>
      )}

      <div className="filtros-section">
        <div className="filtro-grupo">
          <label>Filtrar por Estado Proveedor:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="ACEPTADA">Aceptada</option>
            <option value="RECHAZADA">Rechazada</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Filtrar por Pago:</label>
          <select 
            value={filtroPagado} 
            onChange={(e) => setFiltroPagado(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos</option>
            <option value="pagado">Pagadas</option>
            <option value="pendiente">Pendientes de Pago</option>
          </select>
        </div>

        <button onClick={cargarOrdenes} className="btn-refrescar">
          Refrescar
        </button>
      </div>

      <div className="tabla-container">
        <table className="tabla-pagos">
          <thead>
            <tr>
              <th>ID OC Proveedor</th>
              <th>ID Orden Compra</th>
              <th>Proveedor</th>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Estado Proveedor</th>
              <th>Pago</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={11} className="no-data">
                  No se encontraron órdenes de proveedores
                </td>
              </tr>
            ) : (
              ordenesFiltradas.map(orden => (
                <tr key={orden.id_oc_proveedor}>
                  <td>{orden.id_oc_proveedor}</td>
                  <td>{orden.id_orden_compra}</td>
                  <td>{orden.proveedor_nombre || `Proveedor #${orden.id_proveedor}`}</td>
                  <td>{orden.empleado_nombre || `Empleado #${orden.id_empleado}`}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>
                    <span className={`badge ${getEstadoClase(orden.estado_proveedor)}`}>
                      {orden.estado_proveedor}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getPagoClase(orden.pago_realizado)}`}>
                      {orden.pago_realizado ? 'PAGADA' : 'PENDIENTE'}
                    </span>
                  </td>
                  <td>{formatearMoneda(orden.subtotal)}</td>
                  <td>{formatearMoneda(orden.iva)}</td>
                  <td className="total-destacado">{formatearMoneda(orden.total)}</td>
                  <td className="acciones-cell">
                    {/* Botón Pagar - solo si está aceptada y no pagada */}
                    {orden.estado_proveedor === 'ACEPTADA' && !orden.pago_realizado && (
                      <button
                        onClick={() => pagarOrden(orden.id_oc_proveedor)}
                        disabled={pagando === orden.id_oc_proveedor}
                        className="btn-pagar"
                        title="Marcar como pagada"
                      >
                        {pagando === orden.id_oc_proveedor ? 'Procesando...' : 'Pagar'}
                      </button>
                    )}

                    {/* Botón Descargar Factura - solo si está pagada */}
                    {orden.pago_realizado && (
                      <button
                        onClick={() => descargarFactura(orden.id_orden_compra)}
                        disabled={descargandoFactura === orden.id_orden_compra}
                        className="btn-factura"
                        title="Descargar factura"
                      >
                        {descargandoFactura === orden.id_orden_compra ? 'Descargando...' : 'Factura'}
                      </button>
                    )}

                    {/* Botón Ver Detalle */}
                    <button
                      onClick={() => navigate(`/compras/ver/${orden.id_orden_compra}`)}
                      className="btn-ver-detalle"
                      title="Ver detalle de la orden"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>Total de Ordenes</h3>
          <p className="info-valor">{ordenes.length}</p>
        </div>
        <div className="info-card">
          <h3>Aceptadas</h3>
          <p className="info-valor">{ordenes.filter(o => o.estado_proveedor === 'ACEPTADA').length}</p>
        </div>
        <div className="info-card">
          <h3>Pendientes de Pago</h3>
          <p className="info-valor">{ordenes.filter(o => o.estado_proveedor === 'ACEPTADA' && !o.pago_realizado).length}</p>
        </div>
        <div className="info-card">
          <h3>Pagadas</h3>
          <p className="info-valor">{ordenes.filter(o => o.pago_realizado).length}</p>
        </div>
      </div>

      {/* Diálogo de confirmación de pago */}
      {mostrarDialogoConfirmacion && (
        <div className="modal-overlay" onClick={cancelarPago}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Pago</h3>
            </div>
            <div className="modal-body">
              <p>¿Está seguro que desea marcar esta orden como pagada?</p>
              <p className="modal-advertencia">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button onClick={cancelarPago} className="btn-modal-cancelar">
                Cancelar
              </button>
              <button onClick={confirmarPago} className="btn-modal-confirmar">
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPagosProveedores;
