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


const Label = styled.label`
    flex: 0 0 100px;
    text-align:center;

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
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[personal,personalAgregado]=useState({
        nombre_personal:'',
        telefono_personal:'',
        mail_personal:'',
        domicilio_personal:'',
        apellido_personal:'',
        dni_personal:'',
    })
    const toast = useRef(null);

   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           /* const result= await supabase.from('proveedores')
           .select()
           .eq("isHabilitado_proveedor",true)
           setData(result.data) */
           const { data: personal, error } = await supabase
            .from('personalEducativo')
            .select(`*`)
            .eq("isHabilitado_personal",true)
            .order("id_personal",{ascending:true})
        
            setData(personal)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_personal)=>{
      try {
        const result= await supabase.from("personalEducativo")
        .update({isHabilitado_personal:false})
        .eq("id_personal",id_personal)

        const arrayProveedores = data.filter(provee=>provee.id_personal !==id_personal)
        setData(arrayProveedores)

      } catch (error) {
        console.log(error)
      }
    }

    const{nombre_personal,telefono_personal,mail_personal,domicilio_personal,apellido_personal,dni_personal}=personal;

    const update2=async(id_personal)=>{
      try {
        const {result,error}= await supabase.from("personalEducativo")
        .update({nombre_personal,telefono_personal,mail_personal,domicilio_personal,apellido_personal,dni_personal})
        .eq("id_personal",id_personal)
        funcion()

        const arrayProveedores = data.map((prove)=>{
          if(prove.id_personal === id_personal ){
            return{
              ...prove,
              cuit_proveedor,
              nombre_proveedor,
              direccion_proveedor,
              localidad_proveedor,
              telefono_proveedor,
              email_proveedor,
              id_categoria_proveedor
            }
          }
          return prove
        })

        setData(arrayProveedores)
        abrirCerrarModalEditar();
        toast.current.show({ severity: 'success', summary: 'Exito!', detail: 'Registro Modificado', life: 3000 });    
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const result= await supabase.from("personalEducativo").insert({
            nombre_personal,
            telefono_personal,
            mail_personal,
            domicilio_personal,
            apellido_personal,
            dni_personal
        });
        funcion()

        const resultado=result.data[0]
        setData([...data,resultado])
        abrirCerrarModalInsertar();
       
      } catch (error) {
        console.log(error)
      }
    }

    //Configuracion del 
    const columnas=[
        {title:"Nombre", field:"nombre_personal"},
        {title:"Apellido", field:"apellido_personal"},
        {title:"Email", field:"mail_personal"},
        {title:"TPs Entregados", field:"mail_personal"},
        {title:"Porcentaje de Asistencia", field:"mail_personal"},
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
        personalAgregado({
          ...personal,
          [e.target.name]: e.target.value
      })
  }


    

    const {id_personal}=personal;

    //Funciones

    return (
    <Main>
        <h1>Gestión de Curso</h1>
        <br />
        <Datos>
        <TextField
          id="outlined-read-only-input"
          label="Curso"
          defaultValue="5° A"
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
          defaultValue="La de hoy ah"
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
                    title="Listado de Alumnos"
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
                <Button className="itemBoton" variant="outlined" startIcon={<MenuBookIcon />}>
                    Volver Atrás
                </Button>
            </BotonesAccion>
            
        
        
          
        </Container>
        
    </Main>
  )
}

 
export default MateriaXProfesor
