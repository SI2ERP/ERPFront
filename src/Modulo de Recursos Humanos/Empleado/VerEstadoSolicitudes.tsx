// VerEstadoSolicitudes.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Ausencia {
  id_ausencia: number;
  id_empleado: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo?: string;
  fecha_solicitud: string;
  estado: string;
}
const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const VerEstadoSolicitudes = () => {
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigate = useNavigate();

  const obtenerIdDesdeToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAusencias = async () => {
      const idEmpleado = obtenerIdDesdeToken();
      if (!idEmpleado) {
        setErrorConexion(true);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get<Ausencia[]>(
          `${API}/rrhh/empleados/${idEmpleado}/ausencias`
        );
        setAusencias(res.data);
      } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
        setErrorConexion(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAusencias();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1115]">
        <p className="text-[#c7cdd4] text-lg animate-pulse">
          Cargando tus solicitudes de ausencia...
        </p>
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
          No se pudo conectar con el servidor o el token es inválido.
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

  if (ausencias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-[#d5d9de] mb-2">
          😕 No tienes solicitudes de ausencia
        </h2>
        <p className="text-[#a7aeb6]">
          Aún no has registrado ninguna solicitud.
        </p>
      </div>
    );
  }

  // Tabla de solicitudes(especifico del usuario logeado)
  return (
    <div className="p-8 bg-[#0f1115] min-h-screen text-[#c7cdd4]">
      <h2 className="text-3xl font-semibold mb-6 text-[#d5d9de]">
        Estado de tus solicitudes de ausencia
      </h2>

      <button
        onClick={() => navigate("/rrhh/empleado")}
        className="px-3 py-1 rounded bg-[#23272b]! hover:bg-[#3a3f45]! active:scale-95 mb-4"
      >
        ← Volver al panel empleado
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#3a3f45] bg-[#2b3036] shadow-lg rounded-md">
          <thead className="bg-[#353a40] text-[#d5d9de]">
            <tr>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Tipo
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Fecha inicio
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Fecha fin
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Motivo
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Fecha solicitud
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {ausencias.map((a, index) => (
              <tr
                key={a.id_ausencia}
                className={`${
                  index % 2 === 0 ? "bg-[#1a1d21]" : "bg-[#23272b]"
                } hover:bg-[#2e3237] transition-colors duration-200`}
              >
                <td className="border-b border-[#3a3f45] p-3">{a.tipo}</td>
                <td className="border-b border-[#3a3f45] p-3">
                  {new Date(a.fecha_inicio).toLocaleDateString()}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {new Date(a.fecha_fin).toLocaleDateString()}
                </td>
                <td className="border-b border-[#3a3f45] p-3">{a.motivo}</td>
                <td className="border-b border-[#3a3f45] p-3">
                  {new Date(a.fecha_solicitud).toLocaleDateString()}
                </td>
                <td
                  className={`border-b border-[#3a3f45] p-3 font-semibold ${
                    a.estado === "APROBADA"
                      ? "text-green-400"
                      : a.estado === "RECHAZADA"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {a.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
