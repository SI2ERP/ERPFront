import type { DetalleVenta, Venta } from "../../types/Venta"
import { axiosInstance } from "./AxiosInstance"
import { ClienteService } from "./cliente.service"




export class VentasService {

    private static readonly RESOURCE_NAME_VENTA = 'sales'
    private static readonly RESOURCE_NAME_DETALLE_VENTA = 'cart'

    static async GetVentas(): Promise<Venta[]> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME_VENTA}`)
        const ventas = data?.data ?? []

        const res = await Promise.all(
            ventas.map(async (v: Venta) => {
                const cliente = await ClienteService.GetClientePorID(v.id_cliente)
                return { ...v, cliente }
            })
        )
        return res
    }


    static async GetVentaPorID(ventaId: number) : Promise<Venta[]> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME_VENTA}/${ventaId}`)
        return data?.data
    }

    static async GetDetalleVenta(ventaId : number) : Promise<DetalleVenta[]> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME_VENTA}/${ventaId}/details`)
        return data?.data
    }
}