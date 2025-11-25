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

export interface CreateProductoDto {
  nombre: string
  codigo: string
  descripcion?: string
  precio_unitario: number
  precio_venta: number
  cantidad?: number
}

export interface RestarStockDto {
  stock: number //cantidad a restar
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

//Consulta de productos
export const getProductos = async (): Promise<Producto[]> => {
  const response = await apiClient.get('/productos')
  return response.data
}

//Ingreso de nuevo producto
export const createProducto = async (data: CreateProductoDto): Promise<Producto> => {
  const response = await apiClient.post('/productos', data)
  return response.data
}

//Egreso/retiro de stock
export const restarStockProducto = async (id: number, cantidadARestar: number) => {
  const dto: RestarStockDto = {
    stock: cantidadARestar,
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