import React, { useState } from 'react'
import './Inventario.css'

// Definimos la interfaz basada en tu tabla 'reservas_venta_inventario'
interface Reserva {
  id: number
  ventaId: number
  stock: number // Cantidad reservada
  fechaReserva: string
  productoId: number
  clienteId: number
}

const VistaReservas = () => {
  // Por el momento inicializamos el estado vacío
  const [reservas, setReservas] = useState<Reserva[]>([])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Título de la sección */}
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5em' }}>Reservas de Ventas</h2>

      <div className="tabla-wrapper">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>ID Venta</th>
              <th>ID Producto</th>
              <th>ID Cliente</th>
              <th>Cantidad Reservada</th>
              <th>Fecha Reserva</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  Aún no hay datos de reservas registrados.
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.id}</td>
                  <td>{reserva.ventaId}</td>
                  <td>{reserva.productoId}</td>
                  <td>{reserva.clienteId}</td>
                  <td>{reserva.stock}</td>
                  <td>{new Date(reserva.fechaReserva).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VistaReservas