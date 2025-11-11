import { useState, useEffect } from 'react';
import comprasService, { type OrdenCompraResponse } from './comprasService';

interface UseComprasReturn {
  ordenes: OrdenCompraResponse[];
  cargando: boolean;
  error: string;
  descargandoFactura: number | null;
  mensaje: string;
  tipoMensaje: 'success' | 'error' | 'warning';
  cargarOrdenes: () => Promise<void>;
  cambiarEstado: (id: number, nuevoEstado: string) => Promise<void>;
  descargarFactura: (id: number) => Promise<void>;
  limpiarMensaje: () => void;
}

export const useCompras = (): UseComprasReturn => {
  const [ordenes, setOrdenes] = useState<OrdenCompraResponse[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [descargandoFactura, setDescargandoFactura] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | 'warning'>('success');

  const cargarOrdenes = async (): Promise<void> => {
    try {
      setCargando(true);
      setError('');
      const ordenesData = await comprasService.obtenerOrdenes();
      setOrdenes(ordenesData);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar las órdenes';
      setError(`Error al cargar las órdenes: ${errorMessage}. Por favor, intenta nuevamente.`);
    } finally {
      setCargando(false);
    }
  };

  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' | 'warning' = 'success'): void => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setMensaje('');
    }, 5000);
  };

  const cambiarEstado = async (id: number, nuevoEstado: string): Promise<void> => {
    try {
      // Enviar el estado en minúsculas como espera el backend
      const estadoEnMinusculas = nuevoEstado.toLowerCase();
      
      await comprasService.actualizarOrden(id, { estado: estadoEnMinusculas as any });
      
      setOrdenes(prev => 
        prev.map(orden => 
          orden.id_orden_compra === id 
            ? { ...orden, estado: estadoEnMinusculas.toUpperCase() as any } // Mantener mayúsculas en el frontend
            : orden
        )
      );
      
      // Mostrar mensaje de éxito
      const accion = estadoEnMinusculas === 'aprobada' ? 'aprobada' : 'rechazada';
      const mensajeEstado = `Orden ${accion} correctamente${estadoEnMinusculas === 'aprobada' ? '. Ya puede descargar la factura.' : ''}`;
      mostrarMensaje(mensajeEstado, 'success');
      
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarMensaje(`Error al cambiar el estado: ${errorMessage}`, 'error');
      throw error;
    }
  };

  const descargarFactura = async (id: number): Promise<void> => {
    try {
      setDescargandoFactura(id);
      setError('');
      
      await comprasService.descargarFactura(id);
      mostrarMensaje('Factura descargada correctamente', 'success');
      
    } catch (error) {
      console.error('Error al descargar factura:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarMensaje(`Error al descargar factura: ${errorMessage}`, 'error');
      throw error;
    } finally {
      setDescargandoFactura(null);
    }
  };

  const limpiarMensaje = (): void => {
    setMensaje('');
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  return {
    ordenes,
    cargando,
    error,
    descargandoFactura,
    mensaje,
    tipoMensaje,
    cargarOrdenes,
    cambiarEstado,
    descargarFactura,
    limpiarMensaje
  };
};

export default useCompras;