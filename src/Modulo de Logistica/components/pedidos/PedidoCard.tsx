import React from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import type { PedidoVenta } from "../../types";

interface PedidoCardProps {
  pedido: PedidoVenta;
  onAction?: (pedido: PedidoVenta) => void;
  actionLabel?: string;
  actionDisabled?: boolean;
  showDetails?: boolean;
}

const PedidoCard: React.FC<PedidoCardProps> = ({
  pedido,
  onAction,
  actionLabel = "Seleccionar",
  actionDisabled = false,
  showDetails = true,
}) => {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        border: "2px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.2s",
        cursor: onAction ? "pointer" : "default",
      }}
      onMouseOver={(e) =>
        onAction && (e.currentTarget.style.borderColor = "#667eea")
      }
      onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <h3
            style={{
              color: "#667eea",
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {pedido.numero_pedido}
          </h3>
          <Badge
            variant={
              pedido.estado === "PENDIENTE"
                ? "pendiente"
                : pedido.estado === "PROCESADO"
                ? "completado"
                : "enviado"
            }
            size="small"
          >
            {pedido.estado}
          </Badge>
        </div>

        <div style={{ display: "grid", gap: "6px" }}>
          <p style={{ margin: 0, color: "#2d3748" }}>
            <strong>👤 Cliente:</strong> {pedido.cliente}
          </p>

          {showDetails && (
            <>
              <p style={{ margin: 0, color: "#4a5568" }}>
                <strong>📍 Dirección:</strong>{" "}
                {pedido.direccion_despacho || "No especificada"}
              </p>
              <p style={{ margin: 0, color: "#718096", fontSize: "14px" }}>
                <strong>📅 Fecha:</strong>{" "}
                {new Date(pedido.fecha_pedido).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </>
          )}
        </div>
      </div>

      {onAction && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={(e: any) => {
              e.stopPropagation();
              onAction(pedido);
            }}
            disabled={actionDisabled}
            size="medium"
            fullWidth={false}
            style={{ minWidth: "150px" }}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PedidoCard;
