import React, { useState, useEffect } from "react";
import { integracionService } from "../services/integracionService";
import { automatizacionService } from "../services/automatizacionService";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import PedidoCard from "../components/pedidos/PedidoCard";
import ResultadoProcesamiento from "../components/pedidos/ResultadoProcesamiento";
import type { PedidoVenta } from "../types";

const ProcesarPedidoAutomatico: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);
  const [resultado, setResultado] = useState<any | null>(null);

  useEffect(() => {
    cargarPedidosPendientes();
  }, []);

  const cargarPedidosPendientes = async () => {
    try {
      const response = await integracionService.listarPedidosVentas();

      if (response.success && response.data) {
        // Filtrar solo pedidos pendientes
        const pendientes = response.data.filter(
          (p: PedidoVenta) => p.estado === "PENDIENTE"
        );
        setPedidos(pendientes);
      }
    } catch (error: any) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const procesarPedido = async (idVenta: number) => {
    try {
      setLoading(true);
      setMensaje(null);
      setResultado(null);

      console.log("🤖 Procesando pedido automáticamente...", idVenta);

      const response = await automatizacionService.procesarPedido({
        id_venta: idVenta,
      });

      if (response.success) {
        setMensaje({
          tipo: "success",
          texto: "¡Pedido procesado automáticamente!",
        });
        setResultado(response.data);

        // Recargar lista de pedidos
        setTimeout(() => {
          cargarPedidosPendientes();
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error al procesar pedido:", error);
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Error al procesar el pedido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>🤖 Procesamiento Automático de Pedidos</h1>
        <p style={{ marginTop: "10px", color: "#667eea" }}>
          Sistema automatizado de asignación y despacho
        </p>
      </div>

      {/* Mensajes */}
      {mensaje && (
        <AlertMessage
          type={mensaje.tipo}
          message={mensaje.texto}
          onClose={() => setMensaje(null)}
        />
      )}

      {/* Resultado del procesamiento */}
      {resultado && (
        <ResultadoProcesamiento
          resultado={resultado}
          onClose={() => setResultado(null)}
        />
      )}

      {/* Información del sistema */}
      <div className="info-box" style={{ marginBottom: "20px" }}>
        <h3>🔄 Flujo Automático</h3>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>Selecciona un pedido pendiente</li>
          <li>
            Sistema asigna empleado con <strong>balanceo de carga</strong>
          </li>
          <li>Crea Orden de Trabajo automáticamente</li>
          <li>
            Asigna transportista con <strong>balanceo de carga</strong>
          </li>
          <li>Crea Guía de Despacho automáticamente</li>
          <li>⚠️ Notificar a módulo de Ventas (manual por ahora)</li>
        </ol>
      </div>

      {/* Lista de pedidos pendientes */}
      <div>
        <h2 style={{ marginBottom: "15px" }}>
          📋 Pedidos Pendientes ({pedidos.length})
        </h2>

        {pedidos.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No hay pedidos pendientes"
            description="Todos los pedidos han sido procesados"
            actionLabel="🔄 Recargar"
            onAction={cargarPedidosPendientes}
          />
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                onAction={() => procesarPedido(pedido.id)}
                actionLabel={loading ? "⏳ Procesando..." : "🤖 Procesar"}
                actionDisabled={loading}
                showDetails={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcesarPedidoAutomatico;
