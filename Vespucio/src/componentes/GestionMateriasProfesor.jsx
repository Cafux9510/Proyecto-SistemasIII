import React from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import "../estilos/gestionMateriaXProfesor.css";

export const GestionMateriasProfesor = () => {
    const materias = [
        {label: 'Matematicas', value: 'Mat'},
        {label: 'Lengua', value: 'Leng'},
        {label: 'Fisica', value: 'Fis'},
        {label: 'Educacion Fisica', value: 'PE'},
        {label: 'Historia', value: 'Hist'}
    ];
  return (
        
    <div className="grid grid-nogutter surface-0 text-800 contenedorGestion">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center infoInput ">
            <section className='selector'>
                <span className="block text-6xl font-bold mb-1 spanTitulo">Gestione sus Materias</span>
                <div className="text-4xl font-bold mb-3 subtitulo">Seleccione la Materia</div>

                <Dropdown value={"materia"} options={materias} onChange={(e) => setCity(e.value)} placeholder="Seleccione Materia"/>
 
                <Button label="Seleccionar" type="button" className="mr-3 p-button-raised botonSubmit" />
            </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden imagen">
            <img src="https://cdn.pixabay.com/photo/2014/03/12/18/45/boys-286245_960_720.jpg" alt="hero-1" className="md:ml-auto block md:h-full"  />
        </div>
    </div>
    
    
  )
}
