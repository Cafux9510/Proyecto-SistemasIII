import React from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import "../estilos/gestionMateriaXProfesor.css";
import{useNavigate} from "react-router-dom";

import styled from '@emotion/styled'


const Contenedor=styled.div`
    background-color:white;
    display:flex;
    align-items:center;
    justify-content:center;
`

export const GestionMateriasProfesor = () => {
    const navigate = useNavigate();
    const materias = [
        {label: 'Matematicas', value: 'Mat'},
        {label: 'Lengua', value: 'Leng'},
        {label: 'Fisica', value: 'Fis'},
        {label: 'Educacion Fisica', value: 'PE'},
        {label: 'Historia', value: 'Hist'}
    ];
  return (
        
    <div className="grid grid-nogutter text-800 contenedorGestion">
        <Contenedor> 
            <div className="md:col-6 p-6 text-center md:text-left flex align-items-center " >
                <section>
                    <span className="block text-6xl font-bold mb-1 spanTituloGestion" >Gestione sus Materias</span>
                    <div className="text-4xl font-bold mb-3 subtituloGestion">Seleccione la Materia</div>

                    <Dropdown value={"materia"} options={materias} onChange={(e) => setCity(e.value)} placeholder="Seleccione Materia"/>
                    <br />
                    <br />
                    <Button label="Seleccionar" onClick={()=>navigate('/MateriaXProfesor')} type="button" className="mr-3 p-button-raised botonSubmitGestion" />
                </section>
            </div>
        </Contenedor>
            <div className="md:col-6 overflow-hidden">
                <img src="https://cdn.pixabay.com/photo/2014/03/12/18/45/boys-286245_960_720.jpg" alt="hero-1" className="md:ml-auto block md:h-full"  />
            </div>
        
    </div>
    
    
  )
}
