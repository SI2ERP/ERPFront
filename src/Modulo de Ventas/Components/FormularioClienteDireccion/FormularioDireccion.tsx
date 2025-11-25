import { useEffect } from "react";
import { useDireccionCliente } from "../../api/queries/ClienteQueries";
import type { Cliente } from "../../types/Cliente";


type FormularioDireccionProps = {
    isOpen : boolean
    onClose : () => void
    cliente : Cliente | null
}

export default function FormularioDireccion({ isOpen, onClose, cliente } : FormularioDireccionProps ) {

    const { data: direcciones, isSuccess, isLoading } = useDireccionCliente( cliente ? cliente.id_cliente : undefined)

    useEffect(() => {
        if(isSuccess) {
            console.log(direcciones)
        }
    }, [isSuccess, direcciones])

    if(!isOpen || !cliente) return null


    return (
        <div className="modal-backdrop" onClick={() => onClose()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Direcciones de {cliente.nombre}</h2>
                    <button className="btn-cerrar" onClick={onClose}>&times;</button>
                </div>

                <div className="min-h-100">
                    {isLoading && <p>Cargando direcciones...</p>}

                    {!isLoading && direcciones?.length === 0 && (
                        <p>No hay direcciones registradas.</p>
                    )}

                    {!isLoading && isSuccess && direcciones?.length > 0 && (
                        <ul className="min-h-100 max-h-100 overflow-auto" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {direcciones.map((dir) => (
                                <li 
                                    key={dir.id_direccion}
                                    style={{
                                        padding: "0.75rem 1rem",
                                        borderBottom: "1px solid #444",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px"
                                    }}
                                >
                                    <span style={{ fontWeight: 600 }}>
                                        {dir.direccion} {dir.numero}
                                    </span>

                                    <span style={{ color: "#ccc", fontSize: "0.9rem" }}>
                                        {dir.comuna}, {dir.ciudad}, {dir.region}
                                    </span>

                                    <span style={{ fontSize: "0.85rem", color: "#aaa" }}>
                                        CP: {dir.codigo_postal}
                                    </span>

                                    {dir.etiqueta && (
                                        <span className="chip" style={{ width: "fit-content", marginTop: "4px" }}>
                                            {dir.etiqueta}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-submit" onClick={onClose}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>

    )
};



