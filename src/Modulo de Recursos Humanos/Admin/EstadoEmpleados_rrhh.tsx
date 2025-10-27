import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Departamento { id_departamento: number }
interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  apellido: string;
  fecha_ingreso: string;
  estado: "ACTIVO" | "INACTIVO" | string;
  fecha_baja?: string | null;
  motivo_baja?: string | null;
  departamento?: Departamento | null;
}

const API = "http://localhost:3000";

export const EstadoEmpleados_rrhh = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "activos" | "inactivos">("todos");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(`${API}/rrhh/empleados`);
        setEmpleados(res.data);
      } catch (err) {
        console.error(err);
        setErrorConexion(true);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const dataset = empleados.filter(e =>
    filtro === "activos" ? e.estado === "ACTIVO" :
    filtro === "inactivos" ? e.estado === "INACTIVO" : true
  );

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
        <h2 className="text-2xl font-semibold text-red-600 mb-2">❌ Error de conexión</h2>
        <p className="text-gray-600 mb-4">No se pudo conectar con el servidor.</p>
        <button onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#e8f3ed] min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-[#1a8a5b]">
        Estado / Datos de Empleados
      </h2>

      <button
        onClick={() => navigate("/rrhh/admin")}
        className="px-3 py-1 rounded hover:!bg-gray-100 active:scale-95 mb-4"
      >
        ← Volver al panel admin
      </button>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-3 py-1 rounded ${
            filtro === "todos" ? "bg-[#1a8a5b] text-white" : "bg-white text-[#1a8a5b] border border-[#1a8a5b]"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("activos")}
          className={`px-3 py-1 rounded ${
            filtro === "activos" ? "bg-[#1a8a5b] text-white" : "bg-white text-[#1a8a5b] border border-[#1a8a5b]"
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setFiltro("inactivos")}
          className={`px-3 py-1 rounded ${
            filtro === "inactivos" ? "bg-[#1a8a5b] text-white" : "bg-white text-[#1a8a5b] border border-[#1a8a5b]"
          }`}
        >
          Inactivos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#1e8449] bg-[#cde3d6] shadow-lg rounded-md">
          <thead className="bg-[#1a8a5b] text-white">
            <tr>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">Nombre</th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">RUT</th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">Departamento</th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">Estado</th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">Fecha ingreso</th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">Fecha baja</th>
              <th className="border-b border-[#1e8449] p-3 text-left font-medium">Motivo baja</th>
            </tr>
          </thead>
          <tbody>
            {dataset.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-700" colSpan={7}>
                  No hay empleados para el filtro seleccionado.
                </td>
              </tr>
            ) : (
              dataset.map((e, idx) => (
                <tr key={e.id_empleado}
                  className={`${idx % 2 === 0 ? "bg-[#a8bfb2]" : "bg-[#97b5a5]"} hover:bg-[#86ab98] transition-colors duration-200`}>
                  <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                    {e.nombre} {e.apellido}
                  </td>
                  <td className="border-b border-[#1e8449] p-3 text-white font-medium">{e.rut}</td>
                  <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                    {e.departamento?.id_departamento ?? "—"}
                  </td>
                  <td className="border-b border-[#1e8449] p-3 font-semibold text-white">
                    {e.estado === "ACTIVO" ? "ACTIVO" : "INACTIVO"}
                  </td>
                  <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                    {e.fecha_ingreso ? new Date(e.fecha_ingreso).toLocaleDateString() : "—"}
                  </td>
                  <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                    {e.fecha_baja ? new Date(e.fecha_baja).toLocaleDateString() : "—"}
                  </td>
                  <td className="border-b border-[#1e8449] p-3 text-white font-medium">
                    {e.motivo_baja ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
