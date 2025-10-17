export const HomeAdmin_rrhh = () =>{

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
                Vista Admin
            </h1>
            <p className="mb-2">Aca puedes:</p>
            <ul className="list-disc list-inside space-y-1">
                <li>Agregar usuarios como nuevos empleados</li>
                <li>Despedir empleados</li>
                <li>Aceptar o rechazar solicitudes de vacaciones</li>
                <li>Ver estado/datos de los empleados</li>
            </ul>
         </div>
    );
}