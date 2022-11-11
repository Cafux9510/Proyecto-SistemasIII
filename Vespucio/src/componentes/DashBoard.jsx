import styled from '@emotion/styled'
import {React, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chart } from 'primereact/chart';
import "../estilos/estilos.css";
import {BarChart} from "./BarChart"
import {supabase} from "../Backend/client";



const Main = styled.div `
  margin-top:8vh;
  margin-left:0;
  background-color:white;
  width:80vw;
  height:100vh;
  overflow:scroll;

   `;
const Detalle = styled.span`
  color:grey;
  justify-content:center;

`;
const Titulo = styled.h1`
   margin-left:22vw;

`;
const SubTitulo = styled.span`
   text-align:center;
   color:black;
   font-size:16px;

`;
const Graficos = styled.div`
   width:100%;
   display:flex;
   justify-content:space-around;
`;
const Mes = styled.div`
  width:35vw;
`;
const ComparacionAnual = styled.div`
  /* justify-content:center; */
  width:35vw;
`;
const TituloCarta = styled.h1`
  font-size:1.3em;
  color:#181b3a;
`;

function DashBoard() {

  const [numeroAlumnos, setNumeroAlumnos] = useState(0);
  const [numeroProfesores, setnumeroProfesores] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);

  const cantidadDash = async()=>{
  try {
     const result= await supabase.from('dashBoardView')
     .select()     
    
     setNumeroAlumnos(result.data[0].cant);

     const result2= await supabase.from('dashBoardProfesView')
     .select()     
    
     setnumeroProfesores(result2.data[0].cant);

     const ingresosProy= await supabase.from('dashBoardIngresos')
      .select("ingresosProyectados")
    
    setIngresos(ingresosProy.data[0].ingresosProyectados);
    
         const egresosProy= await supabase.from('dashBoardEgresos')
      .select("egresos")
    
     setEgresos(egresosProy.data[0].egresos);
    



  } catch (error) {
      console.log(error)
  }
  }

const [lightOptions] = useState({
  plugins: {
      legend: {
          labels: {
              color: '#495057'
          }
      }
  }
});

useEffect(()=>{
  cantidadDash();
},[])

  return (

    <Main>
      <Titulo>Sub-Sistema de Control</Titulo>
      <br />
       <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent:'space-around',
          '& > :not(style)': {
            m: 1,
            width: 168,
            height: 108,
          },
        }}
      >
        <Paper elevation={3}> <TituloCarta>Ingresos Actuales</TituloCarta><center><b><Detalle>{ingresos}</Detalle></b></center></Paper> 
        <Paper elevation={3}> <TituloCarta>Egresos Actuales</TituloCarta><center><b><Detalle>{egresos}</Detalle></b></center></Paper> 
        <Paper elevation={3}> <TituloCarta>Total Alumnos</TituloCarta><center><b><Detalle>{numeroAlumnos}</Detalle></b></center></Paper> 
        <Paper elevation={3}> <TituloCarta>Total Profesores</TituloCarta><center><b><Detalle>{numeroProfesores}</Detalle></b></center></Paper> 

      </Box>

        <br/>
      
        <BarChart/>

        <br />
        <br />
        <br />
      
      

    </Main> 
  )
}

export default DashBoard