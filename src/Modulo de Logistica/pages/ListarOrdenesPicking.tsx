import React, { useState, useEffect } from "react";
import { pickingService } from "../services/pickingService";
import api from "../services/api";
import recursosService from "../services/recursosService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import AlertMessage from "../components/common/AlertMessage";
import Badge from "../components/common/Badge";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import SelectField from "../components/common/SelectField";
import StatsCard from "../components/common/StatsCard";
import type { OrdenPicking } from "../types";
import { useAuth } from "../../utils/AuthContext";
import { ROLES } from "../../utils/Permissions";

const ListarOrdenesPicking: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenPicking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenamiento, setOrdenamiento] = useState<
    "fecha_desc" | "fecha_asc" | "id_desc" | "id_asc"
  >("id_desc");
  const [editMode, setEditMode] = useState(false);
  const [rowChanges, setRowChanges] = useState<
    Record<number, Partial<OrdenPicking>>
  >({});
  const [empleadosLogistica, setEmpleadosLogistica] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const [quickEditRow, setQuickEditRow] = useState<number | null>(null);
  const [quickEditValue, setQuickEditValue] = useState<EstadoApi | "">("");
  const [quickSaving, setQuickSaving] = useState<Record<number, boolean>>({});
  const [tempEstados, setTempEstados] = useState<Record<number, EstadoApi>>({});

  const { user } = useAuth();

  const todayStr = React.useMemo(() => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffset).toISOString().split("T")[0];
  }, []);

  React.useEffect(() => {
    const styleId = "logistica-date-icon-style";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      /* WebKit browsers (Chrome, Edge, Safari) */
      .date-input-dark-icon::-webkit-calendar-picker-indicator {
        filter: none !important;
        opacity: 1 !important;
        /* try to force darker icon on white bg */
        -webkit-filter: grayscale(0) contrast(120%) brightness(40%) !important;
      }
      /* Some browsers use a system icon that respects color; this sets text color fallback */
      .date-input-dark-icon {
        color: #111827;
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    cargarOrdenes();
  }, [user]);

  useEffect(() => {
    if (editMode) {
      recursosService
        .listarEmpleados()
        .then((r) => {
          if (r && (r as any).data) {
            const list = (r as any).data.filter(
              (e: any) => e.rol === "EMPLEADO_LOGISTICA"
            );
            setEmpleadosLogistica(list);
          }
        })
        .catch(() => {});
    }
  }, [editMode]);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      let response: any = null;
      if (user && user.rol === ROLES.EMPLEADO_LOGISTICA) {
        response = await pickingService.getMine();
      } else {
        response = await pickingService.getAll();
      }
      if (response && response.success && response.data) {
        setOrdenes(response.data);
        setTempEstados({});
      } else setError("No se pudieron cargar las órdenes");
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  type EstadoApi = OrdenPicking["estado"];
  const contarPorEstado = (estado: EstadoApi) =>
    ordenes.filter((o) => o.estado === estado).length;

  const ordenesFiltradas = React.useMemo(() => {
    let resultado = [...ordenes];

    if (user && user.rol === ROLES.EMPLEADO_LOGISTICA) {
      resultado = resultado.filter((o) => o.id_empleado === user.id);
    }

    if (busqueda.trim()) {
      const lower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (o) =>
          o.id_ot.toString().includes(lower) ||
          o.id_empleado.toString().includes(lower) ||
          o.nombre_empleado?.toLowerCase().includes(lower) ||
          o.observaciones?.toLowerCase().includes(lower)
      );
    }

    if (filtroEstado !== "TODOS")
      resultado = resultado.filter((o) => o.estado === filtroEstado);

    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case "fecha_desc":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case "fecha_asc":
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case "id_desc":
          return b.id_ot - a.id_ot;
        case "id_asc":
          return a.id_ot - b.id_ot;
        default:
          return 0;
      }
    });

    return resultado;
  }, [ordenes, busqueda, filtroEstado, ordenamiento]);

  const getEstadoVariant = (
    estado: EstadoApi
  ): "pendiente" | "proceso" | "completado" | "cancelado" | "enviado" => {
    if (estado === "CREADA") return "pendiente";
    if (estado === "ASIGNADA") return "proceso";
    if (estado === "EN PICKING") return "enviado";
    if (estado === "COMPLETADA") return "completado";
    return "cancelado";
  };

  const getEstadoColor = (estado: EstadoApi | string) => {
    switch (estado) {
      case "CREADA":
        return "#f59e0b";
      case "ASIGNADA":
        return "#3b82f6";
      case "EN PICKING":
        return "#8b5cf6";
      case "COMPLETADA":
        return "#10b981";
      case "CANCELADA":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  const estadoLabel = (estado: EstadoApi | string) => {
    switch (estado) {
      case "CREADA":
        return "CREADA";
      case "ASIGNADA":
        return "ASIGNADA";
      case "EN PICKING":
        return "EN PICKING";
      case "COMPLETADA":
        return "COMPLETADA";
      case "CANCELADA":
        return "CANCELADA";
      default:
        return String(estado || "");
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("TODOS");
    setOrdenamiento("id_desc");
  };

  const allowedStatesForEmpleado: EstadoApi[] = [
    "CREADA",
    "ASIGNADA",
    "EN PICKING",
    "COMPLETADA",
  ];

  const startQuickEdit = (id: number, current: EstadoApi) => {
    setQuickEditRow(id);
    setQuickEditValue(current);
    setTempEstados((t) => ({ ...t, [id]: current }));
  };

  const cancelQuickEdit = () => {
    setQuickEditRow(null);
    setQuickEditValue("");
    setTempEstados((t) => {
      const copy = { ...t };
      if (quickEditRow !== null) delete copy[quickEditRow];
      return copy;
    });
  };

  const confirmQuickEdit = async (id: number) => {
    if (!quickEditValue) return;
    try {
      setQuickSaving((s) => ({ ...s, [id]: true }));
      const resp = await pickingService.update(id, { estado: quickEditValue });
      setOrdenes((prev) =>
        prev.map((o) => (o.id_ot === id ? { ...o, estado: quickEditValue } : o))
      );
      // clear quick edit UI
      setQuickEditRow(null);
      setQuickEditValue("");
      setTempEstados((t) => {
        const copy = { ...t };
        delete copy[id];
        return copy;
      });
    } catch (err: any) {
      setError(err.message || "Error al actualizar estado");
    } finally {
      setQuickSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const descargarPdfPicking = async (id_ot: number) => {
    try {
      const resp = await api.get(`/picking/${id_ot}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `OT-${id_ot}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Error al descargar PDF");
    }
  };

  if (loading)
    return (
      <div className="list-container">
        <LoadingSpinner message="Cargando órdenes..." size="large" />
      </div>
    );

  const hasChanges = Object.keys(rowChanges).length > 0;

  const onRowChange = (id_ot: number, changes: Partial<OrdenPicking>) => {
    setRowChanges((prev) => ({
      ...prev,
      [id_ot]: { ...prev[id_ot], ...changes },
    }));
  };

  const guardarCambios = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const ids = Object.keys(rowChanges).map(Number);

      const allowedByRole: Record<string, string[]> = {
        JEFE_LOGISTICA: ["fecha", "id_empleado", "estado", "observaciones"],
        EMPLEADO_LOGISTICA: ["fecha", "estado", "observaciones"],
      };
      const allowed = allowedByRole[(user && user.rol) || ""] || [];

      for (const id of ids) {
        const body: any = {};
        const changes = rowChanges[id];

        if (changes.fecha && allowed.includes("fecha"))
          body.fecha = changes.fecha;
        if ((changes as any).id_empleado && allowed.includes("id_empleado"))
          body.id_empleado = (changes as any).id_empleado;
        if (changes.estado !== undefined && allowed.includes("estado"))
          body.estado = changes.estado;
        if (
          changes.observaciones !== undefined &&
          allowed.includes("observaciones")
        )
          body.observaciones = changes.observaciones;

        const orden = ordenes.find((o) => o.id_ot === id);
        if (body.fecha) {
          if (new Date(body.fecha) < new Date(todayStr)) {
            throw new Error(
              `La fecha para OT #${id} no puede ser anterior a la fecha de hoy`
            );
          }
          if (orden?.fecha && new Date(body.fecha) < new Date(orden.fecha)) {
            throw new Error(
              `La fecha para OT #${id} no puede ser menor que la fecha registrada`
            );
          }
        }

        if (Object.keys(body).length > 0) {
          await pickingService.update(id, body);
        }
      }
      await cargarOrdenes();
      setRowChanges({});
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || "Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

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
        title="Órdenes de Trabajo de Picking"
        subtitle={`${ordenes.length} órdenes registradas`}
        icon="📊"
        actions={
          <>
            <Button onClick={cargarOrdenes} icon="🔄" variant="secondary">
              Actualizar
            </Button>
            <Button
              onClick={() => {
                setEditMode((v) => !v);
                if (editMode) setRowChanges({});
              }}
              variant={editMode ? "ghost" : "primary"}
            >
              {editMode ? "Cancelar" : "Editar"}
            </Button>
            {editMode && (
              <Button
                onClick={guardarCambios}
                disabled={!hasChanges || saving}
                icon="💾"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            )}
          </>
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
          title="Creadas"
          value={contarPorEstado("CREADA")}
          icon="🆕"
          color="yellow"
          subtitle="Sin asignar"
        />
        <StatsCard
          title="Asignadas"
          value={contarPorEstado("ASIGNADA")}
          icon="👷"
          color="blue"
          subtitle="Asignadas a operarios"
        />
        <StatsCard
          title="En Picking"
          value={contarPorEstado("EN PICKING")}
          icon="📦"
          color="purple"
          subtitle="En ejecución"
        />
        <StatsCard
          title="Completadas"
          value={contarPorEstado("COMPLETADA")}
          icon="✅"
          color="green"
          subtitle="Finalizadas"
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
            placeholder="ID, empleado, observaciones..."
          />
          <SelectField
            label=""
            name="estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: "TODOS", label: `📋 Todos (${ordenes.length})` },
              {
                value: "CREADA",
                label: `🆕 Creadas (${contarPorEstado("CREADA")})`,
              },
              {
                value: "ASIGNADA",
                label: `👷 Asignadas (${contarPorEstado("ASIGNADA")})`,
              },
              {
                value: "EN PICKING",
                label: `📦 En Picking (${contarPorEstado("EN PICKING")})`,
              },
              {
                value: "COMPLETADA",
                label: `✅ Completadas (${contarPorEstado("COMPLETADA")})`,
              },
              {
                value: "CANCELADA",
                label: `❌ Canceladas (${contarPorEstado("CANCELADA")})`,
              },
            ]}
          />
          <SelectField
            label=""
            name="orden"
            value={ordenamiento}
            onChange={(v) => setOrdenamiento(v as typeof ordenamiento)}
            options={[
              { value: "id_desc", label: "🔢 ID: Mayor a menor" },
              { value: "id_asc", label: "🔢 ID: Menor a mayor" },
              { value: "fecha_desc", label: "📅 Fecha: Reciente" },
              { value: "fecha_asc", label: "📅 Fecha: Antiguo" },
            ]}
          />
        </div>
        {(busqueda ||
          filtroEstado !== "TODOS" ||
          ordenamiento !== "id_desc") && (
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
          icon="📦"
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
                    ID OT
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
                    Empleado
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
                    Observaciones
                  </th>
                  {!editMode && (
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: "700",
                        color: "#000000ff",
                      }}
                    >
                      PDF
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map((orden) => (
                  <tr
                    key={orden.id_ot}
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
                      OT #{orden.id_ot}
                    </td>
                    <td style={{ padding: "16px", color: "#334155" }}>
                      {editMode ? (
                        <input
                          className="date-input-dark-icon"
                          type="date"
                          aria-label={`Fecha OT #${orden.id_ot} (seleccione desde el calendario)`}
                          title="Seleccionar fecha (desde el calendario)"
                          value={
                            rowChanges[orden.id_ot]?.fecha ??
                            (orden.fecha
                              ? new Date(orden.fecha).toISOString().slice(0, 10)
                              : "")
                          }
                          onChange={(e) =>
                            onRowChange(orden.id_ot, { fecha: e.target.value })
                          }
                          min={
                            orden.fecha
                              ? new Date(orden.fecha).toISOString().slice(0, 10)
                              : todayStr
                          }
                        />
                      ) : (
                        new Date(orden.fecha).toLocaleDateString("es-CL")
                      )}
                    </td>
                    <td style={{ padding: "16px", color: "#334155" }}>
                      {editMode && user && user.rol === ROLES.JEFE_LOGISTICA ? (
                        <select
                          value={
                            (rowChanges[orden.id_ot] as any)?.id_empleado ??
                            orden.id_empleado ??
                            ""
                          }
                          onChange={(e) =>
                            onRowChange(orden.id_ot, {
                              id_empleado: Number(e.target.value),
                            } as any)
                          }
                        >
                          <option value="">-- Seleccionar --</option>
                          {empleadosLogistica.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.nombre} {emp.apellido}
                            </option>
                          ))}
                        </select>
                      ) : (
                        orden.nombre_empleado || `ID: ${orden.id_empleado}`
                      )}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      {editMode ? (
                        (() => {
                          const selected =
                            (rowChanges[orden.id_ot] as any)?.estado ??
                            orden.estado ??
                            "";
                          return (
                            <select
                              aria-label={`Estado OT #${orden.id_ot}`}
                              value={selected}
                              onChange={(e) =>
                                onRowChange(orden.id_ot, {
                                  estado: e.target.value as EstadoApi,
                                })
                              }
                              style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: `2px solid ${getEstadoColor(selected)}`,
                                background: "white",
                                color: "#0f172a",
                                minWidth: 160,
                              }}
                            >
                              <option value="">-- Seleccionar estado --</option>
                              <option
                                value="CREADA"
                                style={{ color: getEstadoColor("CREADA") }}
                              >
                                🆕 {estadoLabel("CREADA")}
                              </option>
                              <option
                                value="ASIGNADA"
                                style={{ color: getEstadoColor("ASIGNADA") }}
                              >
                                👷 {estadoLabel("ASIGNADA")}
                              </option>
                              <option
                                value="EN PICKING"
                                style={{ color: getEstadoColor("EN PICKING") }}
                              >
                                📦 {estadoLabel("EN PICKING")}
                              </option>
                              <option
                                value="COMPLETADA"
                                style={{ color: getEstadoColor("COMPLETADA") }}
                              >
                                ✅ {estadoLabel("COMPLETADA")}
                              </option>
                              <option
                                value="CANCELADA"
                                style={{ color: getEstadoColor("CANCELADA") }}
                              >
                                ❌ {estadoLabel("CANCELADA")}
                              </option>
                            </select>
                          );
                        })()
                      ) : user && user.rol === ROLES.EMPLEADO_LOGISTICA ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {quickEditRow === orden.id_ot ? (
                            <>
                              <select
                                aria-label={`Editar estado OT #${orden.id_ot}`}
                                value={quickEditValue}
                                onChange={(e) => {
                                  const v = e.target.value as EstadoApi;
                                  setQuickEditValue(v);
                                  setTempEstados((t) => ({
                                    ...t,
                                    [orden.id_ot]: v,
                                  }));
                                }}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: 8,
                                  border: `2px solid ${getEstadoColor(
                                    quickEditValue
                                  )}`,
                                  background: "white",
                                  color: "#0f172a",
                                  minWidth: 160,
                                }}
                              >
                                {allowedStatesForEmpleado.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <div style={{ display: "inline-flex", gap: 6 }}>
                                <Button
                                  onClick={() => confirmQuickEdit(orden.id_ot)}
                                  size="small"
                                  variant="primary"
                                  disabled={quickSaving[orden.id_ot]}
                                >
                                  {quickSaving[orden.id_ot] ? "..." : "✓"}
                                </Button>
                                <Button
                                  onClick={cancelQuickEdit}
                                  size="small"
                                  variant="ghost"
                                >
                                  ✕
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                startQuickEdit(orden.id_ot, orden.estado)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  startQuickEdit(orden.id_ot, orden.estado);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                cursor: "pointer",
                              }}
                              title="Clic para editar rápidamente (Empleado Logística)"
                            >
                              <Badge
                                variant={getEstadoVariant(
                                  (tempEstados[orden.id_ot] ??
                                    orden.estado) as EstadoApi
                                )}
                              >
                                {estadoLabel(
                                  (tempEstados[orden.id_ot] ??
                                    orden.estado) as EstadoApi
                                )}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge
                          variant={getEstadoVariant(
                            (tempEstados[orden.id_ot] ??
                              orden.estado) as EstadoApi
                          )}
                        >
                          {estadoLabel(
                            (tempEstados[orden.id_ot] ??
                              orden.estado) as EstadoApi
                          )}
                        </Badge>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#4a5568",
                        maxWidth: "300px",
                      }}
                    >
                      {editMode ? (
                        <input
                          type="text"
                          value={
                            rowChanges[orden.id_ot]?.observaciones ??
                            orden.observaciones ??
                            ""
                          }
                          onChange={(e) =>
                            onRowChange(orden.id_ot, {
                              observaciones: e.target.value,
                            })
                          }
                        />
                      ) : (
                        orden.observaciones || (
                          <span
                            style={{ color: "#a0aec0", fontStyle: "italic" }}
                          >
                            Sin observaciones
                          </span>
                        )
                      )}
                    </td>
                    {!editMode && (
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <Button
                          onClick={() => descargarPdfPicking(orden.id_ot)}
                          size="small"
                          variant="ghost"
                        >
                          📄 PDF
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ListarOrdenesPicking;
