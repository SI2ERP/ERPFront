import { Button, Typography } from "@mui/material";
import OrderList from "../components/OrderList";
import { useState } from "react";
import OrderForm from "../components/Order Form/OrderForm";


export default function Order() {


    const [ openCreateOrder, setOpenCreateOrder ] = useState(false)


    return (
        <div className="flex flex-col gap-2 p-8 mt-4 bg-[#F5F6FA] border border-[#E5E7ED]">
            <div className="flex flex-row justify-between items-center">
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1a1a1a' }}>
                    Pedidos
                </Typography>
                <Button variant='contained' 
                    onClick={() => (setOpenCreateOrder(true))}
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
            </div>
            <OrderList />
            <OrderForm stateOpen={[openCreateOrder, setOpenCreateOrder]}/>
        </div>
    )
};
