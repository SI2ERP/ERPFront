import '../Venta.css'

export default function GestionCliente() {
    return (

        <div className='flex flex-1 gap-10'>

            <div className='venta-filtro-container'>
                <h2 className='text-2xl mb-4'>Filtros</h2>
                <div className='filtro-input'>
                    <label>Correo Cliente</label>
                    <input placeholder='Ingresa el Correo del Cliente' />
                </div>  
                <div className='filtros-crm'>
                    <label>Etapa del Cliente: </label>
                    <select>
                        <option value='TODOS'>Todos</option>
                        <option value='PROSPECTO'>Prospecto</option>
                        <option value='INTERESADO'>Interesado</option>
                        <option value='CLIENTE'>Cliente</option>
                        <option value='CLIENTE_ACTIVO'>Cliente Activo</option>
                        <option value='PERDIDO'>Perdido</option>
                    </select>
                </div>
                <div className='flex w-full flex-row items-center justify-between'>
                    <label>Región</label>
                    <select>
                        <option value='TODOS'>Todos</option>
                        <option value='SANTIAGO'>Santiago</option>
                    </select>
                </div>
                <div className='flex w-full items-center justify-between'>
                    <label>Fecha última compra realizada</label>
                    <select>
                        <option value='TODO'>Todas las Compras</option>
                        <option value='7_DIAS'>Últimos 7 días</option>
                        <option value='14_DIAS'>Últimos 14 días</option>
                        <option value='30_DIAS'>Últimos 30 días</option>
                        <option value='1_AÑO'>Último año</option>
                    </select>
                </div>
                <div className="self-start">
                    <button className="bg-red-700!">
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            <div className="tabla-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID Cliente</th>
                            <th>Nombre Completo</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>    
            </div>
        </div>
    )    
};
