import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Departamento { id_departamento: number }
interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
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
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando empleados...</p>
      </div>
    );
  }
  if (errorConexion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-500 mb-2">❌ Error de conexión</h2>
        <p className="text-gray-600 mb-4">No se pudo conectar con el servidor.</p>
        <button onClick={() => window.location.reload()}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="p-9 bg-[#0f1115] min-h-screen text-[#d5d9de]">
      <h2 className="text-3xl font-semibold mb-6 text-[#d5d9de]">
        Estado / Datos de Empleados
      </h2>

      <button
        onClick={() => navigate("/rrhh/admin")}
        className="px-3 py-1 rounded bg-[#23272b] hover:!bg-[#3a3f45] active:scale-95 mb-4"
      >
        ← Volver al panel admin
      </button>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-3 py-1 rounded ${
            filtro === "todos" ? "bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115]"
                  : "bg-[#23272b] text-[#c7cdd4] hover:bg-[#3a3f45]"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("activos")}
          className={`px-3 py-1 rounded ${
            filtro === "activos" ? "bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115]"
                  : "bg-[#23272b] text-[#c7cdd4] hover:bg-[#3a3f45]"
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setFiltro("inactivos")}
          className={`px-3 py-1 rounded ${
            filtro === "inactivos" ? "bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115]"
                  : "bg-[#23272b] text-[#c7cdd4] hover:bg-[#3a3f45]"
          }`}
        >
          Inactivos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#3a3f45] bg-[#1e2328] shadow-lg rounded-md">
          <thead className="bg-[#2b3036] text-[#d5d9de]">
            <tr>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Nombre</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Apellido</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Rol</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Email</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Estado</th>
              {/*<th className="border-b border-[#3a3f45] p-3 text-left font-medium">Fecha baja</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Motivo baja</th>*/}
            </tr>
          </thead>
          <tbody>
            {dataset.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-[#c7cdd4]" colSpan={7}>
                  No hay empleados para el filtro seleccionado.
                </td>
              </tr>
            ) : (
              dataset.map((e, idx) => (
                <tr key={e.id_empleado}
                  className={`${idx % 2 === 0 ? "bg-[#2b3036]" : "bg-[#23272b]"} hover:bg-[#3a3f45] transition-colors duration-200`}>
                  <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">
                    {e.nombre} 
                  </td>
                  <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">{e.apellido}</td>
                  <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">
                    {e.rol}
                  </td>
                  <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">
                    {e.email}
                  </td>
                  <td className="border-b border-[#3a3f45] p-3 font-semibold text-[#d5d9de]"> 
                    {e.estado === "ACTIVO" ? "ACTIVO" : "INACTIVO"}
                  </td>
                  {/*<td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">
                    {e.fecha_baja ? new Date(e.fecha_baja).toLocaleDateString() : "—"}
                  </td>
                  <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">
                    {e.motivo_baja ?? "—"}
                  </td>*/}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
