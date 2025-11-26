import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  rol: string;
  apellido: string;
  fecha_ingreso: string;
  estado: "ACTIVO" | "INACTIVO" | string;
  motivo_baja?: string | null;
}

const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const GestionEmpleados_rrhh = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);

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

  useEffect(() => { cargar(); }, []);

  const handleBaja = async (id: number) => {
    const motivo = prompt("Motivo de baja:");
    if (motivo === null) return;
    if (!motivo.trim()) return alert("Debes ingresar un motivo.");
    try {
      const res = await axios.put(`${API}/rrhh/empleados/${id}/baja`, { motivo });
      setEmpleados(prev => prev.map(e => (e.id_empleado === id ? res.data : e)));
      alert("Empleado dado de baja");
    } catch (err) {
      alert("Error al dar de baja");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando empleados...</p>
      </div>
    );
  }
  if (errorConexion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">❌ Error de conexión</h2>
        <p className="text-[#c7cdd4] mb-4">No se pudo conectar con el servidor.</p>
        <button onClick={() => window.location.reload()}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded font-semibold">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f1115] text-[#d5d9de]">
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-6">Gestión de Empleados</h2>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/rrhh/admin")}
            className="px-3 py-1 rounded !hover:bg-[#23272b] active:scale-95 text-[#c7cdd4]!"
          >
            ← Volver al panel admin
          </button>

          <button
            onClick={() => navigate("/rrhh/admin/gestion-empleados/nuevo-empleado")}
            className="bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95 px-4 py-2 rounded-md font-semibold"
          >
            + Agregar empleado
          </button>
        </div>

        {/* Tabla empleados */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#3a3f45] rounded-md shadow-md bg-[#2b3036]">
            <thead className="bg-[#1e2328]">
              <tr>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Nombre</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">ROL</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Estado</th>
                <th className="border-b border-[#3a3f45] p-3 text-center font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp, idx) => (
                <tr key={emp.id_empleado}
                  className={`${idx % 2 === 0 ? "bg-[#23272b]" : "bg-[#2e3237]"} hover:bg-[#3a3f45] transition-colors`}>
                  <td className="border-b border-[#3a3f45] p-3 font-medium">
                    {emp.nombre} {emp.apellido}
                  </td>
                  <td className="border-b border-[#3a3f45] p-3 font-semibold">{emp.rol}</td>
                  <td className="border-b border-[#3a3f45] p-3 font-semibold">
                    {emp.estado}{emp.estado === "INACTIVO" && emp.motivo_baja ? ` • ${emp.motivo_baja}` : ""}
                  </td>
                  <td className="border-b border-[#3a3f45] p-3 text-center">
                    <button
                      onClick={() => handleBaja(emp.id_empleado)}
                      disabled={emp.estado === "INACTIVO"}
                      className={`px-4 py-2 rounded-md font-semibold
                        ${emp.estado === "INACTIVO"
                          ? "bg-[#a7aeb6] text-[#c7cdd4] border border-[#9aa2ab] cursor-not-allowed"
                          : "bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"}`}
                    >
                      Dar de baja
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
