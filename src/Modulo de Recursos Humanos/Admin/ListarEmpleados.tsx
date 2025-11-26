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
const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const ListarEmpleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigate = useNavigate();
  const [idUsuarioLogueado, setIdUsuarioLogueado] = useState<number | null>(null);

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const res = await axios.get(API+"/rrhh/empleados");
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

  useEffect(() => {
  if (empleados.length > 0) {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setIdUsuarioLogueado(decodedPayload.sub);
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    } else {
      console.error("Falta token");
    }
  }
}, [empleados]);


  const manejarAsignarRol = (id: number) => {
      navigate(`/rrhh/admin/elegirEmpleado/asignarRol/${id}`);//solo redirige si el id elegido es diferente del propio
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1115]">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando empleados...</p>
      </div>
    );
  }

  if (errorConexion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          ❌ Error de conexión
        </h2>
        <p className="text-[#c7cdd4] mb-4">
          No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté activo.
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

  if (empleados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-[#d5d9de] mb-2">
          😕 No hay empleados registrados
        </h2>
        <p className="text-[#a7aeb6]">
          Actualmente no hay registros disponibles en la base de datos.
        </p>
      </div>
    );
  }


  return (
    <div className="p-8 bg-[#0f1115] min-h-screen text-[#c7cdd4]">
      <h2 className="text-3xl font-semibold mb-6 text-[#d5d9de]">
        Listado de Empleados
      </h2>

      <button
          onClick={() => navigate("/rrhh/admin")}
          className="px-3 py-1 rounded bg-[#23272b]! hover:bg-[#3a3f45]! active:scale-95 mb-4"
        >
          ← Volver al panel admin
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#3a3f45] bg-[#2b3036] shadow-lg rounded-md">
          <thead className="bg-[#353a40] text-[#d5d9de]">
            <tr>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Nombre
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Rol
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-center font-medium">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, index) => (
              <tr
                key={emp.id_empleado}
                className={`${
                  index % 2 === 0 ? "bg-[#1a1d21]" : "bg-[#23272b]"
                } hover:bg-[#2e3237] transition-colors duration-200`}
              >
                <td className="border-b border-[#3a3f45] p-3">
                  {emp.nombre} {emp.apellido}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {emp.rol}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  <button
                    onClick={() => manejarAsignarRol(emp.id_empleado)}
                     className={`px-4 py-2 rounded-md font-semibold transition duration-200
                              ${emp.id_empleado === idUsuarioLogueado
                                ? "bg-gray-500! text-gray-300! cursor-not-allowed"
                                : "bg-linear-to-tr from-[#c7ccd2]! to-[#a7aeb6]! text-[#0f1115]! hover:from-[#d5d9de]! hover:to-[#b3bbc3]! active:scale-95"
                              }`}
                    disabled={emp.id_empleado === idUsuarioLogueado}
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