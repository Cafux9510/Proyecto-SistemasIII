import { useEffect, useState,useRef } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import swal from "sweetalert";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";
import { Toast } from 'primereact/toast';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import{useNavigate} from "react-router-dom";



const Label = styled.label`
    flex: 0 0 100px;
    text-align:center;

`;
const Titulo = styled.h1`
  margin-left:12px;
`;
const Main = styled.div `
  margin-top:7%;
  background-color:white;
  height:100%;
  width: 78vw;
  overflow:hidden;
`;
const Datos= styled.div`
    width:100%;
    display:flex;
    justify-content:space-evenly
 `;
const Container = styled.div `
  display:flex;
  width:100%;
  height:100%;
`;
const Tabla = styled.div `
  width:70%;
`;
const BotonesAccion = styled.div `
  width:30%;
  /* margin:3px; */
  height:250px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-between;
  padding:30px;
  
  `;

const Select = styled.select`
    display:block;
    width:100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    -webkit-appearance:none;
`

const Campo= styled.div`
    display:flex;
    margin-bottom: 1rem;
    align-items:center;
`;

const useStyles = makeStyles((theme)=>({
  modal:{
    position:"absolute",
    width:400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)" 
  },
  iconos:{
    cursor: "pointer"
  },
  inputMaterial:{
    width: "100%"
  }

}))

const MateriaXProfesor = () => {

  const navigate=useNavigate();
    //Statest
    const [data,setData]=useState([])

    const [titulo, setTitulo] = useState([])
    
    let tiempoTranscurrido = Date.now();
    let hoy = (new Date(tiempoTranscurrido)).toLocaleDateString();
    console.log(hoy)
   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
      try {

        let idMateria = localStorage.getItem("idMateria")
          
        const result = await supabase.from('materiasProfesView')
          .select("concatenado")
          .eq("id_materia",idMateria);
        
        setTitulo(result.data[0].concatenado)
          
        } catch (error) {
            console.log(error)
        }
    }

    //Configuracion del 
    const columnas=[
        {title:"Título de la Tarea", field:"nombre_tarea"},
        {title:"Cantidad de Tareas Entregadas", field:"cantidad_tareas"}
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
        personalAgregado({
          ...personal,
          [e.target.name]: e.target.value
      })
    }
    
    useEffect(() => {
        funcion();
    },[])
    //Funciones

    return (
      <Main>
        <br />
        <Titulo>{ titulo }</Titulo>
        <br />
        <Datos>
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
        <br />
        <Container>
            <Tabla>
                <MaterialTable
                    title="Listado de Trabajos Prácticos"
                    columns={columnas}
                    data={data}
                            

                    options={{
                        actionsColumnIndex: -1,
                        
                    }}
                    
                    localization={{
                        
                        toolbar:{
                        searchPlaceholder:"Buscar"
                        }
                        
                    }}
                    
                />
            </Tabla>
            <BotonesAccion>
                <Button className="itemBoton" variant="contained" startIcon={<MenuBookIcon />}>
                    Cargar Tarea
                </Button>
                <Button className="itemBoton" variant="contained" startIcon={<MenuBookIcon />}>
                    Calificar Tarea
                </Button>
                <Button className="itemBoton" onClick={()=>navigate('/GestionMateriasProfesor')} variant="outlined" startIcon={<MenuBookIcon />}>
                    Volver Atrás
                </Button>
            </BotonesAccion>
            
        
        
          
        </Container>
        
    </Main>
  )
}

 
export default MateriaXProfesor
