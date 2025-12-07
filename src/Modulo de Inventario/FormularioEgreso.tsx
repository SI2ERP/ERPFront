import React, { useState } from 'react'
import axios from 'axios'
import './Inventario.css'
import { type Producto, restarStockProducto } from './inventario.service'
import { useAuth } from "../utils/AuthContext";

interface FormularioEgresoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  producto: Producto | null;
}

const FormularioEgreso = ({ isOpen, onClose, onSuccess, producto }: FormularioEgresoProps) => {
  if (!isOpen || !producto) return null
  const { user } = useAuth();
  const [cantidadStr, setCantidadStr] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const cantidad = Number(cantidadStr);

    if (isNaN(cantidad)) {
      setError('Error: La cantidad debe ser un número.')
      setIsLoading(false)
      return
    }
    if (!Number.isInteger(cantidad)) {
      setError('Error: La cantidad debe ser un número entero.')
      setIsLoading(false)
      return
    }
    if (cantidad <= 0) {
      setError('Error: La cantidad a retirar debe ser mayor a 0.')
      setIsLoading(false)
      return
    }
    if (cantidad > producto.cantidad) {
      setError('Error: No puedes retirar más stock del disponible.')
      setIsLoading(false)
      return
    }

    try {
      const response = await restarStockProducto(producto.id, cantidad, user);
      
      if (response.error) {
        setError(response.error)
      } else {
        onSuccess(`Stock actualizado. Nuevo total: ${response.stockActual}`)
      }
    } catch (err) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        setError('Error al conectar con el servidor.')
      } else {
        setError('Ocurrió un error inesperado.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{maxWidth: '450px'}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Actualizar Stock</h2>
          <button className="btn-cerrar" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{textAlign: 'center', fontSize: '1.1em', marginBottom: '1.5rem'}}>
              Producto: <strong>{producto.nombre}</strong><br/>
              Stock Actual: <strong>{producto.cantidad}</strong>
            </p>
            <div className="form-group full-width">
              <label htmlFor="cantidadRetirar">Cantidad a Retirar</label>
              <input 
                id="cantidadRetirar" 
                name="cantidadRetirar" 
                type="number" 
                min="1"
                value={cantidadStr} 
                onChange={(e) => setCantidadStr(e.target.value)} 
                required 
              />
            </div>
            {error && <p className="error-mensaje" style={{marginTop: '1rem'}}>{error}</p>}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Confirmar Retiro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioEgreso