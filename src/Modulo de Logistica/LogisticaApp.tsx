import React, { useEffect } from "react";
import type { JSX } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import ListarOrdenesPicking from "./pages/ListarOrdenesPicking";
import ListarGuiasDespacho from "./pages/ListarGuiasDespacho";
import ListarPedidosVentas from "./pages/ListarPedidosVentas";
import ListarOrdenesCompra from "./pages/ListarOrdenesCompra";
import ProcesarPedidoAutomatico from "./pages/ProcesarPedidoAutomatico";
import "./App.css";
import { useAuth } from "../utils/AuthContext";
import { ROLES } from "../utils/Permissions";

export default function LogisticaApp(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  const location = useLocation();

  useEffect(() => {
    // Redirect based on role only when we're exactly on the module root
    // so direct visits to subroutes (e.g. /logistica/listar-ordenes-compra)
    // are not overridden.
    if (!user) return;
    const atModuleRoot =
      location.pathname === "/logistica" || location.pathname === "/logistica/";
    if (!atModuleRoot) return;

    if (user.rol === ROLES.EMPLEADO_LOGISTICA) {
      navigate("/logistica/listar-picking", { replace: true });
    } else if (user.rol === ROLES.TRANSPORTISTA) {
      navigate("/logistica/listar-guias", { replace: true });
    }
  }, [user, navigate, location]);

  const RouteGuard = ({
    element,
    allowedRoles,
  }: {
    element: JSX.Element;
    allowedRoles?: string[];
  }) => {
    if (!user) return <Navigate to="/auth" replace />;
    if (!allowedRoles || allowedRoles.includes(user.rol)) return element;
    // Redirect to the role-appropriate default inside logística
    if (user.rol === ROLES.EMPLEADO_LOGISTICA)
      return <Navigate to="/logistica/listar-picking" replace />;
    if (user.rol === ROLES.TRANSPORTISTA)
      return <Navigate to="/logistica/listar-guias" replace />;
    return <Navigate to="/logistica" replace />;
  };

  const buttonStyle = {
    color: "white",
    textDecoration: "none",
    padding: "10px 20px",
    background: "#333333",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  } as const;

  return (
    <div className="logistica-root">
      <nav
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "20px",
          marginBottom: "0",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderBottom: "3px solid #000000ff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              color: "#000000ff",
              margin: 0,
              fontSize: "26px",
              fontWeight: "700",
              marginRight: "16px",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            🚚 ERP Logística
          </h1>

          {/* JEFE: Ver Pedidos; JEFE+EMPLEADO_LOGISTICA: Ver OC */}
          {(!user || user.rol === ROLES.JEFE_LOGISTICA) && (
            <Link to="/logistica/listar-pedidos-ventas" style={buttonStyle}>
              🔍 Ver Pedidos
            </Link>
          )}
          {(!user ||
            user.rol === ROLES.JEFE_LOGISTICA ||
            user.rol === ROLES.EMPLEADO_LOGISTICA) && (
            <Link to="/logistica/listar-ordenes-compra" style={buttonStyle}>
              📦 Ver OC
            </Link>
          )}

          {/* Conditional separators based on visible buttons per role
              - JEFE_LOGISTICA: show both separators
              - EMPLEADO_LOGISTICA: show single separator between OC and OT
              - TRANSPORTISTA: show none */}
          {(() => {
            const canViewPedidos = !user || user.rol === ROLES.JEFE_LOGISTICA;
            const canViewOC =
              !user ||
              user.rol === ROLES.JEFE_LOGISTICA ||
              user.rol === ROLES.EMPLEADO_LOGISTICA;
            const canViewProcesar = !user || user.rol === ROLES.JEFE_LOGISTICA;
            const canViewOT =
              !user ||
              user.rol === ROLES.JEFE_LOGISTICA ||
              user.rol === ROLES.EMPLEADO_LOGISTICA;

            const Separator = () => (
              <div
                style={{
                  width: "2px",
                  height: "24px",
                  background: "rgba(0, 0, 0, 0.3)",
                  margin: "0 4px",
                }}
              ></div>
            );

            if (canViewProcesar) {
              // Show separator between OC and Procesar only if OC visible
              return (
                <>
                  {canViewOC && <Separator />}
                  <Link to="/logistica/procesar-automatico" style={buttonStyle}>
                    🤖 Procesar
                  </Link>
                  {canViewOT && <Separator />}
                </>
              );
            }

            // Procesar hidden: if OC and OT visible show a single separator between them
            if (canViewOC && canViewOT) {
              return <Separator />;
            }

            return null;
          })()}

          {(!user ||
            user.rol === ROLES.JEFE_LOGISTICA ||
            user.rol === ROLES.EMPLEADO_LOGISTICA) && (
            <Link to="/logistica/listar-picking" style={buttonStyle}>
              📊 Listar OT
            </Link>
          )}
          {(!user ||
            user.rol === ROLES.JEFE_LOGISTICA ||
            user.rol === ROLES.TRANSPORTISTA) && (
            <Link to="/logistica/listar-guias" style={buttonStyle}>
              📋 Listar Guías
            </Link>
          )}
        </div>
      </nav>

      <div style={{ padding: "32px 20px" }}>
        <Routes>
          <Route
            index
            element={
              <RouteGuard
                allowedRoles={[ROLES.JEFE_LOGISTICA, ROLES.EMPLEADO_LOGISTICA]}
                element={<ListarOrdenesPicking />}
              />
            }
          />
          <Route
            path="listar-pedidos-ventas"
            element={
              <RouteGuard
                allowedRoles={[ROLES.JEFE_LOGISTICA]}
                element={<ListarPedidosVentas />}
              />
            }
          />
          <Route
            path="listar-ordenes-compra"
            element={
              <RouteGuard
                allowedRoles={[ROLES.JEFE_LOGISTICA, ROLES.EMPLEADO_LOGISTICA]}
                element={<ListarOrdenesCompra />}
              />
            }
          />
          <Route
            path="procesar-automatico"
            element={
              <RouteGuard
                allowedRoles={[ROLES.JEFE_LOGISTICA]}
                element={<ProcesarPedidoAutomatico />}
              />
            }
          />
          <Route
            path="listar-picking"
            element={
              <RouteGuard
                allowedRoles={[ROLES.JEFE_LOGISTICA, ROLES.EMPLEADO_LOGISTICA]}
                element={<ListarOrdenesPicking />}
              />
            }
          />
          <Route
            path="listar-guias"
            element={
              <RouteGuard
                allowedRoles={[ROLES.JEFE_LOGISTICA, ROLES.TRANSPORTISTA]}
                element={<ListarGuiasDespacho />}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}
