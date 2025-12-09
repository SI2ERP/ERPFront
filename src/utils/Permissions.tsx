/* Roles en BD, si agregan más agreguenlos acá */
export const ROLES = {
  ADMIN: "ADMIN",
  SUPERVISOR_RRHH: "SUPERVISOR_RRHH",
  EMPLEADO: "EMPLEADO",
  JEFE_DEPARTAMENTO: "JEFE_DEPARTAMENTO",
  GERENTE: "GERENTE",
  ADMIN_TI: "ADMIN_TI",
  JEFE_RRHH: "JEFE_RRHH",
  ANALISTA_SELECCION: "ANALISTA_SELECCION",
  ANALISTA_NOMINA: "ANALISTA_NOMINA",
  JEFE_AREA: "JEFE_AREA",
  EMPLEADO_GENERAL: "EMPLEADO_GENERAL",
  TRANSPORTISTA: "TRANSPORTISTA",
  TESTING: "TESTING",

  EMPLEADO_INVENTARIO: "EMPLEADO_INVENTARIO",
  JEFE_INVENTARIO: "JEFE_INVENTARIO",
  ADMIN_INVENTARIO: "ADMIN_INVENTARIO",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/* Acá se agregan permisos a cada rol */
/* Modificar cada vez que se creen, dejar los que no ocupan como false por defecto */
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    puedeVerCompras: true,
    puedeModificarInventario: true,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.ADMIN_TI]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: true,
    puedeVerRRHH: false,
    puedeVerVentas: false,
  },

  [ROLES.GERENTE]: {
    puedeVerCompras: true,
    puedeModificarInventario: false,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_DEPARTAMENTO]: {
    puedeVerCompras: true,
    puedeModificarInventario: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_AREA]: {
    puedeVerCompras: true,
    puedeModificarInventario: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: false,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_RRHH]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.SUPERVISOR_RRHH]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.ANALISTA_SELECCION]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.ANALISTA_NOMINA]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.EMPLEADO]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: false,
    puedeVerVentas: true,
  },

  [ROLES.EMPLEADO_GENERAL]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: false,
    puedeVerVentas: true,
  },

  [ROLES.TRANSPORTISTA]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: false,
    puedeVerLogistica: true,
    puedeVerRRHH: false,
    puedeVerVentas: false,
  },

  [ROLES.TESTING]: {
    puedeVerCompras: true,
    puedeModificarInventario: true,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.EMPLEADO_INVENTARIO]: {
    puedeVerCompras: false,
    puedeModificarInventario: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: false,
    puedeVerVentas: false,
  },

  [ROLES.JEFE_INVENTARIO]: {
    puedeVerCompras: false,
    puedeModificarInventario: true,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: false,
    puedeVerVentas: false,
  },
 
  [ROLES.ADMIN_INVENTARIO]: {
    puedeVerCompras: false,
    puedeModificarInventario: true,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: false,
    puedeVerVentas: false,
  },
};

/* Función para ver permisos */
export const hasPermission = (userRole: Role | undefined, permissionKey: string): boolean => {
  if (!userRole || !PERMISSIONS[userRole]) return false;
  return !!PERMISSIONS[userRole][permissionKey];
};