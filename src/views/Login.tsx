import { useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";

type Empleado = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  roles: string[];
  id_departamento: number;
};

export default function Login() {
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState(false);

  const API = import.meta.env.VITE_API_RRHH_URL || "http://localhost:3004";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = `${API}/auth/login`;
      const bodyJson = { email: correo, password: pass };
      
      const res = await axios.post(url, bodyJson);

      if (res.status === 201) {
        const empleado: Empleado = res.data.empleado;
        const token = res.data.access_token;

        setLoginError(false);

        // Integración con AuthContext del ERP
        login(
          {
            id: empleado.id,
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            email: empleado.email,
            rol: empleado.rol,
            id_departamento: empleado.id_departamento,
          },
          token
        );

        // AuthContext ya hace navigate("/")
      } else {
        setLoginError(true);
      }
    } catch (error: any) {
      setLoginError(true);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] ">
      <div className="px-6 bg-linear-to-tr from-[#2b3036] to-[#1e2328] w-full max-w-sm py-16 rounded-md shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#d5d9de]">
            Iniciar Sesión
          </h1>
          <p className="mt-1 text-sm text-[#c7cdd4] mb-3">
            Ingresa tus credenciales para continuar.
          </p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full rounded-xl border border-[#3a3f45]
                         bg-linear-to-b from-[#2e3237] to-[#23272b]
                         px-3.5 py-3 text-[15px] text-[#E6E8EB]
                         placeholder-[#9aa2ab]"
              placeholder="Correo"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              className="w-full rounded-xl border border-[#3a3f45]
                         bg-linear-to-b from-[#2e3237] to-[#23272b]
                         px-3.5 py-3 text-[15px] text-[#E6E8EB]
                         placeholder-[#9aa2ab]"
              placeholder="Contraseña"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {loginError && (
            <p className="text-red-700 bg-red-200 p-2 rounded mt-2 mb-6">
              Credenciales incorrectas. Intente de nuevo.
            </p>
          )}

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="w-full py-3 px-5 font-semibold rounded-xl
                         bg-linear-to-tr from-[#c7ccd2] to-[#a7aeb6]
                         text-[#0f1115] border border-gray-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
