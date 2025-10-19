import { useMutation, useQuery } from "@tanstack/react-query"
import { OrderService } from "../services/OrderService"
import type { Order } from "../../types/Order"



const KEY = 'order'

export function useOrders() {
    return useQuery({
        queryKey: [KEY],
        queryFn:() => (OrderService.FindAllOrders())
    })
} 

export function usePostOrders() {
    return useMutation({
        mutationKey: [KEY],
        mutationFn: ( order : Omit<Order, 'id'>) => (OrderService.PostOrder( order ))
    })
}