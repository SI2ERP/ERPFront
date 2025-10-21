import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NavBar } from "../components/NavBar";
import { Outlet } from "react-router-dom";


const queryClient = new QueryClient()

export default function Venta() {

    const pages = ['Pedidos', 'Clientes', 'Facturas', 'Reportes' ];

    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <NavBar pages={pages} />
                <div className="w-full">
                    <Outlet />
                </div>
            </div>
        </QueryClientProvider>
    )
};
