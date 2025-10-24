import { useState } from "react";

export const Login_rrhh = () =>{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) =>{
        e.preventDefault();
        console.log("enter o click");
        // fetch, confirma usuario valido
        // y se redirige a /rrhh/admin o a /rrhh/empleado dependiendo si contiene el rol admin o no
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
                    id="username"
                    type="text"
                    className="bg-[#27ae60] border border-[#1e8449] rounded-md p-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-[#2ecc71] w-full"
                    placeholder="ingrese nombre..."
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <input
                    id="password"
                    type="password"
                    className="bg-[#27ae60] border border-[#1e8449] rounded-md p-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-[#2ecc71] w-full"
                    placeholder="ingrese contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

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