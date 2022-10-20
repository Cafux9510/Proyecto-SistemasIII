import React from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import "../estilos/gestionMateriaXProfesor.css";

const RegistrarAsistencia = () => {
    const cursos = [
        {label: '1°Año A', value: '1a'},
        {label: '1°Año B', value: '1b'},
        {label: '7° A', value: '7a'},
        {label: '5° A', value: '5a'},
        {label: '2° A', value: '2A'}
    ];
  return (
        
    <div className="grid grid-nogutter  text-800 contenedorGestion">
        <div className=" md:col-6 p-6 text-center md:text-left flex align-items-center infoInputGestion">
            <section className='selectorGestion'>
                <span className="block text-6xl font-bold mb-1 spanTituloGestion">Registro de asistencia</span>
                <div className="text-4xl font-bold mb-3 subtituloGestion">Seleccione la Materia</div>

                <Dropdown value={"materia"} options={cursos} onChange={(e) => setCity(e.value)} placeholder="Seleccione Materia"/>
 
                <Button label="Seleccionar" type="button" className="mr-3 p-button-raised botonSubmitGestion" />
            </section>
        </div>
        <div className=" md:col-6 overflow-hidden imagenGestion">
            <img src="https://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_960_720.jpg" alt="hero-1" className="md:ml-auto block md:h-full"  />
        </div>
    </div>
    
    
  )
}

export default RegistrarAsistencia;