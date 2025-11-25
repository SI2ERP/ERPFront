// src/Modulo de Recursos Humanos/Empleado/JefeMisEmpleados_rrhh.tsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

type Empleado = {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rut: string;
  email?: string;
  rol?: string;
  estado: "ACTIVO" | "INACTIVO" | string;
  departamento?: { nombre?: string }; // ← añadimos nombre de departamento
};

const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const JefeMisEmpleados_rrhh = () => {
  const navigate = useNavigate();
  const { idDepto: idDeptoParam } = useParams<{ idDepto: string }>();
  const location = useLocation();

  const idDeptoQuery = useMemo(
    () => new URLSearchParams(location.search).get("idDepto"),
    [location.search]
  );
  const idDeptoLS = localStorage.getItem("rrhh_id_departamento");
  const idDepartamento = Number(idDeptoParam ?? idDeptoQuery ?? idDeptoLS);

  const handleBackToHome = () =>{
    navigate("/");//ya no deslogeara, ahora va de vuelta al home
  }

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [deptName, setDeptName] = useState<string | null>(null); // ← nombre a mostrar
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState<string | null>(null);
  const [pendientes, setPendientes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setErrorConexion(null);

        if (!idDepartamento || Number.isNaN(idDepartamento)) {
          throw new Error(
            "No se indicó el id del departamento. Usa /rrhh/jefe/mis-empleados/:idDepto (ej: /1) o ?idDepto=1."
          );
        }

        localStorage.setItem("rrhh_id_departamento", String(idDepartamento));

        const token = localStorage.getItem("token");
        // 1) Empleados del departamento
        const [resEmps, resPend] = await Promise.all([
          axios.get(`${API}/rrhh/empleados/departamento/${idDepartamento}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }),
          // 2) Todas las solicitudes en PENDIENTE (las cruzamos por id_empleado)
          axios.get(`${API}/rrhh/solicitud-baja`, {
            params: { estado: "PENDIENTE" },
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }),
        ]);

        const emps: Empleado[] = resEmps.data || [];
        setEmpleados(emps);

        // ← intentamos obtener el nombre del departamento de la respuesta
        const nameFromData =
          emps.find(e => e?.departamento?.nombre)?.departamento?.nombre ?? null;
        setDeptName(nameFromData);

        // construir set de ids con solicitud pendiente pero solo los del depto
        const pendSet = new Set<number>();
        const pendientesAll = Array.isArray(resPend.data) ? resPend.data : [];
        const idsDepto = new Set(emps.map((e) => e.id_empleado));
        for (const s of pendientesAll) {
          if (idsDepto.has(s.id_empleado)) pendSet.add(s.id_empleado);
        }
        setPendientes(pendSet);
      } catch (e: any) {
        console.error(e);
        setErrorConexion(
          e?.response?.data?.message || e?.message || "No se pudo conectar con el servidor."
        );
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idDepartamento]);

  const empleadosFiltrados = empleados.filter((e) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      e.nombre.toLowerCase().includes(q) ||
      e.apellido.toLowerCase().includes(q) ||
      (e.rut || "").toLowerCase().includes(q) ||
      (e.email || "").toLowerCase().includes(q) ||
      (e.rol || "").toLowerCase().includes(q)
    );
  });

  const abrirSolicitud = (id_empleado: number, estado: string) => {
    if (estado !== "ACTIVO") return;
    if (pendientes.has(id_empleado)) return;
    navigate(`/rrhh/jefe/solicitar-baja/${id_empleado}`);
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
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">❌ Error de conexión</h2>
        <p className="text-[#c7cdd4] mb-4">{errorConexion}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded font-semibold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f1115] text-[#d5d9de]">
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-6">
          {deptName
            ? `Empleados de departamento de ${deptName}`
            : `Empleados del Departamento #${idDepartamento}`}
        </h2>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToHome}
            className="px-3 py-1 rounded !hover:bg-[#23272b] active:scale-95 text-[#c7cdd4]!"
          >
            ← Volver
          </button>

          <input
            placeholder="Buscar por nombre, rut, email, rol..."
            className="border border-[#3a3f45] rounded px-3 py-2 w-full max-w-md bg-[#2b3036] text-[#d5d9de] focus:ring-2 focus:ring-[#c0c6cf]"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#3a3f45] rounded-md shadow-md bg-[#2b3036]">
            <thead className="bg-[#1e2328]">
              <tr>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Nombre</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">RUT</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Email</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">ROL</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Estado</th>
                <th className="border-b border-[#3a3f45] p-3 text-center font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-[#c7cdd4] bg-[#23272b]">
                    No hay empleados para mostrar.
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((emp, idx) => {
                  const isInactive = emp.estado !== "ACTIVO";
                  const isPending = pendientes.has(emp.id_empleado);
                  return (
                    <tr
                      key={emp.id_empleado}
                      className={`${idx % 2 === 0 ? "bg-[#23272b]" : "bg-[#2e3237]"} hover:bg-[#3a3f45] transition-colors`}
                    >
                      <td className="border-b border-[#3a3f45] p-3 font-medium">
                        {emp.nombre} {emp.apellido}
                      </td>
                      <td className="border-b border-[#3a3f45] p-3">{emp.rut}</td>
                      <td className="border-b border-[#3a3f45] p-3">{emp.email ?? "—"}</td>
                      <td className="border-b border-[#3a3f45] p-3 font-semibold">{emp.rol ?? "—"}</td>
                      <td className="border-b border-[#3a3f45] p-3 font-semibold">{emp.estado}</td>
                      <td className="border-b border-[#3a3f45] p-3 text-center">
                        <button
                          onClick={() => abrirSolicitud(emp.id_empleado, emp.estado)}
                          disabled={isInactive || isPending}
                          className={`px-4 py-2 rounded-md font-semibold ${
                            isInactive || isPending
                              ? "bg-[#a7aeb6] text-[#c7cdd4] border border-[#9aa2ab] cursor-not-allowed"
                              : "bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"
                          }`}
                          title={
                            isInactive
                              ? "Empleado inactivo"
                              : isPending
                              ? "Ya existe una solicitud pendiente para este empleado"
                              : ""
                          }
                        >
                          {isPending ? "Solicitud pendiente" : "Solicitar baja"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
