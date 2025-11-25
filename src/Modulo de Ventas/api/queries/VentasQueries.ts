import { useQuery } from "@tanstack/react-query"
import { VentasService } from "../services/venta.service"



const KEY = 'venta'

export function useVentas() {
    return useQuery({
        queryKey: [KEY],
        queryFn:() => (VentasService.GetVentas())
    })
} 

export function useVentaDetalle(ventaId ?: number) {
    return useQuery({
        queryKey: [KEY, ventaId],
        queryFn: () => (VentasService.GetDetalleVenta(ventaId as number)),
        enabled: !!ventaId
    })
}