import type { Cliente } from "../../types/Cliente"
import type { Direccion } from "../../types/Direccion"
import { axiosInstance } from "./AxiosInstance"





export class ClienteService {

    private static readonly RESOURCE_NAME = 'clientes'
    private static readonly RESOURCE_DIRECTION_NAME = 'directions'

    static async GetClientes() : Promise<Cliente[]> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME}`)
        return data
    }

    static async GetClientePorID(id : number) : Promise<Cliente> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME}/${id}`)
        return data?.data
    }

    static async GetDireccionesPorClienteID(id : number) : Promise<Direccion[]> {
        const { data } = await axiosInstance.get(`/${this.RESOURCE_NAME}/${id}/${this.RESOURCE_DIRECTION_NAME}`)
        console.log(data)
        return data?.data
    }

} 