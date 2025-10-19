import { FormLabel, Autocomplete, TextField } from "@mui/material";
import FormDialog from "../FormDialog";
import type { OrderItem } from "../../types/Order";
import { useState } from "react";
import type { Product } from "../../types/Product";



type AddItemFormProps = {
    handleAddItem: (item : OrderItem) => void
    orderItems: OrderItem[]
}

export default function AddItemForm({ handleAddItem, orderItems } : AddItemFormProps) {

    const [ selectedProduct, setSelectedProduct ] = useState<Product | null>(null)
    const [ quantity, setQuantity ] = useState<number | null>(1)
    const [ products,  ] = useState<Product[]>([{ id: 10, name: "Kari", price: 100 }])

    const handleSubmitForm = () => {
        if(!selectedProduct) return
        if(!quantity || quantity < 0) return

        const productFound = orderItems.find(( item ) => item.product.id === selectedProduct.id)

        if(productFound) {
            alert("Producto ya seleccionado previamente")
            return
        }

        handleAddItem({
            product: selectedProduct,
            quantity: quantity
        })
    }

    return (
        <FormDialog title={"Agregar Producto"} buttonText={"Añadir producto"} formSubmit={handleSubmitForm} styleDiv="py-4">
            <div className='flex flex-row items-center gap-3 py-4'> 
                <FormLabel sx={{ textAlign: 'start' }}>Producto: </FormLabel> 
                <Autocomplete 
                    fullWidth 
                    options={products} 
                    getOptionLabel={( product ) => product.name}
                    size='small' 
                    value={selectedProduct} 
                    onChange={(event, newValue) => setSelectedProduct(newValue)} renderInput={(params) => <TextField {...params} 
                    size='small' 
                    placeholder='Selecciona un producto' />} 
                /> 
            </div>
           <div className='flex flex-row items-center gap-3 py-4'> 
                <FormLabel sx={{ textAlign: 'start' }}>Cantidad: </FormLabel> 
                <Autocomplete 
                    fullWidth 
                    options={[...Array(50).keys()]} 
                    size='small' 
                    value={quantity} 
                    onChange={(event, newValue) => setQuantity(newValue)} renderInput={(params) => <TextField {...params} 
                    size='small' 
                    placeholder='Selecciona una cantidad' />} 
                /> 
            </div>
        </FormDialog>
    )
};
