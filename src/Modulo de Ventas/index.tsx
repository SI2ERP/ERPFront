import { useState } from 'react'
import NavBar, { type Section } from './Components/NavBar'
import './Venta.css'

export default function VentasPage() {

    const [ sections, setSections ] = useState<Section[]>([
        {id: 'ventas', title: 'Módulo de Ventas', selected: true},
        {id: 'clientes', title: 'Clientes', selected: false},
        {id: 'pedidos', title: 'Pedidos', selected: false}
    ])

    const selectedSections = sections.find((section) => section.selected)?.id

    return (
        <div className="venta-container">
            <NavBar sections={sections} setSections={setSections} />

            {selectedSections === 'ventas' && <h1>Inicio Módulo Ventas</h1>}
            {selectedSections === 'clientes' && <h1>Gestión Clientes</h1>}
            {selectedSections === 'pedidos' && <h1>Gestión Pedidos</h1>}
            
        </div>
    )    
};
