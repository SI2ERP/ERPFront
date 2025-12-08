import { useState, useEffect } from 'react'
import './Inventario.css'
// Ahora sí encontrará estas exportaciones porque actualizaste el servicio arriba
import { getMovimientos, type Movimiento } from './inventario.service'

const VistaMovimientos = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [loading, setLoading] = useState(true)
  
  // Carga de datos de movimientos
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)
      try {
        const data = await getMovimientos()
        // CORRECCIÓN AQUÍ: Tipamos (a: Movimiento, b: Movimiento) para que TS no llore
        const sorted = data.sort((a: Movimiento, b: Movimiento) => 
            new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime()
        );
        setMovimientos(sorted)
      } catch (err) {
        console.error("Error cargando historial", err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

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
            {loading ? (
               <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando historial...</td></tr>
            ) : movimientos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  No hay movimientos registrados en el historial.
                </td>
              </tr>
            ) : (
              movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td>{mov.id}</td>
                  <td style={{ 
                    color: mov.tipo_movimiento?.toLowerCase().includes('ingreso') ? '#4caf50' : '#ff6b6b',
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