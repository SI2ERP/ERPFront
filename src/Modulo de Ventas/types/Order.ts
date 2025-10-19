import type { Client } from "./Client"
import type { Product } from "./Product"


export type Order = {
    id : number
    orderItems : OrderItem[]
    client : Client
    AdditionalDetails : {
        paymentMethod : PaymentMethodType
        paymentTerm : PaymentTermType
    }
    createdAt : Date
    total : number
}

export type OrderFormError = {
    client : string | null
    paymentMethod: string | null
    paymentTerm: string | null
    orderItems : string | null
}

export type OrderItem = {
    product: Product
    quantity: number
}

export const PaymentMethod = {
    CASH: "Efectivo",
    DEBIT_CARD: "Tarjeta de debito",
    TRANSFER: "Transferencia",
    CHECK: "Cheque"
}

export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export const PaymentTerm = {
    IN_CASH: "Contado",
    IN_30_DAYS: "30 Días",
    IN_60_DAYS: "60 Días",
    IN_90_DAYS: "90 Días"
}

export type PaymentTermType = (typeof PaymentTerm)[keyof typeof PaymentTerm];