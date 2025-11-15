import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const AUTH_BACKEND_URL = import.meta.env.VITE_URL_BACKEND_AUTH;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const onHandleLogin = async () => {
    try {
      const response = await axios.post(`${AUTH_BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.access_token;
      const user = response.data.empleado;

      login(
        {
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol || "EMPLEADO",
          email: user.email,
          id_empleado: user.id, // El backend devuelve 'id' no 'id_empleado'
        },
        token
      );
    } catch (err) {
      console.error("Error de login:", err);
      alert("Credenciales inválidas o error del servidor");
    }
  };

  const onHandleRegister = async () => {
    try {
      console.log("Datos enviados:", { rut, email, password });
      console.log("URL:", `${AUTH_BACKEND_URL}/auth/register`);
      
      const response = await axios.post(`${AUTH_BACKEND_URL}/auth/register`, {
        rut,
        email,
        password,
      });

      console.log("Respuesta del servidor:", response.data);

      if (response.data?.message) {
        alert(response.data.message);
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setRut("");
      }
    } catch (err: any) {
      console.error("Error completo:", err);
      console.error("Respuesta del servidor:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Headers:", err.response?.headers);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Error en el registro, intente nuevamente";
      alert(errorMessage);
    }
  };

  return (
    <div className="authContainer">
      {isLogin ? (
        <div className="loginForm">
          <h1>Iniciar Sesión</h1>
          <div className="formGroup">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={onHandleLogin}>Iniciar Sesión</button>
        </div>
      ) : (
        <div className="registerForm">
          <h1>Registrarse</h1>
          <div className="formGroup">
            <label>RUT:</label>
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={onHandleRegister}>Registrarse</button>
        </div>
      )}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  );
};

export default Login;