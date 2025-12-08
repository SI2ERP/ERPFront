// Interfaces que coinciden con tu backend
export interface Proveedor {
  id_proveedor: number;
  rut: string;
  nombre: string;
  contacto: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
  telefono: string | null;
}

export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario?: number; // Opcional, ya que se eliminará de la BD
  cantidad: number;
  estado: boolean;
  precio_proveedor?: number; // Precio específico del proveedor cuando se filtra
}

export interface ProductoSinStock {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: string;
  codigo: string;
  precio_venta: string;
  fecha_sin_stock: string;
  cantidad: number;
  estado: boolean;
}

export interface ProductosSinStockResponse {
  success: boolean;
  message: string;
  data: ProductoSinStock[];
  total: number;
  timestamp: string;
}

export interface ProductosSinStockPaginadoResponse {
  success: boolean;
  message: string;
  data: ProductoSinStock[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface ProductoSinStockIndividualResponse {
  success: boolean;
  message: string;
  data: ProductoSinStock;
}

export interface SolicitudProducto {
  id_solicitud: number;
  nombre: string;
  descripcion: string;
  estado_solicitud: boolean;
  fecha_solicitud: string;
}

export interface ProcesarSolicitudPayload {
  solicitud_id: number;
  producto: {
    nombre: string;
    descripcion: string;
    precio_venta: number;
  };
  vinculacion_proveedor: {
    id_proveedor: number;
    precio_costo: number;
  };
}

export interface DetalleCompra {
  id_detalle_compra?: number;
  id_orden_compra?: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  producto_nombre?: string;
}

export interface OrdenCompra {
  id_orden_compra?: number;
  id_proveedor: number;
  id_empleado: number;
  fecha?: string;
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA'; // Estados en mayúsculas como espera el backend
  proveedor_nombre?: string;
  empleado_nombre?: string;
  subtotal?: number;
  iva?: number;
  total?: number;
  detalle: DetalleCompra[];
}

export interface OrdenCompraResponse {
  id_orden_compra: number;
  id_proveedor: number;
  id_empleado: number;
  fecha: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA'; // Estados en mayúsculas para mostrar en el frontend
  proveedor_nombre?: string;
  empleado_nombre?: string;
  subtotal?: number;
  iva?: number;
  total?: number;
  detalle?: DetalleCompra[];
}

// Interfaces para el endpoint de información completa
export interface ProveedorCompleto {
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
}

export interface EmpleadoCompleto {
  nombre: string;
  email: string;
}

export interface DetalleCompletoCompra {
  id_detalle_compra: number;
  id_producto: number;
  producto_nombre: string;
  producto_descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface OrdenCompraCompleta {
  id_orden_compra: number;
  id_proveedor: number;
  id_empleado: number;
  fecha: string;
  estado: string;
  subtotal?: number;
  iva?: number;
  total?: number;
  total_orden: number;
  proveedor: ProveedorCompleto;
  empleado: EmpleadoCompleto;
  detalle: DetalleCompletoCompra[];
}

// Interfaces para el sistema de pagos a proveedores
export interface OrdenProveedor {
  id_oc_proveedor: number;
  id_orden_compra: number;
  id_proveedor: number;
  id_empleado: number;
  fecha: string;
  estado_proveedor: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
  pago_realizado: boolean;
  subtotal: string;
  iva: string;
  total: string;
  proveedor_nombre?: string;
  empleado_nombre?: string;
  created_at: string;
}

export interface PagarOrdenResponse {
  mensaje: string;
  orden: OrdenProveedor;
  puede_generar_factura: boolean;
}

// Servicio para manejar todas las APIs del módulo de compras
class ComprasService {
  private baseURL = `${import.meta.env.VITE_URL_BACKEND_COMPRAS}/api`;

  // Manejo de errores genérico
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }
    return response.json();
  }

  // =================== PROVEEDORES ===================
  
  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      const response = await fetch(`${this.baseURL}/suppliers`);
      return this.handleResponse<Proveedor[]>(response);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  }

  async obtenerProveedorPorId(id: number): Promise<Proveedor> {
    try {
      const response = await fetch(`${this.baseURL}/suppliers/${id}`);
      return this.handleResponse<Proveedor>(response);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      throw error;
    }
  }

  async crearProveedor(proveedor: Omit<Proveedor, 'id_proveedor'>): Promise<Proveedor> {
    try {
      const response = await fetch(`${this.baseURL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
      });
      return this.handleResponse<Proveedor>(response);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  }

  async actualizarProveedor(id: number, proveedor: Partial<Proveedor>): Promise<Proveedor> {
    try {
      const response = await fetch(`${this.baseURL}/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
      });
      return this.handleResponse<Proveedor>(response);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  }

  async eliminarProveedor(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/suppliers/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  }

  // =================== ÓRDENES DE COMPRA ===================
  
  async obtenerOrdenes(): Promise<OrdenCompraResponse[]> {
    try {
      const response = await fetch(`${this.baseURL}/purchases`);
      return this.handleResponse<OrdenCompraResponse[]>(response);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  }

  async obtenerOrdenesCompletas(): Promise<OrdenCompraCompleta[]> {
    try {
      const response = await fetch(`${this.baseURL}/purchases/info-completa`);
      return this.handleResponse<OrdenCompraCompleta[]>(response);
    } catch (error) {
      console.error('Error al obtener órdenes completas:', error);
      throw error;
    }
  }

  async obtenerOrdenPorId(id: number): Promise<OrdenCompraResponse> {
    try {
      const response = await fetch(`${this.baseURL}/purchases/${id}`);
      return this.handleResponse<OrdenCompraResponse>(response);
    } catch (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }
  }

  async crearOrden(orden: OrdenCompra): Promise<OrdenCompraResponse> {
    try {
      const response = await fetch(`${this.baseURL}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orden)
      });
      return this.handleResponse<OrdenCompraResponse>(response);
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  }

  async actualizarOrden(id: number, datos: Partial<OrdenCompra>): Promise<OrdenCompraResponse> {
    try {
      const response = await fetch(`${this.baseURL}/purchases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      return this.handleResponse<OrdenCompraResponse>(response);
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      throw error;
    }
  }

  async eliminarOrden(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/purchases/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      // Verificar si la respuesta tiene contenido antes de intentar parsear JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await response.json();
      }
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      throw error;
    }
  }

  // =================== FACTURACIÓN ===================
  
  async descargarFactura(idOrden: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/purchases/${idOrden}/descargar-factura`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: Error al generar factura`);
      }

      // Obtener el blob del PDF
      const blob = await response.blob();
      
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura_compra_${idOrden}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error al descargar factura:', error);
      throw error;
    }
  }

  // =================== GESTIÓN DE PAGOS A PROVEEDORES ===================

  async obtenerOrdenesProveedores(): Promise<OrdenProveedor[]> {
    try {
      const response = await fetch(`${this.baseURL}/provider-orders`);
      return this.handleResponse<OrdenProveedor[]>(response);
    } catch (error) {
      console.error('Error al obtener órdenes de proveedores:', error);
      throw error;
    }
  }

  async obtenerOrdenesProveedoresActivas(): Promise<OrdenProveedor[]> {
    try {
      const response = await fetch(`${this.baseURL}/provider-orders/active`);
      return this.handleResponse<OrdenProveedor[]>(response);
    } catch (error) {
      console.error('Error al obtener órdenes de proveedores activas:', error);
      throw error;
    }
  }

  async pagarOrden(idOcProveedor: number): Promise<PagarOrdenResponse> {
    try {
      const response = await fetch(`${this.baseURL}/provider-orders/${idOcProveedor}/pagar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: Error al marcar como pagada`);
      }

      return this.handleResponse<PagarOrdenResponse>(response);
    } catch (error) {
      console.error('Error al pagar orden:', error);
      throw error;
    }
  }

  // =================== EMPLEADOS ===================
  
  async obtenerEmpleados(): Promise<Empleado[]> {
    try {
      const response = await fetch(`${this.baseURL}/employees`);
      return this.handleResponse<Empleado[]>(response);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  }

  async obtenerEmpleadoPorId(id: number): Promise<Empleado> {
    try {
      const response = await fetch(`${this.baseURL}/employees/${id}`);
      return this.handleResponse<Empleado>(response);
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      throw error;
    }
  }

  async crearEmpleado(empleado: Omit<Empleado, 'id_empleado'>): Promise<Empleado> {
    try {
      const response = await fetch(`${this.baseURL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleado)
      });
      return this.handleResponse<Empleado>(response);
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  }

  async actualizarEmpleado(id: number, empleado: Partial<Empleado>): Promise<Empleado> {
    try {
      const response = await fetch(`${this.baseURL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleado)
      });
      return this.handleResponse<Empleado>(response);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      throw error;
    }
  }

  async eliminarEmpleado(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/employees/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      throw error;
    }
  }

  // =================== PRODUCTOS ===================
  
  async obtenerProductos(): Promise<Producto[]> {
    try {
      const response = await fetch(`${this.baseURL}/products`);
      return this.handleResponse<Producto[]>(response);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Nuevo método: Obtener productos filtrados por proveedor
  async obtenerProductosPorProveedor(idProveedor: number): Promise<Producto[]> {
    try {
      const response = await fetch(`${this.baseURL}/products?supplier_id=${idProveedor}`);
      return this.handleResponse<Producto[]>(response);
    } catch (error) {
      console.error('Error al obtener productos por proveedor:', error);
      throw error;
    }
  }

  // Nuevo método alternativo: Obtener productos de un proveedor específico
  async obtenerProductosDeProveedor(idProveedor: number): Promise<{proveedor: Proveedor, productos: Producto[]}> {
    try {
      const response = await fetch(`${this.baseURL}/suppliers/${idProveedor}/products`);
      return this.handleResponse<{proveedor: Proveedor, productos: Producto[]}>(response);
    } catch (error) {
      console.error('Error al obtener productos del proveedor:', error);
      throw error;
    }
  }

  async obtenerProductoPorId(id: number): Promise<Producto> {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`);
      return this.handleResponse<Producto>(response);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }

  async crearProducto(producto: Omit<Producto, 'id_producto'>): Promise<Producto> {
    try {
      const response = await fetch(`${this.baseURL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      return this.handleResponse<Producto>(response);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  async actualizarProducto(id: number, producto: Partial<Producto>): Promise<Producto> {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      return this.handleResponse<Producto>(response);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  async eliminarProducto(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Métodos para productos sin stock
  async obtenerProductosSinStock(): Promise<ProductoSinStock[]> {
    try {
      const response = await fetch(`${this.baseURL}/productos-sin-stock`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result: ProductosSinStockResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al obtener productos sin stock:', error);
      throw error;
    }
  }

  async obtenerProductosSinStockPaginado(page: number = 1, limit: number = 10): Promise<{ productos: ProductoSinStock[], totalItems: number, totalPages: number, currentPage: number, hasNextPage: boolean, hasPrevPage: boolean }> {
    try {
      const response = await fetch(`${this.baseURL}/productos-sin-stock/paginado?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result: ProductosSinStockPaginadoResponse = await response.json();
      return {
        productos: result.data,
        totalItems: result.pagination.total_items,
        totalPages: result.pagination.total_pages,
        currentPage: result.pagination.current_page,
        hasNextPage: result.pagination.has_next_page,
        hasPrevPage: result.pagination.has_prev_page
      };
    } catch (error) {
      console.error('Error al obtener productos sin stock paginados:', error);
      throw error;
    }
  }

  async obtenerProductoSinStockPorId(id: number): Promise<ProductoSinStock> {
    try {
      const response = await fetch(`${this.baseURL}/productos-sin-stock/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result: ProductoSinStockIndividualResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al obtener producto sin stock por ID:', error);
      throw error;
    }
  }

  // =================== SOLICITUDES DE NUEVOS PRODUCTOS ===================

  async obtenerSolicitudesPendientes(): Promise<SolicitudProducto[]> {
    try {
      const response = await fetch(`${this.baseURL}/product-requests/pending`);
      return this.handleResponse<SolicitudProducto[]>(response);
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      throw error;
    }
  }

  async procesarSolicitud(payload: ProcesarSolicitudPayload): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/products/create-from-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return this.handleResponse<any>(response);
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      throw error;
    }
  }

  async obtenerContadorProductosSinStock(): Promise<number> {
    try {
      const response = await fetch(`${this.baseURL}/productos-sin-stock`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result: ProductosSinStockResponse = await response.json();
      return result.total;
    } catch (error) {
      console.error('Error al obtener contador de productos sin stock:', error);
      return 0; // Retornar 0 en caso de error
    }
  }
}

// Instancia única del servicio
const comprasService = new ComprasService();
export default comprasService;