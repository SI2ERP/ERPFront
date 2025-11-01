import { useEffect, useMemo } from "react";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { useOrders } from "../api/queries/OrderQueries";
import type { Order } from "../types/Order";


export default function ClientList() {
  const { data } = useOrders();

  const rows = useMemo(() => {
    if (!data) return [];
    return data.map((order: Order) => ({
      id: order.id,
      id_cliente: order.client?.id_cliente ?? '',
      nombre: order.client.nombre ?? '',
      createdAt: new Date(order.createdAt).toLocaleDateString(),
      paymentMethod: order.AdditionalDetails?.paymentMethod ?? '',
      paymentTerm: order.AdditionalDetails?.paymentTerm ?? '',
      total: order.total,
    }));
  }, [data]);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: 'ID', type: 'number', align: 'left', headerAlign: 'left' },
      { field: 'id_cliente', headerName: 'ID Cliente', align: 'center', headerAlign: 'center', type:'number' },
      { field: 'nombre', headerName: 'Nombre Cliente', flex: 1 },
      { field: 'createdAt', headerName: 'Fecha Creación', flex: 1 },
      { field: 'paymentMethod', headerName: 'Método de pago', flex: 1 },
      { field: 'total', headerName: 'Total (CLP)', type: 'number', flex: 1, headerClassName:'font-semibold', cellClassName : 'font-semibold text-[18px]', align: 'center', headerAlign: 'center' },
    ],
    []
  );

  useEffect(() => {
    console.log("tabla ventas:", rows);
  }, [rows]);

  return (
    <Box sx={{ width: '100%', height: '600px' }}>
      <DataGrid 
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
