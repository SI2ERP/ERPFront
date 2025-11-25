// src/Modulo de Recursos Humanos/Admin/AdminSolicitudesBaja_rrhh.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

interface EmpleadoLite {
  nombre: string;
  apellido: string;
  rut: string;
}

interface SolicitudBaja {
  id_solicitud_baja: number;
  motivo: string;
  fecha_solicitud: string;
  empleado?: EmpleadoLite;
}

export const AdminSolicitudesBaja_rrhh = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<SolicitudBaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState<SolicitudBaja | null>(null);
  const [working, setWorking] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const raiseToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const cargar = async () => {
    try {
      setLoading(true);
      setErrorConexion(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/rrhh/solicitud-baja`, {
        params: { estado: "PENDIENTE" },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setSolicitudes(res.data || []);
    } catch (e: any) {
      console.error(e);
      setErrorConexion(
        e?.response?.data?.message || e?.message || "No se pudo conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirModal = (s: SolicitudBaja) => {
    setWorking(false);            // reset por si venimos de una operación anterior
    setTarget(s);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setWorking(false);            // asegúrate de liberar el estado
    setTarget(null);
    setModalOpen(false);
  };

  const patchEstado = async (estado: "APROBADA" | "RECHAZADA") => {
    if (!target) return;
    try {
      setWorking(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/rrhh/solicitud-baja/${target.id_solicitud_baja}`,
        { estado }, // no mandamos motivo_resolucion
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      raiseToast(estado === "APROBADA" ? "Solicitud aprobada" : "Solicitud rechazada");
      await cargar();
    } catch (e: any) {
      console.error(e);
      raiseToast(
        e?.response?.data?.message ||
          (Array.isArray(e?.response?.data) ? e.response.data.join(", ") : "No se pudo actualizar")
      );
    } finally {
      // MUY IMPORTANTE: liberar 'working' antes de cerrar para que los botones vuelvan a la normalidad
      setWorking(false);
      cerrarModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[#c7cdd4] text-lg animate-pulse">Cargando solicitudes...</p>
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
        <h2 className="text-3xl font-semibold mb-6">Solicitudes de Baja (Pendientes)</h2>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/rrhh/admin")}
            className="px-3 py-1 rounded hover:bg-[#23272b]! active:scale-95 text-[#c7cdd4]!"
          >
            ← Volver al panel admin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#3a3f45] rounded-md shadow-md bg-[#2b3036]">
            <thead className="bg-[#1e2328]">
              <tr>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Empleado</th>
                <th className="border-b border-[#3a3f45] p-3 text-left font-medium">Fecha solicitud</th>
                <th className="border-b border-[#3a3f45] p-3 text-center font-medium">Solicitud</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-[#c7cdd4] bg-[#23272b]">
                    No hay pendientes.
                  </td>
                </tr>
              ) : (
                solicitudes.map((s, i) => (
                  <tr
                    key={s.id_solicitud_baja}
                    className={`${i % 2 === 0 ? "bg-[#23272b]" : "bg-[#2e3237]"} hover:bg-[#3a3f45] transition-colors`}
                  >
                    <td className="border-b border-[#3a3f45] p-3 font-medium">
                      {s.empleado ? `${s.empleado.nombre} ${s.empleado.apellido} • ${s.empleado.rut}` : "—"}
                    </td>
                    <td className="border-b border-[#3a3f45] p-3">
                      {new Date(s.fecha_solicitud).toLocaleString()}
                    </td>
                    <td className="border-b border-[#3a3f45] p-3 text-center">
                      <button
                        onClick={() => abrirModal(s)}
                        className="px-3 py-2 rounded-md font-semibold bg-[#23272b] text-[#d5d9de] border border-[#3a3f45] hover:bg-[#3a3f45] active:scale-95"
                      >
                        Ver Solicitud
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && target && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#2b3036] w-full max-w-2xl rounded-md border border-[#3a3f45] p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Detalle de la solicitud</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-[#23272b] border border-[#3a3f45] rounded-md p-3">
                  <p className="text-sm text-[#c7cdd4]">Empleado</p>
                  <p className="font-semibold">
                    {target.empleado ? `${target.empleado.nombre} ${target.empleado.apellido}` : "—"}
                  </p>
                </div>
                <div className="bg-[#23272b] border border-[#3a3f45] rounded-md p-3">
                  <p className="text-sm text-[#c7cdd4]">RUT</p>
                  <p className="font-semibold">{target.empleado?.rut ?? "—"}</p>
                </div>
              </div>

              <div className="bg-[#23272b] border border-[#3a3f45] rounded-md p-3 mb-4">
                <p className="text-sm text-[#c7cdd4] mb-2">Motivo de la solicitud</p>
                <div className="max-h-56 overflow-auto text-[#d5d9de] whitespace-pre-wrap">
                  {target.motivo}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cerrarModal}
                  disabled={working}
                  className="px-4 py-2 rounded-md font-semibold bg-[#23272b] text-[#d5d9de] border border-[#3a3f45] hover:bg-[#3a3f45] transition active:scale-95"
                >
                  Cerrar
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("¿Confirmas rechazar esta solicitud de baja?")) {
                      patchEstado("RECHAZADA");
                    }
                  }}
                  disabled={working}
                  className={`px-4 py-2 rounded-md font-semibold bg-[#a93a3a] text-white border border-[#b54e4e] hover:bg-[#c55454] active:scale-95 ${working ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {working ? "Procesando..." : "Rechazar"}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("¿Confirmas aprobar esta solicitud de baja?")) {
                      patchEstado("APROBADA");
                    }
                  }}
                  disabled={working}
                  className={`px-4 py-2 rounded-md font-semibold bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] border border-[#a7b0b8] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95 ${working ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {working ? "Procesando..." : "Aprobar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2b3036] border border-[#3a3f45] text-[#d5d9de] px-4 py-2 rounded-md shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};
