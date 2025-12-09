import { useEffect, useMemo, useState } from "react"
import { useVentas } from "../api/queries/VentasQueries"
import type { Venta } from "../types/Venta";
import { compareDates } from "../utils/CompareDate";
import DialogVentaDetalle from "../Components/DialogVentaDetalle/DialogVentaDetalle";



type GestionVentasProps = {
    selectedClient : string 
    onSelectVenta ?: (v : Venta) => void
    filtrarVentas ?: (v : Venta) => boolean
}



export default function GestionVentas({ selectedClient, onSelectVenta, filtrarVentas } : GestionVentasProps) {


    const { data, isLoading, isSuccess } = useVentas()
    const [ correoFiltro, setCorreoFiltro ] = useState('')
    const [ selByClientSect, setSelByClientSect ] = useState(false)
    const [ idVentaFiltro, setIdVentaFiltro ] = useState<number | undefined>(undefined)
    const [ ordenarPor, setOrdenarPor ] = useState<'ID_VENTA' | 'ID_CLIENTE' | 'FECHA' | 'TOTAL' | 'EMAIL_CLIENTE'>('ID_VENTA')
    const [ ordenarForma, setOrdenarForma ] = useState<'ASC' | 'DESC'>('ASC')
    const [ isOpenDetallesventa, setIsOpenDetallesVenta ] = useState(false)
    const [ selectedVenta, setSelectedVenta ] = useState<Venta | null>(null)

    const filtrosFns = useMemo(() => [
        (v : Venta) => !correoFiltro || v.cliente.email.toLowerCase().includes(correoFiltro.toLowerCase()),
        (v : Venta) => !idVentaFiltro || v.id_venta === idVentaFiltro,
        (v : Venta) => !filtrarVentas || filtrarVentas(v)
    ], [correoFiltro, idVentaFiltro, filtrarVentas])


    const VentasFiltradas = useMemo(() => {
        if(!isSuccess || !data) return []
        const filterData =  data.filter((v => filtrosFns.every(fn => fn(v))))
        return filterData.sort((a, b) => {
            let comparator = 0
            switch(ordenarPor) {
                case "ID_VENTA":
                    comparator = a.id_venta - b.id_venta
                    break
                case "ID_CLIENTE":
                    comparator =  a.id_cliente - b.id_cliente
                    break
                case "FECHA":
                    comparator = compareDates(new Date(a.fecha_pedido), new Date(b.fecha_pedido))
                    break
                case "TOTAL":
                    comparator =  a.total - b.total
                    break
                case "EMAIL_CLIENTE":
                    comparator = a.cliente.email.toLowerCase().localeCompare(b.cliente.email.toLowerCase())
                    break
                default:
                    return 0
            }
            return ordenarForma == 'ASC' ? comparator : -comparator
        })
    }, [isSuccess, data, filtrosFns, ordenarPor, ordenarForma])


    const clearStates = () => {
        setCorreoFiltro('')
        setOrdenarForma('ASC')
        setOrdenarPor('ID_VENTA')
    }


    useEffect(() => {
        if(selectedClient) {
            setCorreoFiltro(selectedClient)
            setSelByClientSect(true)
            setTimeout(() => {
                setSelByClientSect(false)
            }, 3000);
        }
    }, [selectedClient])


    const handleVerDetallesVenta = (e : React.MouseEvent<HTMLTableDataCellElement, MouseEvent>, v : Venta) => {
        e.stopPropagation()
        setIsOpenDetallesVenta(true)
        setSelectedVenta(v)
    }

    return (
        <div className='flex flex-1 gap-10'>
            <div className='venta-filtro-container'>
                <h2 className='text-2xl mb-4'>Filtros</h2>
                <div className="filtro-input">
                    <label>ID Venta</label>
                    <input placeholder="Ingresa el ID de la Venta" value={idVentaFiltro} type="number" onChange={(e) => (setIdVentaFiltro(Number(e.target.value === '' ? undefined : e.target.value)))}/>
                </div>
                <div className={`filtro-input`}>
                    <label>Correo Cliente</label>
                    <input className={`${selByClientSect ? "highlight-selection" : ""}`} type='text' value={correoFiltro} onChange={(e) => setCorreoFiltro(e.target.value)} placeholder='Ingresa el Correo del Cliente' />
                </div>  
                <div className='filtros-crm'>
                    <label>Método de pago: </label>
                    <select>
                        <option value='TODOS'>Todos</option>
                        <option value='Transferencia'>Transferencia</option>
                        <option value='Debito'>Debito</option>
                    </select>
                </div>
                <div className='flex w-full flex-row items-center justify-between'>
                    <label>Estado Venta</label>
                    <select>
                        <option value='TODOS'>Todos</option>
                        <option value='PENDIENTE'>Pendiente</option>
                        <option value='COMPLETADO'>Completado</option>
                        <option value='CANCELADO'>Cancelado</option>
                    </select>
                </div>
                <div className='flex w-full flex-row items-center justify-between'>
                    <label>Ordenar Por</label>
                    <div className="flex gap-4">
                        <select
                        className="min-w-34!"
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value as 'ID_VENTA' | 'ID_CLIENTE' | 'FECHA' | 'TOTAL' | 'EMAIL_CLIENTE')}
                        >
                            <option value='ID_VENTA'>ID Venta</option>
                            <option value='ID_CLIENTE'>Nombre</option>
                            <option value='EMAIL_CLIENTE'>Email</option>
                            <option value='FECHA'>Fecha</option>
                            <option value='TOTAL'>Total</option>
                        </select>
                        <select className="min-w-2!" value={ordenarForma} onChange={(e) => setOrdenarForma(e.target.value as 'ASC' | 'DESC')}>
                            <option value={'ASC'}>Asc</option>
                            <option value={'DESC'}>Desc</option>
                        </select>
                    </div>
                </div>
                <div className="self-start">
                    <button onClick={() => clearStates()} className="bg-red-700!">
                        Limpiar Filtros
                    </button>
                </div>
            </div>
            <div className="tabla-wrapper max-h-[537px]">
                <table className={!isSuccess ? 'h-full' : ''}>
                    <thead>
                        <tr>
                            <th>ID Ventas</th>
                            <th>ID Cliente</th>
                            <th>Email Cliente</th>
                            <th>Fecha Creación</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        isLoading ? 
                            <tr>
                                <td colSpan={6} className="text-center align-middle text-gray-400">
                                    Cargando...
                                </td>
                            </tr>
                            :
                        isSuccess ? 
                            VentasFiltradas.map((venta) => (
                                <tr key={venta.id_venta} onClick={() => onSelectVenta && onSelectVenta(venta)}>
                                    <td>{venta.id_venta}</td>
                                    <td>{venta.id_cliente}</td>
                                    <td className="text-xs">{venta.cliente.email}</td>
                                    <td className="text-xs">{(new Date(venta.fecha_pedido)).toLocaleString("es-CL")}</td>
                                    <td><span className="chip success">{venta.estado}</span></td>
                                    <td onClick={(e) => handleVerDetallesVenta(e, venta)} className="font-semibold cursor-pointer">{`$ ${venta.total.toLocaleString("es-CL")}`}</td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan={6} className="text-center align-middle text-red-400">
                                    Error al cargar los datos
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <DialogVentaDetalle 
                isOpen={isOpenDetallesventa}
                onClose={() => setIsOpenDetallesVenta(false)}
                venta={selectedVenta}
            />
        </div>
    )    
};
