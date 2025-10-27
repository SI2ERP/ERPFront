import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-5xl font-bold text-red-500 mb-4">🚫 Acceso denegado</h1>
        <p className="text-gray-600 mb-8">
          Este contenido está protegido. No tienes permisos suficientes para acceder a esta sección.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 !bg-gray-500 text-white rounded-lg hover:!bg-gray-600 transition-colors duration-200"
          >
            ← Volver
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 !bg-blue-600 text-white rounded-lg hover:!bg-blue-700 transition-colors duration-200"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
