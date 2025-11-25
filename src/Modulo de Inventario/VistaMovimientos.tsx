import React, { useState } from 'react'
import './Inventario.css'

// Definimos la interfaz basada en tu tabla 'movimientos_inventario'
interface Movimiento {
  id: number
  cantidad: number
  tipo_movimiento: string // Ej: "Ingreso", "Egreso", "Ajuste"
  fechaMovimiento: string
  productoId: number
  empleadoId: number
}

const VistaMovimientos = () => {
  // Inicializamos vacío por ahora
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5em' }}>Historial de Movimientos</h2>

      <div className="tabla-wrapper">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Producto (ID)</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Empleado (ID)</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  No hay movimientos registrados en el historial.
                </td>
              </tr>
            ) : (
              movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td>{mov.id}</td>
                  {/* Podemos darle color al tipo de movimiento */}
                  <td style={{ 
                    color: mov.tipo_movimiento.toLowerCase().includes('ingreso') ? '#4caf50' : '#ff6b6b',
                    fontWeight: 'bold'
                  }}>
                    {mov.tipo_movimiento}
                  </td>
                  <td>{mov.productoId}</td>
                  <td>{mov.cantidad}</td>
                  <td>{new Date(mov.fechaMovimiento).toLocaleDateString()} {new Date(mov.fechaMovimiento).toLocaleTimeString()}</td>
                  <td>{mov.empleadoId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VistaMovimientos