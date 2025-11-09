import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] text-[#c7cdd4] px-6">
      <div className="w-full max-w-md text-center rounded-2xl border border-[#3a3f45] bg-gradient-to-b from-[#2b3036] to-[#1e2328] p-10 shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#ff5c5c]/10 p-4 ring-1 ring-[#ff5c5c]/25">
            <span className="text-5xl">🚫</span>
          </div>
        </div>

        <h1 className="mb-3 text-4xl font-extrabold text-[#a34747] tracking-tight">
          Acceso denegado
        </h1>

        <p className="mb-8 leading-relaxed text-[#c7cdd4]/80">
          No tienes permisos suficientes para acceder a esta sección.
          Si crees que esto es un error, contacta con el administrador del sistema.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg px-6 py-3 font-medium text-[#c7cdd4] bg-[#2b3036] hover:bg-[#3a3f45] border border-[#3a3f45] transition-all duration-200"
          >
            ← Volver
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg px-6 py-3 font-medium text-[#1e2328] bg-gradient-to-b from-[#c7ccd2] to-[#a7aeb6] hover:from-[#d4d9de] hover:to-[#b3b9c0] transition-all duration-200"
          >
            Ir al inicio
          </button>
        </div>

        <p className="mt-8 text-sm text-[#c7cdd4]/70">
          Código de error: <span className="font-semibold text-[#c7cdd4]">403</span>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
