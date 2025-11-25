import { useVentaDetalle } from "../../api/queries/VentasQueries";
import type { Venta } from "../../types/Venta"


type DialogVentaDetalleProps = {
    isOpen: boolean;
    onClose: () => void;
    venta: Venta | null;
};

export default function DialogVentaDetalle({ isOpen, onClose, venta }: DialogVentaDetalleProps) {

    const { data: detalleVenta, isLoading } = useVentaDetalle(venta ? venta.id_venta : 0)

    if (!isOpen || !venta) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content min-w-4/7!" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Detalles de la Venta #{venta.id_venta}</h2>
                    <button className="btn-cerrar" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="min-h-10 px-5 overflow-y-auto">

                    {isLoading && (
                        <p style={{ opacity: 0.8 }}>Cargando detalles...</p>
                    )}

                    {!isLoading && detalleVenta?.length === 0 && (
                        <p>No hay detalles registrados para esta venta.</p>
                    )}

                    {!isLoading && detalleVenta && detalleVenta.length > 0 && (
                        <div className="tabla-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="w-20">Producto</th>
                                        <th className="w-10">Cant.</th>
                                        <th className="w-10">Precio Unit.</th>
                                        <th className="w-10">Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {detalleVenta.map((detalle) => (
                                        <tr key={detalle.id_producto}>
                                            <td>
                                                <strong>{detalle.producto?.nombre}</strong>
                                                <br />
                                                <small style={{ opacity: 0.7 }}>
                                                    {detalle.producto?.descripcion}
                                                </small>
                                            </td>

                                            <td className="font-bold">{detalle.cantidad}</td>

                                            <td className="font-semibold">${detalle.precio_unit.toLocaleString("es-CL")}</td>

                                            <td className="font-semibold">
                                                ${(
                                                    detalle.cantidad * detalle.precio_unit
                                                ).toLocaleString("es-CL")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex flex-col gap-1 mt-5 text-right text-[1.2rem] font-bold">  
                        <h2>Subtotal: ${(venta.total).toLocaleString("es-CL")}</h2>
                        <h2>IVA: ${(venta.total * 0.19).toLocaleString("es-CL")}</h2>
                        <h2>Total: ${(venta.total * 1.19).toLocaleString("es-CL")}</h2>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-cancelar" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
