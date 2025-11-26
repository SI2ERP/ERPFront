/* Roles en BD, si agregan más agreguenlos acá */
export const ROLES = {
  ADMIN: "ADMIN",
  ADMIN_TI: "ADMIN_TI",
  SUPERVISOR_RRHH: "SUPERVISOR_RRHH",
  EMPLEADO: "EMPLEADO",
  JEFE_DEPARTAMENTO: "JEFE_DEPARTAMENTO",
  GERENTE: "GERENTE",
  JEFE_RRHH: "JEFE_RRHH",
  ANALISTA_SELECCION: "ANALISTA_SELECCION",
  ANALISTA_NOMINA: "ANALISTA_NOMINA",
  JEFE_AREA: "JEFE_AREA",
  EMPLEADO_GENERAL: "EMPLEADO_GENERAL",
  TRANSPORTISTA: "TRANSPORTISTA",
  TESTING: "TESTING",

  JEFE_COMPRAS: "JEFE_COMPRAS",
  JEFE_LOGISTICA: "JEFE_LOGISTICA",
  JEFE_VENTAS: "JEFE_VENTAS",
  JEFE_INVENTARIO: "JEFE_INVENTARIO",

  EMPLEADO_COMPRAS: "EMPLEADO_COMPRAS",
  EMPLEADO_LOGISTICA: "EMPLEADO_LOGISTICA",
  EMPLEADO_VENTAS: "EMPLEADO_VENTAS",
  EMPLEADO_INVENTARIO: "EMPLEADO_INVENTARIO",
  EMPLEADO_AREA: "EMPLEADO_AREA",

} as const;

export type PermissionKey =
  | "puedeVerCompras"
  | "puedeVerInventario"
  | "puedeVerLogistica"
  | "puedeVerRRHH"
  | "puedeVerVentas";

export type Role = typeof ROLES[keyof typeof ROLES];

/* Acá se agregan permisos a cada rol */
/* Modificar cada vez que se creen, dejar los que no ocupan como false por defecto */
export const PERMISSIONS = {
  //uso extra de admin, al logear en rrhh pasa directo a la vista admin
  [ROLES.ADMIN]: {
    puedeVerCompras: true,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.ADMIN_TI]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.GERENTE]: {
    puedeVerCompras: true,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },
  //uso extra de 
  [ROLES.JEFE_DEPARTAMENTO]: {
    puedeVerCompras: true,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_AREA]: {
    puedeVerCompras: true,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_RRHH]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.SUPERVISOR_RRHH]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.ANALISTA_SELECCION]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.ANALISTA_NOMINA]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.EMPLEADO]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.EMPLEADO_GENERAL]: {
    puedeVerCompras: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.TRANSPORTISTA]: {
    puedeVerCompras: false,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.TESTING]: {
    puedeVerCompras: true,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_COMPRAS]: {
    puedeVerCompras: true,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_LOGISTICA]: {
    puedeVerCompras: false,
    puedeVerInventario: true,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.JEFE_VENTAS]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.JEFE_INVENTARIO]: {
    puedeVerCompras: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.EMPLEADO_COMPRAS]: {
    puedeVerCompras: true,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.EMPLEADO_LOGISTICA]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: true,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.EMPLEADO_VENTAS]: {
    puedeVerCompras: false,
    puedeVerInventario: false,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },

  [ROLES.EMPLEADO_INVENTARIO]: {
    puedeVerCompras: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: false,
  },

  [ROLES.EMPLEADO_AREA]: {
    puedeVerCompras: false,
    puedeVerInventario: true,
    puedeVerLogistica: false,
    puedeVerRRHH: true,
    puedeVerVentas: true,
  },



};

/* Función para ver permisos */
export const hasPermission = (userRole: Role | undefined, permissionKey: PermissionKey): boolean => {
  if (!userRole || !PERMISSIONS[userRole]) return false;
  return !!PERMISSIONS[userRole][permissionKey];
};