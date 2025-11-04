import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  apellido: string;
  fecha_ingreso: string;
  estado: "ACTIVO" | "INACTIVO" | string;
  motivo_baja?: string | null;
}

const API = "http://localhost:3000";

export const GestionEmpleados_rrhh = () => {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);

  const [nuevo, setNuevo] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    id_departamento: 1,
  });

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

  const handleAgregar = async () => {
    if (!nuevo.rut || !nuevo.nombre || !nuevo.apellido) {
      alert("Completa RUT, Nombre y Apellido");
      return;
    }
    try {
      const res = await axios.post(`${API}/rrhh/empleados`, nuevo);
      setEmpleados(prev => [...prev, res.data]);
      setNuevo({ rut: "", nombre: "", apellido: "", id_departamento: 1 });
      alert("Empleado agregado correctamente");
    } catch (err: any) {
      alert("Error al agregar empleado");
      console.error(err);
    }
  };

  const handleBaja = async (id: number) => {
    const motivo = prompt("Motivo de baja:");
    if (motivo === null) return;
    if (!motivo.trim()) return alert("Debes ingresar un motivo.");

    try {
      const res = await axios.put(`${API}/rrhh/empleados/${id}/baja`, { motivo });
      setEmpleados(prev => prev.map(e => (e.id_empleado === id ? res.data : e)));
      alert("Empleado dado de baja");
    } catch (err: any) {
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
    <div className="p-8 bg-[#0f1115] min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-[#d5d9de]">
        Gestión de Empleados
      </h2>

      <button
        onClick={() => navigate("/rrhh/admin")}
        className="px-3 py-1 rounded hover:bg-[#23272b] active:scale-95 mb-4 text-[#c7cdd4]"
      >
        ← Volver al panel admin
      </button>

      {/* Card formulario */}
      <div className="bg-gradient-to-tr from-[#2b3036] to-[#1e2328] rounded-md shadow-md mb-8 p-4 border border-[#3a3f45]">
        <h3 className="text-lg font-semibold text-[#d5d9de] mb-3">Agregar empleado</h3>
        <div className="flex flex-wrap gap-2">
          <input
            className="border border-[#3a3f45] bg-[#23272b] text-[#d5d9de] p-2 rounded flex-1 min-w-[180px] placeholder-[#a7aeb6] outline-none focus:ring-2 focus:ring-[#c7cdd4]"
            placeholder="RUT"
            value={nuevo.rut}
            onChange={(e) => setNuevo({ ...nuevo, rut: e.target.value })}
          />
          <input
            className="border border-[#3a3f45] bg-[#23272b] text-[#d5d9de] p-2 rounded flex-1 min-w-[180px] placeholder-[#a7aeb6] outline-none focus:ring-2 focus:ring-[#c7cdd4]"
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
          <input
            className="border border-[#3a3f45] bg-[#23272b] text-[#d5d9de] p-2 rounded flex-1 min-w-[180px] placeholder-[#a7aeb6] outline-none focus:ring-2 focus:ring-[#c7cdd4]"
            placeholder="Apellido"
            value={nuevo.apellido}
            onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
          />
          <button
            onClick={handleAgregar}
            className="bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95 px-4 py-2 rounded-md font-semibold transition duration-200"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Tabla empleados */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#3a3f45] rounded-md shadow-md bg-[#2b3036]">
          <thead className="bg-[#1e2328] text-[#d5d9de]">
            <tr>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Nombre</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">RUT</th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Estado</th>
              <th className="border-b border-[#3a3f45] p-3 text-center font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, idx) => (
              <tr
                key={emp.id_empleado}
                className={`${idx % 2 === 0 ? "bg-[#23272b]" : "bg-[#2e3237]"} hover:bg-[#3a3f45] transition-colors duration-200`}
              >
                <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">
                  {emp.nombre} {emp.apellido}
                </td>
                <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-medium">{emp.rut}</td>
                <td className="border-b border-[#3a3f45] p-3 text-[#d5d9de] font-semibold">
                  {emp.estado}
                  {emp.estado === "INACTIVO" && emp.motivo_baja ? ` • ${emp.motivo_baja}` : ""}
                </td>
                <td className="border-b border-[#3a3f45] p-3 text-center">
                  <button
                    onClick={() => handleBaja(emp.id_empleado)}
                    disabled={emp.estado === "INACTIVO"}
                    className={`px-4 py-2 rounded-md font-semibold transition duration-200
                      ${emp.estado === "INACTIVO"
                        ? "bg-[#a7aeb6] text-[#c7cdd4] border border-[#9aa2ab] cursor-not-allowed"
                        : "bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"}`}
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
  );
};
