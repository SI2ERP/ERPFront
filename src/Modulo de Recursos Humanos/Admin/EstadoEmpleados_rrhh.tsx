import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  apellido: string;
  fecha_ingreso: string;
  estado: string;
  fecha_baja?: string;
  motivo_baja?: string;
  departamento?: {
    id_departamento: number;
  };
}

export const EstadoEmpleados_rrhh = () => {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [filtro, setFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then((data) => {
        setEmpleados(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const empleadosFiltrados = empleados.filter((e) => {
    if (filtro === "activos") return e.estado === "activo";
    if (filtro === "inactivos") return e.estado === "inactivo";
    return true;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Estado / Datos de Empleados</h1>
        <button
          onClick={() => navigate("/rrhh/admin")}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          ← Volver al panel admin
        </button>
      {/* Filtros */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-3 py-1 rounded ${
            filtro === "todos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("activos")}
          className={`px-3 py-1 rounded ${
            filtro === "activos" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setFiltro("inactivos")}
          className={`px-3 py-1 rounded ${
            filtro === "inactivos" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Inactivos
        </button>
      </div>

      {cargando ? (
        <p>Cargando empleados...</p>
      ) : (
        <table className="min-w-full bg-black border border-gray-300">
          <thead>
            <tr className="bg-white-100">
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-left">RUT</th>
              <th className="border px-4 py-2 text-left">Departamento</th>
              <th className="border px-4 py-2 text-left">Estado</th>
              <th className="border px-4 py-2 text-left">Fecha ingreso</th>
              <th className="border px-4 py-2 text-left">Fecha baja</th>
              <th className="border px-4 py-2 text-left">Motivo baja</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map((e) => (
              <tr key={e.id_empleado}>
                <td className="border px-4 py-2">
                  {e.nombre} {e.apellido}
                </td>
                <td className="border px-4 py-2">{e.rut}</td>
                <td className="border px-4 py-2">
                  {e.departamento?.id_departamento ?? "—"}
                </td>
                <td
                  className={`border px-4 py-2 font-semibold ${
                    e.estado === "activo" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {e.estado}
                </td>
                <td className="border px-4 py-2">
                  {new Date(e.fecha_ingreso).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {e.fecha_baja
                    ? new Date(e.fecha_baja).toLocaleDateString()
                    : "—"}
                </td>
                <td className="border px-4 py-2">
                  {e.motivo_baja ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
