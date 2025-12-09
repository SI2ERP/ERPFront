import { useState } from 'react'
import '../../Venta.css'
import ClipIcon from '../ClipIcon'
import type { MensajeCorreoFormData } from './FormularioMensaje'


interface MensajeEditorProps {
    destinatario : string
    correoData : MensajeCorreoFormData
    handleCorreoData : (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void 
    handleAdjuntarVenta : () => void
    handleEliminarVentaAdjunta : (id : number) => void
    handleSubmitCorreo: (e : React.FormEvent) => void
    onClose : () => void
}



export default function MensajeEditor({ onClose, destinatario, correoData, handleCorreoData, handleAdjuntarVenta, handleEliminarVentaAdjunta, handleSubmitCorreo } : MensajeEditorProps) {


    const [ msgError, setMsgError ] = useState<string | null>(null)

    
    const handleSubmit = (e : React.FormEvent) => {

        if(correoData.asunto.trim() === "") {
            setMsgError("Asunto no puede ser vacio")
            return 
        } else if(correoData.cuerpo.trim() === "") {
            setMsgError("El cuerpo del correo no puede estar vacio")
            return 
        } 
        setMsgError(null)
        handleSubmitCorreo(e)
    }

    return (
        <div className='transition-all duration-300 opacity-100'>
            <div className='modal-header'>
                <h2>Enviar Mensaje vía Email</h2>
                <button className='btn-cerrar' onClick={onClose}>&times;</button>
            </div>
            <form>
                <div className='modal-body'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-2'>
                            <label>Para: </label>
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium 
                            bg-gray-600 text-white rounded-full">
                            {destinatario}
                            </span>
                        </div>

                        <div className='form-group'>
                            <input id='asunto' name='asunto' type='text' value={correoData.asunto} onChange={handleCorreoData} required placeholder='Asunto' />
                        </div>
                        <div className='form-group'>
                            <textarea id='cuerpo' name='cuerpo' value={correoData.cuerpo} onChange={handleCorreoData} required placeholder='Escribe tu mensaje acá' />
                        </div>
                        <div className='adjuntar-archivos'>
                            {correoData.ventasAdjuntas.map((idVenta) => (
                                <div key={idVenta} className='label-archivo'>
                                    <span>{`Boleta N°${idVenta}.pdf`}</span>
                                    <button type='button' className='archivo-btn-cerrar' onClick={() => handleEliminarVentaAdjunta(idVenta)}>&times;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='min-h-6'>
                        { msgError && <h2 className='text-red-500'>{msgError}</h2> }
                    </div>
                </div>

                <div className='modal-footer justify-between!'>
                    <button type='button' className='btn-adjuntar' onClick={handleAdjuntarVenta}>
                        <ClipIcon /> Adjuntar Boleta
                    </button>
                    <div className='flex flex-row gap-4'>
                        <button type='button' className='btn-cancelar' onClick={onClose}>
                            Descartar
                        </button>
                        <button type='submit' className='btn-submit' onClick={handleSubmit}>
                            Enviar Mensaje
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
