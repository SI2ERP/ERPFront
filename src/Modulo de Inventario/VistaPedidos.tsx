import React, { useState } from 'react'
import './Inventario.css'

// Definimos la interfaz basada en tu tabla 'productos_sin_stock'
interface ProductoSinStock {
  id_producto: number
  nombre: string
  descripcion: string
  precio_unitario: number
  codigo: string
  precio_venta: number
  fecha_sin_stock: string
}

const VistaPedidos = () => {
  // Inicializamos vacío por ahora
  const [pedidos, setPedidos] = useState<ProductoSinStock[]>([])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5em' }}>Productos Sin Stock</h2>

      <div className="tabla-wrapper">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Costo (Unitario)</th>
              <th>Fecha Sin Stock</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  No hay productos pendientes de pedido actualmente.
                </td>
              </tr>
            ) : (
              pedidos.map((p) => (
                <tr key={p.id_producto}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>${p.precio_unitario.toLocaleString('es-CL')}</td>
                  <td>{new Date(p.fecha_sin_stock).toLocaleDateString()}</td>
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