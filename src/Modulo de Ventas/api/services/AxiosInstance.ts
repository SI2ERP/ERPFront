import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'applicacion/json'
    }
})

