import axios from 'axios'
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_URL_INVENTORY_BACKEND || 'http://localhost:3003'; 

const apiClient = axios.create({
  baseURL: API_URL,
})

// --- INTERFACES ---
export interface Producto {
  id: number
  nombre: string
  codigo: string 
  descripcion?: string
  precio_unitario: number | string 
  precio_venta: number | string
  cantidad: number 
  estado: boolean
  fechaCreacion: Date
  fechaActualizacion: Date
}

export interface User {
  nombre: string;
  rol: string;
  email?: string;
}

export interface CreateProductoDto {
  nombre: string
  descripcion?: string
  user: User | null
}

// interfaz para sumar stock
export interface UpdateProductoDto {
  stock?: number;
  user?: any;
  [key: string]: any; 
}

export interface RestarStockDto {
  stock: number 
  user: any 
  observaciones: string
}

export interface ProductoSinStock {
  id_producto: number
  nombre: string
  descripcion: string
  precio_unitario: string
  codigo: string
  precio_venta: string
  fecha_sin_stock: string
}

export interface Reserva {
  id: number
  stock: number
  fechaReserva: string
  producto: {
    id: number
    nombre: string
    codigo: string
  }
}

export interface Movimiento {
  id: number
  cantidad: number
  tipo_movimiento: string
  fechaMovimiento: string
  productoId: number
  empleadoId: number
}

// Producto por despachar - interfaz para el listado
export interface ProductoDespachoBase {
    id: number;
    codigo: string; 
    nombre: string; 
}

// Producto por despachar - como viene del service
export interface ProductoPorDespachar {
    id: number; 
    cantidad_por_despachar: number; 
    producto: ProductoDespachoBase; 
    fecha_registro: Date;
}

// --- INTERFACES PARA HISTORIAL DE MOVIMIENTOS ---

export interface EmpleadoBase {
    nombre: string;
    apellido: string
}

export interface ProductoBaseMovimiento {
    codigo: string;
    nombre: string;
}

// Movimiento Automático
export interface MovimientoLogistica {
    id: number;
    cantidad: number; 
    es_recepcion: boolean; // TRUE: Ingreso, FALSE: Salida
    id_referencia: number;
    producto: ProductoBaseMovimiento; 
    empleado: EmpleadoBase;
    fecha_movimiento: Date;
}

// Ajuste Manual
export interface AjusteManual {
    id: number;
    cantidad: number; // Puede ser positivo o negativo
    observaciones: string; 
    producto: ProductoBaseMovimiento; 
    empleado: EmpleadoBase;
    fechaAjuste: Date;
}

type MovimientoData = MovimientoLogistica | AjusteManual;

// --- FUNCIONES ---

export const getProductos = async (): Promise<Producto[]> => {
  const response = await apiClient.get('/productos')
  return response.data
}

export const createProducto = async (data: CreateProductoDto): Promise<any> => {
  const payload = { ...data };
  const response = await apiClient.post('/productos', payload)
  return response.data
}

// ✅ RESTAURADA: Función para actualizar datos (se usa para SUMAR stock)
export const actualizarProducto = async (id: number, data: UpdateProductoDto): Promise<any> => {
  const response = await apiClient.patch(`/productos/${id}`, data)
  return response.data
}

// Función para RESTAR stock (endpoint específico que requiere user)
export const restarStockProducto = async (id: number, cantidadARestar: number, user: any, observaciones: string) => {
  const dto: RestarStockDto = {
    stock: cantidadARestar,
    user: user,
    observaciones: observaciones,
  }
  const response = await apiClient.patch(`/productos/${id}/stock`, dto)
  return response.data 
}

export const getProductosSinStock = async (): Promise<ProductoSinStock[]> => {
  const response = await apiClient.get('/productos-sin-stock') 
  return response.data
}

export const getReservas = async (): Promise<Reserva[]> => {
  const response = await apiClient.get('/reservas-venta-inventario')
  return response.data
}

/* export const getMovimientos = async (): Promise<Movimiento[]> => {
  try {
    const response = await apiClient.get('/movimientos-inventario')
    return response.data
  } catch (error) {
    console.warn("Error obteniendo movimientos", error);
    return [];
  }
} */

// Obtener productos por despachar
export const getProductosPorDespachar = async (): Promise<ProductoPorDespachar[]> => {
    try {
        const response = await apiClient.get('/productos-por-despachar'); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos por despachar:", error);
        return []; 
    }
}

// --- FUNCIONES PARA HISTORIAL DE MOVIMIENTOS ---

// Obtener movimientos automáticos
export const getMovimientosLogistica = async (): Promise<MovimientoLogistica[]> => {
    try {
        const response = await apiClient.get('/movimientos-inventario-logistica'); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener movimientos de logística:", error);
        return [];
    }
}

// Obtener ajustes manuales
export const getAjustesManuales = async (): Promise<AjusteManual[]> => {
    try {
        const response = await apiClient.get('/ajustes-inventario'); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener ajustes manuales:", error);
        return [];
    }
}

// --- FUNCIÓN PARA GENERAR PDF ---

export const generarPDFMovimiento = (data: MovimientoData, tipo: 'logistica' | 'ajustes'): void => {
    const doc = new jsPDF();
    const isAjuste = tipo === 'ajustes';
    const titulo = isAjuste ? 'REPORTE DE AJUSTE DE INVENTARIO (MANUAL)' : 'COMPROBANTE DE MOVIMIENTO DE LOGÍSTICA';
    let y = 15; // Posición inicial vertical

    // --- ENCABEZADO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("MINI ERP", 20, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(90, 90, 90);
    doc.text(titulo, 20, y);
    y += 15;
    
    // Línea divisoria 
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 5;
    
    // --- METADATOS DEL DOCUMENTO ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-CL')}`, 190, y, { align: 'right' });
    y += 5;
    doc.text(`ID de Registro: ${data.id}`, 20, y);
    y += 10;

    // --- DETALLE DEL RESPONSABLE Y FECHAS ---
    const fechaMovimiento = isAjuste ? (data as AjusteManual).fechaAjuste : (data as MovimientoLogistica).fecha_movimiento;
    const empleado = data.empleado.nombre + ' ' + data.empleado.apellido;

    doc.setFont('helvetica', 'bold');
    doc.text("Responsable:", 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(empleado, 60, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.text("Fecha de Operación:", 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(fechaMovimiento).toLocaleDateString('es-CL'), 60, y);
    y += 10;
    
    // --- DETALLE DEL PRODUCTO ---
    doc.setFont('helvetica', 'bold');
    doc.text("PRODUCTO Y CANTIDAD:", 20, y);
    y += 7;
    
    const xProducto = 20;
    const xCantidad = 150;
    
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.rect(xProducto, y, 170, 7, 'F');
    doc.setTextColor(40, 40, 40);
    doc.text('CÓDIGO / PRODUCTO', xProducto + 2, y + 5);
    doc.text('CANTIDAD', xCantidad, y + 5);
    y += 7;
    
    doc.setTextColor(0, 0, 0);
    doc.text(`${data.producto.codigo} - ${data.producto.nombre}`, xProducto + 2, y + 5);
    doc.text(Math.abs(data.cantidad).toLocaleString(), xCantidad, y + 5);
    y += 10;


    // --- SECCIÓN ESPECÍFICA (AJUSTE vs. LOGÍSTICA) ---
    y += 10; 
    
    if (isAjuste) {
        const ajusteData = data as AjusteManual;
        
        doc.setFont('helvetica', 'bold');
        doc.text("MOTIVO DEL AJUSTE:", 20, y);
        
        doc.setFont('helvetica', 'normal');
        const observacionesFormato = doc.splitTextToSize(ajusteData.observaciones, 160);
        doc.text(observacionesFormato, 20, y + 7);
        
        doc.setFont('helvetica', 'bold');
        const accion = ajusteData.cantidad >= 0 ? "ACCIÓN: INGRESO DE STOCK" : "ACCIÓN: RETIRO DE STOCK";
        doc.text(accion, 20, y + 20);

    } else {
        const logisticaData = data as MovimientoLogistica;
      
  
        const tipoOp = logisticaData.es_recepcion ? 'RECEPCIÓN' : 'ENVÍO';
        doc.setFont('helvetica', 'normal');
        doc.text(`Tipo de Operación: ${tipoOp}`, 20, y + 7);
    }
    
    // --- PIE DE PÁGINA ---
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text("Documento generado por el Módulo de Inventario del ERP.", 190, 290, { align: 'right' });
    
    doc.save(`Comprobante_${titulo.replace(/ /g, '_')}_ID_${data.id}.pdf`);
};