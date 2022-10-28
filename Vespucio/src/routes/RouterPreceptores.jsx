import React from 'react'
import { Routes,Route } from 'react-router-dom'
import RegistrarAsistencia from '../componentes/RegistrarAsistencia';
import AsistenciaXCurso from '../componentes/AsistenciaXCurso';

const RouterPreceptores = () => {
  return (
    <Routes>
      <Route exact path="/RegistrarAsistencia" element={<RegistrarAsistencia/>}/>
      <Route exact path="/AsistenciaXCurso" element={<AsistenciaXCurso/>}/>
    </Routes>
  )
}

export default RouterPreceptores