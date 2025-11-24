import React, { useState, useEffect, useMemo } from 'react'
import './Inventario.css'
import { getProductos, type Producto } from './inventario.service'
import FormularioIngreso from './FormularioIngreso'
import FormularioEgreso from './FormularioEgreso'
import VistaReservas from './VistaReservas'
import VistaPedidos from './VistaPedidos'
import VistaMovimientos from './VistaMovimientos'

const InventarioPage = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filtro, setFiltro] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const [isIngresoOpen, setIsIngresoOpen] = useState(false)
  const [isEgresoOpen, setIsEgresoOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [seccionActual, setSeccionActual] = useState<'inventario' | 'reservas' | 'pedidos' | 'movimientos'>('inventario')
  

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
        <div className="header-left">
          <button className="btn-hamburguesa" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <h1>Módulo de Inventario</h1>
        </div>
      </div>

      {seccionActual === 'inventario' && (
        <> 
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
               {/* ... thead, tbody, etc ... */}
               <thead>
                 {/* ... */}
               </thead>
               <tbody>
                 {productosFiltrados.map(producto => (
                   // ... tus filas tr ...
                   <tr key={producto.id}>
                      {/* ... celdas td ... */}
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
        </>
      )}


      {seccionActual === 'reservas' && (
        <VistaReservas />
      )}

      {seccionActual === 'pedidos' && (
        <VistaPedidos />
      )}

      {seccionActual === 'movimientos' && (
        <VistaMovimientos />
      )}


      {/* --- SIDEBAR Y BACKDROP --- */}
      
      {/* Fondo oscuro al abrir menú */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* El Menú Lateral */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Navegación</h3>
          <button className="btn-cerrar" onClick={() => setIsSidebarOpen(false)}>&times;</button>
        </div>
        
        <nav className="sidebar-nav">

          <button className={seccionActual === 'inventario' ? 'active' : ''} onClick={() => { setSeccionActual('inventario'); setIsSidebarOpen(false); }}>
            Inventario Principal
          </button>
          
          <button className={seccionActual === 'reservas' ? 'active' : ''} onClick={() => { setSeccionActual('reservas'); setIsSidebarOpen(false); }}>
            Reservas
          </button>
          
          <button  className={seccionActual === 'pedidos' ? 'active' : ''} onClick={() => { setSeccionActual('pedidos'); setIsSidebarOpen(false); }}>
            Productos Sin Stock
          </button>

          <button className={seccionActual === 'movimientos' ? 'active' : ''} onClick={() => { setSeccionActual('movimientos'); setIsSidebarOpen(false); }}>
            Historial Movimientos
          </button>
        </nav>
      </div>
    </div>
  )
}

export default InventarioPage