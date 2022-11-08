import React, { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import styled from '@emotion/styled';

import {supabase} from "../Backend/client";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuBookIcon from '@mui/icons-material/MenuBook';


import{Routes, Route, useNavigate} from "react-router-dom";
import RegistrarAsistencia from "./RegistrarAsistencia";


const Main = styled.div `
  margin-top:6%;
  margin-left:1%;
  background-color:white;
  width:80vw;
  height:100vh;
  
   `;
 const Datos= styled.div`
    width:100%;
    display:flex;
    justify-content:space-evenly
 `;
 const Contenido=styled.div`
    width:100%;
    display:flex;
    margin-left:0; 
    /* align-items:center; */

 `
 const TablaLista=styled.div`
    width:70%;
 `
 const Botones= styled.div`
    width:30%;
    margin-left:0px;
    display:flex;
    justify-content:space-evenly;
    flex-direction:column;
    align-items:flex-start;
 `;

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function AsistenciaXCurso() {
  const navigate = useNavigate();

  const [checked, setChecked] = React.useState([]);
  const [alumnos, setAlumnos] = useState([]);

  let tiempoTranscurrido = Date.now();
  let hoy = (new Date(tiempoTranscurrido)).toLocaleDateString();
  console.log(hoy)

  let curso = localStorage.getItem( "nombreCurso" )


  const funcion = async()=>{
    try {

//aca tendria que traer solo los que no tome asistencia todavia
      //osea es hacer teoria de conjuntos entre todos - los que ya tome

      let idCurso = localStorage.getItem("idCurso");
      
      //Este te trae todos los alumnos de un curso
      const result = await supabase.from('alumnosPorAnioView')
      .select("id_alumno, concatenado")
      .eq("idAnio",idCurso)

      //Este te trae todos los alumnos presentes
      const result2 = await supabase.from('asistenciaAlumno')
        .select("id_alumno")
        .eq("id_anioEduc", idCurso)
        .eq("fecha_asistencia",hoy)
 
      // setAlumnos(result.data)
      // setChecked(result.data)

      let todos = result.data
      let presentes = result2.data
      console.log(todos);
      console.log(presentes);

      var ausentes=[];
      todos.forEach(i => {
        var existe = false;
        var igual = false;
        presentes.forEach(j => {
          !igual && i.id_alumno== j.id_alumno&& (existe= true);
        });
        !existe && ausentes.push(i);
      });

      console.log(ausentes);
      setAlumnos(ausentes);
      setChecked(ausentes);
      
      // setAlumnos(value);
        // setChecked(value);
      //console.log(ausentes);
      // setAlumnos(ausentes);
      // setChecked(ausentes);


        } catch (error) {
            console.log(error)
        }
  }

  const submit = async()=>{
    try {

        let idCurso = localStorage.getItem("idCurso");

        checked.map(async(element) =>{
        
          const veriAsis  = await supabase.from("asistenciaAlumno")
          .select()
          .eq("id_alumno", element.id_alumno)
          .eq("fecha_asistencia", hoy)
                
        if (veriAsis.data.length === 0) {
          let id = element.id_alumno;
          const resultado = await supabase.from("asistenciaAlumno").insert({
            id_alumno: id,
            fecha_asistencia: hoy,
            id_anioEduc:idCurso
          });
        window.location.reload()
        }        
      });
      } catch (error) {
        console.log(error)
      }
    }
  
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  var listaPresentes=[];
  const registrarAsistencia =()=> {
    
    listaPresentes=right.map(alumno=>{
      return alumno
    });
    console.log(listaPresentes);
  }
  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 13, py: 3 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} seleccionados`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 430,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={alumnos.id_alumno} primary={value.concatenado} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  useEffect(()=>{
    funcion();
  }, [])
  
  console.log(curso)

  return (
    <Main>
        <h1>Registro de Asistencia</h1>
        <br />
        <Datos>
        <TextField
          id="outlined-read-only-input"
          label="Curso"
          defaultValue={curso}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Ciclo Lectivo"
          defaultValue="2022"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Fecha"
          defaultValue={hoy}
          InputProps={{
            readOnly: true,
          }}
        />
        </Datos> 
        <br />

        <Contenido>
            <TablaLista>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList('Alumnos del Curso', alumnos)}</Grid>
                {/* <Grid item>
                    <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    </Grid>
                </Grid> */}
                {/* <Grid item>{customList('Presentes', right)}</Grid> */}
                </Grid>
            </TablaLista>
            <Botones>
                <Button className="itemBoton" variant="contained" onClick={submit} startIcon={<MenuBookIcon />}>
                    Registrar Asistencia
                </Button>
                
                <span onClick={()=>navigate('/RegistrarAsistencia')}><Button className="itemBoton"  variant="outlined" startIcon={<MenuBookIcon />}>
                    Volver Atrás
                </Button></span>
            </Botones>
        </Contenido>
        <br />
        
    </Main> 
  );
}
