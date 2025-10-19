import { useQuery } from "@tanstack/react-query"
import { ClientService } from "../services/ClientService"



const KEY = 'client'

export function useClients() {
    return useQuery({
        queryKey: [KEY],
        queryFn:() => (ClientService.FindAllUsers())
    })
} 