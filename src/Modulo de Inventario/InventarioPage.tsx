import React, { useState, useEffect, useMemo } from 'react'
import './Inventario.css'
import { getProductos, type Producto } from './inventario.service'
import FormularioIngreso from './FormularioIngreso'
import FormularioEgreso from './FormularioEgreso'

const InventarioPage = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filtro, setFiltro] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const [isIngresoOpen, setIsIngresoOpen] = useState(false)
  const [isEgresoOpen, setIsEgresoOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)

  const cargarProductos = async () => {
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError("No se pudieron cargar los productos desde el backend.")
    }
  }
  
  useEffect(() => {
    cargarProductos()
  }, [])

  const productosFiltrados = useMemo(() => {
    if (!filtro) {
      return productos
    }
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.codigo.toLowerCase().includes(filtro.toLowerCase())
    )
  }, [productos, filtro])

  const handleOpenEgreso = (producto: Producto) => {
    setSelectedProducto(producto)
    setIsEgresoOpen(true)
  }

  const handleCloseModals = () => {
    setIsIngresoOpen(false)
    setIsEgresoOpen(false)
    setSelectedProducto(null)
  }

  const handleSuccess = (message: string) => {
    handleCloseModals()
    cargarProductos()
    alert(message)
  }

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <h1>Módulo de Inventario</h1>
      </div>

      <div className="filtro-container">
        <input 
          type="text"
          placeholder="Buscar por nombre o código..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {error && <p className="error-mensaje">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Precio Unitario</th>
              <th>Precio Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(producto => (
              <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.precio_unitario.toLocaleString('es-CL')}</td>
                <td>${producto.precio_venta.toLocaleString('es-CL')}</td>
                <td>
                  <button className="btn-retirar" onClick={() => handleOpenEgreso(producto)}>
                    Actualizar Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer-acciones">
        <button className="btn-nuevo-producto" onClick={() => setIsIngresoOpen(true)}>
          + Nuevo Producto
        </button>
      </div>

      <FormularioIngreso 
        isOpen={isIngresoOpen}
        onClose={handleCloseModals}
        onSuccess={handleSuccess}
      />

      <FormularioEgreso 
        isOpen={isEgresoOpen}
        onClose={handleCloseModals}
        onSuccess={handleSuccess}
        producto={selectedProducto}
      />
    </div>
  )
}

export default InventarioPage