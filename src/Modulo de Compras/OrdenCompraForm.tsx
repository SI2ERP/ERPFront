import React, { useState } from 'react';
import './OrdenCompraForm.css';

interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface OrdenCompra {
  proveedor: string;
  productos: Producto[];
  fechaEntrega: string;
  observaciones: string;
  total: number;
}

const OrdenCompraForm: React.FC = () => {
  const [ordenCompra, setOrdenCompra] = useState<OrdenCompra>({
    proveedor: '',
    productos: [],
    fechaEntrega: '',
    observaciones: '',
    total: 0,
  });

  const [nuevoProducto, setNuevoProducto] = useState<Producto>({
    id: '',
    nombre: '',
    cantidad: 1,
    precio: 0,
    subtotal: 0,
  });

  // Lista simulada de proveedores (se reemplazará por datos del backend)
  const proveedoresSimulados = [
    'Proveedor A S.A.',
    'Distribuidora XYZ',
    'Comercial ABC',
    'Importadora 123',
    'Suministros DEF'
  ];

  // Lista simulada de productos (se reemplazará por datos del backend)
  const productosDisponibles = [
    { id: '1', nombre: 'Producto A' },
    { id: '2', nombre: 'Producto B' },
    { id: '3', nombre: 'Producto C' },
    { id: '4', nombre: 'Producto D' },
    { id: '5', nombre: 'Producto E' }
  ];

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdenCompra({
      ...ordenCompra,
      proveedor: e.target.value,
    });
  };

  const handleProductoChange = (campo: keyof Producto, valor: string | number) => {
    const nuevoProductoActualizado = {
      ...nuevoProducto,
      [campo]: valor,
    };

    // Calcular subtotal automáticamente
    if (campo === 'cantidad' || campo === 'precio') {
      nuevoProductoActualizado.subtotal = nuevoProductoActualizado.cantidad * nuevoProductoActualizado.precio;
    }

    setNuevoProducto(nuevoProductoActualizado);
  };

  const agregarProducto = () => {
    if (nuevoProducto.nombre && nuevoProducto.cantidad > 0 && nuevoProducto.precio > 0) {
      const productosActualizados = [...ordenCompra.productos, nuevoProducto];
      const nuevoTotal = productosActualizados.reduce((sum, prod) => sum + prod.subtotal, 0);
      
      setOrdenCompra({
        ...ordenCompra,
        productos: productosActualizados,
        total: nuevoTotal,
      });

      // Limpiar formulario de producto
      setNuevoProducto({
        id: '',
        nombre: '',
        cantidad: 1,
        precio: 0,
        subtotal: 0,
      });
    }
  };

  const eliminarProducto = (index: number) => {
    const productosActualizados = ordenCompra.productos.filter((_, i) => i !== index);
    const nuevoTotal = productosActualizados.reduce((sum, prod) => sum + prod.subtotal, 0);
    
    setOrdenCompra({
      ...ordenCompra,
      productos: productosActualizados,
      total: nuevoTotal,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!ordenCompra.proveedor) {
      alert('Por favor seleccione un proveedor');
      return;
    }
    
    if (ordenCompra.productos.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    if (!ordenCompra.fechaEntrega) {
      alert('Por favor seleccione una fecha de entrega');
      return;
    }

    // Aquí se enviará la data al backend cuando esté listo
    console.log('Orden de Compra a enviar:', ordenCompra);
    alert('Orden de Compra creada exitosamente (simulado)');
    
    // Resetear formulario
    setOrdenCompra({
      proveedor: '',
      productos: [],
      fechaEntrega: '',
      observaciones: '',
      total: 0,
    });
  };

  return (
    <div className="orden-compra-container">
      <div className="orden-compra-form">
        <h2>Nueva Orden de Compra</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Información del Proveedor */}
          <div className="form-section">
            <h3>Información del Proveedor</h3>
            <div className="form-group">
              <label htmlFor="proveedor">Proveedor *</label>
              <select
                id="proveedor"
                value={ordenCompra.proveedor}
                onChange={handleProveedorChange}
                required
              >
                <option value="">Seleccione un proveedor...</option>
                {proveedoresSimulados.map((proveedor, index) => (
                  <option key={index} value={proveedor}>
                    {proveedor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="form-section">
            <h3>Agregar Productos</h3>
            <div className="producto-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombreProducto">Producto</label>
                  <select
                    id="nombreProducto"
                    value={nuevoProducto.nombre}
                    onChange={(e) => {
                      const productoSeleccionado = productosDisponibles.find(p => p.nombre === e.target.value);
                      handleProductoChange('nombre', e.target.value);
                      handleProductoChange('id', productoSeleccionado?.id || '');
                    }}
                  >
                    <option value="">Seleccione un producto...</option>
                    {productosDisponibles.map((producto) => (
                      <option key={producto.id} value={producto.nombre}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad</label>
                  <input
                    type="number"
                    id="cantidad"
                    min="1"
                    value={nuevoProducto.cantidad}
                    onChange={(e) => handleProductoChange('cantidad', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="precio">Precio Unitario</label>
                  <input
                    type="number"
                    id="precio"
                    min="0"
                    step="0.01"
                    value={nuevoProducto.precio}
                    onChange={(e) => handleProductoChange('precio', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Subtotal</label>
                  <input
                    type="text"
                    value={`$${nuevoProducto.subtotal.toFixed(2)}`}
                    readOnly
                    className="readonly"
                  />
                </div>
                
                <div className="form-group">
                  <button
                    type="button"
                    onClick={agregarProducto}
                    className="btn-agregar"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Productos Agregados */}
          {ordenCompra.productos.length > 0 && (
            <div className="form-section">
              <h3>Productos en la Orden</h3>
              <div className="productos-lista">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenCompra.productos.map((producto, index) => (
                      <tr key={index}>
                        <td>{producto.nombre}</td>
                        <td>{producto.cantidad}</td>
                        <td>${producto.precio.toFixed(2)}</td>
                        <td>${producto.subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            className="btn-eliminar"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="total-section">
                  <h3>Total: ${ordenCompra.total.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Información Adicional */}
          <div className="form-section">
            <h3>Información Adicional</h3>
            <div className="form-group">
              <label htmlFor="fechaEntrega">Fecha de Entrega *</label>
              <input
                type="date"
                id="fechaEntrega"
                value={ordenCompra.fechaEntrega}
                onChange={(e) => setOrdenCompra({ ...ordenCompra, fechaEntrega: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                rows={4}
                value={ordenCompra.observaciones}
                onChange={(e) => setOrdenCompra({ ...ordenCompra, observaciones: e.target.value })}
                placeholder="Ingrese observaciones adicionales..."
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Crear Orden de Compra
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.')) {
                  setOrdenCompra({
                    proveedor: '',
                    productos: [],
                    fechaEntrega: '',
                    observaciones: '',
                    total: 0,
                  });
                }
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrdenCompraForm;