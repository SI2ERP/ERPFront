import { useState } from "react";

export const Login_rrhh = () =>{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) =>{
        e.preventDefault();
        
        // fetch, confirma usuario valido
        // y se redirige a /rrhh/admin o a /rrhh/empleado dependiendo si contiene el rol admin o no
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="px-4 bg-[#21be82] w-full py-16 rounded-md">
                <div>
                    <h1 className="mb-16 text-[#444444] text-2xl font-bold">
                        Modulo RRHH
                    </h1>
                </div>

                <form onSubmit={handleLogin}> 
                    <div className="mb-2">
                        <input 
                        id="username"
                        type="text" 
                        className="bg-[#009c5b] hover:bg-[#00d47c] rounded-sm p-2 text-gray-200" 
                        placeholder="ingrese nombre..." 
                        onChange={(e) =>{setUsername(e.target.value)}}
                        />
                    </div>

                    <div>
                        <input 
                        id="password"
                        type="password" 
                        className="bg-[#009c5b] hover:bg-[#00d47c] rounded-sm p-2 text-gray-200" 
                        placeholder="ingrese contraseña" 
                        onChange={(e) =>{setPassword(e.target.value)}}
                        />
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                        type="submit"
                        className="py-2 px-16 bg-[#f9f9f9]"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 