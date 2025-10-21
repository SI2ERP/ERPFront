import { FormLabel, TextField, Typography } from "@mui/material";
import type { Client } from "../../types/Client";
import { format } from 'date-fns';


export type OrderHeaderProps = {
    clients : Client[]
    selectedClient : Client | null
    handleSelectedClient : (client : Client | null) => void
    errorClient: string | null
    setErrorClient: (msg : string | null) => void
}

export default function OrderHeader({ clients, selectedClient, handleSelectedClient, errorClient, setErrorClient } : OrderHeaderProps) {
    return (
        <div className='flex w-full flex-row gap-4 p-2 justify-between'>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-row items-center gap-3'>
                    <FormLabel sx={{ textAlign: 'start', minWidth: '100px' }} required>Cliente: </FormLabel>
                    <TextField
                        select
                        fullWidth
                        error={!!errorClient}
                        helperText={errorClient}
                        size="small"
                        value={selectedClient?.id_cliente ?? ''}
                        onChange={(e) => {
                            const id_cliente = Number(e.target.value)
                            const client = clients.find(c => c.id_cliente === id_cliente) || null
                            handleSelectedClient(client)
                        }}
                        slotProps={{
                            select: {
                                native: true
                            }
                        }}
                        onBlur={() => {
                            setErrorClient(null)
                        }}
                    >
                        <option value={''}>Selecciona un cliente</option>
                        {clients.map(client => (
                            <option key={client.id_cliente} value={client.id_cliente}>
                            {client.nombre}
                            </option>
                        ))}
                    </TextField>
                </div>
                <div className='flex flex-row items-center gap-3'>
                    <FormLabel sx={{ textAlign: 'start', minWidth: '100px' }} >Vendedor: </FormLabel>
                    <TextField
                    size='small'
                    value='OP-01'
                    disabled
                    fullWidth
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center gap-3'>
                    <Typography variant='body1'>Fecha:</Typography>
                    <TextField
                    value={format(new Date(), 'dd-MM-yyyy')}
                    variant='outlined'
                    disabled
                    size='small'
                    />
                </div>
            </div>
        </div>
    )
}