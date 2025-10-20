import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdenCompraForm.css';
import comprasService, { 
  type Proveedor, 
  type Empleado, 
  type Producto, 
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
  total: number;
}

interface EstadosCarga {
  proveedores: boolean;
  empleados: boolean;
  productos: boolean;
  enviando: boolean;
}

const OrdenCompraForm: React.FC = () => {
  // Hook para navegación
  const navigate = useNavigate();

  // Estados principales
  const [formulario, setFormulario] = useState<EstadoFormulario>({
    id_proveedor: null,
    id_empleado: null,
    productos: [],
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

      // Cargar productos (inicialmente todos)
      setCargando(prev => ({ ...prev, productos: true }));
      const productosData = await comprasService.obtenerProductos();
      setProductosDisponibles(productosData.filter(p => p.estado)); // Solo productos activos
      setCargando(prev => ({ ...prev, productos: false }));

    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setErrores(['Error al cargar los datos. Por favor, recarga la página.']);
    }
  };

  // Nueva función para cargar productos específicos de un proveedor
  const cargarProductosDeProveedor = async (idProveedor: number) => {
    setCargando(prev => ({ ...prev, productos: true }));
    try {
      const productosData = await comprasService.obtenerProductosPorProveedor(idProveedor);
      setProductosDisponibles(productosData.filter(p => p.estado));
      setErrores([]); // Limpiar errores previos
      
      // Mostrar mensaje informativo si no hay productos
      if (productosData.length === 0) {
        setMensaje('Este proveedor no tiene productos disponibles');
      } else {
        setMensaje('');
      }
    } catch (error) {
      console.error('Error al cargar productos del proveedor:', error);
      setErrores(['Error al cargar los productos del proveedor seleccionado']);
      setProductosDisponibles([]);
    } finally {
      setCargando(prev => ({ ...prev, productos: false }));
    }
  };

  const handleProveedorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idProveedor = parseInt(e.target.value) || null;
    
    setFormulario({
      ...formulario,
      id_proveedor: idProveedor,
      // Limpiar productos cuando cambia el proveedor
      productos: [],
      total: 0,
    });

    // Limpiar producto temporal
    setNuevoProducto({
      id_producto: 0,
      nombre: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    });

    // Cargar productos específicos del proveedor seleccionado
    if (idProveedor) {
      await cargarProductosDeProveedor(idProveedor);
    } else {
      // Si no hay proveedor seleccionado, cargar todos los productos
      setCargando(prev => ({ ...prev, productos: true }));
      try {
        const productosData = await comprasService.obtenerProductos();
        setProductosDisponibles(productosData.filter(p => p.estado));
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setErrores(['Error al cargar los productos']);
      } finally {
        setCargando(prev => ({ ...prev, productos: false }));
      }
    }
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
        // Usar precio del proveedor si está disponible, sino usar precio base
        const precioAUsar = productoSeleccionado.precio_proveedor || productoSeleccionado.precio_unitario;
        
        nuevoProductoActualizado = {
          ...nuevoProductoActualizado,
          id_producto: productoSeleccionado.id_producto,
          nombre: productoSeleccionado.nombre,
          precio_unitario: precioAUsar,
          // Recalcular subtotal con el precio correcto y la cantidad actual
          subtotal: (nuevoProductoActualizado.cantidad || 0) * precioAUsar,
        };
      }
    }

    // Calcular subtotal automáticamente cuando cambia la cantidad
    // El precio unitario no se puede modificar manualmente
    if (campo === 'cantidad') {
      const cantidad = typeof valor === 'string' && valor === '' ? 0 : (valor as number);
      nuevoProductoActualizado.cantidad = cantidad;
      nuevoProductoActualizado.subtotal = cantidad * nuevoProductoActualizado.precio_unitario;
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
        {/* Botón de navegación */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f8c8d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#95a5a6'}
          >
            ← Volver al Menú Principal
          </button>
        </div>
        
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
                  disabled={formulario.productos.length > 0}
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
              {formulario.productos.length > 0 && (
                <div className="campo-bloqueado-info">
                  <small>⚠️ No se puede cambiar el proveedor una vez agregados los productos. Para cambiar, elimine todos los productos primero.</small>
                </div>
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
                  disabled={formulario.productos.length > 0}
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
              {formulario.productos.length > 0 && (
                <div className="campo-bloqueado-info">
                  <small>⚠️ No se puede cambiar el empleado una vez agregados los productos. Para cambiar, elimine todos los productos primero.</small>
                </div>
              )}
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="form-section">
            <h3>Agregar Productos</h3>
            
            {/* Mensaje informativo sobre filtrado por proveedor */}
            {formulario.id_proveedor && (
              <div className="info-proveedor">
                <div className="info-box">
                  <i>ℹ️</i>
                  <span>
                    Se muestran únicamente los productos que vende este proveedor. 
                    Los precios mostrados son los precios específicos de este proveedor.
                  </span>
                </div>
              </div>
            )}
            
            {!formulario.id_proveedor && (
              <div className="info-proveedor warning">
                <div className="info-box warning">
                  <i>⚠️</i>
                  <span>
                    Debe seleccionar un proveedor antes de agregar productos.
                  </span>
                </div>
              </div>
            )}
            
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
                      disabled={!formulario.id_proveedor}
                    >
                      <option value="">
                        {!formulario.id_proveedor 
                          ? "Primero seleccione un proveedor..." 
                          : "Seleccione un producto..."
                        }
                      </option>
                      {productosDisponibles.map((producto) => {
                        const precioMostrar = producto.precio_proveedor || producto.precio_unitario;
                        
                        return (
                          <option key={producto.id_producto} value={producto.id_producto}>
                            {producto.nombre} - {formatearPrecio(precioMostrar)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input
                      type="number"
                      id="cantidad"
                      min="1"
                      value={nuevoProducto.cantidad || ''}
                      onChange={(e) => {
                        const valor = e.target.value;
                        if (valor === '') {
                          handleProductoChange('cantidad', '');
                        } else {
                          handleProductoChange('cantidad', parseInt(valor) || 1);
                        }
                      }}
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