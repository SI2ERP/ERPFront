import { useMemo } from "react";
import { useClients } from "../api/queries/ClientQueries";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";

export default function ClientList() {
    
    
    const { data } = useClients()

    const columns = useMemo<GridColDef[]>(
        () => [
            { field: 'id_cliente', headerName: 'ID', type: 'number', align: 'left', headerAlign: 'left' },
            { field: 'nombre', headerName: 'Nombre', flex: 1 },
            { field: 'apellido', headerName: 'Apellido', flex: 1 },
            { field: 'direccion', headerName: 'Dirección', flex: 2 },
            { field: 'telefono', headerName: 'Teléfono', flex: 1 },
            { field: 'email', headerName: 'correo electrónico', flex: 2 },
            { field: 'estado', headerName: 'Estado', type: 'boolean', align: 'center', headerAlign: 'center', flex: 1 }
        ], 
    [])

    return (
        <Box sx={{ flex: 'flex' , width: '100%', height: '600px', flexDirection: 'column' }}>
            { data ? 
                <DataGrid 
                    rows={data}
                    getRowId={(row) => row.id_cliente}
                    columns={columns}     
                    disableRowSelectionOnClick        
                />
                :   
                <></>
            }
        </Box>
    )

};
