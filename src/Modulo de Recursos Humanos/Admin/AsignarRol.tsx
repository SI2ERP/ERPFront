import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const AsignarRol: React.FC = () => {
  const { idEmpleado } = useParams<{ idEmpleado: string }>();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(false);

  useEffect(() => {
    if (!idEmpleado) return;

    const obtenerRoles = async () => {
      try {
        const res = await axios.get(API+"/rrhh/roles");
        setRoles(res.data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
        setErrorRoles(true);
      } finally {
        setLoadingRoles(false);
      }
    };

    obtenerRoles();
  }, [idEmpleado]);

  const handleGuardar = async () => {
    if (!rolSeleccionado || !idEmpleado) return;

    setGuardando(true);
    setErrorGuardar(false);

    try {
      await axios.put(`${API}/rrhh/empleados/${idEmpleado}`, {
        rol: rolSeleccionado,
      });
      navigate("/rrhh/admin/elegirEmpleado");
    } catch (error) {
      console.error("Error al guardar rol:", error);
      setErrorGuardar(true);
    } finally {
      setGuardando(false);
    }
  };

  if (!idEmpleado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          ❌ Error: No se ha seleccionado un empleado
        </h2>
        <p className="text-[#c7cdd4] mb-4">
          Debes elegir un empleado desde la lista antes de asignar un rol.
        </p>
        <button
          onClick={() => navigate("/rrhh/admin/elegirEmpleado")}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded font-semibold transition duration-200"
        >
          Volver a empleados
        </button>
      </div>
    );
  }

  if (loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115]">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando roles...</p>
      </div>
    );
  }

  if (errorRoles) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          ❌ Error al cargar roles
        </h2>
        <p className="text-[#c7cdd4] mb-4">
          No se pudieron obtener los roles desde el servidor.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded font-semibold transition duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1115] px-4">
      <div className="bg-[#2b3036] p-8 rounded-md shadow-lg w-full max-w-md border border-[#3a3f45]">
        <h2 className="text-2xl font-semibold text-[#d5d9de] mb-6 text-center">
          Asignar Rol al Empleado #{idEmpleado}
        </h2>

        <div className="mb-6">
          <label
            htmlFor="rol"
            className="block text-[#c7cdd4] font-medium mb-2"
          >
            Selecciona un rol:
          </label>
          <select
            id="rol"
            value={rolSeleccionado}
            onChange={(e) => setRolSeleccionado(e.target.value)}
            className="w-full p-3 rounded-md border border-[#3a3f45]
             bg-linear-to-b from-[#2e3237] to-[#23272b]
             text-[#d5d9de] outline-none focus:ring-2 focus:ring-[#c0c6cf]"
          >
            <option value="">-- Selecciona --</option>
            {roles.map((rol) => (
              <option className="bg-[#1e2328]" key={rol.id_rol} value={rol.nombre}>
                {rol.nombre} - {rol.descripcion}
              </option>
            ))}
          </select>
        </div>

        {errorGuardar && (
          <p className="text-red-600 mb-4 text-center">
            ❌ Error al guardar el rol. Intenta nuevamente.
          </p>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGuardar}
            disabled={!rolSeleccionado || guardando}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 ${
              !rolSeleccionado || guardando
                ? "bg-[#0f1115]! cursor-not-allowed text-[#c7ccd2]!"
                : "bg-linear-to-tr from-[#c7ccd2]! to-[#a7aeb6]! text-[#0f1115]! hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"
            }`}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            onClick={() => navigate("/rrhh/admin/elegirEmpleado")}
            className="px-6 py-3 rounded-md font-semibold bg-[#23272b] text-[#d5d9de] border border-[#3a3f45] hover:bg-[#3a3f45] transition duration-200 active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};