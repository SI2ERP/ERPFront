import React, { useState } from 'react'
import axios from 'axios'
import './Inventario.css'
import { type CreateProductoDto, createProducto } from './inventario.service'
import { useAuth } from "../utils/AuthContext";

interface IngresoFormState {
  nombre: string;
  codigo: string;
  descripcion?: string;
  precio_unitario: string; // <-- CAMBIO
  precio_venta: string; // <-- CAMBIO
  cantidad: string; // <-- CAMBIO
}

const initialFormData: IngresoFormState = {
  nombre: '',
  codigo: '',
  descripcion: '',
  precio_unitario: '', // <-- CAMBIO
  precio_venta: '', // <-- CAMBIO
  cantidad: '', // <-- CAMBIO
}

interface FormularioIngresoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const FormularioIngreso = ({ isOpen, onClose, onSuccess }: FormularioIngresoProps) => {
  if (!isOpen) return null
  const { user } = useAuth();
  const [formData, setFormData] = useState<IngresoFormState>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
        ...prev,
        [name]: value,
    }))
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // 1. Convertimos los strings del formulario a números para la API
    const datosAPI: CreateProductoDto = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        descripcion: formData.descripcion,
        precio_unitario: parseFloat(formData.precio_unitario) || 0,
        precio_venta: parseFloat(formData.precio_venta) || 0,
        stock: parseInt(formData.cantidad) || 0,
        user: user,
    }

    // 2. Hacemos la validación con los números convertidos
    if (datosAPI.precio_venta < datosAPI.precio_unitario) {
        setError('Error: El Precio de Venta no puede ser menor al Costo (Precio Unitario).')
        setIsLoading(false)
        return
    }

    try {
        // 3. Enviamos los datos numéricos (datosAPI) al backend
        const res = await createProducto(datosAPI)
        setFormData(initialFormData) // Resetea el formulario a strings vacíos
        if (res.error) {
          alert(`${res.error}, Código ya existe.`)
        } else {
          onSuccess('Producto creado exitosamente.')
        }
    } catch (err) {
        console.error(err)
        if (axios.isAxiosError(err)) {
        if (err.response?.data?.error?.includes('unique constraint')) {
            setError('Error: El Código ya existe.')
        } else {
            setError('Error al crear el producto. Revise los campos.')
        }
        } else {
        setError('Ocurrió un error inesperado.')
        }
    } finally {
        setIsLoading(false)
    }
}

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>+ Ingresar Nuevo Producto</h2>
          <button className="btn-cerrar" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input id="nombre" name="nombre" type="text" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input id="codigo" name="codigo" type="text" value={formData.codigo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="precio_unitario">Costo (Precio Unitario)</label>
                <input id="precio_unitario" name="precio_unitario" type="number" min="0" step="0.01" value={formData.precio_unitario} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="precio_venta">Precio Venta</label>
                <input id="precio_venta" name="precio_venta" type="number" min="0" step="0.01" value={formData.precio_venta} onChange={handleChange} required />
              </div>
              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción (Opcional)</label>
                <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label htmlFor="cantidad">Stock Inicial (Cantidad)</label>
                <input id="cantidad" name="cantidad" type="number" min="0" value={formData.cantidad} onChange={handleChange} />
              </div>
            </div>
            {error && <p className="error-mensaje" style={{marginTop: '1rem'}}>{error}</p>}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioIngreso