import { Button } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import OrderForm from "../Modulo de Ventas/components/Order Form/OrderForm"
import { useState } from "react"


export default function Venta() {

    const queryClient = new QueryClient()
    const [ open, setOpen ] = useState(false)

    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Button variant='outlined' onClick={() => { setOpen(true) }}>
                Crear Pedido
                </Button>
                <OrderForm  stateOpen={[open, setOpen]}/>
            </div>
        </QueryClientProvider>
    )
};
