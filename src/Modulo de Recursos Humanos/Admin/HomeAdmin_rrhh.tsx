import { useNavigate } from "react-router-dom";

export const HomeAdmin_rrhh = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Vista Admin</h1>
      <p className="mb-2">Aca puedes:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <button
            className="text-blue-600 underline"
            onClick={() => navigate("/rrhh/gestion-empleados")}
          >
            Agregar o despedir empleados
          </button>
        </li>
        <li>Aceptar o rechazar solicitudes de vacaciones</li>
        <li>Ver estado/datos de los empleados</li>
      </ul>
    </div>
  );
};
