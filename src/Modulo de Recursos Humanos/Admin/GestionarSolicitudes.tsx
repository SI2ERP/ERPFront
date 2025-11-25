import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Departamento {
  nombre: string;
}

interface Empleado {
  nombre: string;
  apellido: string;
  departamento: Departamento;
}

interface Ausencia {
  id_ausencia: number;
  id_empleado: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  motivo: string | null;
  fecha_solicitud: string;
  empleado: Empleado;
}
const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const GestionarSolicitudes = () => {
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigate = useNavigate();

  const fetchAusencias = async () => {
    try {
      const res = await axios.get<Ausencia[]>(API+"/rrhh/ausencias/");
      const pendientes = res.data.filter((a) => a.estado === 'PENDIENTE');
      setAusencias(pendientes);
    } catch (error) {
      console.error("Error al obtener ausencias:", error);
      setErrorConexion(true);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id: number, nuevoEstado: "APROBADA" | "RECHAZADA") => {
    try {
      await axios.put(`${API}/rrhh/ausencias/${id}/estado`, { estado: nuevoEstado });
      // Remover la fila actualizada (ya no es PENDIENTE)
      setAusencias((prev) => prev.filter((a) => a.id_ausencia !== id));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  useEffect(() => {
    fetchAusencias();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1115]">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando solicitudes...</p>
      </div>
    );
  }

  if (errorConexion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">❌ Error de conexión</h2>
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

  if (ausencias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-[#d5d9de] mb-2">
          😌 No hay solicitudes pendientes
        </h2>
        <p className="text-[#a7aeb6]">
          Actualmente no existen solicitudes en estado pendiente.
        </p>
      </div>
    );
  }

  // === Tabla principal ===
  return (
    <div className="p-8 bg-[#0f1115] min-h-screen text-[#c7cdd4]">
      <button
          onClick={() => navigate("/rrhh/admin")}
          className="px-3 py-1 rounded bg-[#23272b]! hover:bg-[#3a3f45]! active:scale-95 mb-4"
        >
          ← Volver al panel admin
      </button>

      <h2 className="text-3xl font-semibold mb-6 text-[#d5d9de]">
        Solicitudes de Ausencia Pendientes
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#3a3f45] bg-[#2b3036] shadow-lg rounded-md">
          <thead className="bg-[#353a40] text-[#d5d9de]">
            <tr>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Empleado</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Departamento</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Tipo</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Fecha Inicio</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Fecha Fin</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Motivo</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Fecha Solicitud</th>
              <th className="border-b border-[#3a3f45] p-3 text-center font-medium">Acciones</th>
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
                <td className="border-b border-[#3a3f45] p-3">
                  {a.empleado.nombre} {a.empleado.apellido}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {a.empleado.departamento.nombre}
                </td>
                <td className="border-b border-[#3a3f45] p-3">{a.tipo}</td>
                <td className="border-b border-[#3a3f45] p-3">
                  {new Date(a.fecha_inicio).toLocaleDateString()}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {new Date(a.fecha_fin).toLocaleDateString()}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {a.motivo ? a.motivo : "No da motivos"}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {new Date(a.fecha_solicitud).toLocaleDateString()}
                </td>
                <td className="border-b border-[#3a3f45] p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => actualizarEstado(a.id_ausencia, "APROBADA")}
                    className="px-4 py-1 rounded-md font-semibold transition duration-200
                               bg-linear-to-tr from-green-400 to-green-300 text-[#0f1115]
                               hover:from-green-300 hover:to-green-200 active:scale-95"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => actualizarEstado(a.id_ausencia, "RECHAZADA")}
                    className="px-4 py-1 rounded-md font-semibold transition duration-200
                               bg-linear-to-tr from-red-500 to-red-400 text-[#0f1115]
                               hover:from-red-400 hover:to-red-300 active:scale-95"
                  >
                    Rechazar
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


