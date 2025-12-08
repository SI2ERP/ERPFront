import axios from 'axios'
const API_URL = import.meta.env.VITE_URL_INVENTORY_BACKEND || 'http://localhost:3003'; 

const apiClient = axios.create({
  baseURL: API_URL,
})

// --- INTERFACES ---
export interface Producto {
  id: number
  nombre: string
  codigo: string 
  descripcion?: string
  precio_unitario: number | string 
  precio_venta: number | string
  cantidad: number 
  estado: boolean
  fechaCreacion: Date
  fechaActualizacion: Date
}

export interface User {
  nombre: string;
  rol: string;
  email?: string;
}

export interface CreateProductoDto {
  nombre: string
  descripcion?: string
  user: User | null
}

// interfaz para sumar stock
export interface UpdateProductoDto {
  stock?: number;
  user?: any;
  [key: string]: any; 
}

export interface RestarStockDto {
  stock: number 
  user: any 
}

export interface ProductoSinStock {
  id_producto: number
  nombre: string
  descripcion: string
  precio_unitario: string
  codigo: string
  precio_venta: string
  fecha_sin_stock: string
}

export interface Reserva {
  id: number
  stock: number
  fechaReserva: string
  producto: {
    id: number
    nombre: string
    codigo: string
  }
}

export interface Movimiento {
  id: number
  cantidad: number
  tipo_movimiento: string
  fechaMovimiento: string
  productoId: number
  empleadoId: number
}

// Producto por despachar - interfaz para el listado
export interface ProductoDespachoBase {
    id: number;
    codigo: string; 
    nombre: string; 
}

// Producto por despachar - como viene del service
export interface ProductoPorDespachar {
    id: number; 
    cantidad_por_despachar: number; 
    producto: ProductoDespachoBase; 
    fecha_registro: Date;
}

// --- INTERFACES PARA HISTORIAL DE MOVIMIENTOS ---

export interface EmpleadoBase {
    nombre: string;
}

export interface ProductoBaseMovimiento {
    codigo: string;
    nombre: string;
}

// Movimiento Automático
export interface MovimientoLogistica {
    id: number;
    cantidad: number; 
    es_recepcion: boolean; // TRUE: Ingreso, FALSE: Salida
    id_referencia: number;
    producto: ProductoBaseMovimiento; 
    empleado: EmpleadoBase;
    fechaMovimiento: Date;
}

// Ajuste Manual
export interface AjusteManual {
    id: number;
    cantidad: number; // Puede ser positivo o negativo
    observaciones: string; 
    producto: ProductoBaseMovimiento; 
    empleado: EmpleadoBase;
    fechaAjuste: Date;
}

// --- FUNCIONES ---

export const getProductos = async (): Promise<Producto[]> => {
  const response = await apiClient.get('/productos')
  return response.data
}

export const createProducto = async (data: CreateProductoDto): Promise<any> => {
  const payload = { ...data };
  const response = await apiClient.post('/productos', payload)
  return response.data
}

// ✅ RESTAURADA: Función para actualizar datos (se usa para SUMAR stock)
export const actualizarProducto = async (id: number, data: UpdateProductoDto): Promise<any> => {
  const response = await apiClient.patch(`/productos/${id}`, data)
  return response.data
}

// Función para RESTAR stock (endpoint específico que requiere user)
export const restarStockProducto = async (id: number, cantidadARestar: number, user: any) => {
  const dto: RestarStockDto = {
    stock: cantidadARestar,
    user: user,
  }
  const response = await apiClient.patch(`/productos/${id}/stock`, dto)
  return response.data 
}

export const getProductosSinStock = async (): Promise<ProductoSinStock[]> => {
  const response = await apiClient.get('/productos-sin-stock') 
  return response.data
}

export const getReservas = async (): Promise<Reserva[]> => {
  const response = await apiClient.get('/reservas-venta-inventario')
  return response.data
}

export const getMovimientos = async (): Promise<Movimiento[]> => {
  try {
    const response = await apiClient.get('/movimientos-inventario')
    return response.data
  } catch (error) {
    console.warn("Error obteniendo movimientos", error);
    return [];
  }
}

// Obtener productos por despachar
export const getProductosPorDespachar = async (): Promise<ProductoPorDespachar[]> => {
    try {
        const response = await apiClient.get('/productos-por-despachar'); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos por despachar:", error);
        return []; 
    }
}

// --- FUNCIONES PARA HISTORIAL DE MOVIMIENTOS ---

// Obtener movimientos automáticos
export const getMovimientosLogistica = async (): Promise<MovimientoLogistica[]> => {
    try {
        const response = await apiClient.get('/movimientos-inventario-logistica'); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener movimientos de logística:", error);
        return [];
    }
}

// Obtener ajustes manuales
export const getAjustesManuales = async (): Promise<AjusteManual[]> => {
    try {
        const response = await apiClient.get('/ajustes-inventario'); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener ajustes manuales:", error);
        return [];
    }
}