import api from "./api";
import type { Empleado, Transportista, ApiResponse } from "../types";

export const recursosService = {
  /**
   * Listar empleados activos
   */
  listarEmpleados: async () => {
    const response = await api.get<ApiResponse<Empleado[]>>(
      "/recursos/empleados"
    );
    return response.data.data;
  },

  /**
   * Listar transportistas activos
   */
  listarTransportistas: async () => {
    const response = await api.get<ApiResponse<Transportista[]>>(
      "/recursos/transportistas"
    );
    return response.data.data;
  },

  /**
   * Listar empleados y transportistas
   */
  listarEmpleadosTransportistas: async () => {
    const response = await api.get<ApiResponse<any[]>>(
      "/recursos/empleados-transportistas"
    );
    return response.data.data;
  },
};

export default recursosService;
