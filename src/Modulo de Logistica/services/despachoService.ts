import api from "./api";
import type { GuiaDespacho, CreateGuiaDespacho, ApiResponse } from "../types";

export const despachoService = {
  // Obtener todas las guías de despacho
  getAll: async () => {
    const response = await api.get<ApiResponse<GuiaDespacho[]>>("/despacho");
    return response.data;
  },

  // Obtener guías asignadas al transportista logueado (usa token Bearer)
  getMine: async () => {
    const response = await api.get<ApiResponse<GuiaDespacho[]>>(
      "/despacho/mis"
    );
    return response.data;
  },

  // Obtener una guía por ID
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<GuiaDespacho>>(
      `/despacho/${id}`
    );
    return response.data;
  },

  // Crear nueva guía
  create: async (data: CreateGuiaDespacho) => {
    // Transformar los datos al formato que espera el backend
    const backendData = {
      id_ot: data.id_ot,
      fecha: data.fecha_despacho,
      transportista: data.transportista,
      direccion_entrega: data.direccion_entrega,
    };
    const response = await api.post<ApiResponse<GuiaDespacho>>(
      "/despacho",
      backendData
    );
    return response.data;
  },
  // Obtener transportistas (encargados) por id_empresa
  getTransportistasByEmpresa: async (id_empresa: number) => {
    const response = await api.get<ApiResponse<any[]>>(
      `/despacho/transportistas/${id_empresa}`
    );
    return response.data;
  },
  // Actualizar guía (usa el endpoint de automatizacion)
  update: async (id: number, data: Partial<GuiaDespacho>) => {
    const response = await api.put<ApiResponse<GuiaDespacho>>(
      `/automatizacion/guia/${id}`,
      data
    );
    return response.data;
  },
};
