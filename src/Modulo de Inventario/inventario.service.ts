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

// Interface alineada con tu Backend
export interface CreateProductoDto {
  nombre: string
  codigo?: string // Opcional porque lo generamos si falta
  descripcion?: string
  precio_unitario?: number
  precio_venta?: number
  stock?: number
  user: User | null
}

// Interface para la actualización genérica (Sumar)
export interface UpdateProductoDto {
  stock?: number;
  user?: User | null; // El backend espera un 'user' en el DTO
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

// --- FUNCIONES ---

export const getProductos = async (): Promise<Producto[]> => {
  const response = await apiClient.get('/productos')
  return response.data
}

export const createProducto = async (data: CreateProductoDto): Promise<any> => {
  const payload = {
      ...data,
      // Valores por defecto para pasar validaciones del backend
      stock: data.stock || 0,
      codigo: data.codigo || `SOL-${Date.now()}`,
      precio_unitario: data.precio_unitario || 0,
      precio_venta: data.precio_venta || 0
  };
  const response = await apiClient.post('/productos', payload)
  return response.data
}

// ✅ Función para SUMAR (Calculamos total y pisamos el valor)
export const actualizarProducto = async (id: number, data: UpdateProductoDto): Promise<any> => {
  // Enviamos PATCH a /productos/:id
  const response = await apiClient.patch(`/productos/${id}`, data)
  return response.data
}

// ✅ Función para RESTAR (Usa la lógica del backend de descontar)
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