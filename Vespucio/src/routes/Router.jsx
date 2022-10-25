import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Inicio from "../componentes/Inicio";
import Pagos from "../componentes/Pagos"
import Insumos from "../componentes/Insumos"
import Comprobantes from "../componentes/Comprobantes"
import TablaProveedores from "../componentes/TablaProveedores";

/*ACA MODIFICO FACUNDO-C2*/
import CategoriasInsumos from "../componentes/CategoriasInsumos";
import CategoriasProveedores from "../componentes/CategoriasProveedores";
import CategoriasComprobantes from "../componentes/CategoriasComprobantes";
import Alumnos from "../componentes/Alumnos";
import AsignacionPersonal from '../componentes/AsignacionPersonal';
import PersonalEducativo from '../componentes/PersonalEducativo';
import Materias from '../componentes/Materias';
import EstructuraEscolar from '../componentes/EstructuraEscolar';
/*HASTA ACA*/


const Router = () => {
  return (
    <Routes>
    {/* <Route exact path="/" element={<Inicio/>}/> */}
    <Route exact path="/" element={<Inicio/>}/>
    <Route exact path="/comprobantes" element={<Comprobantes/>}/>
    <Route exact path="/insumos" element={<Insumos/>}/>
    <Route exact path="/TablaProveedores" element={<TablaProveedores/>}/>
    <Route exact path="/pagos" element={<Pagos/>}/>
    {/*ACA MODIFICO FACUNDO-C2*/}
    <Route exact path="/CategoriasInsumos" element={<CategoriasInsumos/>}/>
    <Route exact path="/CategoriasProveedores" element={<CategoriasProveedores/>}/>
    <Route exact path="/CategoriasComprobantes" element={<CategoriasComprobantes/>}/>
    <Route exact path="/AsignacionPersonal" element={<AsignacionPersonal/>}/>
    <Route exact path="/Alumnos" element={<Alumnos/>}/>
    <Route exact path="/PersonalEducativo" element={<PersonalEducativo/>}/>
    <Route exact path="/Materias" element={<Materias/>}/>
    <Route exact path="/EstructuraEscolar" element={<EstructuraEscolar/>}/>
    {/*HASTA ACA*/}
  </Routes>
    )
}

export default Router