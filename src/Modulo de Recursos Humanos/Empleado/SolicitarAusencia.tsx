import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate} from "react-router-dom";

interface SolicitudAusencia {
  id_empleado: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
}

const tiposAusencia: string[] = [
  "VACACIONES",
  "PERMISO",
  "LICENCIA",
  "OTRO",
];
const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

export const SolicitarAusencia: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SolicitudAusencia>({
    id_empleado: -1,
    tipo: "",
    fecha_inicio: "",
    fecha_fin: "",
    motivo: "",
  });

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const obtenerIdDesdeToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (err) {
      console.error("Error al decodificar token:", err);
      return null;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    const { tipo, fecha_inicio, fecha_fin } = form;
    if (!tipo || !fecha_inicio || !fecha_fin) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    if (fin < inicio) {
      setError("⚠️ La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (inicio < hoy) {
      setError("⚠️ No puedes solicitar una ausencia que comience en el pasado.");
      return;
    }

    const idEmpleado = obtenerIdDesdeToken();
    if (!idEmpleado) {
      setError("❌ No se pudo obtener el ID del empleado. Inicia sesión nuevamente.");
      return;
    }

    try {
      const backUrl = API+"/rrhh/ausencias/";
      const payload: SolicitudAusencia = { ...form, id_empleado: idEmpleado, fecha_inicio: new Date(fecha_inicio).toISOString(), fecha_fin: new Date(fecha_fin).toISOString()};
      console.log("payload: ",payload);
      await axios.post(backUrl, payload);
      setMensaje("✅ Solicitud enviada correctamente.");
      setForm({id_empleado: idEmpleado, tipo: "", fecha_inicio: "", fecha_fin: "", motivo: "" });
    } catch (err) {
      if(err instanceof AxiosError){
        if(err.response?.data?.message){
          setError(`❌ ${err.response?.data?.message ?? `Error de red o servidor (status ${err.response?.status ?? "desconocido"})`}`);
        }
        else{
          setError("❌ Error al enviar la solicitud. Intenta nuevamente.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/rrhh/empleado")}
          className="px-3 py-1 rounded bg-[#23272b]! hover:bg-[#3a3f45]! active:scale-95 mb-4 text-[#c7cdd4]!"
        >
          ← Volver al panel empleado
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#23272b] p-8 rounded-lg shadow-lg w-full max-w-md text-[#c7cdd4]"
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#d5d9de]">
          Solicitar Ausencia
        </h2>

        <div className="h-6 mb-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {mensaje && <p className="text-green-500 text-sm">{mensaje}</p>}
        </div>

        <label className="block mb-3">
          Tipo de ausencia <span className="text-red-600">*</span>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="mt-1 w-full bg-[#1a1d21] border border-[#3a3f45] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7aeb6]"
          >
            <option value="">Seleccione...</option>
            {tiposAusencia.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-3">
          Fecha de inicio <span className="text-red-600">*</span>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            className="mt-1 w-full bg-[#1a1d21] border border-[#3a3f45] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7aeb6]"
          />
        </label>

        <label className="block mb-3">
          Fecha de fin <span className="text-red-600">*</span>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            className="mt-1 w-full bg-[#1a1d21] border border-[#3a3f45] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7aeb6]"
          />
        </label>

        <label className="block mb-6">
          Motivo (opcional)
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full bg-[#1a1d21] border border-[#3a3f45] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7aeb6]"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] font-semibold py-2 rounded-md hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95 transition-all duration-200"
        >
          Solicitar
        </button>
      </form>
    </div>
  );
};
