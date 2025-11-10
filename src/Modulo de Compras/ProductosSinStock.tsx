import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import comprasService, { type ProductoSinStock } from './comprasService';
import './ProductosSinStock.css';

const ProductosSinStock: React.FC = () => {
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState<ProductoSinStock[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError('');
      
      const productosData: ProductoSinStock[] = await comprasService.obtenerProductosSinStock();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos sin stock:', error);
      setError('Error al cargar los productos sin stock. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const crearOrdenCompra = (producto: ProductoSinStock) => {
    // Navegar al formulario de orden de compra con el producto preseleccionado
    navigate('/compras/nueva', { 
      state: { 
        productoSinStock: producto 
      }
    });
  };

  const formatearPrecio = (precio: string) => {
    const precioNumerico = parseFloat(precio);
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precioNumerico);
  };

  if (cargando) {
    return (
      <div className="productos-sin-stock-container">
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando productos sin stock...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productos-sin-stock-container">
      <div className="productos-sin-stock-header">
        <h2>Productos Sin Stock</h2>
        <div className="productos-sin-stock-actions">
          <button 
            onClick={() => navigate('/compras')} 
            className="btn btn-secondary"
          >
            Volver a Compras
          </button>
          <button 
            onClick={cargarProductos} 
            className="btn btn-primary"
          >
            Actualizar Lista
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {productos.length === 0 ? (
        <div className="no-productos">
          <h3>¡Excelente!</h3>
          <p>No hay productos sin stock en este momento.</p>
        </div>
      ) : (
        <div className="productos-sin-stock-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock Actual</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id_producto}>
                  <td className="producto-nombre">{producto.nombre}</td>
                  <td className="producto-stock">
                    <span className="stock-cero">{producto.cantidad}</span>
                  </td>
                  <td className="producto-precio">
                    {formatearPrecio(producto.precio_unitario)}
                  </td>
                  <td>
                    <button
                      onClick={() => crearOrdenCompra(producto)}
                      className="btn btn-primary btn-sm"
                      title="Crear orden de compra para este producto"
                    >
                      Crear Orden
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductosSinStock;