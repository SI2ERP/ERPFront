import React, { useState, useEffect } from 'react'
import './Inventario.css'
import { getProductosSinStock, type ProductoSinStock } from './inventario.service'

const VistaPedidos = () => {
  const [pedidos, setPedidos] = useState<ProductoSinStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)
      try {
        const data = await getProductosSinStock()
        setPedidos(data)
      } catch (err) {
        console.error("Error cargando productos sin stock:", err)
        setError("No se pudo cargar la lista de productos sin stock.")
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5em' }}>Productos con Stock Insuficiente</h2>
      {error && <p className="error-mensaje">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla-productos">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Fecha de Alerta</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando alertas...</td></tr>
            ) : pedidos.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No hay productos con stock crítico.</td></tr>
            ) : (
              pedidos.map((p, index) => (
                <tr key={`${p.codigo}-${index}`}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{new Date(p.fecha_sin_stock).toLocaleDateString('es-CL')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VistaPedidos