import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 px-6">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        
        {/* Icono principal */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <span className="text-5xl">🚫</span>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-red-600 mb-3">
          Acceso denegado
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          No tienes permisos suficientes para acceder a esta sección.
          Si crees que esto es un error, contacta con el administrador del sistema.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 !bg-gray-500 text-white font-medium rounded-lg hover:!bg-gray-600 transition-all duration-200"
          >
            ← Volver
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 !bg-blue-600 text-white font-medium rounded-lg hover:!bg-blue-700 transition-all duration-200"
          >
            Ir al inicio
          </button>
        </div>

        {/* Pie de página */}
        <p className="text-sm text-gray-400 mt-8">
          Código de error: <span className="font-semibold text-gray-500">403</span>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
