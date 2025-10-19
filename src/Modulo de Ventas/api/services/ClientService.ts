import type { Client } from "../../types/Client"
import { axiosInstance } from "./AxiosInstance"




export class ClientService {

    static async FindAllUsers() : Promise<Client[]> {
        const { data } = await axiosInstance.get(`/user/`)
        return data?.message 
    }

    static async FindUserById(id : string) : Promise<Client> {
        const { data } = await axiosInstance.get(`/user/${id}`)
        return data?.message
    }

} 