import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

interface Depto {
  id_departamento: number;
  nombre?: string;
}

type FormState = {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  id_departamento: number;
  fecha_ingreso: string; // YYYY-MM-DD
};

export const NuevoEmpleado_rrhh = () => {
  const navigate = useNavigate();

  const hoy = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<FormState>({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "",
    id_departamento: 1,
    fecha_ingreso: hoy,
  });

  const [roles, setRoles] = useState<Rol[]>([]);
  const [deps, setDeps] = useState<Depto[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [errorConexion, setErrorConexion] = useState(false); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onChange = (k: keyof FormState, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/rrhh/roles`);
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      setErrorConexion(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const validate = () => {
    if (
      !form.rut.trim() ||
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.email.trim() ||
      !form.rol.trim()
    ) {
      setErrorMsg("Completa RUT, Nombre, Apellido, Email y Rol.");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    setErrorMsg(null);
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        rut: form.rut.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        rol: form.rol,
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        id_departamento: Number(form.id_departamento),
        fecha_ingreso: new Date(`${form.fecha_ingreso}T00:00:00`).toISOString(),
      };

      await axios.post(`${API}/rrhh/empleados`, payload);
      alert("Empleado creado correctamente");

      navigate("/rrhh/admin/gestion-empleados");
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.message;
      setErrorMsg(typeof msg === "string" ? msg : "No se pudo crear el empleado.");
    } finally {
      setSaving(false);
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f1115] text-[#d5d9de]">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Nuevo empleado</h2>
          <button
            onClick={() => navigate("/rrhh/admin/gestion-empleados")}
            className="px-3 py-1 rounded hover:bg-[#23272b] active:scale-95 text-[#c7cdd4]"
          >
            ← Volver
          </button>
        </div>
      
        {errorConexion && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-900/30 px-4 py-3 text-red-200">
            No se pudieron cargar los roles. Puedes reintentar recargando la página.
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-900/20 px-4 py-3 text-red-200">
            {errorMsg}
          </div>
        )}

        <div className="bg-[#1e2328] border border-[#3a3f45] rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
              placeholder="RUT"
              value={form.rut}
              onChange={(e) => onChange("rut", e.target.value)}
            />
            <input
              className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
            />
            <input
              className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
              placeholder="Apellido"
              value={form.apellido}
              onChange={(e) => onChange("apellido", e.target.value)}
            />
            <input
              className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
            <input
              className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => onChange("telefono", e.target.value)}
            />

            
            <div>
              <label className="block text-sm mb-1">Rol</label>
              <select
                className="w-full bg-[#23272b] border border-[#3a3f45] rounded p-2"
                value={form.rol}
                onChange={(e) => onChange("rol", e.target.value)}
                disabled={roles.length === 0}
                aria-disabled={roles.length === 0}
              >
                <option value="">
                  {roles.length === 0 ? "No disponible" : "-- Selecciona --"}
                </option>
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.nombre}>
                    {r.nombre} - {r.descripcion}
                  </option>
                ))}
              </select>
            </div>

          
            {deps.length ? (
              <select
                className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
                value={form.id_departamento}
                onChange={(e) => onChange("id_departamento", Number(e.target.value))}
              >
                {deps.map((d) => (
                  <option key={d.id_departamento} value={d.id_departamento}>
                    {d.nombre ?? `Depto ${d.id_departamento}`}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="bg-[#23272b] border border-[#3a3f45] rounded p-2"
                type="number"
                min={1}
                value={form.id_departamento}
                onChange={(e) => onChange("id_departamento", Number(e.target.value))}
                placeholder="ID Departamento"
              />
            )}

            <div>
              <label className="block text-sm mb-1">Fecha de ingreso</label>
              <input
                type="date"
                className="w-full bg-[#23272b] border border-[#3a3f45] rounded p-2"
                value={form.fecha_ingreso}
                onChange={(e) => onChange("fecha_ingreso", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleGuardar}
              disabled={saving}
              className={`px-4 py-2 rounded-md font-semibold border
                ${saving
                  ? "bg-[#a7aeb6] text-[#c7cdd4] border-[#9aa2ab] cursor-not-allowed"
                  : "bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"}`}
            >
              {saving ? "Guardando..." : "Guardar empleado"}
            </button>

            <button
              onClick={() => navigate("/rrhh/admin/gestion-empleados")}
              className="px-4 py-2 rounded-md hover:bg-[#23272b]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
