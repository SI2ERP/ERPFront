import { useState, useEffect, useMemo } from 'react'
import './Inventario.css'
import { getProductos, type Producto } from './inventario.service'
import FormularioIngreso from './FormularioIngreso'
import FormularioEgreso from './FormularioEgreso'
import VistaReservas from './VistaReservas'
import VistaPedidos from './VistaPedidos'
import VistaMovimientos from './VistaMovimientos'
import VistaProductosDespacho from './VistaProductosDespacho'
import VistaProductosSolicitados from './VistaProductosSolicitados'
import { useAuth } from "../utils/AuthContext";
import { hasPermission, type Role } from '../utils/Permissions';

const InventarioPage = () => {
  const {user} = useAuth();
  
  const tienePermisoModificar = hasPermission(user?.rol as Role, 'puedeModificarInventario');
  const tienePermisoVer = hasPermission(user?.rol as Role, 'puedeVerInventario');

  if (user && !tienePermisoVer) {
    window.location.href = '/'; 
  }

  const [productos, setProductos] = useState<Producto[]>([])
  const [filtro, setFiltro] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [isIngresoOpen, setIsIngresoOpen] = useState(false)
  const [isEgresoOpen, setIsEgresoOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [seccionActual, setSeccionActual] = useState<'inventario' | 'reservas' | 'pedidos' | 'movimientos'| 'despachos'| 'solicitados'>('inventario')

  const cargarProductos = async () => {
    setLoading(true)
    try {
      const data = await getProductos()
      setProductos(data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError("No se pudieron cargar los productos desde el backend.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (seccionActual === 'inventario') cargarProductos()
  }, [seccionActual])

  const productosFiltrados = useMemo(() => {
    if (!filtro) return productos
    return productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()) || p.codigo.toLowerCase().includes(filtro.toLowerCase()))
  }, [productos, filtro])

  const handleOpenEgreso = (producto: Producto) => {
    if (!tienePermisoModificar) return;
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

  const renderStockAvisos = (stock: number | string) => {
      // asegurar stock como número
      const numericStock = Number(stock); 
      let aviso = null;
      let claseAviso = '';

      if (numericStock === 0) { 
          aviso = 'El producto no cuenta con stock';
          claseAviso = 'aviso-stock-rojo'; 
      } else if (numericStock >= 1 && numericStock <= 3) {
          aviso = 'El stock es muy bajo';
          claseAviso = 'aviso-stock-naranja';
      } else if (numericStock >= 4 && numericStock <= 10) {
          aviso = 'El stock es bajo';
          claseAviso = 'aviso-stock-amarillo'; 
      }

      return aviso ? <div className={claseAviso}>{aviso}</div> : null;
  };

  // Función auxiliar para leer el stock de forma segura
  const getStockSeguro = (p: any) => {
      return p.cantidad !== undefined ? p.cantidad : (p.stock !== undefined ? p.stock : 0);
  }

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <div className="header-left">
          <button className="btn-hamburguesa" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <h1>Módulo de Inventario</h1>
        </div>
      </div>

      {seccionActual === 'inventario' && (
        <> 
          <div className="filtro-container">
            <input type="text" placeholder="Buscar por nombre o código..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          </div>

          {error && <p className="error-mensaje">{error}</p>}

          <div className="tabla-wrapper">
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>Código</th><th>Nombre</th><th>Stock</th><th>Precio Venta</th>
                  {tienePermisoModificar && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Cargando inventario</td></tr>
                ) : productosFiltrados.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No se encontraron productos</td></tr>
                ) : (
                  productosFiltrados.map(producto => {
                    const stock = getStockSeguro(producto);
                    return (
                    <tr key={producto.id}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre} {renderStockAvisos(stock)}</td>
                      <td className={stock <= 10 ? 'stock-bajo' : ''}>{stock}</td>
                      <td>${Number(producto.precio_venta).toLocaleString('es-CL')}</td>
                      {tienePermisoModificar && (
                        <td><button className="btn-retirar" onClick={() => handleOpenEgreso(producto)}>Actualizar Stock</button></td>
                      )}
                    </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {tienePermisoModificar && (
            <div className="footer-acciones">
              <button className="btn-nuevo-producto" onClick={() => setIsIngresoOpen(true)}>+ Solicitar Producto</button>
            </div>
          )}

          <FormularioIngreso isOpen={isIngresoOpen} onClose={handleCloseModals} onSuccess={handleSuccess} />
          <FormularioEgreso isOpen={isEgresoOpen} onClose={handleCloseModals} onSuccess={handleSuccess} producto={selectedProducto} />
        </>
      )}

      {seccionActual === 'reservas' && <VistaReservas />}
      {seccionActual === 'pedidos' && <VistaPedidos />}
      {seccionActual === 'movimientos' && <VistaMovimientos />}
      {seccionActual === 'despachos' && <VistaProductosDespacho />}
      {seccionActual === 'solicitados' && <VistaProductosSolicitados />}

      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Navegación</h3>
          <button className="btn-cerrar" onClick={() => setIsSidebarOpen(false)}>&times;</button>
        </div>
        <nav className="sidebar-nav">
          <button className={seccionActual === 'inventario' ? 'active' : ''} onClick={() => { setSeccionActual('inventario'); setIsSidebarOpen(false); }}>Página Principal</button>
          <button className={seccionActual === 'reservas' ? 'active' : ''} onClick={() => { setSeccionActual('reservas'); setIsSidebarOpen(false); }}>Reservas de Inventario</button>
          <button className={seccionActual === 'movimientos' ? 'active' : ''} onClick={() => { setSeccionActual('movimientos'); setIsSidebarOpen(false); }}>Historial Movimientos</button>
          <button className={seccionActual === 'despachos' ? 'active' : ''} onClick={() => { setSeccionActual('despachos'); setIsSidebarOpen(false); }}>Productos por Despachar</button>
          <button className={seccionActual === 'solicitados' ? 'active' : ''} onClick={() => { setSeccionActual('solicitados'); setIsSidebarOpen(false); }}>Productos Solicitados</button>
          <button className={seccionActual === 'pedidos' ? 'active' : ''} onClick={() => { setSeccionActual('pedidos'); setIsSidebarOpen(false); }}>Productos con Stock Insuficiente</button>
        </nav>
      </div>
    </div>
  )
}

export default InventarioPage