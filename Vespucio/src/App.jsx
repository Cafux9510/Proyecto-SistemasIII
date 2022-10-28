import LayoutAlumno from "./componentes/Layouts/LayoutAlumno";
import LayoutProfesor from "./componentes/Layouts/LayoutProfesor";
import LayoutAdministrativo from "./componentes/Layouts/LayoutAdministrativo";
import LayoutDirector from "./componentes/Layouts/LayoutDirector";
import LayoutPreceptor from "./componentes/Layouts/LayoutPreceptor";
import React, { useState, useEffect } from 'react';
import "./estilos/estilos.css";
import Inicio from "./componentes/Inicio";

function App() {

  const[numero,setNumero] = useState(0)

  // let variable=1;
// alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)
  if (numero === 0) {
    return(
      <Inicio setNumero = {setNumero}/>
      // <Inicio nombre1 = {setNumero} nombre2 = {variable}/>
    )
  }else if(numero === 1){
    return(
      <LayoutAlumno/>
    )
  }else if(numero === 2){
    return(
      <LayoutProfesor/>
    )
  }else if(numero === 3){
    return(
      <LayoutAdministrativo/>
    )
  }else if(numero === 4){
    return(
      <LayoutDirector/>
    )
  }else if(numero === 5){
    return(
      <LayoutPreceptor/>
    )
  }
  
}

export default App