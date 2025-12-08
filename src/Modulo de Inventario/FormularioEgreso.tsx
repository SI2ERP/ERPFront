import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Inventario.css'
// Importamos actualizarProducto que acabamos de restaurar
import { type Producto, restarStockProducto, actualizarProducto } from './inventario.service'
import { useAuth } from "../utils/AuthContext";

interface FormularioEgresoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  producto: Producto | null;
}

const FormularioEgreso = ({ isOpen, onClose, onSuccess, producto }: FormularioEgresoProps) => {
  const { user } = useAuth();
  
  const [cantidadStr, setCantidadStr] = useState("1")
  const [tipoAccion, setTipoAccion] = useState<'AGREGAR' | 'QUITAR'>('AGREGAR')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setCantidadStr("1")
      setTipoAccion("AGREGAR")
      setError(null)
    }
  }, [isOpen, producto])

  if (!isOpen || !producto) return null

  // --- 1. SOLUCIÓN AL PROBLEMA DE VISUALIZACIÓN ---
  const p = producto as any; 
  // Buscamos cantidad, si no existe buscamos stock, si no 0.
  const stockBase = (p.cantidad !== undefined && p.cantidad !== null)
    ? Number(p.cantidad) 
    : ((p.stock !== undefined && p.stock !== null) ? Number(p.stock) : 0);

  const cantidadInput = cantidadStr === '' ? 0 : parseInt(cantidadStr);
  const cantidadValida = isNaN(cantidadInput) ? 0 : cantidadInput;

  // Cálculo visual
  const stockFuturo = tipoAccion === 'AGREGAR' 
    ? stockBase + cantidadValida
    : stockBase - cantidadValida;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (cantidadValida <= 0) {
      setError('Error: La cantidad debe ser un número entero mayor a 0.')
      setIsLoading(false)
      return
    }

    if (tipoAccion === 'QUITAR' && cantidadValida > stockBase) {
      setError('Error: No puedes retirar más stock del disponible.')
      setIsLoading(false)
      return
    }

    if (!user) {
      setError('Error: No hay sesión de usuario activa.');
      setIsLoading(false);
      return;
    }

    try {
      // --- 2. SOLUCIÓN AL PROBLEMA DE AGREGAR ---
      
      if (tipoAccion === 'QUITAR') {
        // Para restar usamos el endpoint específico (funciona bien)
        const response = await restarStockProducto(producto.id, cantidadValida, user);
        
        if (response.error) throw new Error(response.error);
        onSuccess(`Stock actualizado. Nuevo total: ${response.stockActual ?? stockFuturo}`)
      
      } else {
        // Para agregar, calculamos el total y usamos el endpoint de actualización
        const nuevoTotal = stockBase + cantidadValida;
        
        // ¡OJO AQUÍ! Enviamos 'stock', NO 'cantidad'. Esto arregla el error "property shouldn't exist"
        const datosParaEnviar = {
            stock: nuevoTotal,
            user: user
        };

        await actualizarProducto(producto.id, datosParaEnviar);
        
        onSuccess(`Stock actualizado. Nuevo total: ${nuevoTotal}`)
      }

    } catch (err: any) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.response?.data?.error;
        setError(msg || 'Error al conectar con el servidor.')
      } else {
        setError(err.message || 'Ocurrió un error inesperado.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Estilos visuales
  const radioGroupStyle: React.CSSProperties = { display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' };
  const labelStyle: React.CSSProperties = { cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' };
  const activeAddStyle: React.CSSProperties = { ...labelStyle, borderColor: '#646cff', backgroundColor: 'rgba(100, 108, 255, 0.2)', fontWeight: 'bold' };
  const activeRemoveStyle: React.CSSProperties = { ...labelStyle, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', fontWeight: 'bold' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', fontSize: '1.2em', textAlign: 'center', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: '#fff', outline: 'none' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{maxWidth: '450px', backgroundColor: '#2b2b2b', color: '#fff'}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajuste de Stock</h2>
          <button className="btn-cerrar" onClick={onClose} style={{color:'#fff'}}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{textAlign: 'center', fontSize: '1.1em', marginBottom: '1.5rem'}}>
              Producto: <br/><strong style={{fontSize:'1.3em', color:'#646cff'}}>{producto.nombre}</strong>
            </p>

            <div style={radioGroupStyle}>
              <label style={tipoAccion === 'AGREGAR' ? activeAddStyle : labelStyle}>
                <input type="radio" name="accion" value="AGREGAR" checked={tipoAccion === 'AGREGAR'} onChange={() => setTipoAccion('AGREGAR')} style={{accentColor: '#646cff'}} />
                (+) Agregar
              </label>
              <label style={tipoAccion === 'QUITAR' ? activeRemoveStyle : labelStyle}>
                <input type="radio" name="accion" value="QUITAR" checked={tipoAccion === 'QUITAR'} onChange={() => setTipoAccion('QUITAR')} style={{accentColor: '#ef4444'}} />
                (-) Quitar
              </label>
            </div>

            <div className="form-group full-width">
              <label htmlFor="cantidadAjuste" style={{marginBottom:'8px', display:'block'}}>Cantidad</label>
              <input id="cantidadAjuste" type="number" min="1" value={cantidadStr} onChange={(e) => setCantidadStr(e.target.value)} required autoFocus style={inputStyle} />
            </div>

            <div style={{
              marginTop: '20px', padding: '15px', backgroundColor: '#1a1a1a', 
              borderRadius: '8px', textAlign: 'center', border: '1px solid #444',
              borderLeft: `5px solid ${tipoAccion === 'AGREGAR' ? '#646cff' : '#ef4444'}`
            }}>
              <span style={{color: '#aaa', fontSize: '0.9em'}}>Actual:</span> 
              <strong style={{marginLeft:'5px', fontSize: '1.2em', color: '#ffffff'}}>{stockBase}</strong>
              <span style={{margin: '0 15px', color: '#666'}}>➜</span>
              <span style={{color: '#aaa', fontSize: '0.9em'}}>Nuevo:</span>
              <strong style={{marginLeft:'5px', fontSize: '1.2em', color: tipoAccion === 'AGREGAR' ? '#a5b4fc' : '#fca5a5'}}>
                {stockFuturo < 0 ? 0 : stockFuturo}
              </strong>
            </div>

            {error && <p className="error-mensaje" style={{marginTop: '1rem', textAlign: 'center', color: '#ff6b6b'}}>{error}</p>}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={isLoading}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={isLoading} style={{
                backgroundColor: tipoAccion === 'QUITAR' ? '#991b1b' : '#4338ca', color: 'white', border: 'none'
            }}>
              {isLoading ? 'Confirmar' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioEgreso