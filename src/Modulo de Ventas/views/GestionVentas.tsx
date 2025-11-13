
export default function GestionVentas() {
    return (

        <div className='flex flex-1 gap-10'>
            <div className='venta-filtro-container'>
                <h2 className='text-2xl mb-4'>Filtros</h2>
                <div className="filtro-input">
                    <label>ID Venta</label>
                    <input placeholder="Ingresa el ID de la Venta"/>
                </div>
                <div className='filtro-input'>
                    <label>Correo Cliente</label>
                    <input placeholder='Ingresa el Correo del Cliente' />
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
                            <th>ID Ventas</th>
                            <th>ID Cliente</th>
                            <th>Email Cliente</th>
                            <th>Fecha Creación</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )    
};
