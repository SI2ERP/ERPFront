import { useNavigate } from "react-router-dom";

export const HomeAdmin_rrhh = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 bg-[#e8f3ed] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#cde3d6] border border-[#1e8449] shadow-lg rounded-md p-8">
        <h1 className="text-3xl font-semibold text-[#1a8a5b] mb-6 text-center">
          Panel del Administrador RRHH
        </h1>

        <p className="text-[#1e293b] mb-6 text-center">
          Desde aquí puedes gestionar empleados, revisar solicitudes y
          administrar roles del personal.
        </p>

        <ul className="space-y-4">
          <li>
            <button
              onClick={() => navigate("/rrhh/admin/gestion-empleados")}
              className="w-full bg-white text-[#1a8a5b] border border-[#1a8a5b] py-3 rounded-md font-medium shadow-sm hover:bg-[#2ecc71] hover:text-black active:scale-95 transition duration-200"
            >
              👥 Agregar o despedir empleados
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/rrhh/admin/solicitudes-vacaciones")}
              disabled={true}
              className="w-full bg-white text-[#1a8a5b] border hover:!border-red-600 py-3 rounded-md font-medium shadow-sm"
            >
              🌴 Aceptar o rechazar solicitudes de vacaciones
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/rrhh/admin/estado-empleados")}
              className="w-full bg-white text-[#1a8a5b] border border-[#1a8a5b] py-3 rounded-md font-medium shadow-sm hover:bg-[#2ecc71] hover:text-black active:scale-95 transition duration-200"
            >
              📊 Ver estado y datos de empleados
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/rrhh/admin/elegirEmpleado")}
              className="w-full bg-white text-[#1a8a5b] border border-[#1a8a5b] py-3 rounded-md font-medium shadow-sm hover:bg-[#2ecc71] hover:text-black active:scale-95 transition duration-200"
            >
              🧩 Asignar roles a empleados
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/rrhh/admin/crearCuentaDeTrabajo")}
              disabled={true}
              className="w-full bg-white text-[#1a8a5b] border hover:!border-red-600 py-3 rounded-md font-medium shadow-sm"
            >
              🧑‍💻 Crear cuenta de trabajo para empleados
            </button>
          </li>

        </ul>
      </div>
    </div>
  );
};
