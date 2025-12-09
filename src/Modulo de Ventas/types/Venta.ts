import type { Cliente } from "./Cliente"


export type ProductoVenta = {
    id_producto : number
    nombre : string
    descripcion : string
}

export type Venta = {
    id_venta : number
    id_cliente : number 
    id_carrito : number
    forma_de_pago : string 
    fecha_pedido : Date
    estado : string 
    direccion_envio : string 
    total : number
    cliente : Cliente
}


export type DetalleVenta = {
    id_venta : number
    id_producto : number
    producto : ProductoVenta
    cantidad : number
    precio_unit : number
}