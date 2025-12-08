// Tipos para Orden de Picking
export interface OrdenPicking {
  id_ot: number;
  id_empleado: number;
  nombre_empleado?: string;
  fecha: string;
  // Estados actualizados: CREADA, ASIGNADA, EN PICKING, COMPLETADA, CANCELADA
  estado: "CREADA" | "ASIGNADA" | "EN PICKING" | "COMPLETADA" | "CANCELADA";
  observaciones?: string;
}

export interface CreateOrdenPicking {
  id_empleado: number;
  fecha: string;
  estado?: string;
  observaciones?: string;
}

// Tipos para Guía de Despacho
export interface GuiaDespacho {
  id_guia: number;
  id_ot: number;
  fecha: string;
  id_transportista: number;
  // Nombre ya resuelto por el backend mediante join con public.empleado
  transportista_nombre?: string | null;
  direccion_entrega: string;
  // 'EN PICKING', 'ASIGNADA', 'EN CAMINO', 'ENTREGADA', 'FALLIDA', 'CANCELADA'
  estado?:
    | "EN PICKING"
    | "ASIGNADA"
    | "EN CAMINO"
    | "ENTREGADA"
    | "FALLIDA"
    | "CANCELADA";
  estado_ot?: string;
  id_encargado?: number;
  encargado_name?: string | null;
}

export interface CreateGuiaDespacho {
  id_ot: number;
  fecha_despacho: string;
  transportista: string;
  direccion_entrega: string;
  id_encargado?: number;
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

// ========== TIPOS PARA INTEGRACIÓN ==========

// Pedidos de Ventas (recibidos desde ERP Ventas)
export interface PedidoVenta {
  id: number;
  numero_pedido: string;
  cliente: string;
  direccion_despacho: string;
  estado: "PENDIENTE" | "PROCESADO" | "RECHAZADO";
  fecha_pedido: string;
  fecha_recepcion: string;
  observaciones?: string;
  cantidad_productos?: number;
}

export interface DetallePedidoVenta {
  id: number;
  pedido_venta_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

// Órdenes de Compra (recibidas desde ERP Compras)
export interface OrdenCompra {
  id: number;
  numero_orden: string;
  proveedor: string;
  estado: "PENDIENTE" | "RECEPCIONADA" | "RECHAZADA";
  fecha_orden: string;
  fecha_recepcion: string;
  fecha_esperada_entrega?: string;
  observaciones?: string;
  cantidad_productos?: number;
  empleado_logistica_nombre?: string;
  total_compra?: number;
}

export interface DetalleOrdenCompra {
  id: number;
  orden_compra_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

// Para crear pedido (simulador de testing)
export interface CreatePedidoVenta {
  numero_pedido: string;
  cliente: string;
  direccion_despacho: string;
  fecha_pedido?: string;
  observaciones?: string;
  detalles: {
    producto_id: number;
    producto_nombre: string;
    cantidad: number;
    precio_unitario: number;
  }[];
}

// Para crear OC (simulador de testing)
export interface CreateOrdenCompra {
  numero_orden: string;
  proveedor: string;
  fecha_orden?: string;
  fecha_esperada_entrega?: string;
  observaciones?: string;
  detalles: {
    producto_id: number;
    producto_nombre: string;
    cantidad: number;
    precio_unitario: number;
  }[];
}

// ========== RECURSOS (Empleados y Transportistas) ==========

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
  telefono: string;
}

export interface Transportista {
  id: number;
  nombre: string;
  apellido?: string;
  rut: string;
  telefono: string;
  email: string;
}
