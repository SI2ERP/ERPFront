import type { Order, PaymentMethodType, PaymentTermType } from "../../types/Order"
import { axiosInstance } from "./AxiosInstance"
import type { TClient } from "./ClientService"


const RESOURCE_NAME = 'sales'


type TEmpleado = {
    id_empleado: number
    nombre: string
    apellido: string
    rol: string
    email: string
    telefono: string
}

type TProducto = {
    id_producto: number
    nombre: string
    descripcion: string
    precio_unitario: number
    estado: boolean
    cantidad: number
}

type TDetalleVenta = {
    id_venta: number
    id_producto: number
    producto: TProducto
    cantidad: number
    precio_unit: number
}

type TOrderResponse = {
    id_venta: number
    id_cliente: number 
    id_empleado: number
    empleado: TEmpleado
    detalles_venta: TDetalleVenta[]
    cliente: TClient
    fecha_pedido: Date
    total: number
    estado: boolean
    forma_de_pago: string
    condiciones_de_pago: string
}

type TCreateOrderRequest = {
    id_cliente: number
    id_empleado: number,
    fecha_pedido: Date,
    detalles_venta: {
        id_producto: number
        cantidad: number
        precio_unitario: number
    }[]
    forma_de_pago: string
    condiciones_de_pago: string
}


const transformOrderResponse = (response: TOrderResponse): Order => {
    return {
        id: response.id_venta,
        orderItems: response.detalles_venta.map(detalle => ({
            product: {
                id: detalle.id_producto,
                name: detalle.producto.nombre,
                price: detalle.precio_unit
            },
            quantity: detalle.cantidad
        })),
        client: {
            id_cliente: response.id_cliente,
            nombre: response.cliente.nombre,
            apellido: response.cliente.apellido,
            email: response.cliente.email,
            telefono: response.cliente.telefono,
            direccion: response.cliente.direccion,
            estado: response.cliente.estado
        },
        AdditionalDetails: {
            paymentMethod: response.forma_de_pago as PaymentMethodType,
            paymentTerm: response.condiciones_de_pago as PaymentTermType
        },
        createdAt: new Date(response.fecha_pedido),
        total: response.total
    }
}

const transformOrderToRequest = (order: Omit<Order, 'id' | 'createdAt'>): TCreateOrderRequest => {
    return {
        id_cliente: 1,
        id_empleado: 1,
        fecha_pedido: new Date(),
        detalles_venta: order.orderItems.map(item => ({
            id_producto: item.product.id,
            cantidad: item.quantity,
            precio_unitario: item.product.price
        })),
        forma_de_pago: order.AdditionalDetails.paymentMethod,
        condiciones_de_pago: order.AdditionalDetails.paymentTerm,
    }
}

export class OrderService {

    static async FindAllOrders(): Promise<Order[]> {
        const { data } = await axiosInstance.get<TOrderResponse[]>(`/${RESOURCE_NAME}`)  
        console.log(data)      
        console.log(data.map(transformOrderResponse))
        return data.map(transformOrderResponse)
    }

    static async FindOrderByID(orderId: number): Promise<Order> {
        const { data } = await axiosInstance.get<TOrderResponse>(`/${RESOURCE_NAME}/${orderId}`)
        return transformOrderResponse(data)
    }

    static async PostOrder(order: Omit<Order, 'id'>): Promise<Order> {
        console.log("sdjdsj")
        const body = transformOrderToRequest(order)
        console.log("post: ", body)
        const { data } = await axiosInstance.post<TOrderResponse>(`/${RESOURCE_NAME}`, body)
        return transformOrderResponse(data)
    }
}