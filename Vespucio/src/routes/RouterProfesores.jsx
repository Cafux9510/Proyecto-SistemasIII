import React from 'react'
import { Routes,Route } from 'react-router-dom'
import { GestionMateriasProfesor } from '../componentes/GestionMateriasProfesor';
import MateriaXProfesor from '../componentes/MateriaXProfesor';

import Tareas from '../componentes/Tareas';


/*HASTA ACA*/


const RouterProfesores = () => {
  return (
    <Routes>   
      <Route exact path="/GestionMateriasProfesor" element={<GestionMateriasProfesor/>}/>
      <Route exact path="/MateriaXProfesor" element={<MateriaXProfesor/>}/>
      {/* <Route exact path="/Tareas" element={<Tareas/>}/> */}
    </Routes>
    )
}

export default RouterProfesores