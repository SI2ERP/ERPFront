import api from "./api";

export interface ProcesarPedidoRequest {
  id_venta: number;
}

export interface ProcesarPedidoResponse {
  success: boolean;
  message: string;
  data?: {
    pedido: {
      id_venta: number;
      numero: string;
      cliente: string;
      direccion: string;
    };
    orden_trabajo: {
      id_ot: number;
      empleado: string;
      fecha: string;
      estado: string;
    };
    guia_despacho: {
      id_guia: number;
      transportista: string;
      fecha: string;
      direccion: string;
    };
    notificacion_ventas: {
      pendiente: boolean;
      mensaje: string;
    };
  };
}

export interface EstadisticasBalanceo {
  empleados: Array<{
    id_empleado: number;
    nombre: string;
    apellido: string;
    rol: string;
    ot_pendientes: number;
  }>;
  transportistas: Array<{
    id_transportista: number;
    nombre: string;
    entregas_activas: number;
  }>;
}

export const automatizacionService = {
  /**
   * Procesa un pedido de venta automáticamente
   */
  procesarPedido: async (
    data: ProcesarPedidoRequest
  ): Promise<ProcesarPedidoResponse> => {
    const response = await api.post("/automatizacion/procesar-pedido", data);
    return response.data;
  },

  /**
   * Obtiene estadísticas de balanceo de carga
   */
  obtenerEstadisticas: async (): Promise<{
    success: boolean;
    data: EstadisticasBalanceo;
  }> => {
    const response = await api.get("/automatizacion/estadisticas-balanceo");
    return response.data;
  },
  editarOt: async (id_ot: number, data: { id_empleado: number }) => {
    const response = await api.put(`/automatizacion/ot/${id_ot}`, data);
    return response.data;
  },
  editarGuia: async (
    id_guia: number,
    data: { transportista?: string; fecha?: string; direccion_entrega?: string }
  ) => {
    const response = await api.put(`/automatizacion/guia/${id_guia}`, data);
    return response.data;
  },
};
