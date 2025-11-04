import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Empleado = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  roles: string[];
};

export const Login_rrhh = () =>{
    const [correo,setCorreo] = useState("");
    const [pass,setPass] = useState("");
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState<Empleado | null>(null);
    

    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault();
        console.log("enter o click");
        try {
            const url = "http://localhost:3000/auth/login";
            const bodyJson = {
                email: correo,
                password: pass
            }
            const res = await axios.post(url,bodyJson);
            if(res.status === 201){
                const empleadoData: Empleado = res.data.empleado;
                setEmpleado(empleadoData);
                setLoginError(false);
                localStorage.setItem("rol",empleadoData.rol);
                localStorage.setItem("token",res.data.access_token);

                if (empleadoData.rol === "ADMIN" || empleadoData.rol === "ADMIN_TI") {
                    console.log("admin");
                    navigate("/rrhh/admin/");
                } else {
                    console.log("empleado");
                    navigate("/rrhh/empleado/");
                }
            }
            else{
                console.warn("credenciales invalidas o error de conexion");
            }

        } catch (error : any) {
            if(error.response.status === 401){
                console.warn("credenciales invalidas");
                setLoginError(true);
            }
            else{
                console.error("ocurrio un error: ",error);
            }
            
        }
        // redirige a /rrhh/admin o a /rrhh/empleado dependiendo si contiene el rol admin o no
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1115] ">
            <div className="px-6 bg-gradient-to-tr from-[#2b3036] to-[#1e2328] w-full max-w-sm py-16 rounded-md shadow-2xl">
                <div>
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-[#d5d9de]">
                            Modulo RRHH
                        </h1>

                        <p className="mt-1 text-sm text-[#c7cdd4] mb-3">
                            Ingresa tus credenciales para continuar.
                        </p>
                    </header>
                </div>

                <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <input
                    id="correo"
                    type="text"
                    className="w-full rounded-xl border border-[#3a3f45]
                           bg-gradient-to-b from-[#2e3237] to-[#23272b]
                           px-3.5 py-3 text-[15px] text-[#E6E8EB]
                           placeholder-[#9aa2ab]
                           outline-none transition
                           hover:from-[#3a3f45] hover:to-[#2e3237]
                           focus:border-[#6a727a] focus:ring-2 focus:ring-[#c0c6cf]"
                    placeholder="ingrese correo..."
                    onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <input
                    id="password"
                    type="password"
                    className="w-full rounded-xl border border-[#3a3f45]
                           bg-gradient-to-b from-[#2e3237] to-[#23272b]
                           px-3.5 py-3 text-[15px] text-[#E6E8EB]
                           placeholder-[#9aa2ab]
                           outline-none transition
                           hover:from-[#3a3f45] hover:to-[#2e3237]
                           focus:border-[#6a727a] focus:ring-2 focus:ring-[#c0c6cf]"
                    placeholder="ingrese contraseña"
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
                                bg-gradient-to-tr from-[#c7ccd2] to-[#a7aeb6]
                                text-[#0f1115] border border-gray-500
                                hover:from-[#d5d9de] hover:to-[#b3bbc3]
                                transition-transform duration-200 active:scale-95"
                    >
                    Iniciar Sesión
                    </button>
                </div>
                </form>
            </div>
        </div>  
    );
} 