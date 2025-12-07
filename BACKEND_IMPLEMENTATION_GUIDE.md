# Guía de Implementación Backend: Flujo de Creación de Nuevos Productos

Esta guía detalla los cambios necesarios en el Backend para soportar el flujo de "Alta de Producto y Vinculación de Proveedor" desde una Solicitud de Producto.

## 1. Nuevo Endpoint: Procesar Solicitud de Producto

Se requiere un nuevo endpoint transaccional que realice múltiples operaciones atómicas.

**Ruta Sugerida:** `POST /api/products/create-from-request`

**Autorización:** Requiere Rol `JEFE_COMPRAS`.

### Payload (JSON de entrada)
El frontend enviará un objeto con la información combinada del producto y la vinculación con el proveedor.

```json
{
  "solicitud_id": 1,              // ID de la solicitud original (para cerrar/borrar)
  "producto": {
    "nombre": "Webcam 1080p",     // Viene de la solicitud (o editado)
    "descripcion": "...",         // Viene de la solicitud
    "precio_venta": 80000,        // Nuevo dato (Precio Público)
    "stock_minimo": 5             // Opcional
  },
  "vinculacion_proveedor": {
    "id_proveedor": 4,            // Proveedor seleccionado
    "precio_costo": 50000         // Precio negociado (se guardará en producto_proveedor)
  }
}
```

### Lógica del Controlador (Pseudocódigo)

El backend debe validar primero que el usuario que realiza la petición tenga el rol `JEFE_COMPRAS`. Si no lo tiene, retornar `403 Forbidden`.

Luego, abrir una **Transacción de Base de Datos** (`BEGIN TRANSACTION`) y ejecutar los siguientes pasos. Si alguno falla, debe hacer `ROLLBACK`.

#### Paso 1: Crear el Producto
Insertar en la tabla `producto`.
*   `nombre`, `descripcion`, `precio_venta` vienen del payload.
*   `codigo` se genera automáticamente (Trigger/Sequence).
*   `cantidad` (stock) se inicializa en **0** (o dejar que el DEFAULT/Trigger de la BD lo maneje).
*   `estado` = `true`.
*   **Retorno:** Obtener el `id_producto` generado (ej: 105).

#### Paso 2: Vincular Proveedor
Insertar en la tabla `producto_proveedor`.
*   `id_producto`: 105
*   `id_proveedor`: `vinculacion_proveedor.id_proveedor`
*   `precio_proveedor`: `vinculacion_proveedor.precio_costo`
*   `activo`: `true`

#### Paso 3: Cerrar Solicitud
Actualizar o Eliminar el registro en `solicitud_producto`.
*   **Opción A (Recomendada - Historial):** `UPDATE solicitud_producto SET estado_solicitud = true WHERE id_solicitud = payload.solicitud_id`
*   **Opción B (Borrado):** `DELETE FROM solicitud_producto WHERE id_solicitud = payload.solicitud_id`

#### Paso 4: Commit
Hacer `COMMIT` de la transacción y retornar éxito.

---

## 2. Nuevos Endpoints de Consulta

### Listar Solicitudes Pendientes
**Ruta:** `GET /api/product-requests/pending`
*   Debe retornar las filas de `solicitud_producto` donde `estado_solicitud = false`.

---

## 3. Consideraciones de Base de Datos

*   Asegurarse de que la tabla `producto` ya no requiera `precio_unitario` como obligatorio (si se eliminó la columna).
*   Asegurarse de que el `codigo` (SKU) sea único en la tabla `producto`.
