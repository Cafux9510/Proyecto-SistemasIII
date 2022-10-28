import React from 'react'
import { Routes,Route } from 'react-router-dom'
import CargaTareas from '../componentes/CargaTareas';

const RouterAlumnos = () => {
  return (
    <Routes> 
      <Route exact path="/CargaTareas" element={<CargaTareas/>}/>
  </Routes>
    )
}

export default RouterAlumnos