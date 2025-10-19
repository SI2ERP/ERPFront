import { Typography, Divider } from "@mui/material";


type TotalOrderProps = {
    subTotal : number,
    iva: number,
    total: number
}

export default function TotalOrder({ subTotal, iva, total } : TotalOrderProps) {

    return (
        <div className='flex flex-col justify-around gap-4 px-8 py-4 bg-gray-100 border-l-1 border-gray-200'>
            <div className='flex flex-row gap-4'>
                <Typography className='min-w-40' sx={{ fontWeight: 'none' }}>Subtotal:</Typography>
                <Typography>${subTotal}</Typography>
            </div>
            <div className='flex flex-row gap-4'>
                <Typography className='min-w-40'>IVA:</Typography>
                <Typography>${iva}</Typography>
            </div>
            <Divider />
            <div className='flex flex-row gap-4'>
                <Typography className='min-w-40' sx={{ fontWeight: 'bold' }}>Total:</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>${total}</Typography>
            </div>
        </div>        
    )
};
