import React, { useState, useEffect } from 'react';
import "./estilos/estilos.css";

import Login from "./componentes/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutDirector from "../src/componentes/Layouts/LayoutDirector";
import LayoutAlumno from "../src/componentes/Layouts/LayoutAlumno";
import LayoutProfesor from "../src/componentes/Layouts/LayoutProfesor";
import LayoutAdministrativo from "../src/componentes/Layouts/LayoutAdministrativo";
import LayoutPreceptor from "../src/componentes/Layouts/LayoutPreceptor";


function App() {

  // let tipo = localStorage.getItem( "tipoUsuario" )
  // let tipoInt = parseInt(tipo)
  // console.log(typeof tipoInt)

  let isSesionActiva = localStorage.getItem( "sesionActiva" )

  let tipoUsuario = parseInt(localStorage.getItem( "tipoUsuario" ))

  return(
    <div>
      { (localStorage.getItem( "sesionActiva" ) === null) && <Login/>  }
      { ((isSesionActiva !== null) && (tipoUsuario===1)) && <LayoutAlumno/>  }
      { ((isSesionActiva !== null) && (tipoUsuario===2)) && <LayoutProfesor/>  }
      { ((isSesionActiva !== null) && (tipoUsuario===3)) && <LayoutAdministrativo/>  }
      { ((isSesionActiva !== null) && (tipoUsuario===4)) && <LayoutDirector/>  }
      { ((isSesionActiva !== null) && (tipoUsuario===5)) && <LayoutPreceptor/>  }
    </div>

  )
  
  
      // Para mandar algo mas, lo puedo pasar asi.
      // <Inicio nombre1 = {setNumero} nombre2 = {variable}/>
  

  // if (localStorage.getItem( "sesionActiva" )) {

  //   //alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)
  //   console.log("Pase el primer if")

  //   if(localStorage.getItem( "tipoUsuario" ) === 1){
      
  //     return(
  //       <LayoutAlumno/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 2){
  //     return(
  //       <LayoutProfesor/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 3){
  //     return(
  //       <LayoutAdministrativo/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 4){
  //     return(
  //       <LayoutDirector/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 5){
  //     console.log("Entre a prece")
  //     return(
  //       <LayoutPreceptor/>
  //     )
  //   }
    
  // }else{

  // }

   
  
}

export default App