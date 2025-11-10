import { useState } from "react";
import "./Login.css";

const Login = () => {
    const [rut, setRut] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const onHandleLogin = async () => {
        alert("LOGIN");
        /*  try {
            const response = await axios.post('/auth/login', {
                email,
                password
            })
        } catch(err) {
            console.error(err);
        } */
    }

    const onHandleRegister = async () => {
        alert("REGISTRO");
        /* try {
            const response = await axios.post('/auth/register', {
                rut,
                email,
                password
            })
        } catch(err) {
            console.error(err);
        } */
    }

    return(
        <div className={"authContainer"}>
            {isLogin ? (
                <div className={"loginForm"}>
                    <h1>Iniciar Sesión</h1>
                    <form onSubmit={onHandleLogin}>
                        <div className="formGroup">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="password">Contraseña:</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>
            ) : (
                <div className={"registerForm"}>
                    <h1>Registrarse</h1>
                    <form onSubmit={onHandleRegister}>
                        <div className="formGroup">
                            <label htmlFor="rut">RUT:</label>
                            <input type="text" id="rut" />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="password">Contraseña:</label>
                            <input type="password" id="password" />
                        </div>
                        <button type="submit">Registrarse</button>
                    </form>
                </div>
            )}
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Registrese" : "¿Ya tiene cuenta? Inicie Sesión"}
            </button>
        </div>
    )
}

export default Login;