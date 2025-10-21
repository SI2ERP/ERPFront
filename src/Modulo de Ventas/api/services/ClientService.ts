import type { Client } from "../../types/Client"
import { axiosInstance } from "./AxiosInstance"


const RESOURCE_NAME = 'clientes'


export type TClient = {
    id_cliente: number 
    nombre: string
    apellido: string
    direccion: string
    telefono: string
    email: string
    estado: boolean
}

export class ClientService {

    static async FindAllUsers() : Promise<Client[]> {
        const { data } = await axiosInstance.get(`/${RESOURCE_NAME}`)
        return data 
    }

    static async FindUserById(id : string) : Promise<Client> {
        const { data } = await axiosInstance.get(`/${RESOURCE_NAME}/${id}`)
        return data
    }

} 