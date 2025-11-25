import '../Venta.css'

export type Section = {
    id : string
    title : string
    selected : boolean
}


type NavBarProps = {
    sections : Section[]
    setSections : (id : string) => void 
}

export default function NavBar({ sections, setSections } : NavBarProps) {


    return (
        <div className='venta-header'>
            {sections.map((section) => (
                <button  
                    className={`nav-btn ${section.selected ? 'active' : ''} ${section.id === 'ventas' ? 'selected-section' : ''}`}
                    key={section.id}
                    onClick={() => (setSections(section.id))} 
                >
                    <h2>{section.title}</h2>
                </button>
            ))}
        </div>
    )    
};
