import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import "../estilos/gestionMateriaXProfesor.css";
import{Routes, Route, useNavigate} from "react-router-dom";
import styled from '@emotion/styled'

const Contenedor=styled.div`
    background-color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    width:50%
`

const RegistrarAsistencia = () => {
    
    const [curso, setCurso] = useState(null);


    const navigate=useNavigate();

    const cursos = [
        {label: '1°Año A', value: '1a'},
        {label: '1°Año B', value: '1b'},
        {label: '7° A', value: '7a'},
        {label: '5° A', value: '5a'},
        {label: '2° A', value: '2A'}
    ];
    const onCursoChange = (e) => {
        setCurso(e.value);
    }
  return (
        
    <div className="grid grid-nogutter  text-800 contenedorGestion">
        <Contenedor>
            <div className=" md:col-6 p-6 text-center md:text-left flex align-items-center infoInputGestion">
                    <section className='selectorGestion'>
                        <span className="block text-6xl font-bold mb-1 spanTituloGestion">Registro de asistencia</span>
                        <div className="text-2xl font-bold mb-3 subtituloGestion">Seleccione un Curso Asignado</div>
                            <Dropdown value={curso} options={cursos} onChange={onCursoChange} optionLabel="name" placeholder="--Seleccione--" />
                        <br/>
                        <br/>
                        <br/>
        
                        <Button label="Seleccionar" type="button" className="mr-3 p-button-raised botonSubmitGestion" onClick={()=>navigate('/AsistenciaXCurso')}/>
                    </section>
            </div>
        </Contenedor>
        <div className=" md:col-6 overflow-hidden imagenGestion">
            <img src="https://cdn.pixabay.com/photo/2018/11/17/07/10/notebook-3820634_960_720.jpg" alt="hero-1" className="md:ml-auto block md:h-full"  />
        </div>
    </div>
    
    
  )
}

export default RegistrarAsistencia;