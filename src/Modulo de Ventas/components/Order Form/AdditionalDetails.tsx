import { Typography, TextField } from "@mui/material";
import {  PaymentMethod, type PaymentMethodType, type PaymentTermType } from "../../types/Order";


type AdditionalDetailsProps = {
    selectedPaymentMethod : PaymentMethodType | null
    handlePaymentMethod : (method : string | null) => void
    errorPaymentMethod : string | null 
    setErrorPaymentMethod : (msg : string | null) => void
    
    selectedPaymentTerms : PaymentTermType | null 
    handlePaymentTerms : (term : string | null) => void
    errorPaymentTerm : string | null
    setErrorPaymentTerm : (msg : string | null) => void
} 

export default function AdditionalDetails({ selectedPaymentMethod, handlePaymentMethod, errorPaymentMethod, setErrorPaymentMethod } : AdditionalDetailsProps) {

    return (
        <div className='flex flex-col gap-4 flex-1 px-8 py-4'>
            <Typography variant='body2' sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Detalles Adicionales</Typography>
            <div className='flex flex-col gap-2'>
                <Typography variant='body2'>Método de Pago:</Typography>
                <TextField
                select
                required
                size='small'
                value={selectedPaymentMethod}
                error={!!errorPaymentMethod}
                helperText={errorPaymentMethod}
                onChange={(e) => handlePaymentMethod(e.target.value)}
                slotProps={{
                    select: {
                        native: true
                    }
                }}
                onBlur={() => {
                    setErrorPaymentMethod(null)
                }}
                >
                    <option value={''}>Selecciona un método de pago</option>
                    <option value={PaymentMethod.DEBIT_CARD}>{PaymentMethod.DEBIT_CARD}</option>
                    <option value={PaymentMethod.TRANSFER}>{PaymentMethod.TRANSFER}</option>
                </TextField>
            </div>
            {/*
            <div className='flex flex-col gap-2'>
                <Typography variant='body2'>Condiciones de Pago:</Typography>
                <TextField
                    select
                    size='small'
                    required
                    error={!!errorPaymentTerm}
                    onBlur={() => {setErrorPaymentTerm(null)}}
                    helperText={errorPaymentTerm}
                    value={selectedPaymentTerms}
                    onChange={(e) => handlePaymentTerms(e.target.value)}
                    slotProps={{
                        select: {
                            native: true
                        }
                    }}
                >
                    <option value={''}>Selecciona una condición de pago</option>
                    <option value={PaymentTerm.IN_CASH}>{PaymentTerm.IN_CASH}</option>
                    <option value={PaymentTerm.IN_30_DAYS}>{PaymentTerm.IN_30_DAYS}</option>
                    <option value={PaymentTerm.IN_60_DAYS}>{PaymentTerm.IN_60_DAYS}</option>
                    <option value={PaymentTerm.IN_90_DAYS}>{PaymentTerm.IN_90_DAYS}</option>
                </TextField>
            </div>    
            */}          
        </div>        
    )    
};
