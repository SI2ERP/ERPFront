import React from 'react';

interface ResultadoData {
  pedido: {
    id_venta: number;
    numero: string;
    cliente: string;
    direccion: string;
  };
  orden_trabajo: {
    id_ot: number;
    empleado: string;
    fecha: string;
    estado: string;
  };
  guia_despacho: {
    id_guia: number;
    transportista: string;
    fecha: string;
    direccion: string;
  };
  notificacion_ventas?: {
    pendiente: boolean;
    mensaje: string;
  };
}

interface ResultadoProcesamientoProps {
  resultado: ResultadoData;
  onClose?: () => void;
}

const ResultadoProcesamiento: React.FC<ResultadoProcesamientoProps> = ({ resultado, onClose }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '20px',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, fontSize: '22px' }}>
          ✅ Procesamiento Completado
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        )}
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Pedido */}
        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          padding: '16px', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📦 Pedido</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <div><strong>Número:</strong> {resultado.pedido.numero}</div>
            <div><strong>Cliente:</strong> {resultado.pedido.cliente}</div>
            <div><strong>Dirección:</strong> {resultado.pedido.direccion}</div>
          </div>
        </div>

        {/* Orden de Trabajo */}
        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          padding: '16px', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📋 Orden de Trabajo</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <div><strong>OT #:</strong> {resultado.orden_trabajo.id_ot}</div>
            <div><strong>Empleado:</strong> {resultado.orden_trabajo.empleado}</div>
            <div><strong>Estado:</strong> {resultado.orden_trabajo.estado}</div>
          </div>
        </div>

        {/* Guía de Despacho */}
        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          padding: '16px', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🚚 Guía de Despacho</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <div><strong>Guía #:</strong> {resultado.guia_despacho.id_guia}</div>
            <div><strong>Transportista:</strong> {resultado.guia_despacho.transportista}</div>
          </div>
        </div>

        {/* Notificación pendiente */}
        {resultado.notificacion_ventas?.pendiente && (
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.3)', 
            padding: '12px', 
            borderRadius: '8px',
            fontSize: '13px',
            border: '1px solid rgba(251, 191, 36, 0.5)'
          }}>
            ⚠️ {resultado.notificacion_ventas.mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultadoProcesamiento;
