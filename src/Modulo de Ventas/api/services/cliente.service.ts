import type { Cliente } from "../../types/Cliente"
import type { Direccion } from "../../types/Direccion"
import { axiosInstance } from "./AxiosInstance"



export type TSendEmailReq = {
    id_cliente : number
    to: string[]
    subject: string
    body: string
    boleta_ventas: number[]
}

export class ClienteService {

    private static readonly RESOURCE_NAME = 'clientes'
    private static readonly RESOURCE_DIRECTION_NAME = 'directions'

    static async GetClientes() : Promise<Cliente[]> {
        const { data } = await axiosInstance.get(`/${ClienteService.RESOURCE_NAME}`)
        return data
    }

    static async GetClientePorID(id : number) : Promise<Cliente> {
        const { data } = await axiosInstance.get(`/${ClienteService.RESOURCE_NAME}/${id}`)
        return data?.data
    }

    static async GetDireccionesPorClienteID(id : number) : Promise<Direccion[]> {
        const { data } = await axiosInstance.get(`/${ClienteService.RESOURCE_NAME}/${id}/${ClienteService.RESOURCE_DIRECTION_NAME}`)
        console.log(data)
        return data?.data
    }

    static async SendEmail( body : TSendEmailReq) : Promise<boolean> {
        const { data } = await axiosInstance.post(`/${ClienteService.RESOURCE_NAME}/send_email`, body, { validateStatus: () => true })
        console.log(data)
        return true
    } 

} 