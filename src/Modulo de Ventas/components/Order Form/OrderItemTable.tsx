import { Grid, Typography, type SxProps, type Theme } from "@mui/material"
import { NumberInput } from "../NumberInput"
import type { OrderItem } from "../../types/Order"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { IVA } from "../../utils/IVA"

export type OrderItemTableProps = {
    orderItems : OrderItem[] 
    handleQuantityItem : ( productId : number, newQuantity : number ) => void
    handleRemoveItem : ( productId : number) => void
}

export default function OrderItemTable({ orderItems, handleQuantityItem, handleRemoveItem } : OrderItemTableProps) {
    return (
        <Grid container sx={containerGridStyle}>
              <Grid size="grow" sx={gridHeaderStyle}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>Productos</Typography>
              </Grid>
              <Grid size={2} sx={{...gridHeaderStyle }}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>Cantidad</Typography>
              </Grid>
              <Grid size={1} sx={gridHeaderStyle}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>IVA</Typography>
              </Grid>
              <Grid size={2} sx={gridHeaderStyle}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>Precio sin IVA (unitario)</Typography>
              </Grid>
              <Grid size={2} sx={gridHeaderStyle}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>Precio con IVA (unitario)</Typography>
              </Grid>
              <Grid size={1} sx={gridHeaderStyle}>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>Eliminar</Typography>
              </Grid>

              {orderItems.map((item) => (
                <Grid key={item.product.id} container sx={{ width: '100%' }}>
                  <Grid size="grow" sx={{...gridRowStyle, justifyContent: 'start'}}>
                    <Typography className='pl-2' variant='body2' fontWeight='bold'>{item.product.name}</Typography>
                  </Grid>
                  <Grid size={2} sx={gridRowStyle}>
                   <NumberInput cantidad={item.quantity} onChange={(newQuantity : number) => {handleQuantityItem(item.product.id, newQuantity )}} />
                  </Grid>
                  <Grid size={1} sx={gridRowStyle}>
                    <Typography variant='body2'>19%</Typography>
                  </Grid>
                  <Grid size={2} sx={gridRowStyle}>
                    <Typography variant='body2'>${item.product.price}</Typography>
                  </Grid>
                  <Grid size={2} sx={gridRowStyle}>
                    <Typography variant='body2'>${(item.product.price * (IVA) * item.quantity).toFixed(2)}</Typography>
                  </Grid>
                  <Grid size={1} sx={{...gridRowStyle, cursor: 'pointer' }}>
                    <RemoveCircleIcon onClick={() => handleRemoveItem(item.product.id)} sx={{ cursor: 'pointer', '&:hover': { color: '#d11f25' } }} />
                  </Grid>
                </Grid>
              ))}
        </Grid>
    )
};


const containerGridStyle : SxProps<Theme> = {
  marginTop: '32px',
  '--Grid-borderWidth': '1px',
  borderTop: 'var(--Grid-borderWidth) solid',
  borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
  },
}

const gridHeaderStyle : SxProps<Theme> = { 
  background: 'oklch(92.8% 0.006 264.531)', 
  paddingLeft: '8px', 
  display: 'flex', 
  alignItems: 'center', 
  minHeight: '40px' 
}

const gridRowStyle : SxProps<Theme> = { 
  borderRight: '1px solid', 
  borderBottom: '1px solid', 
  borderColor: 'divider', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  minHeight: '40px' 
}