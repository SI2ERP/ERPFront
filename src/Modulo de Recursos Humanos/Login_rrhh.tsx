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
                if (empleadoData.rol === "Administrador") {
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="px-6 bg-[#1a8a5b] w-full max-w-sm py-16 rounded-md shadow-md">
                <div>
                <h1 className="mb-16 text-white font-bold text-4xl sm:text-3xl">
                    Modulo RRHH
                </h1>
                </div>

                <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <input
                    id="correo"
                    type="text"
                    className="bg-[#27ae60] border border-[#1e8449] rounded-md p-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-[#2ecc71] w-full"
                    placeholder="ingrese correo..."
                    onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <input
                    id="password"
                    type="password"
                    className="bg-[#27ae60] border border-[#1e8449] rounded-md p-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-[#2ecc71] w-full"
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
                    className="py-3 px-20 text-[#1a8a5b] border border-[#1a8a5b] rounded-md hover:bg-[#166e47] active:scale-95 font-semibold transition-colors duration-200"
                    >
                    Log in
                    </button>
                </div>
                </form>
            </div>
        </div>  
    );
} 