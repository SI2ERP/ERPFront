import { useNavigate } from "react-router-dom";

export const HomeEmpleado_rrhh = () =>{
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.clear();
    navigate("/rrhh");
  }
    return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
    <div className="bg-[#1e2328] p-8 rounded-2xl text-center w-[90%] max-w-md">
      <h1 className="text-3xl font-bold mb-2 text-[#d5d9de]">Panel del Empleado</h1>
      <p className="text-sm mb-6 text-[#9aa1a8]">Gestiona tus solicitudes fácilmente</p>

      <ul className="space-y-4">
        <li>
          <button
            onClick={() => navigate("/rrhh/empleado/solicitarAusencia")}
            className="w-full bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
          >
            👥 Solicitar ausencia
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate("/rrhh/empleado/estadoSolicitud")}
            className="w-full bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#3a3f45] py-3 rounded-md font-medium shadow-md hover:from-[#d5d9de] hover:to-[#b3bbc3] hover:text-black active:scale-95 transition duration-200"
          >
            📝 Ver estado de tus solicitudes de ausencia
          </button>
        </li>
      </ul>

      <div className="text-center mt-10">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-linear-to-tr from-[#f87171] to-[#ef4444] text-black font-semibold rounded-md shadow-md hover:from-[#ef4444] hover:to-[#dc2626] active:scale-95 transition duration-200"
        >
          🔒 Cerrar sesión
        </button>
      </div>
    </div>
  </div>
);

}