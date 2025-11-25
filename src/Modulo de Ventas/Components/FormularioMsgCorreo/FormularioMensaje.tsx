import { useState } from "react";
import MensajeEditor from "./MensajeEditor";
import SeleccionVenta from "./SeleccionVenta";

enum FlujoEstado {
  MODAL_PRINCIPAL,
  MODAL_VENTA,
}

interface FormularioMensajeProps {
    isOpen : boolean
    destinatario : string | null
    onClose : () => void
}

export type MensajeCorreoFormData = {
    asunto : string
    cuerpo : string  
    ventasAdjuntas : number[]
}

const initialFormData : MensajeCorreoFormData = {
    asunto : '',
    cuerpo : '',
    ventasAdjuntas : []
}

export default function FormularioMensaje({ isOpen, onClose, destinatario } : FormularioMensajeProps ) {

    const [ formData, setFormData ] = useState<MensajeCorreoFormData>(initialFormData)
    const [ flujo, setFlujo ] = useState<FlujoEstado>(FlujoEstado.MODAL_PRINCIPAL)


    if(!isOpen || !destinatario) return null


    const handleAdjuntarVenta = () => {
        setFlujo(FlujoEstado.MODAL_VENTA)
    }

    const handleEliminarVentaAdjunta = ( idVenta : number ) => {
        const newVentasAdjuntas = formData.ventasAdjuntas.filter(( id ) => id !== idVenta)
        setFormData(prev => ({...prev, ventasAdjuntas: newVentasAdjuntas}))
    }

    const handleVentaSeleccionada = (newVenta : number) => {
        setFormData( prev => ({...prev, ventasAdjuntas : [...prev.ventasAdjuntas, newVenta]}))
        setFlujo(FlujoEstado.MODAL_PRINCIPAL)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
    }))}

    return (
        <div className="modal-backdrop" onClick={() => {setFlujo(FlujoEstado.MODAL_PRINCIPAL); onClose()}}>
            <div className={`modal-content ${flujo === FlujoEstado.MODAL_VENTA ? 'max-w-11/12!' : ''}`} onClick={(e) => e.stopPropagation()}>
                { flujo === FlujoEstado.MODAL_PRINCIPAL && 
                    <MensajeEditor 
                        onClose={onClose} 
                        destinatario={destinatario} 
                        correoData={formData} 
                        handleCorreoData={handleChange} 
                        handleAdjuntarVenta={handleAdjuntarVenta}
                        handleEliminarVentaAdjunta={handleEliminarVentaAdjunta}
                    />
                } { flujo === FlujoEstado.MODAL_VENTA && 
                    <SeleccionVenta 
                        correoCliente={destinatario}
                        onClose={() => (setFlujo(FlujoEstado.MODAL_PRINCIPAL))} 
                        handleVentaSeleccionada={handleVentaSeleccionada}
                        idVentasSeleccionadas={formData.ventasAdjuntas}
                    />
                }
            </div>
        </div>
    )
};



