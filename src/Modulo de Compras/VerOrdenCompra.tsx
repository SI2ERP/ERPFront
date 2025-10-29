import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import comprasService, { type OrdenCompraCompleta } from './comprasService';
import './VerOrdenCompra.css';

const VerOrdenCompra: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [orden, setOrden] = useState<OrdenCompraCompleta | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      cargarOrdenCompleta();
    }
  }, [id]);

  const cargarOrdenCompleta = async () => {
    try {
      setCargando(true);
      setError('');
      
      // Obtener todas las órdenes completas y filtrar por ID
      const ordenesCompletas = await comprasService.obtenerOrdenesCompletas();
      const ordenEncontrada = ordenesCompletas.find(o => o.id_orden_compra === parseInt(id!));
      
      if (ordenEncontrada) {
        setOrden(ordenEncontrada);
      } else {
        setError('Orden de compra no encontrada');
      }
    } catch (error) {
      console.error('Error al cargar orden completa:', error);
      setError('Error al cargar la orden de compra');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
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

  if (cargando) {
    return (
      <div className="ver-orden-container">
        <div className="cargando">
          <p>Cargando información de la orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ver-orden-container">
        <div className="error-mensaje">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/compras')} className="btn-volver">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="ver-orden-container">
        <div className="error-mensaje">
          <h3>Orden no encontrada</h3>
          <p>La orden de compra solicitada no existe o ha sido eliminada.</p>
          <button onClick={() => navigate('/compras')} className="btn-volver">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ver-orden-container">
      <div className="ver-orden-header">
        <div className="header-left">
          <button onClick={() => navigate('/compras')} className="btn-volver">
            ← Volver
          </button>
          <h1>Orden de Compra #{orden.id_orden_compra}</h1>
        </div>
        <div className="header-right">
          <span className={`estado-badge ${getEstadoClase(orden.estado)}`}>
            {orden.estado.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="orden-contenido">
        {/* Información General */}
        <div className="seccion-info">
          <h2>Información General</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Número de Orden:</label>
              <span>#{orden.id_orden_compra}</span>
            </div>
            <div className="info-item">
              <label>Fecha:</label>
              <span>{formatearFecha(orden.fecha)}</span>
            </div>
            <div className="info-item">
              <label>Estado:</label>
              <span>{orden.estado.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <label>Total:</label>
              <span className="total-orden">{formatearMoneda(orden.total_orden)}</span>
            </div>
          </div>
        </div>

        {/* Información del Proveedor */}
        <div className="seccion-info">
          <h2>Información del Proveedor</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Nombre:</label>
              <span>{orden.proveedor.nombre}</span>
            </div>
            <div className="info-item">
              <label>RUT:</label>
              <span>{orden.proveedor.rut}</span>
            </div>
            <div className="info-item">
              <label>Dirección:</label>
              <span>{orden.proveedor.direccion}</span>
            </div>
            <div className="info-item">
              <label>Teléfono:</label>
              <span>{orden.proveedor.telefono}</span>
            </div>
          </div>
        </div>

        {/* Información del Empleado */}
        <div className="seccion-info">
          <h2>Empleado Responsable</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Nombre:</label>
              <span>{orden.empleado.nombre}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{orden.empleado.email}</span>
            </div>
          </div>
        </div>

        {/* Detalle de Productos */}
        <div className="seccion-productos">
          <h2>Detalle de Productos</h2>
          <div className="tabla-productos-container">
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                </tr>
              </thead>
              <tbody>
                {orden.detalle.map((item) => (
                  <tr key={item.id_detalle_compra}>
                    <td className="producto-nombre">{item.producto_nombre}</td>
                    <td className="producto-descripcion">{item.producto_descripcion}</td>
                    <td className="cantidad">{item.cantidad}</td>
                    <td className="precio-unitario">{formatearMoneda(item.precio_unitario)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="fila-subtotal">
                  <td colSpan={3} className="texto-derecha"><strong>Subtotal:</strong></td>
                  <td className="valor-total"><strong>{formatearMoneda(orden.subtotal ?? 0)}</strong></td>
                </tr>
                <tr className="fila-iva">
                  <td colSpan={3} className="texto-derecha"><strong>IVA (19%):</strong></td>
                  <td className="valor-total"><strong>{formatearMoneda(orden.iva ?? 0)}</strong></td>
                </tr>
                <tr className="fila-total">
                  <td colSpan={3} className="texto-derecha"><strong>Total de la Orden:</strong></td>
                  <td className="valor-total-final"><strong>{formatearMoneda(orden.total ?? orden.total_orden ?? 0)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerOrdenCompra;