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

  console.log(localStorage.getItem( "sesionActiva" ))

  if (localStorage.getItem( "sesionActiva" )) {

    //alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)
    console.log("Pase el primer if")

    if(localStorage.getItem( "tipoUsuario" ) === 1){
      
      return(
        <LayoutAlumno/>
      )
    }else if(localStorage.getItem( "tipoUsuario" ) === 2){
      return(
        <LayoutProfesor/>
      )
    }else if(localStorage.getItem( "tipoUsuario" ) === 3){
      return(
        <LayoutAdministrativo/>
      )
    }else if(localStorage.getItem( "tipoUsuario" ) === 4){
      return(
        <LayoutDirector/>
      )
    }else if(localStorage.getItem( "tipoUsuario" ) === 5){
      console.log("Entre a prece")
      return(
        <LayoutPreceptor/>
      )
    }
    
  }else{
    return(
      <Inicio setNumero = {setNumero}/>
      // <Inicio nombre1 = {setNumero} nombre2 = {variable}/>
    )
  }



    
   
  
}

export default App