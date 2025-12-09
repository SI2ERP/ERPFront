import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

type EmpleadoFull = {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rut: string;
  estado: "ACTIVO" | "INACTIVO" | string;
  departamento?: { id_departamento: number; nombre: string };
};

export const JefeSolicitarBaja_rrhh = () => {
  const navigate = useNavigate();
  const { idEmpleado } = useParams<{ idEmpleado: string }>();

  const [empleado, setEmpleado] = useState<EmpleadoFull | null>(null);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState<string | null>(null);

  // util: volver a la lista del jefe
  const volverALista = () => {
    const depId =
      empleado?.departamento?.id_departamento ||
      Number(localStorage.getItem("rrhh_id_departamento") || "");
    if (depId) {
      navigate(`/rrhh/jefe/mis-empleados/${depId}`);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setErrorConexion(null);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/rrhh/empleados/${idEmpleado}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setEmpleado(res.data);
      } catch (e: any) {
        console.error(e);
        setErrorConexion(
          e?.response?.data?.message || e?.message || "No se pudo cargar el empleado."
        );
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idEmpleado]);

  const enviarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empleado) return;
    if (!motivo.trim()) {
      setErrorConexion("El motivo es requerido.");
      return;
    }
    try {
      setErrorConexion(null);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/rrhh/solicitud-baja`,
        { id_empleado: empleado.id_empleado, motivo },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      // al terminar, volver a la lista:
      volverALista();
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        (Array.isArray(e?.response?.data) ? e.response.data.join(", ") : null) ||
        "No se pudo crear la solicitud.";
      setErrorConexion(String(msg));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (errorConexion && !empleado) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">❌ Error</h2>
        <p className="text-[#c7cdd4] mb-4">{errorConexion}</p>
        <button
          onClick={volverALista}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded font-semibold"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#0f1115] px-4 py-10">
      <div className="bg-[#2b3036] p-8 rounded-md shadow-lg w-full max-w-2xl border border-[#3a3f45]">
        <h2 className="text-2xl font-semibold text-[#d5d9de] mb-6">
          Solicitar baja de empleado
        </h2>

        {empleado && (
          <div className="bg-[#23272b] border border-[#3a3f45] rounded-md p-4 mb-6">
            <p className="text-lg font-semibold text-[#d5d9de]">
              {empleado.nombre} {empleado.apellido}
            </p>
            <p className="text-[#c7cdd4]">RUT: {empleado.rut}</p>
            <p className="text-[#c7cdd4]">
              Departamento: {empleado.departamento?.nombre ?? "—"}
            </p>
            <p className="text-[#c7cdd4]">
              Estado:{" "}
              <span className={empleado.estado === "ACTIVO" ? "text-green-400" : "text-red-400"}>
                {empleado.estado}
              </span>
            </p>
          </div>
        )}

        <form onSubmit={enviarSolicitud}>
          <label className="block text-[#c7cdd4] font-medium mb-2">
            Motivo de la baja:
          </label>
          <textarea
            className="w-full p-3 rounded-md border border-[#3a3f45]
                       bg-linear-to-b from-[#2e3237] to-[#23272b]
                       text-[#d5d9de] outline-none focus:ring-2 focus:ring-[#c0c6cf] min-h-32"
            placeholder="Describe el motivo…"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          {errorConexion && empleado && (
            <p className="mt-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
              {errorConexion}
            </p>
          )}

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={!empleado || empleado.estado !== "ACTIVO"}
              className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 ${
                !empleado || empleado.estado !== "ACTIVO"
                  ? "bg-[#0f1115]! cursor-not-allowed text-[#c7ccd2]!"
                  : "bg-linear-to-tr from-[#c7ccd2]! to-[#a7aeb6]! text-[#0f1115]! hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"
              }`}
            >
              Enviar solicitud
            </button>

            <button
              type="button"
              onClick={volverALista}
              className="px-6 py-3 rounded-md font-semibold bg-[#23272b] text-[#d5d9de] border border-[#3a3f45] hover:bg-[#3a3f45] transition duration-200 active:scale-95"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
