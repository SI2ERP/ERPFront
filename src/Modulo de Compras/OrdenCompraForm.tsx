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
  id_proveedor: number | null;
  proveedor_nombre?: string;
  proveedores_disponibles?: Proveedor[];
}

interface EstadoFormulario {
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
    id_proveedor: null,
    proveedores_disponibles: [],
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

  const obtenerProveedoresDeProducto = async (idProducto: number): Promise<Proveedor[]> => {
    try {
      const proveedoresDelProducto: Proveedor[] = [];
      
      for (const proveedor of proveedores) {
        try {
          const productosProveedor = await comprasService.obtenerProductosPorProveedor(proveedor.id_proveedor);
          const tieneProducto = productosProveedor.some(p => p.id_producto === idProducto);
          
          if (tieneProducto) {
            proveedoresDelProducto.push(proveedor);
          }
        } catch (error) {
          console.error(`Error al verificar producto ${idProducto} del proveedor ${proveedor.id_proveedor}:`, error);
        }
      }
      
      return proveedoresDelProducto;
    } catch (error) {
      console.error('Error al obtener proveedores del producto:', error);
      return [];
    }
  };

  const handleProductoChange = async (campo: keyof ProductoEnOrden, valor: string | number) => {
    let nuevoProductoActualizado = {
      ...nuevoProducto,
      [campo]: valor,
    };

    // Si se selecciona un producto, cargar su información y proveedores
    if (campo === 'id_producto') {
      const productoSeleccionado = productosDisponibles.find(p => p.id_producto === parseInt(valor.toString()));
      if (productoSeleccionado) {
        // Obtener proveedores que venden este producto
        const proveedoresDelProducto = await obtenerProveedoresDeProducto(productoSeleccionado.id_producto);
        
        nuevoProductoActualizado = {
          ...nuevoProductoActualizado,
          id_producto: productoSeleccionado.id_producto,
          nombre: productoSeleccionado.nombre,
          precio_unitario: productoSeleccionado.precio_unitario, // precio base inicialmente
          subtotal: (nuevoProductoActualizado.cantidad || 0) * productoSeleccionado.precio_unitario,
          id_proveedor: null, // resetear proveedor
          proveedores_disponibles: proveedoresDelProducto,
        };
      }
    }

    // Calcular subtotal automáticamente cuando cambia la cantidad
    if (campo === 'cantidad') {
      const cantidad = typeof valor === 'string' && valor === '' ? 0 : (valor as number);
      nuevoProductoActualizado.cantidad = cantidad;
      nuevoProductoActualizado.subtotal = cantidad * nuevoProductoActualizado.precio_unitario;
    }

    setNuevoProducto(nuevoProductoActualizado);
  };

  const handleProveedorProductoChange = async (indexProducto: number, idProveedor: number | null) => {
    if (!idProveedor) return;
    
    try {
      const productosActualizados = [...formulario.productos];
      const producto = productosActualizados[indexProducto];
      
      // Obtener precio específico del proveedor
      const productosProveedor = await comprasService.obtenerProductosPorProveedor(idProveedor);
      const productoConPrecio = productosProveedor.find(p => p.id_producto === producto.id_producto);
      
      if (productoConPrecio) {
        const nuevoPrecio = productoConPrecio.precio_proveedor || productoConPrecio.precio_unitario;
        const nuevoSubtotal = producto.cantidad * nuevoPrecio;
        
        // Obtener nombre del proveedor
        const proveedor = proveedores.find(p => p.id_proveedor === idProveedor);
        
        productosActualizados[indexProducto] = {
          ...producto,
          id_proveedor: idProveedor,
          proveedor_nombre: proveedor?.nombre,
          precio_unitario: nuevoPrecio,
          subtotal: nuevoSubtotal,
        };
        
        // Calcular nuevo total
        const nuevoTotal = productosActualizados.reduce((sum, prod) => sum + prod.subtotal, 0);
        
        setFormulario({
          ...formulario,
          productos: productosActualizados,
          total: nuevoTotal,
        });
      }
    } catch (error) {
      console.error('Error al actualizar precio del proveedor:', error);
      setErrores(['Error al obtener el precio del proveedor seleccionado']);
    }
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
    const indiceProductoExistente = formulario.productos.findIndex(p => p.id_producto === nuevoProducto.id_producto);
    
    let productosActualizados;
    
    if (indiceProductoExistente !== -1) {
      // El producto ya existe, sumar la cantidad
      productosActualizados = [...formulario.productos];
      const productoExistente = productosActualizados[indiceProductoExistente];
      
      // Sumar las cantidades
      const nuevaCantidad = productoExistente.cantidad + nuevoProducto.cantidad;
      const nuevoSubtotal = nuevaCantidad * productoExistente.precio_unitario;
      
      // Actualizar el producto existente
      productosActualizados[indiceProductoExistente] = {
        ...productoExistente,
        cantidad: nuevaCantidad,
        subtotal: nuevoSubtotal
      };
      
      // Mostrar mensaje informativo
      setMensaje(`Se sumó ${nuevoProducto.cantidad} unidad(es) al producto "${nuevoProducto.nombre}". Nueva cantidad: ${nuevaCantidad}`);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje('');
      }, 3000);
      
    } else {
      // Producto nuevo, agregarlo a la lista con sus proveedores disponibles
      const productoConProveedores = {
        ...nuevoProducto,
        proveedores_disponibles: nuevoProducto.proveedores_disponibles || []
      };
      productosActualizados = [...formulario.productos, productoConProveedores];
    }

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
      id_proveedor: null,
      proveedores_disponibles: [],
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

  const handleEmpleadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormulario({
      ...formulario,
      id_empleado: parseInt(e.target.value) || null,
    });
  };

  const validarFormulario = (): string[] => {
    const erroresValidacion: string[] = [];

    if (!formulario.id_empleado) {
      erroresValidacion.push('Debe seleccionar un empleado');
    }

    if (formulario.productos.length === 0) {
      erroresValidacion.push('Debe agregar al menos un producto');
    }

    // Validar que todos los productos tengan proveedor seleccionado
    const productosSinProveedor = formulario.productos.filter(p => !p.id_proveedor);
    if (productosSinProveedor.length > 0) {
      erroresValidacion.push(`Debe seleccionar proveedor para todos los productos (${productosSinProveedor.length} producto(s) sin proveedor)`);
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
    // Crear una orden separada por cada proveedor único
    const proveedoresUnicos = [...new Set(formulario.productos.map(p => p.id_proveedor).filter(Boolean))];
    
    if (proveedoresUnicos.length === 0) {
      setErrores(['Debe seleccionar al menos un proveedor para los productos']);
      return;
    }

    // Agrupar productos por proveedor
    const productosPorProveedor = new Map<number, typeof formulario.productos>();
    
    formulario.productos.forEach(producto => {
      if (producto.id_proveedor) {
        if (!productosPorProveedor.has(producto.id_proveedor)) {
          productosPorProveedor.set(producto.id_proveedor, []);
        }
        productosPorProveedor.get(producto.id_proveedor)!.push(producto);
      }
    });

    setCargando(prev => ({ ...prev, enviando: true }));
    setErrores([]);
    setMensaje('');

    try {
      const ordenesCreadas = [];
      
      // Crear una orden por cada proveedor
      for (const [idProveedor, productos] of productosPorProveedor) {
        const ordenParaEnviar: OrdenCompra = {
          id_proveedor: idProveedor,
          id_empleado: formulario.id_empleado!,
          detalle: productos.map(producto => ({
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_unitario,
          }))
        };

        const ordenCreada = await comprasService.crearOrden(ordenParaEnviar);
        ordenesCreadas.push(ordenCreada);
      }
      
      // Mostrar mensaje de éxito con todas las órdenes creadas
      if (ordenesCreadas.length === 1) {
        setMensaje(`¡Orden de compra #${ordenesCreadas[0].id_orden_compra} creada exitosamente! Puede crear otra orden o volver a la lista.`);
      } else {
        const numerosOrdenes = ordenesCreadas.map(o => `#${o.id_orden_compra}`).join(', ');
        setMensaje(`¡${ordenesCreadas.length} órdenes creadas exitosamente: ${numerosOrdenes}! Se creó una orden por cada proveedor. Puede crear otra orden o volver a la lista.`);
      }
      
      // Resetear formulario para permitir crear otra orden
      setFormulario({
        id_empleado: null,
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
        id_proveedor: null,
        proveedores_disponibles: [],
      });

      // Recargar productos disponibles (limpiar filtro de proveedor)
      try {
        const productosData = await comprasService.obtenerProductos();
        setProductosDisponibles(productosData.filter(p => p.estado));
      } catch (productsError) {
        console.error('Error al recargar productos:', productsError);
      }

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
        id_proveedor: null,
        proveedores_disponibles: [],
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

  // Crear resumen de órdenes que se van a generar
  const obtenerResumenOrdenes = () => {
    if (formulario.productos.length === 0) return null;

    const productosPorProveedor = new Map<number, typeof formulario.productos>();
    
    formulario.productos.forEach(producto => {
      if (producto.id_proveedor) {
        if (!productosPorProveedor.has(producto.id_proveedor)) {
          productosPorProveedor.set(producto.id_proveedor, []);
        }
        productosPorProveedor.get(producto.id_proveedor)!.push(producto);
      }
    });

    const resumen = Array.from(productosPorProveedor.entries()).map(([idProveedor, productos]) => {
      const proveedor = proveedores.find(p => p.id_proveedor === idProveedor);
      const totalProveedor = productos.reduce((sum, prod) => sum + prod.subtotal, 0);
      
      return {
        proveedor: proveedor?.nombre || 'Proveedor desconocido',
        productos: productos.length,
        total: totalProveedor,
        items: productos
      };
    });

    return resumen;
  };

  return (
    <div className="orden-compra-container">
      <div className="orden-compra-form">
        {/* Botón de navegación */}
        <div style={{ marginBottom: '20px', textAlign: 'left', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/compras')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#646cff',
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
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#535bf2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#646cff'}
          >
            ← Volver a Órdenes
          </button>
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
            ← Menú Principal
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
          {/* Agregar Productos */}
          <div className="form-section">
            <h3>Agregar Productos</h3>
            
            {/* Mensaje informativo sobre flujo de trabajo */}
            <div className="info-proveedor">
              <div className="info-box">
                <i>ℹ️</i>
                <span>
                  Seleccione los productos que necesita. Los precios mostrados son los precios base.
                  Después podrá elegir el proveedor específico para cada producto en la tabla.
                </span>
              </div>
            </div>
            
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
                      {productosDisponibles.map((producto) => {
                        // Mostrar precio base inicialmente
                        const precioMostrar = producto.precio_unitario;
                        
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
                      <th>Proveedor</th>
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
                        <td>
                          <select
                            value={producto.id_proveedor || ''}
                            onChange={(e) => handleProveedorProductoChange(index, parseInt(e.target.value) || null)}
                            className="proveedor-select"
                          >
                            <option value="">Seleccionar proveedor...</option>
                            {(producto.proveedores_disponibles || []).map((proveedor) => (
                              <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                {proveedor.nombre}
                              </option>
                            ))}
                          </select>
                          {producto.proveedor_nombre && (
                            <div className="proveedor-seleccionado">
                              <small>✓ {producto.proveedor_nombre}</small>
                            </div>
                          )}
                        </td>
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

          {/* Resumen de Órdenes a Crear */}
          {formulario.productos.length > 0 && obtenerResumenOrdenes() && obtenerResumenOrdenes()!.length > 1 && (
            <div className="form-section">
              <h3>📋 Resumen de Órdenes</h3>
              <div className="info-proveedor">
                <div className="info-box warning">
                  <i>⚠️</i>
                  <span>
                    Tiene productos de diferentes proveedores. Se crearán <strong>{obtenerResumenOrdenes()!.length} órdenes separadas</strong>, una por cada proveedor:
                  </span>
                </div>
              </div>
              <div className="resumen-ordenes">
                {obtenerResumenOrdenes()!.map((resumen, index) => (
                  <div key={index} className="resumen-orden">
                    <h4>🏪 {resumen.proveedor}</h4>
                    <div className="resumen-detalles">
                      <span>{resumen.productos} producto(s)</span>
                      <span className="resumen-total">{formatearPrecio(resumen.total)}</span>
                    </div>
                    <div className="resumen-productos">
                      {resumen.items.map((item, itemIndex) => (
                        <small key={itemIndex}>
                          • {item.nombre} (x{item.cantidad})
                        </small>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información del Empleado */}
          {formulario.productos.length > 0 && (
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