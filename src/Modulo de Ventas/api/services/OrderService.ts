import type { Order } from "../../types/Order"
import { axiosInstance } from "./AxiosInstance"

export class OrderService {

    static async FindAllOrders() : Promise<Order[]> {
        const { data } = await axiosInstance.get(`/sales/`)
        return data?.message 
    }

    static async FindOrderByID( orderId : number ) : Promise<Order> {
        const { data } = await axiosInstance.get(`/sales/${orderId}`)
        return data?.message
    }

    static async PostOrder( order : Omit<Order, 'id'> ) : Promise<Order> {
        const { data } = await axiosInstance.post('/sales/', order)
        return data?.message
    }

} 