import { useState } from 'react'
import NavBar, { type Section } from './Components/NavBar'
import './Venta.css'
import GestionCliente from './views/GestionCliente'
import GestionVentas from './views/GestionVentas'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Cliente } from './types/Cliente'


const queryClient = new QueryClient()

export default function VentasPage() {

    const [ sections, setStateSections ] = useState<Section[]>([
        {id: 'ventas', title: 'Módulo de Ventas', selected: true},
        {id: 'clientes', title: 'Clientes', selected: false},
        {id: 'pedidos', title: 'Pedidos', selected: false}
    ])

    const setSections = (id : string) => {
        setStateSections(sections.map((section) => (
            {...section, selected : (section.id === id)}
        )))
    }

    const [ selectedClient, setSelectedClient ] = useState<string>('')

    const selectedSections = sections.find((section) => section.selected)?.id



    return (
        <QueryClientProvider client={queryClient}>
            <div className="venta-container">
                <NavBar sections={sections} setSections={setSections} />

                { selectedSections === 'ventas' &&
                     <h1>
                        Inicio Módulo Ventas
                     </h1>
                }
                { selectedSections === 'clientes' && 
                    <GestionCliente 
                        onSelectClient={(c : Cliente) => setSelectedClient(c.email)} 
                        setSection={setSections} 
                    />
                }
                { selectedSections === 'pedidos' && 
                    <GestionVentas 
                        selectedClient={selectedClient}
                    />
                }
                
            </div>
        </QueryClientProvider>
    )    
};
