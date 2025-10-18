import React, { useState, useEffect } from 'react';
import './OrdenCompraForm.css';
import comprasService, { 
  type Proveedor, 
  type Empleado, 
  type Producto, 
  type DetalleCompra, 
  type OrdenCompra 
} from './comprasService';

interface ProductoEnOrden {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface EstadoFormulario {
  id_proveedor: number | null;
  id_empleado: number | null;
  productos: ProductoEnOrden[];
  observaciones: string;
  total: number;
}

interface EstadosCarga {
  proveedores: boolean;
  empleados: boolean;
  productos: boolean;
  enviando: boolean;
}

const OrdenCompraForm: React.FC = () => {
  // Estados principales
  const [formulario, setFormulario] = useState<EstadoFormulario>({
    id_proveedor: null,
    id_empleado: null,
    productos: [],
    observaciones: '',
    total: 0,
  });

  // Estados de datos
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);

  // Estados de carga
  const [cargando, setCargando] = useState<EstadosCarga>({
    proveedores: true,
    empleados: true,
    productos: true,
    enviando: false,
  });

  // Estados de errores
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState<string>('');

  // Producto temporal para agregar
  const [nuevoProducto, setNuevoProducto] = useState<ProductoEnOrden>({
    id_producto: 0,
    nombre: '',
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0,
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      // Cargar proveedores
      setCargando(prev => ({ ...prev, proveedores: true }));
      const proveedoresData = await comprasService.obtenerProveedores();
      setProveedores(proveedoresData);
      setCargando(prev => ({ ...prev, proveedores: false }));

      // Cargar empleados
      setCargando(prev => ({ ...prev, empleados: true }));
      const empleadosData = await comprasService.obtenerEmpleados();
      setEmpleados(empleadosData);
      setCargando(prev => ({ ...prev, empleados: false }));

      // Cargar productos
      setCargando(prev => ({ ...prev, productos: true }));
      const productosData = await comprasService.obtenerProductos();
      setProductosDisponibles(productosData.filter(p => p.estado)); // Solo productos activos
      setCargando(prev => ({ ...prev, productos: false }));

    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setErrores(['Error al cargar los datos. Por favor, recarga la página.']);
    }
  };

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormulario({
      ...formulario,
      id_proveedor: parseInt(e.target.value) || null,
    });
  };

  const handleEmpleadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormulario({
      ...formulario,
      id_empleado: parseInt(e.target.value) || null,
    });
  };

  const handleProductoChange = (campo: keyof ProductoEnOrden, valor: string | number) => {
    let nuevoProductoActualizado = {
      ...nuevoProducto,
      [campo]: valor,
    };

    // Si se selecciona un producto, cargar su información
    if (campo === 'id_producto') {
      const productoSeleccionado = productosDisponibles.find(p => p.id_producto === parseInt(valor.toString()));
      if (productoSeleccionado) {
        nuevoProductoActualizado = {
          ...nuevoProductoActualizado,
          id_producto: productoSeleccionado.id_producto,
          nombre: productoSeleccionado.nombre,
          precio_unitario: productoSeleccionado.precio_unitario,
          // Recalcular subtotal con el nuevo precio y la cantidad actual
          subtotal: nuevoProductoActualizado.cantidad * productoSeleccionado.precio_unitario,
        };
      }
    }

    // Calcular subtotal automáticamente cuando cambia la cantidad
    // El precio unitario no se puede modificar manualmente
    if (campo === 'cantidad') {
      nuevoProductoActualizado.subtotal = nuevoProductoActualizado.cantidad * nuevoProductoActualizado.precio_unitario;
    }

    setNuevoProducto(nuevoProductoActualizado);
  };

  const agregarProducto = () => {
    // Validaciones
    if (!nuevoProducto.id_producto) {
      setErrores(['Debe seleccionar un producto']);
      return;
    }
    
    if (nuevoProducto.cantidad <= 0) {
      setErrores(['La cantidad debe ser mayor a 0']);
      return;
    }
    
    // Ya no validamos precio_unitario porque se asigna automáticamente
    // La validación del precio se hace implícitamente al seleccionar el producto

    // Verificar si el producto ya está en la orden
    const productoExistente = formulario.productos.find(p => p.id_producto === nuevoProducto.id_producto);
    if (productoExistente) {
      setErrores(['Este producto ya está agregado a la orden']);
      return;
    }

    const productosActualizados = [...formulario.productos, nuevoProducto];
    const nuevoTotal = productosActualizados.reduce((sum, prod) => sum + prod.subtotal, 0);
    
    setFormulario({
      ...formulario,
      productos: productosActualizados,
      total: nuevoTotal,
    });

    // Limpiar formulario de producto
    setNuevoProducto({
      id_producto: 0,
      nombre: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    });

    setErrores([]);
  };

  const eliminarProducto = (index: number) => {
    const productosActualizados = formulario.productos.filter((_, i) => i !== index);
    const nuevoTotal = productosActualizados.reduce((sum, prod) => sum + prod.subtotal, 0);
    
    setFormulario({
      ...formulario,
      productos: productosActualizados,
      total: nuevoTotal,
    });
  };

  const validarFormulario = (): string[] => {
    const erroresValidacion: string[] = [];

    if (!formulario.id_proveedor) {
      erroresValidacion.push('Debe seleccionar un proveedor');
    }

    if (!formulario.id_empleado) {
      erroresValidacion.push('Debe seleccionar un empleado');
    }

    if (formulario.productos.length === 0) {
      erroresValidacion.push('Debe agregar al menos un producto');
    }

    return erroresValidacion;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const erroresValidacion = validarFormulario();
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    // Preparar datos para enviar al backend
    const ordenParaEnviar: OrdenCompra = {
      id_proveedor: formulario.id_proveedor!,
      id_empleado: formulario.id_empleado!,
      detalle: formulario.productos.map(producto => ({
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
      }))
    };

    setCargando(prev => ({ ...prev, enviando: true }));
    setErrores([]);
    setMensaje('');

    try {
      const ordenCreada = await comprasService.crearOrden(ordenParaEnviar);
      
      setMensaje(`¡Orden de compra #${ordenCreada.id_orden_compra} creada exitosamente!`);
      
      // Resetear formulario
      setFormulario({
        id_proveedor: null,
        id_empleado: null,
        productos: [],
        observaciones: '',
        total: 0,
      });

      // Scroll hacia arriba para mostrar el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error al crear orden:', error);
      setErrores([`Error al crear la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`]);
    } finally {
      setCargando(prev => ({ ...prev, enviando: false }));
    }
  };

  const limpiarFormulario = () => {
    if (confirm('¿Está seguro de que desea limpiar el formulario? Se perderán todos los datos ingresados.')) {
      setFormulario({
        id_proveedor: null,
        id_empleado: null,
        productos: [],
        observaciones: '',
        total: 0,
      });
      setNuevoProducto({
        id_producto: 0,
        nombre: '',
        cantidad: 1,
        precio_unitario: 0,
        subtotal: 0,
      });
      setErrores([]);
      setMensaje('');
    }
  };

  // Formatear precio en pesos chilenos
  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <div className="orden-compra-container">
      <div className="orden-compra-form">
        <h2>Nueva Orden de Compra</h2>
        
        {/* Mensajes de error */}
        {errores.length > 0 && (
          <div className="mensaje-error">
            <h4>Errores encontrados:</h4>
            <ul>
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mensaje de éxito */}
        {mensaje && (
          <div className="mensaje-exito">
            {mensaje}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Información del Proveedor */}
          <div className="form-section">
            <h3>Información del Proveedor</h3>
            <div className="form-group">
              <label htmlFor="proveedor">Proveedor *</label>
              {cargando.proveedores ? (
                <div className="loading-select">Cargando proveedores...</div>
              ) : (
                <select
                  id="proveedor"
                  value={formulario.id_proveedor || ''}
                  onChange={handleProveedorChange}
                  required
                >
                  <option value="">Seleccione un proveedor...</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                      {proveedor.nombre} - {proveedor.rut}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Información del Empleado */}
          <div className="form-section">
            <h3>Empleado Responsable</h3>
            <div className="form-group">
              <label htmlFor="empleado">Empleado *</label>
              {cargando.empleados ? (
                <div className="loading-select">Cargando empleados...</div>
              ) : (
                <select
                  id="empleado"
                  value={formulario.id_empleado || ''}
                  onChange={handleEmpleadoChange}
                  required
                >
                  <option value="">Seleccione un empleado...</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombre} {empleado.apellido} - {empleado.rol}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="form-section">
            <h3>Agregar Productos</h3>
            {cargando.productos ? (
              <div className="loading-products">Cargando productos...</div>
            ) : (
              <div className="producto-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombreProducto">Producto</label>
                    <select
                      id="nombreProducto"
                      value={nuevoProducto.id_producto || ''}
                      onChange={(e) => handleProductoChange('id_producto', parseInt(e.target.value) || 0)}
                    >
                      <option value="">Seleccione un producto...</option>
                      {productosDisponibles.map((producto) => (
                        <option key={producto.id_producto} value={producto.id_producto}>
                          {producto.nombre} - {formatearPrecio(producto.precio_unitario)}
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
                      type="text"
                      id="precio"
                      value={formatearPrecio(nuevoProducto.precio_unitario)}
                      readOnly
                      className="readonly"
                      placeholder="Se asigna automáticamente al seleccionar producto"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Subtotal</label>
                    <input
                      type="text"
                      value={formatearPrecio(nuevoProducto.subtotal)}
                      readOnly
                      className="readonly"
                    />
                  </div>
                  
                  <div className="form-group">
                    <button
                      type="button"
                      onClick={agregarProducto}
                      className="btn-agregar"
                      disabled={!nuevoProducto.id_producto}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Productos Agregados */}
          {formulario.productos.length > 0 && (
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
                    {formulario.productos.map((producto, index) => (
                      <tr key={index}>
                        <td>{producto.nombre || 'Sin nombre'}</td>
                        <td>{producto.cantidad || 0}</td>
                        <td>{formatearPrecio(producto.precio_unitario || 0)}</td>
                        <td>{formatearPrecio(producto.subtotal || 0)}</td>
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
                  <h3>Total: {formatearPrecio(formulario.total)}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Información Adicional */}
          <div className="form-section">
            <h3>Información Adicional</h3>
            <div className="form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                rows={4}
                value={formulario.observaciones}
                onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
                placeholder="Ingrese observaciones adicionales..."
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={cargando.enviando || formulario.productos.length === 0}
            >
              {cargando.enviando ? 'Creando Orden...' : 'Crear Orden de Compra'}
            </button>
            <button
              type="button"
              onClick={limpiarFormulario}
              className="btn-secondary"
              disabled={cargando.enviando}
            >
              Limpiar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrdenCompraForm;