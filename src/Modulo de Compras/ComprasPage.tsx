import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaOrdenes from './ListaOrdenes';
import OrdenCompraForm from './OrdenCompraForm';
import VerOrdenCompra from './VerOrdenCompra';
import ProductosSinStock from './ProductosSinStock';

const ComprasPage: React.FC = () => {
  return (
    <Routes>
      {/* Ruta principal del módulo - Lista de órdenes */}
      <Route path="/" element={<ListaOrdenes />} />
      
      {/* Ruta para crear nueva orden */}
      <Route path="/nueva" element={<OrdenCompraForm />} />
      
      {/* Ruta para ver una orden específica */}
      <Route path="/ver/:id" element={<VerOrdenCompra />} />
      
      {/* Ruta para editar una orden específica */}
      <Route path="/editar/:id" element={<OrdenCompraForm />} />
      
      {/* Ruta para ver productos sin stock */}
      <Route path="/productos-sin-stock" element={<ProductosSinStock />} />
    </Routes>
  );
};

export default ComprasPage;