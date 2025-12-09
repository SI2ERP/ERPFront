import { useEffect, useMemo, useState } from "react"

type MostrarResultadoProps = {
    onClose: () => void
    estado: "IS_PENDING" | "IS_SUCCESS" | "IS_ERROR"
    error?: string
}

export default function MostrarResultado({ onClose, estado, error } : MostrarResultadoProps) {

    const [ puntoEspera, setPuntoEspera ] = useState('.')

    useEffect(() => {
        setTimeout(() => {
            setPuntoEspera(prev => prev + ".")
        }, 1000)
    })

    const tituloEstado = useMemo(() => {
        switch(estado) {
            case "IS_PENDING":
                return "Enviando correo"
            case "IS_SUCCESS":
                return "Correo Enviado Exitosamente"
            case "IS_ERROR":
                return "Ha ocurrido un error al enviar el correo"
        }
    }, [estado])

    return (
        <div>
            <div className='modal-header'>
                <h2>{tituloEstado}</h2>
                <button className='btn-cerrar' onClick={onClose}>&times;</button>
            </div>

            <div className='modal-body'>
                {estado === "IS_PENDING" && (
                    <p>Estamos procesando tu solicitud{puntoEspera}</p>
                )}

                {estado === "IS_SUCCESS" && (
                    <p>¡Correo enviado exitosamente!</p>
                )}

                {estado === "IS_ERROR" && (
                    <div>
                        <p>No se pudo enviar el correo.</p>
                        {error && (
                            <pre className="error-box">
                            {error}
                            </pre>
                        )}
                    </div>
                )}
            </div>


            <div className='modal-footer'>
                <button type="button" className="btn-submit" onClick={onClose}>
                    Aceptar
                </button>
            </div>
        </div>
    )
};
