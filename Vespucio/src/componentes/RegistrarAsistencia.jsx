import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import "../estilos/gestionMateriaXProfesor.css";
import{Routes, Route, useNavigate} from "react-router-dom";
import styled from '@emotion/styled'
import {supabase} from "../Backend/client";

const Contenedor=styled.div`
    background-color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    width:50%
`

const RegistrarAsistencia = () => {
    
    const [curso, setCurso] = useState(null);

    const [cursosPrece, setCursosPrece] = useState(null);


    const navigate=useNavigate();

    const cursosAsignados = async () => {
        
        let idDelStorage = localStorage.getItem( "idUsuario" )

      const grado = await supabase.from('personalPorAnio')
          .select(`
          id_grado`)
          .eq("id_personal",idDelStorage)
          .eq("isHabilitado_asignacion",true);

        let gradillo = grado.data[0].id_grado

      const cursosGrado = await supabase.from('anioEducativo')
          .select(`
          id_anioEduc,
          nombre_anioEduc`)
          .eq("id_grado",gradillo)
          .eq("isHabilitado_anio",true);

        setCursosPrece(cursosGrado.data);
    }

    const onCursoChange = (e) => {
        setCurso(e.value);
    }

    async function boton() {
        localStorage.setItem("idCurso", curso.id_anioEduc)
        localStorage.setItem( "nombreCurso", curso.nombre_anioEduc )
        navigate('/AsistenciaXCurso')
    }

    useEffect(()=>{
        cursosAsignados();
    },[])

  return (
        
    <div className="grid grid-nogutter  text-800 contenedorGestion">
        <Contenedor>
            <div className=" md:col-6 p-6 text-center md:text-left flex align-items-center infoInputGestion">
                    <section className='selectorGestion'>
                        <span className="block text-6xl font-bold mb-1 spanTituloGestion">Registro de asistencia</span>
                        <div className="text-2xl font-bold mb-3 subtituloGestion">Seleccione un Curso Asignado</div>
                            <Dropdown value={curso} options={cursosPrece} onChange={onCursoChange} optionLabel="nombre_anioEduc" placeholder="--Seleccione--" />
                        <br/>
                        <br/>
                        <br/>
        
                        <Button label="Seleccionar" type="button" className="mr-3 p-button-raised botonSubmitGestion" onClick={boton}/>
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