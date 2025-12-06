import React, { useState, useEffect } from "react";
import integracionService from "../services/integracionService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import AlertMessage from "../components/common/AlertMessage";
import Badge from "../components/common/Badge";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import SelectField from "../components/common/SelectField";
import StatsCard from "../components/common/StatsCard";
import InfoBox from "../components/common/InfoBox";
import type { PedidoVenta } from "../types";

export default function ListarPedidosVentas() {
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenamiento, setOrdenamiento] = useState<
    "fecha_desc" | "fecha_asc" | "numero_desc" | "numero_asc"
  >("fecha_desc");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integracionService.listarPedidosVentas();
      if (response?.success && response.data) setPedidos(response.data);
      else setError("No se pudieron cargar los pedidos");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al cargar pedidos de ventas"
      );
    } finally {
      setLoading(false);
    }
  };

  const contarPorEstado = (estado: string) =>
    pedidos.filter((p) => p.estado === estado).length;

  const pedidosFiltrados = React.useMemo(() => {
    let resultado = [...pedidos];

    if (busqueda.trim()) {
      const lower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.numero_pedido.toLowerCase().includes(lower) ||
          p.cliente.toLowerCase().includes(lower) ||
          p.direccion_despacho?.toLowerCase().includes(lower)
      );
    }

    if (filtroEstado !== "TODOS")
      resultado = resultado.filter((p) => p.estado === filtroEstado);

    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case "fecha_desc":
          return (
            new Date(b.fecha_pedido).getTime() -
            new Date(a.fecha_pedido).getTime()
          );
        case "fecha_asc":
          return (
            new Date(a.fecha_pedido).getTime() -
            new Date(b.fecha_pedido).getTime()
          );
        case "numero_desc":
          return b.numero_pedido.localeCompare(a.numero_pedido);
        case "numero_asc":
          return a.numero_pedido.localeCompare(b.numero_pedido);
        default:
          return 0;
      }
    });

    return resultado;
  }, [pedidos, busqueda, filtroEstado, ordenamiento]);

  const getEstadoVariant = (
    estado: string
  ): "pendiente" | "completado" | "cancelado" => {
    if (estado === "PENDIENTE") return "pendiente";
    if (estado === "PROCESADO") return "completado";
    return "cancelado";
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("TODOS");
    setOrdenamiento("fecha_desc");
  };

  if (loading)
    return (
      <div className="list-container">
        <LoadingSpinner message="Cargando pedidos de ventas..." size="large" />
      </div>
    );

  if (error) {
    return (
      <div className="list-container">
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
        <EmptyState
          icon="❌"
          title="Error al cargar pedidos"
          description={error}
          actionLabel="🔄 Reintentar"
          onAction={cargarPedidos}
        />
      </div>
    );
  }

  return (
    <div className="list-container">
      <PageHeader
        title="Pedidos Recibidos desde Ventas"
        subtitle={`${pedidos.length} pedidos integrados`}
        icon="📥"
        actions={
          <Button onClick={cargarPedidos} icon="🔄" variant="secondary">
            Actualizar
          </Button>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatsCard
          title="Pendientes"
          value={contarPorEstado("PENDIENTE")}
          icon="⏳"
          color="yellow"
          subtitle="Por procesar"
        />
        <StatsCard
          title="Procesados"
          value={contarPorEstado("PROCESADO")}
          icon="✅"
          color="green"
          subtitle="Con OT asignada"
        />
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "2px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            placeholder="N° pedido, cliente, dirección..."
          />
          <SelectField
            label=""
            name="estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: "TODOS", label: `📋 Todos (${pedidos.length})` },
              {
                value: "PENDIENTE",
                label: `⏳ Pendientes (${contarPorEstado("PENDIENTE")})`,
              },
              {
                value: "PROCESADO",
                label: `✅ Procesados (${contarPorEstado("PROCESADO")})`,
              },
            ]}
          />
          <SelectField
            label=""
            name="orden"
            value={ordenamiento}
            onChange={(v) => setOrdenamiento(v as typeof ordenamiento)}
            options={[
              { value: "fecha_desc", label: "📅 Fecha: Reciente" },
              { value: "fecha_asc", label: "📅 Fecha: Antiguo" },
              { value: "numero_desc", label: "🔢 N° Pedido: Z-A" },
              { value: "numero_asc", label: "🔢 N° Pedido: A-Z" },
            ]}
          />
        </div>
        {(busqueda ||
          filtroEstado !== "TODOS" ||
          ordenamiento !== "fecha_desc") && (
          <Button
            onClick={limpiarFiltros}
            variant="ghost"
            size="small"
            icon="🗑️"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No hay pedidos"
          description="No se encontraron pedidos con los filtros aplicados"
          actionLabel="🗑️ Limpiar filtros"
          onAction={limpiarFiltros}
        />
      ) : (
        <>
          <p style={{ color: "#64748b", marginBottom: "16px" }}>
            📈 Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </p>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    N° Pedido
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Cliente
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Fecha
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Dirección
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Estado
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Recepción
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido) => (
                  <tr
                    key={pedido.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontWeight: "600",
                        color: "#667eea",
                      }}
                    >
                      {pedido.numero_pedido}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#334155",
                        fontWeight: "500",
                      }}
                    >
                      {pedido.cliente}
                    </td>
                    <td style={{ padding: "16px", color: "#334155" }}>
                      {new Date(pedido.fecha_pedido).toLocaleDateString(
                        "es-CL"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#4a5568",
                        maxWidth: "250px",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "13px",
                        }}
                      >
                        📍 {pedido.direccion_despacho}
                      </div>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <Badge variant={getEstadoVariant(pedido.estado)}>
                        {pedido.estado}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      {new Date(pedido.fecha_recepcion).toLocaleDateString(
                        "es-CL"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox title="Información" variant="tip">
            <strong>Pedidos Pendientes:</strong> Esperan ser procesados en una
            OT de Picking
            <br />
            <strong>Dirección de Despacho:</strong> Viene automáticamente del
            pedido original
            <br />
            <strong>Procesados:</strong> Ya tienen una OT asociada
            <br />
            Los pedidos llegan automáticamente desde el ERP de Ventas
          </InfoBox>
        </>
      )}
    </div>
  );
}
