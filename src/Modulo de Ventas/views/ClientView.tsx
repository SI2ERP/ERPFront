import { useState } from "react";
import OrderForm from "../components/Order Form/OrderForm";
import { Button } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const queryClient = new QueryClient()


export default function ClientView() {

    const [open, setOpen] = useState(false)
    return (
    <QueryClientProvider client={queryClient}>
        <div>
            <Button variant='contained' 
                    onClick={() => (setOpen(true))}
                    sx={{ 
                        paddingY: 0,
                        height: '2.3rem',
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#1a1a1a',
                        }
                    }}
                >
                    Crear Pedido
            </Button>
            <OrderForm stateOpen={[open, setOpen]} />
        </div>
    </QueryClientProvider>
    )
};
