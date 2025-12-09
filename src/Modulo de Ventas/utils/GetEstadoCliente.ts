

export type EstadoCliente = 'PROSPECTO' | 'INTERESADO' | 'CLIENTE_NUEVO' | 'CLIENTE_ACTIVO' | 'CLIENTE_PERDIDO';

export const getEstadoClass = (estado: string) => {
  const estados: Record<string, string> = {
    'PROSPECTO': 'prospecto',
    'INTERESADO': 'interesado',
    'CLIENTE_NUEVO': 'cliente-nuevo',
    'CLIENTE_ACTIVO': 'cliente-activo',
    'CLIENTE_PERDIDO': 'perdido'
  }
  return estados[estado] || ''
}

export const getEstadoDescripcion = (estado: string) => {
  const descripciones: Record<string, string> = {
    'PROSPECTO': 'Cliente potencial identificado, aún sin contacto formal',
    'INTERESADO': 'Ha mostrado interés activo  en nuestros servicios',
    'CLIENTE_NUEVO': 'Cliente recién incorporado,  en proceso de onboarding',
    'CLIENTE_ACTIVO': 'Cliente con servicios activos y  facturación regular',
    'CLIENTE_PERDIDO': 'Cliente que ha dejado de  utilizar nuestros servicios'
  }
  return descripciones[estado] || 'Estado desconocido'
}