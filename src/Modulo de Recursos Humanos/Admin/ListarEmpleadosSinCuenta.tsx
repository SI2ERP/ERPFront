import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Departamento {
  nombre: string;
}

interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
  estado: string;
  departamento: Departamento;
}

export const ListarEmpleadosSinCuenta: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpleadosSinCuenta = async () => {
      try {
        const res = await axios.get("http://localhost:3000/rrhh/empleados/sin-cuenta/");
        setEmpleados(res.data);
      } catch (error) {
        console.error("Error al obtener empleados sin cuenta:", error);
        setErrorConexion(true);
      } finally {
        setLoading(false);
      }
    };
    obtenerEmpleadosSinCuenta();
  }, []);

  const manejarCrearCuenta = async (empleado: Empleado) => {
    const nombreCompleto = empleado.nombre+" "+empleado.apellido;


    const confirmacion = await Swal.fire({
      title: "¿Crear cuenta para "+nombreCompleto+"?",
      text: "Esta acción generará una cuenta de usuario para este empleado.",
      icon: "warning",
      background: "#1a1d21",
      color: "#d5d9de",
      showCancelButton: true,
      confirmButtonColor: "#a7aeb6",
      cancelButtonColor: "#3a3f45",
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    });

 if (confirmacion.isConfirmed) {
      try {
        const registerPayload = {
            rut: empleado.rut,
            email: empleado.email,
            password: "123456"//xd
        }
        const res = await axios.post(`http://localhost:3000/auth/register`,registerPayload);
        if(res.status === 201){
            setEmpleados(prev => prev.filter(e => e.id_empleado !== empleado.id_empleado));
            await Swal.fire({
              title: "✅ Cuenta creada correctamente",
              text: `Se generó la cuenta para ${nombreCompleto}.`,
              background: "#1a1d21",
              color: "#d5d9de",
              confirmButtonColor: "#a7aeb6",
            });
        }
        
      } catch (error) {
        console.error("Error al crear cuenta:", error);
        Swal.fire({
          title: "❌ Error al crear la cuenta",
          text: "No se pudo completar la operación. Intenta nuevamente.",
          background: "#1a1d21",
          color: "#d5d9de",
          confirmButtonColor: "#a7aeb6",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1115]">
        <p className="text-[#c7cdd4] text-lg animate-pulse">
          Cargando empleados sin cuenta...
        </p>
      </div>
    );
  }

  if (errorConexion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          ❌ Error de conexión
        </h2>
        <p className="text-[#c7cdd4] mb-4">
          No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté activo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#a7aeb6] hover:bg-[#d5d9de] text-[#0f1115] px-4 py-2 rounded font-semibold transition duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#0f1115]">
        <h2 className="text-2xl font-semibold text-[#d5d9de] mb-2">
          😕 No hay empleados sin cuenta
        </h2>
        <p className="text-[#a7aeb6]">
          Todos los empleados ya tienen una cuenta de usuario registrada.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0f1115] min-h-screen text-[#c7cdd4]">
      <h2 className="text-3xl font-semibold mb-6 text-[#d5d9de]">
        Empleados sin cuenta de usuario
      </h2>

      <button
        onClick={() => navigate("/rrhh/admin")}
        className="px-3 py-1 rounded text-[#d5d9de] border border-[#3a3f45] hover:bg-[#2b3036] active:scale-95 mb-4"
      >
        ← Volver al panel admin
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#3a3f45] bg-[#2b3036] shadow-lg rounded-md">
          <thead className="bg-[#353a40] text-[#d5d9de]">
            <tr>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Nombre
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Departamento
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-left font-medium">
                Estado
              </th>
              <th className="border-b border-[#3a3f45] p-3 text-center font-medium">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, index) => (
              <tr
                key={emp.id_empleado}
                className={`${
                  index % 2 === 0 ? "bg-[#1a1d21]" : "bg-[#23272b]"
                } hover:bg-[#2e3237] transition-colors duration-200`}
              >
                <td className="border-b border-[#3a3f45] p-3">
                  {emp.nombre} {emp.apellido}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                  {emp.departamento?.nombre || "Sin asignar"}
                </td>
                <td className="border-b border-[#3a3f45] p-3">
                    {emp.estado}
                </td>

                <td className="border-b border-[#3a3f45] p-3 text-center">
                  <button
                    onClick={() => manejarCrearCuenta(emp)}
                    className="px-4 py-2 rounded-md font-semibold transition duration-200 bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6] text-[#0f1115] hover:from-[#d5d9de] hover:to-[#b3bbc3] active:scale-95"
                  >
                    Crear Cuenta
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
