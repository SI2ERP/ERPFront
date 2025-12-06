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
import type { OrdenCompra } from "../types";
import { useAuth } from "../../utils/AuthContext";

export default function ListarOrdenesCompra() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenamiento, setOrdenamiento] = useState<
    "fecha_desc" | "fecha_asc" | "numero_desc" | "numero_asc"
  >("fecha_desc");

  const { user } = useAuth();

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integracionService.listarOrdenesCompra();
      if (response?.success && response.data)
        setOrdenes(
          response.data.map((o: any) => ({
            ...o,
            estado: o.estado ? String(o.estado).toUpperCase().trim() : o.estado,
          }))
        );
      else setError("No se pudieron cargar las órdenes de compra");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al cargar órdenes de compra"
      );
    } finally {
      setLoading(false);
    }
  };

  const contarPorEstado = (estado: string) =>
    ordenes.filter((o) => o.estado === estado).length;

  const ordenesFiltradas = React.useMemo(() => {
    let resultado = [...ordenes];

    // // Show only OC pendientes (esperan recepcion) for EMPLEADO_LOGISTICA and JEFE_LOGISTICA
    // if (
    //   user &&
    //   (user.rol === ROLES.EMPLEADO_LOGISTICA ||
    //     user.rol === ROLES.JEFE_LOGISTICA)
    // ) {
    //   resultado = resultado.filter((o) => o.estado === "PENDIENTE");
    // }

    if (busqueda.trim()) {
      const lower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (o) =>
          o.numero_orden.toLowerCase().includes(lower) ||
          o.proveedor.toLowerCase().includes(lower) ||
          o.observaciones?.toLowerCase().includes(lower)
      );
    }

    if (filtroEstado !== "TODOS")
      resultado = resultado.filter((o) => o.estado === filtroEstado);

    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case "fecha_desc":
          return (
            new Date(b.fecha_orden).getTime() -
            new Date(a.fecha_orden).getTime()
          );
        case "fecha_asc":
          return (
            new Date(a.fecha_orden).getTime() -
            new Date(b.fecha_orden).getTime()
          );
        case "numero_desc":
          return b.numero_orden.localeCompare(a.numero_orden);
        case "numero_asc":
          return a.numero_orden.localeCompare(b.numero_orden);
        default:
          return 0;
      }
    });

    return resultado;
  }, [ordenes, busqueda, filtroEstado, ordenamiento]);

  const getEstadoVariant = (
    estado: string
  ): "pendiente" | "completado" | "cancelado" => {
    if (estado === "PENDIENTE") return "pendiente";
    if (estado === "RECEPCIONADA") return "completado";
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
        <LoadingSpinner message="Cargando órdenes de compra..." size="large" />
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
          title="Error al cargar órdenes"
          description={error}
          actionLabel="🔄 Reintentar"
          onAction={cargarOrdenes}
        />
      </div>
    );
  }

  return (
    <div className="list-container">
      <PageHeader
        title="Órdenes de Compra Recibidas"
        subtitle={`${ordenes.length} órdenes integradas`}
        icon="📦"
        actions={
          <Button onClick={cargarOrdenes} icon="🔄" variant="secondary">
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
          subtitle="Esperan recepción"
        />
        <StatsCard
          title="Recepcionadas"
          value={contarPorEstado("RECEPCIONADA")}
          icon="✅"
          color="green"
          subtitle="Ya ingresadas"
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
            placeholder="N° orden, proveedor, observaciones..."
          />
          <SelectField
            label=""
            name="estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: "TODOS", label: `📋 Todos (${ordenes.length})` },
              {
                value: "PENDIENTE",
                label: `⏳ Pendientes (${contarPorEstado("PENDIENTE")})`,
              },
              {
                value: "RECEPCIONADA",
                label: `✅ Recepcionadas (${contarPorEstado("RECEPCIONADA")})`,
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
              { value: "numero_desc", label: "🔢 N° Orden: Z-A" },
              { value: "numero_asc", label: "🔢 N° Orden: A-Z" },
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

      {ordenesFiltradas.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No hay órdenes"
          description="No se encontraron órdenes con los filtros aplicados"
          actionLabel="🗑️ Limpiar filtros"
          onAction={limpiarFiltros}
        />
      ) : (
        <>
          <p style={{ color: "#64748b", marginBottom: "16px" }}>
            📈 Mostrando {ordenesFiltradas.length} de {ordenes.length} órdenes
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
                    N° Orden
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Proveedor
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
                    Recibida
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map((orden) => (
                  <tr
                    key={orden.id}
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
                      {orden.numero_orden}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#334155",
                        fontWeight: "500",
                      }}
                    >
                      {orden.proveedor}
                    </td>
                    <td style={{ padding: "16px", color: "#334155" }}>
                      {new Date(orden.fecha_orden).toLocaleDateString("es-CL")}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <Badge variant={getEstadoVariant(orden.estado)}>
                        {orden.estado}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      {new Date(orden.fecha_recepcion).toLocaleDateString(
                        "es-CL"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#64748b",
                        fontSize: "13px",
                        maxWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {orden.observaciones || "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox title="Información" variant="tip">
            <strong>OC Pendientes:</strong> Esperan recepción de mercadería
            <br />
            <strong>Recepcionadas:</strong> La mercadería ya fue registrada en
            el sistema
            <br />
            <strong>Proceso:</strong> Registrar recepción → Confirmar ingreso a
            Inventario
            <br />
            Las órdenes llegan automáticamente desde el ERP de Compras
          </InfoBox>
        </>
      )}
    </div>
  );
}
