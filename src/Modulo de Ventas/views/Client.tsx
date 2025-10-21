import { Typography } from "@mui/material";
import ClientList from "../components/ClientList";

export default function Client() {


    return (
        <div className="flex flex-col gap-8 p-8 mt-4 bg-[#F5F6FA] border border-[#E5E7ED]">
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    color: '#1a1a1a'
                }}
            >
                Clientes
            </Typography>
            <ClientList />
        </div>
    )
};
