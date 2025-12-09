import { useState } from "react";
import MensajeEditor from "./MensajeEditor";
import SeleccionVenta from "./SeleccionVenta";
import type { Cliente } from "../../types/Cliente";
import { useSendEmail } from "../../api/queries/ClienteQueries";
import MostrarResultado from "./MostrarResultado";

enum FlujoEstado {
  MODAL_PRINCIPAL,
  MODAL_VENTA,
  MODAL_SUBMIT
}

interface FormularioMensajeProps {
    isOpen : boolean
    destinatario : Cliente | null
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
    const [ flujoResultado, setFlujoResultado ] = useState<"IS_PENDING" | "IS_SUCCESS" | "IS_ERROR">("IS_PENDING")
    const { error, mutate, reset } = useSendEmail()


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

    const handleSubmitCorreo = (e : React.FormEvent) => {
    e.preventDefault()
    setFlujo(FlujoEstado.MODAL_SUBMIT)
    setFlujoResultado("IS_PENDING")

    mutate({
        id_cliente: destinatario.id_cliente,
        to: [destinatario.email],
        subject: formData.asunto,
        body: formData.cuerpo,
        boleta_ventas: formData.ventasAdjuntas
        },{
            onSuccess: () => setFlujoResultado("IS_SUCCESS"),
            onError: () => setFlujoResultado("IS_ERROR")
        })
    }

    return (
        <div className="modal-backdrop">
            <div className={`modal-content ${flujo === FlujoEstado.MODAL_VENTA ? 'max-w-11/12!' : ''}`} onClick={(e) => e.stopPropagation()}>
                { flujo === FlujoEstado.MODAL_PRINCIPAL && 
                    <MensajeEditor 
                        onClose={onClose}
                        destinatario={destinatario.email}
                        correoData={formData}
                        handleCorreoData={handleChange}
                        handleAdjuntarVenta={handleAdjuntarVenta}
                        handleEliminarVentaAdjunta={handleEliminarVentaAdjunta} 
                        handleSubmitCorreo={handleSubmitCorreo}                    
                    />
                } { flujo === FlujoEstado.MODAL_VENTA && 
                    <SeleccionVenta 
                        correoCliente={destinatario.email}
                        onClose={() => (setFlujo(FlujoEstado.MODAL_PRINCIPAL))} 
                        handleVentaSeleccionada={handleVentaSeleccionada}
                        idVentasSeleccionadas={formData.ventasAdjuntas}
                    />
                } { flujo === FlujoEstado.MODAL_SUBMIT && 
                    <MostrarResultado 
                        onClose={() => {
                            setFormData(initialFormData)
                            setFlujo(FlujoEstado.MODAL_PRINCIPAL)
                            reset()
                            onClose()
                        }}  
                        estado={flujoResultado}
                        error={error ? (error as Error).message : undefined}
                    />
                }
            </div>
        </div>
    )
};



