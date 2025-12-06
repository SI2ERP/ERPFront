import api from "./api";
import type {
  PedidoVenta,
  OrdenCompra,
  CreatePedidoVenta,
  CreateOrdenCompra,
  ApiResponse,
} from "../types";

export const integracionService = {
  // ========== PEDIDOS DE VENTAS ==========

  // Listar todos los pedidos recibidos desde Ventas
  listarPedidosVentas: async () => {
    const response = await api.get<ApiResponse<PedidoVenta[]>>(
      "/integracion/pedidos-ventas"
    );
    return response.data;
  },

  // Obtener un pedido específico con su detalle
  obtenerPedidoVenta: async (id: number) => {
    const response = await api.get<ApiResponse<PedidoVenta>>(
      `/integracion/pedidos-ventas/${id}`
    );
    return response.data;
  },

  // Simular recepción de pedido desde ERP Ventas (para testing)
  recibirPedidoVenta: async (pedido: CreatePedidoVenta) => {
    const response = await api.post<ApiResponse<PedidoVenta>>(
      "/integracion/recibir-pedido-venta",
      pedido
    );
    return response.data;
  },

  // ========== ÓRDENES DE COMPRA ==========

  // Listar todas las OC recibidas desde Compras
  listarOrdenesCompra: async () => {
    const response = await api.get<ApiResponse<OrdenCompra[]>>(
      "/integracion/ordenes-compra"
    );
    return response.data;
  },

  // Obtener una OC específica con su detalle
  obtenerOrdenCompra: async (id: number) => {
    const response = await api.get<ApiResponse<OrdenCompra>>(
      `/integracion/ordenes-compra/${id}`
    );
    return response.data;
  },

  // Simular recepción de OC desde ERP Compras (para testing)
  recibirOrdenCompra: async (orden: CreateOrdenCompra) => {
    const response = await api.post<ApiResponse<OrdenCompra>>(
      "/integracion/recibir-orden-compra",
      orden
    );
    return response.data;
  },
};

export default integracionService;
