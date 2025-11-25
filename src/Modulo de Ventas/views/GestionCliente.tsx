import { useMemo, useState } from 'react'
import { useClientes } from '../api/queries/ClienteQueries'
import '../Venta.css'
import type { Cliente } from '../types/Cliente'
import FormularioMensaje from '../Components/FormularioMsgCorreo/FormularioMensaje'
import { getEstadoClass, getEstadoDescripcion, type EstadoCliente } from '../utils/GetEstadoCliente'
import FormularioDireccion from '../Components/FormularioClienteDireccion/FormularioDireccion'


type GestionClienteProps = {
    onSelectClient : ( client : Cliente ) => void 
    setSection : ( id : string ) => void
}

export default function GestionCliente({ onSelectClient, setSection } : GestionClienteProps) {


    const { data, isLoading, isSuccess } = useClientes()
    const [ correoFiltro, setCorreoFiltro ] = useState('')
    const [ telefonoFiltro, setTelefonoFiltro ] = useState('')
    const [ filtroEstado, setFiltroEstado ] = useState<EstadoCliente | 'TODOS'>('TODOS')
    const [ ordenarPor, setOrdenarPor ] = useState<'ID' | 'NOMBRE' | 'EMAIL'>('ID')
    const [ ordenarForma, setOrdenarForma ] = useState<'ASC' | 'DESC'>('ASC')

    const [ isEnviarCorreoOpen, setIsEnviarCorreoOpen ] = useState(false)


    const [ isVerDireccionesOpen, setIsVerDireccionesOpen ] = useState(false)
    const [ selectedClient, setSelectedClient ] = useState<Cliente | null>(null)

    const [ destinatario, setDestinatario ] = useState<string | null>('')


    const filtrosFns = useMemo(() => [
        (c: Cliente) => !correoFiltro || c.email.toLowerCase().includes(correoFiltro.toLowerCase()),
        (c: Cliente) => !telefonoFiltro || c.telefono.toLowerCase().includes(telefonoFiltro.toLowerCase()),
        (c: Cliente) => filtroEstado === 'TODOS' || c.estado === filtroEstado  
    ], [correoFiltro, filtroEstado, telefonoFiltro])

    const ClientesFiltrados = useMemo(() => {
        if(!isSuccess || !data) return []
        const filterData =  data.filter(cliente => filtrosFns.every(fn => fn(cliente)))

        return filterData.sort((a, b) => {
            let comparator = 0
            switch(ordenarPor) {
                case 'ID':
                    comparator = a.id_cliente - b.id_cliente
                    break
                case 'NOMBRE':
                    comparator = `${a.nombre} ${a.apellido}`.toLowerCase().localeCompare(`${b.nombre} ${b.apellido}`.toLowerCase())
                    break
                case 'EMAIL':
                    comparator = a.email.toLowerCase().localeCompare(b.email.toLowerCase())
                    break
                default:
                    return 0
            }
            return ordenarForma === 'ASC' ? comparator : -comparator
        })
    }, [data, isSuccess, filtrosFns, ordenarPor, ordenarForma])

    const handleSelectedRow = ( cliente : Cliente) => {
        onSelectClient(cliente)
        setSection('pedidos')
    }

    const handleVerDirecciones = (e : React.MouseEvent<HTMLTableDataCellElement, MouseEvent>, client : Cliente) => {
        e.stopPropagation()
        setSelectedClient(client)
        setIsVerDireccionesOpen(true)
    }

    const clearStates = () => {
        setCorreoFiltro('')
        setTelefonoFiltro('')
        setOrdenarPor('ID')
        setFiltroEstado('TODOS')
        setOrdenarForma('ASC')
    }

    return (

        <div className='flex flex-1 gap-10'>
            <div className='venta-filtro-container'>
                <h2 className='text-2xl mb-4'>Filtros</h2>
                <div className='filtro-input'>
                    <label>Correo Cliente</label>
                    <input type='text' value={correoFiltro} onChange={(e) => setCorreoFiltro(e.target.value)} placeholder='Ingresa el Correo del Cliente' />
                </div>  
                <div className='filtro-input'>
                    <label>Teléfono Cliente</label>
                    <input type='text' value={telefonoFiltro} onChange={(e) => setTelefonoFiltro(e.target.value)} placeholder='Ingresa el teléfono del Cliente' />
                </div>  
                <div className='filtros-crm'>
                    <label>Etapa del Cliente: </label>
                    <select 
                        value={filtroEstado} 
                        onChange={(e) => setFiltroEstado(e.target.value as EstadoCliente | 'TODOS')}
                    >
                        <option value='TODOS'>Todos</option>
                        <option value='PROSPECTO'>Prospecto</option>
                        <option value='INTERESADO'>Interesado</option>
                        <option value='CLIENTE'>Cliente</option>
                        <option value='CLIENTE_ACTIVO'>Cliente Activo</option>
                        <option value='PERDIDO'>Perdido</option>
                    </select>
                </div>
                <div className='flex w-full flex-row items-center justify-between'>
                    <label>Ordenar Por</label>
                    <div className='flex gap-4'>
                        <select
                            className='min-w-34!'
                            value={ordenarPor}
                            onChange={(e) => setOrdenarPor(e.target.value as 'ID' | 'NOMBRE' | 'EMAIL')}
                        >
                            <option value='ID'>ID</option>
                            <option value='NOMBRE'>Nombre</option>
                            <option value='EMAIL'>Email</option>
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

            <div className="tabla-wrapper max-h-[575px]">
                <table className={!isSuccess ? 'h-full' : ''}>
                    <thead>
                        <tr>
                            <th>ID Cliente</th>
                            <th>Nombre Completo</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        { 
                        isLoading ? 
                            <tr>
                                <td colSpan={6} className='text-center align-middle text-gray-400'>
                                    Cargando...
                                </td>
                            </tr>
                            :
                        isSuccess ?
                            ClientesFiltrados.map((cliente => (
                                <tr key={cliente.id_cliente} onClick={() => handleSelectedRow(cliente)}>
                                    <td className='tooltip-fila' data-tooltip="Click para ver sus ventas">{cliente.id_cliente}</td>
                                    <td>{cliente.nombre + " " + cliente.apellido}</td>
                                    <td onClick={(e) => handleVerDirecciones(e, cliente)} className='tooltip-fila' data-tooltip="Click para más direcciones">{cliente.direccion}</td>
                                    <td>{cliente.telefono}</td>
                                    <td onClick={(e) => e.stopPropagation()} className='tooltip-fila text-xs' data-tooltip={`${getEstadoDescripcion(cliente.estado)}`}><span className={`chip ${getEstadoClass(cliente.estado)}`}>{cliente.estado}</span></td>
                                    <td>
                                        <button onClick={(e) => {
                                            setIsEnviarCorreoOpen(true)
                                            setDestinatario(cliente.email)
                                            e.stopPropagation()
                                        }} 
                                            className='tooltip tooltip-button'
                                        >
                                            {cliente.email}
                                            <span className='tooltip-text'>Enviar un Mensaje</span>
                                        </button>
                                    </td>
                                </tr>
                            )))
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
            <FormularioMensaje 
                isOpen={isEnviarCorreoOpen} 
                destinatario={destinatario} 
                onClose={() => setIsEnviarCorreoOpen(false)}                
            />
            <FormularioDireccion 
                isOpen={isVerDireccionesOpen}
                onClose={() => setIsVerDireccionesOpen(false)}
                cliente={selectedClient}
                />
        </div>
    )    
};
