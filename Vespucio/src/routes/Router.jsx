import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Inicio from "../componentes/Inicio";
import Pagos from "../componentes/Pagos"
import Insumos from "../componentes/Insumos"
import Comprobantes from "../componentes/Comprobantes"
import TablaProveedores from "../componentes/TablaProveedores";
import EstructuraEscolar from "../componentes/EstructuraEscolar";

/*ACA MODIFICO FACUNDO-C2*/
import CategoriasInsumos from "../componentes/CategoriasInsumos";
import CategoriasProveedores from "../componentes/CategoriasProveedores";
import CategoriasComprobantes from "../componentes/CategoriasComprobantes";
import Profesores from "../componentes/Profesores";
import Alumnos from "../componentes/Alumnos";
/*HASTA ACA*/


const Router = () => {
  return (
    <Routes>
    {/* <Route exact path="/" element={<Inicio/>}/> */}
    <Route exact path="/inicio" element={<Inicio/>}/>
    <Route exact path="/comprobantes" element={<Comprobantes/>}/>
    <Route exact path="/insumos" element={<Insumos/>}/>
    <Route exact path="/TablaProveedores" element={<TablaProveedores/>}/>
    <Route exact path="/pagos" element={<Pagos/>}/>
    {/*ACA MODIFICO FACUNDO-C2*/}
    <Route exact path="/CategoriasInsumos" element={<CategoriasInsumos/>}/>
    <Route exact path="/CategoriasProveedores" element={<CategoriasProveedores/>}/>
    <Route exact path="/CategoriasComprobantes" element={<CategoriasComprobantes/>}/>
    <Route exact path="/Profesores" element={<Profesores/>}/>
    <Route exact path="/Alumnos" element={<Alumnos/>}/>
    <Route exact path="/EstructuraEscolar" element={<EstructuraEscolar/>}/>


    {/*HASTA ACA*/}
  </Routes>
    )
}

export default Router