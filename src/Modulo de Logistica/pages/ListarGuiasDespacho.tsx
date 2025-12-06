import React, { useState, useEffect } from "react";
import { despachoService } from "../services/despachoService";
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
import type { GuiaDespacho } from "../types";
import { useAuth } from "../../utils/AuthContext";
import { ROLES } from "../../utils/Permissions";

const ListarGuiasDespacho: React.FC = () => {
  const [guias, setGuias] = useState<GuiaDespacho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenamiento, setOrdenamiento] = useState<
    "fecha_desc" | "fecha_asc" | "id_desc" | "id_asc"
  >("id_desc");

  // Editing state
  const [editMode, setEditMode] = useState(false);
  const [rowChanges, setRowChanges] = useState<
    Record<number, Partial<GuiaDespacho>>
  >({});
  const [saving, setSaving] = useState(false);
  const [empresasList, setEmpresasList] = useState<
    { id?: number; nombre: string }[]
  >([]);
  const [encargadosPorEmpresa, setEncargadosPorEmpresa] = useState<
    Record<string | number, any[]>
  >({});

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
    cargarGuias();
  }, [user]);

  const cargarGuias = async () => {
    try {
      setLoading(true);
      setError(null);
      let response: any = null;
      if (user && user.rol === ROLES.TRANSPORTISTA) {
        response = await despachoService.getMine();
      } else {
        response = await despachoService.getAll();
      }
      if (response && response.success && response.data) {
        const normalized = (response.data as any[]).map((g) => {
          const parsedTransportista = Number(g.transportista);
          const transportistaVal = Number.isFinite(parsedTransportista)
            ? parsedTransportista
            : g.transportista;
          return {
            ...g,
            estado: (g.estado || "").toString().toUpperCase().trim(),
            id_guia: Number(g.id_guia),
            id_ot: Number(g.id_ot),
            transportista: transportistaVal,
            id_encargado: g.id_encargado ? Number(g.id_encargado) : undefined,
            encargado_name: g.encargado_name || null,
          };
        });
        setGuias(normalized as GuiaDespacho[]);
      } else setError("No se pudieron cargar las guías");
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const getGuiaEstado = (g: GuiaDespacho) =>
    (g.estado || "").toString().toUpperCase().trim();

  const contarPorEstado = (estado: string) =>
    guias.filter((g) => getGuiaEstado(g) === estado).length;

  const guiasFiltradas = React.useMemo(() => {
    let resultado = [...guias];

    if (user && user.rol === ROLES.TRANSPORTISTA) {
      const name = `${user.nombre}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      resultado = resultado.filter((g) => {
        const t = (g.transportista || "").toString().toLowerCase();
        return t.includes(name) || t.includes(email) || t === name;
      });
    }

    if (busqueda.trim()) {
      const lower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (g) =>
          g.id_guia.toString().includes(lower) ||
          g.id_ot.toString().includes(lower) ||
          (g.transportista || "").toString().toLowerCase().includes(lower) ||
          g.direccion_entrega?.toLowerCase().includes(lower)
      );
    }

    if (filtroEstado !== "TODOS")
      resultado = resultado.filter((g) => getGuiaEstado(g) === filtroEstado);

    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case "fecha_desc":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case "fecha_asc":
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case "id_desc":
          return b.id_guia - a.id_guia;
        case "id_asc":
          return a.id_guia - b.id_guia;
        default:
          return 0;
      }
    });

    return resultado;
  }, [guias, busqueda, filtroEstado, ordenamiento, user]);

  const getEstadoVariant = (
    estado?: string
  ): "pendiente" | "proceso" | "completado" | "cancelado" | "enviado" => {
    if (!estado) return "pendiente";
    if (estado === "EN PICKING") return "pendiente";
    if (estado === "ASIGNADA") return "proceso";
    if (estado === "EN CAMINO") return "enviado";
    if (estado === "ENTREGADA") return "completado";
    if (estado === "FALLIDA") return "cancelado";
    return "cancelado";
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("TODOS");
    setOrdenamiento("id_desc");
  };

  const descargarPdfGuia = async (id_guia: number) => {
    try {
      const resp = await api.get(`/despacho/${id_guia}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Guia-${id_guia}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Error al descargar PDF");
    }
  };

  const onRowChange = (id_guia: number, changes: Partial<GuiaDespacho>) => {
    setRowChanges((prev) => ({
      ...prev,
      [id_guia]: { ...prev[id_guia], ...changes },
    }));
  };

  const onEmpresaChangeForRow = (
    id_guia: number,
    empresaKey: string | number
  ) => {
    onRowChange(id_guia, {
      transportista: empresaKey as any,
      id_encargado: undefined,
    } as any);
  };

  const encargadosForRow = (guia: GuiaDespacho) => {
    const changes = rowChanges[guia.id_guia] || {};
    const empresaKey = (changes as any).transportista ?? guia.transportista;

    if (user && user.rol === ROLES.TRANSPORTISTA) {
      const uEmpresa =
        (user as any).id_empresa ?? (user as any).empresa ?? undefined;
      if (uEmpresa !== undefined) {
        const list = encargadosPorEmpresa[uEmpresa] || [];
        return list;
      }
    }

    if (empresaKey !== undefined && empresaKey !== null) {
      const list = encargadosPorEmpresa[empresaKey] || [];
      return list;
    }

    const allEncargados = Object.values(encargadosPorEmpresa).flat();
    return allEncargados;
  };

  // Allowed fields by role
  const allowedByRole: Record<string, string[]> = {
    JEFE_LOGISTICA: ["fecha", "transportista", "id_encargado", "estado"],
    TRANSPORTISTA: ["fecha", "id_encargado", "estado"],
  };

  const guardarCambios = async () => {
    const hasChanges = Object.keys(rowChanges).length > 0;
    if (!hasChanges) {
      setError("No hay cambios para guardar");
      return;
    }
    setSaving(true);
    try {
      const ids = Object.keys(rowChanges).map(Number);
      for (const id of ids) {
        const changes = rowChanges[id] || {};
        const body: any = {};

        const allowed = allowedByRole[(user && user.rol) || ""] || [];

        if (changes.fecha && allowed.includes("fecha")) {
          body.fecha = changes.fecha;
        }
        if (
          (changes as any).transportista !== undefined &&
          allowed.includes("transportista")
        ) {
          body.transportista = (changes as any).transportista;
        }
        if (
          (changes as any).id_encargado !== undefined &&
          allowed.includes("id_encargado")
        ) {
          body.id_encargado = (changes as any).id_encargado;
        }
        if (
          (changes as any).estado !== undefined &&
          allowed.includes("estado")
        ) {
          body.estado = (changes as any).estado;
        }
        // `direccion_entrega` is not editable in this list view; do not send it

        // If fecha exists, validate not before today and not before original recorded date
        if (body.fecha) {
          const guia = guias.find((g) => g.id_guia === id);
          if (new Date(body.fecha) < new Date(todayStr)) {
            throw new Error(
              `La fecha para Guía #${id} no puede ser anterior a la fecha de hoy`
            );
          }
          if (guia?.fecha && new Date(body.fecha) < new Date(guia.fecha)) {
            throw new Error(
              `La fecha para Guía #${id} no puede ser menor que la fecha registrada`
            );
          }
        }

        if (Object.keys(body).length > 0) {
          await despachoService.update(id, body);
        }
      }

      await cargarGuias();
      setRowChanges({});
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || "Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadResources = async () => {
      try {
        if (user && user.rol === ROLES.JEFE_LOGISTICA) {
          const transportistas =
            (await recursosService.listarTransportistas()) ?? [];
          const empleadosTransportistas =
            (await recursosService.listarEmpleadosTransportistas()) ?? [];

          setEmpresasList(
            transportistas.map((t) => ({
              id: t.id,
              nombre: `${t.nombre} ${t.apellido}`,
            }))
          );

          const encargados = empleadosTransportistas.reduce((acc, emp) => {
            if (!acc[emp.id_empresa]) acc[emp.id_empresa] = [];
            acc[emp.id_empresa].push(emp);
            return acc;
          }, {} as Record<string | number, any[]>);

          setEncargadosPorEmpresa(encargados);
        } else if (user && user.rol === ROLES.TRANSPORTISTA) {
          const empleadosTransportistas =
            (await recursosService.listarEmpleadosTransportistas()) ?? [];

          const filteredEmpleados = empleadosTransportistas.filter(
            (emp) => emp.id_empresa === user.id
          );

          setEmpresasList([
            { id: user.id, nombre: `${user.nombre} ${user.apellido}` },
          ]);

          setEncargadosPorEmpresa({ [user.id]: filteredEmpleados });
        }
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    };

    loadResources();
  }, [user]);

  if (loading)
    return (
      <div className="list-container">
        <LoadingSpinner message="Cargando guías de despacho..." size="large" />
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
          title="Error al cargar guías"
          description={error}
          actionLabel="🔄 Reintentar"
          onAction={cargarGuias}
        />
      </div>
    );
  }

  return (
    <div className="list-container">
      <PageHeader
        title="Guías de Despacho"
        subtitle={`${guias.length} guías registradas`}
        icon="🚚"
        actions={
          <>
            <Button onClick={cargarGuias} icon="🔄" variant="secondary">
              Actualizar
            </Button>
            <Button
              onClick={() => {
                const newEdit = !editMode;
                setEditMode(newEdit);
                // when exiting edit mode, clear any accumulated changes and temp estados
                if (!newEdit) {
                  setRowChanges({});
                }
              }}
              variant={editMode ? "ghost" : "primary"}
            >
              {editMode ? "Cancelar" : "Editar"}
            </Button>
            {editMode && (
              <Button
                onClick={guardarCambios}
                disabled={Object.keys(rowChanges).length === 0 || saving}
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
          title="En Picking"
          value={contarPorEstado("EN PICKING")}
          icon="📦"
          color="yellow"
          subtitle="Preparación"
        />
        <StatsCard
          title="Asignadas"
          value={contarPorEstado("ASIGNADA")}
          icon="👷"
          color="blue"
          subtitle="Transportista asignado"
        />
        <StatsCard
          title="En Camino"
          value={contarPorEstado("EN CAMINO")}
          icon="🚚"
          color="purple"
          subtitle="En tránsito"
        />
        <StatsCard
          title="Entregadas"
          value={contarPorEstado("ENTREGADA")}
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
            placeholder="ID guía, OT, transportista, dirección..."
          />
          <SelectField
            label=""
            name="estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: "TODOS", label: `📋 Todos (${guias.length})` },
              {
                value: "EN PICKING",
                label: `📦 En Picking (${contarPorEstado("EN PICKING")})`,
              },
              {
                value: "ASIGNADA",
                label: `👷 Asignadas (${contarPorEstado("ASIGNADA")})`,
              },
              {
                value: "EN CAMINO",
                label: `🚚 En Camino (${contarPorEstado("EN CAMINO")})`,
              },
              {
                value: "ENTREGADA",
                label: `✅ Entregadas (${contarPorEstado("ENTREGADA")})`,
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

      {guiasFiltradas.length === 0 ? (
        <EmptyState
          icon="🚚"
          title="No hay guías"
          description="No se encontraron guías con los filtros aplicados"
          actionLabel="🗑️ Limpiar filtros"
          onAction={limpiarFiltros}
        />
      ) : (
        <>
          <p style={{ color: "#64748b", marginBottom: "16px" }}>
            📈 Mostrando {guiasFiltradas.length} de {guias.length} guías
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
                    ID Guía
                  </th>
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
                    Empresa
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "700",
                      color: "#000000ff",
                    }}
                  >
                    Encargado
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
                    Estado OT
                  </th>
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
                </tr>
              </thead>
              <tbody>
                {guiasFiltradas.map((guia) => {
                  const changes = rowChanges[guia.id_guia] || {};
                  const currentTransportista =
                    (changes as any).transportista ?? guia.transportista;
                  const currentEncargadoId =
                    (changes as any).id_encargado ?? guia.id_encargado;
                  const estadoSelected = (changes as any).estado ?? guia.estado;
                  return (
                    <tr
                      key={guia.id_guia}
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
                        Guía #{guia.id_guia}
                      </td>
                      <td style={{ padding: "16px", color: "#334155" }}>
                        OT #{guia.id_ot}
                      </td>
                      <td style={{ padding: "16px", color: "#334155" }}>
                        {editMode ? (
                          <input
                            className="date-input-dark-icon"
                            type="date"
                            aria-label={`Fecha Guía #${guia.id_guia}`}
                            value={
                              (rowChanges[guia.id_guia] as any)?.fecha ??
                              (guia.fecha
                                ? new Date(guia.fecha)
                                    .toISOString()
                                    .slice(0, 10)
                                : "")
                            }
                            onChange={(e) =>
                              onRowChange(guia.id_guia, {
                                fecha: e.target.value,
                              } as any)
                            }
                            min={
                              guia.fecha
                                ? new Date(guia.fecha)
                                    .toISOString()
                                    .slice(0, 10)
                                : todayStr
                            }
                          />
                        ) : guia.fecha ? (
                          new Date(guia.fecha).toLocaleDateString("es-CL")
                        ) : (
                          <span
                            style={{ color: "#a0aec0", fontStyle: "italic" }}
                          >
                            No definida
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "16px", color: "#334155" }}>
                        {editMode ? (
                          user && user.rol === ROLES.JEFE_LOGISTICA ? (
                            <select
                              value={
                                currentTransportista ?? guia.transportista ?? ""
                              }
                              onChange={(e) =>
                                onEmpresaChangeForRow(
                                  guia.id_guia,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">
                                -- Seleccionar empresa --
                              </option>
                              {empresasList && empresasList.length > 0 ? (
                                empresasList.map((emp, idx) => (
                                  <option
                                    key={idx}
                                    value={emp.id ?? emp.nombre}
                                  >
                                    {emp.nombre}
                                  </option>
                                ))
                              ) : (
                                // fallback: show the guia.transportista as an option so it doesn't disappear
                                <option value={guia.transportista ?? ""}>
                                  {guia.transportista ?? "(Sin empresa)"}
                                </option>
                              )}
                            </select>
                          ) : user && user.rol === ROLES.TRANSPORTISTA ? (
                            // transportista cannot change company; show their company (try user.id_empresa or derive)
                            <div>
                              {(() => {
                                const uEmpresa =
                                  (user as any).id_empresa ??
                                  (user as any).empresa ??
                                  null;
                                const display =
                                  uEmpresa ??
                                  guia.transportista ??
                                  "Mi empresa";
                                return <>🚛 {display}</>;
                              })()}
                            </div>
                          ) : (
                            // other roles: show company name as text
                            <div>🚛 {guia.transportista}</div>
                          )
                        ) : (
                          <>🚛 {guia.transportista}</>
                        )}
                      </td>

                      <td style={{ padding: "16px", color: "#334155" }}>
                        {editMode ? (
                          (() => {
                            // Build encargado options for this row
                            const opts = encargadosForRow(guia);
                            return (
                              <select
                                value={
                                  currentEncargadoId ?? guia.id_encargado ?? ""
                                }
                                onChange={(e) =>
                                  onRowChange(guia.id_guia, {
                                    id_encargado: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  } as any)
                                }
                              >
                                <option value="">
                                  -- Seleccionar encargado --
                                </option>
                                {opts && opts.length > 0 ? (
                                  opts.map((emp: any) => (
                                    <option key={emp.id} value={emp.id}>
                                      {emp.nombre} {emp.apellido}
                                    </option>
                                  ))
                                ) : (
                                  // fallback: show current encargado if none available in opts
                                  <option value={guia.id_encargado ?? ""}>
                                    {guia.encargado_name ??
                                      (guia.id_encargado
                                        ? `#${guia.id_encargado}`
                                        : "(Sin encargado)")}
                                  </option>
                                )}
                              </select>
                            );
                          })()
                        ) : guia.encargado_name ? (
                          guia.encargado_name
                        ) : guia.id_encargado ? (
                          `#${guia.id_encargado}`
                        ) : (
                          <span
                            style={{ color: "#a0aec0", fontStyle: "italic" }}
                          >
                            Sin encargado
                          </span>
                        )}
                      </td>

                      <td
                        style={{
                          padding: "16px",
                          color: "#4a5568",
                          maxWidth: "250px",
                        }}
                      >
                        {guia.direccion_entrega ? (
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            📍 {guia.direccion_entrega}
                          </div>
                        ) : (
                          <span
                            style={{ color: "#a0aec0", fontStyle: "italic" }}
                          >
                            Sin dirección
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "16px", textAlign: "center" }}>
                        {editMode ? (
                          <select
                            aria-label={`Estado Guía #${guia.id_guia}`}
                            value={estadoSelected ?? ""}
                            onChange={(e) => {
                              onRowChange(guia.id_guia, {
                                estado: e.target.value,
                              } as any);
                            }}
                            style={{
                              padding: "8px 10px",
                              borderRadius: 8,
                              border: `2px solid ${getEstadoColorForSelect(
                                estadoSelected
                              )}`,
                              background: "white",
                              color: "#0f172a",
                              minWidth: 160,
                            }}
                          >
                            <option value="">-- Seleccionar estado --</option>
                            <option value="EN PICKING">📦 EN PICKING</option>
                            <option value="ASIGNADA">👷 ASIGNADA</option>
                            <option value="EN CAMINO">🚚 EN CAMINO</option>
                            <option value="ENTREGADA">✅ ENTREGADA</option>
                            <option value="FALLIDA">❌ FALLIDA</option>
                            <option value="CANCELADA">❌ CANCELADA</option>
                          </select>
                        ) : getGuiaEstado(guia) ? (
                          <Badge
                            variant={getEstadoVariant(getGuiaEstado(guia))}
                          >
                            {getGuiaEstado(guia)}
                          </Badge>
                        ) : (
                          <span
                            style={{ color: "#a0aec0", fontStyle: "italic" }}
                          >
                            N/A
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <Button
                          onClick={() => descargarPdfGuia(guia.id_guia)}
                          size="small"
                          variant="ghost"
                        >
                          📄 PDF
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// small helper to pick border color for estado select
const getEstadoColorForSelect = (estado?: string) => {
  switch (estado) {
    case "EN PICKING":
      return "#f59e0b";
    case "ASIGNADA":
      return "#3b82f6";
    case "EN CAMINO":
      return "#8b5cf6";
    case "ENTREGADA":
      return "#10b981";
    case "CANCELADA":
      return "#ef4444";
    case "FALLIDA":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
};

export default ListarGuiasDespacho;
