import { useQuery } from "@tanstack/react-query"
import { ClienteService } from "../services/cliente.service"




export function useClientes() {
    return useQuery({
        queryKey: ['clientes'],
        queryFn:() => (ClienteService.GetClientes())
    })
} 

export function useDireccionCliente( clientID ?: number) {
    return useQuery({
        queryKey: ['clientes_direccion', clientID],
        queryFn: () => (ClienteService.GetDireccionesPorClienteID(clientID as number)),
        enabled: !!clientID
    })
}