import { useNavigate } from "react-router-dom";

export const HomeAdmin_rrhh = () => {
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.clear();
    navigate("/rrhh");
  }

  return (
    <div className="p-10 bg-[#0f1115] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gradient-to-tr from-[#2b3036] to-[#1e2328] border border-[#3a3f45] shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold text-[#d5d9de] mb-6 text-center">
          Panel del Administrador RRHH
        </h1>

        <p className="text-[#c7cdd4] mb-6 text-center">
          Desde aquí puedes gestionar empleados, revisar solicitudes y
          administrar roles del personal.
        </p>

        <ul className="space-y-4">
          <li>
            <button
              onClick={() => navigate("/rrhh/admin/gestion-empleados")}
              className="w-full bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
            >
              👥 Agregar o despedir empleados
            </button>
          </li>

           <li>
            <button
              onClick={() => navigate("/rrhh/admin/gestionSolicitudes")}
              className="w-full bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
            >
              📋 Revisar, aprobar o rechazar solicitudes de ausencia
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/rrhh/admin/solicitudes-baja")}
              className="w-full bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
            >
              📝 Aceptar o rechazar solicitudes de baja
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/rrhh/admin/estado-empleados")}
              className="w-full bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
            >
              📊 Ver estado y datos de empleados
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/rrhh/admin/elegirEmpleado")}
              className="w-full bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
            >
              🧩 Asignar roles a empleados
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/rrhh/admin/crearCuentaDeTrabajo")}
              className="w-full bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
            >
              🧑‍💻 Crear cuenta de trabajo para empleados
            </button>
          </li>

        </ul>
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-gradient-to-tr from-[#f87171] to-[#ef4444] text-black font-semibold rounded-md shadow-md hover:from-[#ef4444] hover:to-[#dc2626] active:scale-95 transition duration-200"
          >
            🔒 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
