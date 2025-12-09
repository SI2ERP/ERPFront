import React, { useState } from 'react'
import axios from 'axios'
import './Inventario.css'
import { type CreateProductoDto, createProducto } from './inventario.service'
import { useAuth } from "../utils/AuthContext";

interface IngresoFormState {
  nombre: string;
  descripcion?: string;
}

const initialFormData: IngresoFormState = {
  nombre: '',
  descripcion: '',
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

    // Creamos el objeto solo con lo necesario para la solicitud
    const datosAPI: CreateProductoDto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        user: user,
    }

    try {
        const res = await createProducto(datosAPI)
        setFormData(initialFormData) // Limpiar formulario
        
        if (res.error) {
          alert(`${res.error}`)
        } else {
          onSuccess('Solicitud de producto creada exitosamente.')
        }
    } catch (err) {
        console.error(err)
        if (axios.isAxiosError(err)) {
            // Manejo genérico de errores
            const msg = err.response?.data?.message || 'Error al solicitar el producto.';
            setError(msg)
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
          {/* CAMBIO: Título actualizado */}
          <h2>Solicitar Nuevo Producto</h2>
          <button className="btn-cerrar" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              {/* Solo Nombre */}
              <div className="form-group full-width">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input 
                  id="nombre" 
                  name="nombre" 
                  type="text" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ej: Monitor LED 24''"
                />
              </div>

              {/* Solo Descripción */}
              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción (Opcional)</label>
                <textarea 
                  id="descripcion" 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleChange} 
                  placeholder="Detalles adicionales..."
                  rows={3}
                />
              </div>

            </div>
            {error && <p className="error-mensaje" style={{marginTop: '1rem'}}>{error}</p>}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {/* CAMBIO: Texto del botón */}
              {isLoading ? 'Enviando...' : 'Solicitar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioIngreso