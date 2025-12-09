import type { Venta } from "../../types/Venta"
import GestionVentas from "../../views/GestionVentas"


type SeleccionVentaProps = {
    correoCliente : string
    onClose : () => void
    handleVentaSeleccionada : ( ventaId : number) => void
    idVentasSeleccionadas : number[]
}


export default function SeleccionVenta({ onClose, handleVentaSeleccionada, correoCliente, idVentasSeleccionadas } : SeleccionVentaProps) {


    const handleVentaSel = ( v : Venta) => {
        if(!v) return 
        handleVentaSeleccionada(v.id_venta)
    }
     
    return (
        <div>
            <div className='modal-header'>
                <h2>Selecciona una venta</h2>
                <button className='btn-cerrar' onClick={onClose}>&times;</button>
            </div>

            <div className='modal-body'>
                <GestionVentas 
                    selectedClient={correoCliente} 
                    onSelectVenta={handleVentaSel}    
                    filtrarVentas={(v) => (!idVentasSeleccionadas.includes(v.id_venta))}           
                />
            </div>

            <div className='modal-footer'>
                <button type="button" className="btn-cancelar" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    )
};
