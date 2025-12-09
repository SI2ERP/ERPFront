import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import comprasService, { type SolicitudProducto, type Proveedor, type ProcesarSolicitudPayload } from './comprasService';
import { useAuth } from '../utils/AuthContext';
import './SolicitudesNuevosProductos.css';

const SolicitudesNuevosProductos: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudProducto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');
  
  // Estado para el modal
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudProducto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(''), 5000);
  };

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const data = await comprasService.obtenerSolicitudesPendientes();
      setSolicitudes(data);
    } catch (err) {
      setError('Error al cargar las solicitudes pendientes');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleProcesar = (solicitud: SolicitudProducto) => {
    setSolicitudSeleccionada(solicitud);
    setMostrarModal(true);
  };

  const handleModalClose = (recargar: boolean = false) => {
    setMostrarModal(false);
    setSolicitudSeleccionada(null);
    if (recargar) {
      cargarSolicitudes();
      mostrarMensaje('Producto creado y vinculado al proveedor exitosamente.', 'success');
    }
  };

  if (cargando) return <div className="loading">Cargando solicitudes...</div>;

  return (
    <div className="solicitudes-container">
      <div className="solicitudes-header">
        <h2>Solicitudes de Nuevos Productos</h2>
        <button onClick={() => navigate('/compras')} className="btn-volver">
          ← Volver
        </button>
      </div>

      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          <p>{mensaje}</p>
          <button onClick={() => setMensaje('')} className="btn-cerrar-mensaje">×</button>
        </div>
      )}

      {error && <div className="mensaje-error">{error}</div>}

      <div className="solicitudes-table-container">
        {solicitudes.length === 0 ? (
          <div className="no-data">No hay solicitudes pendientes de nuevos productos.</div>
        ) : (
          <table className="solicitudes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto Solicitado</th>
                <th>Descripción</th>
                <th>Fecha Solicitud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((solicitud) => (
                <tr key={solicitud.id_solicitud}>
                  <td>#{solicitud.id_solicitud}</td>
                  <td>{solicitud.nombre}</td>
                  <td>{solicitud.descripcion}</td>
                  <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn-procesar"
                      onClick={() => handleProcesar(solicitud)}
                    >
                      Procesar Solicitud
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mostrarModal && solicitudSeleccionada && (
        <ProcesarSolicitudModal 
          solicitud={solicitudSeleccionada} 
          onClose={handleModalClose}
          userId={user?.id || 0}
        />
      )}
    </div>
  );
};

interface ModalProps {
  solicitud: SolicitudProducto;
  onClose: (recargar?: boolean) => void;
  userId: number;
}

const ProcesarSolicitudModal: React.FC<ModalProps> = ({ solicitud, onClose, userId }) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    // Producto
    nombre: solicitud.nombre,
    descripcion: solicitud.descripcion,
    precio_venta: 0,
    // Vinculación Proveedor
    id_proveedor: 0,
    precio_costo: 0
  });

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const data = await comprasService.obtenerProveedores();
        setProveedores(data);
      } catch (err) {
        setError('Error al cargar proveedores');
      }
    };
    cargarProveedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'nombre' || name === 'descripcion' ? value : Number(value)
      };

      // Regla de Negocio: Precio Venta = Precio Costo + 30%
      if (name === 'precio_costo') {
        const costo = Number(value);
        if (!isNaN(costo)) {
          newData.precio_venta = Math.round(costo * 1.30);
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.precio_venta || !formData.id_proveedor || !formData.precio_costo) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const payload: ProcesarSolicitudPayload = {
        solicitud_id: solicitud.id_solicitud,
        producto: {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio_venta: formData.precio_venta
        },
        vinculacion_proveedor: {
          id_proveedor: formData.id_proveedor,
          precio_costo: formData.precio_costo
        }
      };

      await comprasService.procesarSolicitud(payload);
      // alert('Producto creado y vinculado al proveedor exitosamente.'); // Eliminado para usar notificación en el padre
      onClose(true); // Cerrar y recargar
    } catch (err) {
      console.error(err);
      setError('Error al procesar la solicitud. Verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Alta de Producto: {solicitud.nombre}</h3>
          <button className="btn-close" onClick={() => onClose(false)}>×</button>
        </div>

        {error && <div className="mensaje-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Columna Izquierda: Datos del Producto */}
            <div className="form-column">
              <h4>1. Definición del Producto</h4>
              
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Precio Venta Sugerido (+30%)</label>
                <input 
                  type="number" 
                  name="precio_venta" 
                  value={formData.precio_venta || ''} 
                  onChange={handleChange}
                  min="0"
                  required 
                />
                <small style={{color: '#888'}}>Calculado automáticamente según el costo.</small>
              </div>
            </div>

            {/* Columna Derecha: Datos de Compra */}
            <div className="form-column">
              <h4>2. Vinculación con Proveedor</h4>
              
              <div className="form-group">
                <label>Proveedor Inicial</label>
                <select 
                  name="id_proveedor" 
                  value={formData.id_proveedor} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor...</option>
                  {proveedores.map(p => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Precio Costo (Acordado)</label>
                <input 
                  type="number" 
                  name="precio_costo" 
                  value={formData.precio_costo || ''} 
                  onChange={handleChange}
                  min="0"
                  required 
                />
                <small style={{color: '#888'}}>Este precio se guardará como referencia del proveedor.</small>
              </div>
            </div>
          </div>

          <div className="form-actions-modal">
            <button type="button" className="btn-secondary" onClick={() => onClose(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudesNuevosProductos;
