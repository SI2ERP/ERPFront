import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, type AlertColor, type SxProps, type Theme } from "@mui/material"
import OrderHeader from "./OrderHeader"
import { useMemo, useState } from "react"
import type { Client } from "../../types/Client"
import OrderItemTable from "./OrderItemTable"
import { PaymentMethod, type PaymentMethodType, type OrderItem, PaymentTerm, type PaymentTermType, type OrderFormError } from "../../types/Order"
import AdditionalDetails from "./AdditionalDetails"
import TotalOrder from "./TotalOrder"
import AddItemForm from "./AddItemForm"



export type OrderFormProps = {
    stateOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export default function OrderForm({ stateOpen } : OrderFormProps) {
    const [open, setOpen] = stateOpen
    
    const [snackbar, setSnackbar] = useState<{
        open : boolean
        msg : string | null
        severity ?: AlertColor
    }>({
        open: false,
        msg: null,
        severity: undefined,
    })
    
    const [ clients,  ] = useState<Client[]>([{ id: 1, name: "Cristian"}, { id: 2, name: "Manuel" }])
    
    const [ orderItems, setOrderItems ] = useState<OrderItem[]>([{ product: { id: 1, name: "Mouse", price: 231}, quantity: 5}, { product: { id: 2, name: "PC-GAMER", price: 2131}, quantity: 1}])
    const [ selectedClient, setSelectedClient ] = useState<Client | null>(null)
    const [ selectedPaymentMethod, setSelectedPaymentMethod ] = useState<PaymentMethodType | null>(null)
    const [ selectedPaymentTerms, setSelectedPaymentTerms ] = useState<PaymentTermType | null>(null)



    const [ errors, setErrors ] = useState<OrderFormError>({
        client : null,
        paymentMethod: null,
        paymentTerm: null,
        orderItems: null
    })

    const clearState = () => {
        setOrderItems([])
        setSelectedClient(null)
        setSelectedPaymentMethod(null)
        setSelectedPaymentTerms(null)
        setSnackbar({ open : false, msg : null, severity: undefined})
    }

    const subtotal = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    }, [orderItems]) 

    const iva = useMemo(() => {
        return orderItems.reduce((acc, item) => {
            const cost = acc + (item.product.price * item.quantity)*(import.meta.env.VITE_IVA)
            return Math.fround(cost*100)/100
        }, 0)
    }, [orderItems])

    const total = useMemo(() => {
        return Math.fround((subtotal + iva)*100)/100
    }, [subtotal, iva])


    const handleSubmitOrder = () => {
        if(!selectedClient) {
            setErrors({...errors, client: 'Selecciona un cliente'})
            setSnackbar({ open: true, severity: 'error', msg : 'Debes de seleccionar un cliente antes de generar el pedido'})

            return 
        } 

        if(orderItems.length === 0) {
            setErrors({...errors, orderItems: 'Agrega al menos un producto al pedido'})
            setSnackbar({open: true, severity: 'error', msg : 'No puedes crear un pedido sin seleccionar al menos 1 producto'})
            return 
        }

        if(!selectedPaymentMethod) {
            setErrors({...errors, paymentMethod: 'Selecciona un método de pago'})
            setSnackbar({open: true, severity: 'error', msg : 'Debes de seleccionar un método de pago'})
            return 
        }

        if(!selectedPaymentTerms) {
            setErrors({...errors, paymentTerm: 'Selecciona una condición de pago'})
            setSnackbar({open: true, severity: 'error', msg : 'Debes de seleccionar una condición de pago'})
            return
        }

        setSnackbar({open: true, severity: 'success', msg : "Order esta correcta para ser creada"})

    }

    const handleCancelOrder = () => {
        clearState()
        setOpen(false)
    }

    const handleQuantityItem = ( productId : number, newQuantity : number ) => {
        setOrderItems(orderItems.map(( item ) => {
            if(item.product.id === productId) return { ...item, quantity: newQuantity } 
            return item
        }))
    }

    const handleRemoveItem = ( productId : number ) => { setOrderItems(orderItems.filter((item) => (item.product.id !== productId))) }
    const handleAddItem = (item : OrderItem) => { setOrderItems([...orderItems, item]) }

    return (
        <Dialog open={open} fullWidth maxWidth='lg'>
            <DialogTitle sx={dialogTitleStyle}>
                Crear Pedido
            </DialogTitle>

            <DialogContent sx={dialogContentStyle}>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbar.open} autoHideDuration={6000} onClose={() => (setSnackbar(prev => ({...prev, open : false})))}>
                    <Alert
                        onClose={() => (setSnackbar(prev => ({...prev, open : false})))}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                       {snackbar.msg}
                    </Alert>
                </Snackbar>
                <OrderHeader 
                    clients={clients}       
                    selectedClient={selectedClient} 
                    handleSelectedClient={setSelectedClient} 
                    errorClient={errors.client}
                    setErrorClient={( msg ) => setErrors( prev => ({...prev, client: msg }))}
                />
                <OrderItemTable 
                    orderItems={orderItems} 
                    handleQuantityItem={handleQuantityItem} 
                    handleRemoveItem={handleRemoveItem} 
                />
                <AddItemForm 
                    handleAddItem={handleAddItem} 
                    orderItems={orderItems}  
                />

                <div className='flex w-full justify-end border-2 border-gray-300 border-dashed mt-8'>
                    <AdditionalDetails 
                        selectedPaymentMethod={selectedPaymentMethod} 
                        handlePaymentMethod={(method : string | null) => setSelectedPaymentMethod((method && Object.values(PaymentMethod).includes(method)) ? method : null)} 
                        selectedPaymentTerms={selectedPaymentTerms} 
                        handlePaymentTerms={(term : string | null) => setSelectedPaymentTerms((term && Object.values(PaymentTerm).includes(term)) ? term : null)} 
                        errorPaymentMethod={errors.paymentMethod}
                        setErrorPaymentMethod={( msg ) => setErrors( prev => ({ ...prev, paymentMethod: msg }))}
                        errorPaymentTerm={errors.paymentTerm}
                        setErrorPaymentTerm={( msg ) => setErrors( prev => ({...prev, paymentTerm: msg }))}
                    />
                    <TotalOrder 
                        subTotal={subtotal}
                        iva={iva}
                        total={total}
                    />
                </div>
            </DialogContent>

            <DialogActions>
                <Button variant='outlined' sx={{ color: '#99CC17', borderColor: '#99CC17'}} onClick={handleSubmitOrder}>
                    Crear Pedido
                </Button>
                <Button variant='outlined' sx={{ color: '#B61C23', borderColor: '#B61C23'}} onClick={handleCancelOrder}>
                    Cancelar Pedido
                </Button>                
            </DialogActions>
        </Dialog>
    )
};




const dialogTitleStyle : SxProps<Theme> =  {
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '22px',
  padding: '16px 24px',
  marginBottom: '2rem',
  background: '#99CC17',
}

const dialogContentStyle : SxProps<Theme> = { 
  width: '100%', 
  display: 'flex', 
  flexDirection: 'column',
}
