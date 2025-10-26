import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Departamento {
  nombre: string;
}

interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
  estado: string;
  departamento: Departamento;
}

export const ListarEmpleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const res = await axios.get("http://localhost:3000/rrhh/empleados");
        setEmpleados(res.data);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
        setErrorConexion(true);
      } finally {
        setLoading(false);
      }
    };
    obtenerEmpleados();
  }, []);

  const manejarAsignarRol = (id: number) => {
    navigate(`/rrhh/admin/elegirEmpleado/asignarRol/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Cargando empleados...</p>
      </div>
    );
  }

  if (errorConexion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          ❌ Error de conexión
        </h2>
        <p className="text-gray-600 mb-4">
          No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté activo.
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

  if (empleados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          😕 No hay empleados registrados
        </h2>
        <p className="text-gray-500">
          Actualmente no hay registros disponibles en la base de datos.
        </p>
      </div>
    );
  }


  return (
    <div className="p-8 bg-[#e8f3ed] min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-[#1a8a5b]">
        Listado de Empleados
      </h2>

      <button
          onClick={() => navigate("/rrhh/admin")}
          className="px-3 py-1 rounded hover:!bg-gray-100 active:scale-95"
        >
          ← Volver al panel admin
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#1e8449] bg-[#cde3d6] shadow-lg rounded-md">
          <thead className="bg-[#1a8a5b] text-white">
            <tr>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">
                Nombre
              </th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">
                Rol
              </th>
              <th className="border-b border-[#1e8449] p-3 text-center font-medium">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, index) => (
              <tr
                key={emp.id_empleado}
                className={`${
                  index % 2 === 0 ? "bg-[#a8bfb2]" : "bg-[#97b5a5]"
                } hover:bg-[#86ab98] transition-colors duration-200`}
              >
                <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                  {emp.nombre} {emp.apellido}
                </td>
                <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                  {emp.rol}
                </td>
                <td className="border-b border-[#1e8449] p-3 text-center">
                  <button
                    onClick={() => manejarAsignarRol(emp.id_empleado)}
                    className="bg-white text-[#1a8a5b] border border-[#1a8a5b] hover:bg-[#2ecc71] hover:text-black active:scale-95 px-4 py-2 rounded-md font-semibold transition duration-200"
                  >
                    Asignar Rol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};