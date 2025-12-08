import api from "./api";
import type { OrdenPicking, CreateOrdenPicking, ApiResponse } from "../types";

export const pickingService = {
  /**
   * Obtener todas las órdenes de picking
   */
  getAll: async () => {
    const response = await api.get<ApiResponse<OrdenPicking[]>>("/picking");
    return response.data;
  },

  /**
   * Obtener OTs asignadas al empleado logueado (usa token Bearer)
   */
  getMine: async () => {
    const response = await api.get<ApiResponse<OrdenPicking[]>>("/picking/mis");
    return response.data;
  },

  /**
   * Obtener una orden por ID
   */
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<OrdenPicking>>(`/picking/${id}`);
    return response.data;
  },

  /**
   * Crear nueva orden
   */
  create: async (data: CreateOrdenPicking) => {
    const response = await api.post<ApiResponse<OrdenPicking>>(
      "/picking",
      data
    );
    return response.data;
  },

  /**
   * Actualizar orden
   */
  update: async (id: number, data: Partial<OrdenPicking>) => {
    const response = await api.put<ApiResponse<OrdenPicking>>(
      `/picking/${id}`,
      data
    );
    return response.data;
  },
};
