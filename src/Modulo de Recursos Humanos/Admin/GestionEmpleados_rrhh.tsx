import { useEffect, useState } from "react";

interface Empleado {
  id_empleado: number;
  rut: string;
  nombre: string;
  apellido: string;
  fecha_ingreso: string;
  estado: string;
}

export const GestionEmpleados_rrhh = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    id_departamento: 1, // puedes hacerlo dinámico más adelante
  });

  // Cargar empleados existentes
  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then(setEmpleados)
      .catch((err) => console.error(err));
  }, []);

  // Agregar empleado
  const handleAgregar = async () => {
    const res = await fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoEmpleado),
    });
    if (res.ok) {
      alert("Empleado agregado correctamente");
      const data = await res.json();
      setEmpleados([...empleados, data]);
    } else {
      alert("Error al agregar empleado");
    }
  };

  // Despedir empleado
  const handleDespedir = async (id_empleado: number) => {
    const confirmacion = confirm("¿Seguro que deseas despedir a este empleado?");
    if (!confirmacion) return;

    const res = await fetch(``, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("Empleado despedido");
      setEmpleados(empleados.filter((e) => e.id_empleado !== id_empleado));
    } else {
      alert("Error al despedir empleado");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Empleados</h1>

      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Agregar Empleado</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded"
            placeholder="RUT"
            value={nuevoEmpleado.rut}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, rut: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Nombre"
            value={nuevoEmpleado.nombre}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Apellido"
            value={nuevoEmpleado.apellido}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
          />
          <button onClick={handleAgregar} className="bg-blue-500 text-white px-4 rounded">
            Agregar
          </button>
        </div>
      </div>

      
      <h2 className="text-xl font-semibold mb-2">Empleados Actuales</h2>
      <ul className="space-y-2">
        {empleados.map((emp) => (
          <li
            key={emp.id_empleado}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>
              {emp.nombre} {emp.apellido} — {emp.rut} ({emp.estado})
            </span>
            <button
              onClick={() => handleDespedir(emp.id_empleado)}
              className="bg-red-500 text-white px-3 rounded"
            >
              Despedir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
