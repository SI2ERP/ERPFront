import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL_VENTAS_BACKEND,
    timeout: 0,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'applicacion/json'
    }
})

