import React from 'react'
import { Routes,Route } from 'react-router-dom'
import EstructuraEscolar from '../componentes/EstructuraEscolar';
import DashBoard from '../componentes/DashBoard';

const RouterDirectores = () => {
  return (
    <Routes>
    <Route exact path="/EstructuraEscolar" element={<EstructuraEscolar/>}/>
    <Route exact path="/DashBoard" element={<DashBoard/>}/>

  </Routes>
    )
}

export default RouterDirectores