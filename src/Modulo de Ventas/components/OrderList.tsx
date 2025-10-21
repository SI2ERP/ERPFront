import { useMemo } from "react";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { useOrders } from "../api/queries/OrderQueries";

export default function ClientList() {
    
    
    const { data } = useOrders()

    const columns = useMemo<GridColDef[]>(
        () => [
            { field: 'id', headerName: 'ID', type: 'number', align: 'left', headerAlign: 'left' },
            { field: 'id_cliente', headerName: 'ID Cliente', headerAlign: 'left', flex: 1, type: 'number' },
            { field: 'nombre', headerName: 'Nombre Cliente', flex: 1 },
            { field: 'createdAt', headerName: 'Fecha Creación', flex: 1 },
            { field: 'paymentMethod', headerName: 'Método de pago', flex: 1},
            { field: 'paymentTerm', headerName: 'Condición del pago', flex: 1},
            { field: 'total', headerName: 'Total', type: 'number', flex: 1 },
        ], 
    [])

    return (
        <Box sx={{ flex: 'flex' , width: '100%', height: '600px', flexDirection: 'column' }}>
            { data ? 
                <DataGrid 
                    rows={data}
                    columns={columns}     
                    disableRowSelectionOnClick        
                />
                :   
                <></>
            }
        </Box>
    )

};
