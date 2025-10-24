import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

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
        const res = await axios.get("http://localhost:3000/rrhh/roles");
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
      await axios.put(`http://localhost:3000/rrhh/empleados/${idEmpleado}`, {
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
        <p className="text-gray-600 mb-4">
          Debes elegir un empleado desde la lista antes de asignar un rol.
        </p>
        <button
          onClick={() => navigate("/rrhh/admin/elegirEmpleado")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Volver a empleados
        </button>
      </div>
    );
  }

  if (loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Cargando roles...</p>
      </div>
    );
  }

  if (errorRoles) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          ❌ Error al cargar roles
        </h2>
        <p className="text-gray-600 mb-4">
          No se pudieron obtener los roles desde el servidor.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8f3ed] px-4">
      <div className="bg-[#cde3d6] p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#1a8a5b] mb-6 text-center">
          Asignar Rol al Empleado #{idEmpleado}
        </h2>

        <div className="mb-6">
          <label
            htmlFor="rol"
            className="block text-[#1a8a5b] font-medium mb-2"
          >
            Selecciona un rol:
          </label>
          <select
            id="rol"
            value={rolSeleccionado}
            onChange={(e) => setRolSeleccionado(e.target.value)}
            className="w-full p-3 rounded-md border border-[#1a8a5b] focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">-- Selecciona --</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.nombre}>
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
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "!bg-[#1a8a5b] text-white hover:bg-[#166e47] active:scale-95"
            }`}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            onClick={() => navigate("/rrhh/admin/elegirEmpleado")}
            className="px-6 py-3 rounded-md font-semibold bg-white text-[#1a8a5b] border border-[#1a8a5b] hover:bg-[#2ecc71] hover:text-black transition duration-200 active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};