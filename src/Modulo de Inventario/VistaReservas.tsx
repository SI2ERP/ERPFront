import React, { useState, useEffect } from 'react'
import './Inventario.css'
import { getReservas, type Reserva } from './inventario.service'

const VistaReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)
      try {
        const data = await getReservas()
        setReservas(data)
      } catch (err) {
        console.error("Error cargando reservas:", err)
        setError("No se pudo cargar el historial de reservas.")
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5em' }}>Reservas de Ventas</h2>
      {error && <p className="error-mensaje">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla-productos">
          <thead>
            <tr><th>Producto</th><th>Cantidad Reservada</th><th>Fecha Reserva</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando reservas...</td></tr>
            ) : reservas.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No hay reservas activas en este momento.</td></tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.producto?.nombre || 'Producto Desconocido'}</td>
                  <td>{reserva.stock}</td>
                  <td>{reserva.fechaReserva ? new Date(reserva.fechaReserva).toLocaleDateString('es-CL') : '-'}</td>
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