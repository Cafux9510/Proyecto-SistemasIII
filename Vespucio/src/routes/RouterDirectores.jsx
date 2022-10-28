import React from 'react'
import { Routes,Route } from 'react-router-dom'
import EstructuraEscolar from '../componentes/EstructuraEscolar';

const RouterDirectores = () => {
  return (
    <Routes>
    <Route exact path="/EstructuraEscolar" element={<EstructuraEscolar/>}/>

    {/* Falta el Dashboard */}

  </Routes>
    )
}

export default RouterDirectores