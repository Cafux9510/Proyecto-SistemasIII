import React from 'react'
import { Routes,Route } from 'react-router-dom'
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

import Cobranzas from '../componentes/Cobranzas';

/*HASTA ACA*/


const RouterAdministrativos = () => {
  return (
    <Routes>
    <Route exact path="/"/>
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
    <Route exact path="/Materias" element={<Materias />} />


    <Route exact path="/Cobranzas" element={<Cobranzas/>}/>    



    {/*HASTA ACA*/}
  </Routes>
    )
}

export default RouterAdministrativos