import axios from 'axios'
const API_URL = import.meta.env.VITE_URL_INVENTORY_BACKEND; 

const apiClient = axios.create({
  baseURL: API_URL,
})

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

// Se cambia a interface para evitar errores de inicialización estricta
export interface CreateProductoDto {
  nombre: string
  codigo: string
  descripcion?: string
  precio_unitario: number
  precio_venta: number
  cantidad?: number
  stock?: number // Propiedad esperada por el backend
  user: User | null
}

export interface RestarStockDto {
  stock: number // cantidad a restar
  user: any // Usuario que realiza la acción
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
  stock: number // cantidad reservada
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

//Consulta de productos
export const getProductos = async (): Promise<Producto[]> => {
  const response = await apiClient.get('/productos')
  return response.data
}

//Ingreso de nuevo producto
export const createProducto = async (data: CreateProductoDto): Promise<any> => {
  // Aseguramos que se envíe 'stock' si el backend lo requiere
  const payload = {
    ...data,
    stock: data.stock || data.cantidad
  };
  const response = await apiClient.post('/productos', payload)
  return response.data
}

//Egreso/retiro de stock
export const restarStockProducto = async (id: number, cantidadARestar: number, user: any) => {
  const dto: RestarStockDto = {
    stock: cantidadARestar,
    user: user,
  }
  const response = await apiClient.patch(`/productos/${id}/stock`, dto)
  return response.data 
}

//Obtener productos sin stock
export const getProductosSinStock = async (): Promise<ProductoSinStock[]> => {
  const response = await apiClient.get('/productos-sin-stock') 
  return response.data
}

export const getReservas = async (): Promise<Reserva[]> => {
  const response = await apiClient.get('/reservas-venta-inventario')
  return response.data
}

// Obtener historial de movimientos
export const getMovimientos = async (): Promise<Movimiento[]> => {
  try {
    const response = await apiClient.get('/movimientos-inventario')
    return response.data
  } catch (error) {
    console.warn("Error obteniendo movimientos", error);
    return [];
  }
}