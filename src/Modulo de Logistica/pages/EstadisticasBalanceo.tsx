import React, { useState, useEffect } from "react";
import { automatizacionService } from "../services/automatizacionService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import Card from "../components/common/Card";

interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rol: string;
  ot_pendientes: number;
}

interface Transportista {
  id_transportista: number;
  nombre: string;
  entregas_activas: number;
}

const EstadisticasBalanceo: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await automatizacionService.obtenerEstadisticas();

      if (response.success) {
        setEmpleados(response.data.empleados);
        setTransportistas(response.data.transportistas);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorCarga = (carga: number) => {
    if (carga === 0) return "#10b981";
    if (carga <= 2) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div className="list-container">
        <LoadingSpinner message="Cargando estadísticas..." size="large" />
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>📊 Estadísticas de Balanceo de Carga</h1>
        <button onClick={cargarEstadisticas} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      <div className="info-box" style={{ marginBottom: "30px" }}>
        <strong>ℹ️ Balanceo Automático:</strong> El sistema asigna nuevos
        pedidos al empleado y transportista con menor carga de trabajo para
        distribuir equitativamente.
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px", color: "#667eea" }}>
          👷 Empleados ({empleados.length})
        </h2>

        {empleados.length === 0 ? (
          <EmptyState
            icon="👷"
            title="No hay empleados disponibles"
            description="No se encontraron empleados en el sistema"
          />
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {empleados.map((emp) => (
              <Card
                key={emp.id_empleado}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "5px" }}>
                    {emp.nombre} {emp.apellido}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#718096" }}>
                    Rol: {emp.rol}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      background: getColorCarga(emp.ot_pendientes),
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      minWidth: "80px",
                    }}
                  >
                    {emp.ot_pendientes}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#718096",
                      marginTop: "5px",
                    }}
                  >
                    OT Pendientes
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ marginBottom: "20px", color: "#667eea" }}>
          🚚 Transportistas ({transportistas.length})
        </h2>

        {transportistas.length === 0 ? (
          <EmptyState
            icon="🚚"
            title="No hay transportistas disponibles"
            description="No se encontraron transportistas en el sistema"
          />
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {transportistas.map((trans) => (
              <Card
                key={trans.id_transportista}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "5px" }}>{trans.nombre}</h3>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      background: getColorCarga(trans.entregas_activas),
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      minWidth: "80px",
                    }}
                  >
                    {trans.entregas_activas}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#718096",
                      marginTop: "5px",
                    }}
                  >
                    Entregas Activas
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadisticasBalanceo;
