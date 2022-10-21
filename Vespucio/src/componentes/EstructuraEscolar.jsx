import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import swal from "sweetalert";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";

const Label = styled.label`
    flex: 0 0 100px;
    text-align:center;

`;

const Main = styled.div `
  margin-top: 7%;
  width:97%;
  margin-left:1%;

`;
const Titulo = styled.label `
    width:100%;
    background-color:white; 
    font-size:17px;
    font-weight:bold;
    text-align:center;
    border-radius:5px;
`;

const Select = styled.select`
    display:block;
    width:100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    -webkit-appearance:none;
    
`
const SelectCat = styled.select`
    display:block;
    width:100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    -webkit-appearance:none;
    padding:10px;
    margin:10px;
    border-color:black;
    
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


const EstructuraEscolar = () => {
    //Statest
    const [data,setDataA]=useState([])
    const [dataP,setDataP]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[modalTabla,setModalTabla]=useState(false)
    const[datos,alumnoAgregado]=useState({
        id_nivel:'',
        id_anioEduc:'',
        id_tipo:'',
        
        
    })

    

    const llenarTabla = async()=>{
      try {
         if(id_tipo == 1){
          funcionA();
         }else if(id_tipo ==2){
          funcionP();
         }
      } catch (error) {
          console.log(error)
      }
  }
   
    //Funciones que tienen datos desde una api
    const funcionA = async()=>{
        try {
           const { data: alumnos, error } = await supabase
            .from('alumnosPorAnio')
            .select(`
              alumnos(
                nombre_alumno,
                apellido_alumno,
                telefono_alumno,
                dni_alumno
              )
            `)
          .eq("isHabilitado_asignacion",true)
          .eq("id_anioEduc",id_anioEduc)
          console.log(alumnos.data)
            setDataA(alumnos)
        } catch (error) {
            console.log(error)
        }
    }

    const funcionP = async()=>{
      try {
         const { data: profes, error } = await supabase
          .from('personalPorAnio')
          .select(`
            cargoFuncion(
              materias(
                nombre_materia
              )
            ),
            personalEducativo(
              nombre_personal,
              telefono_personal,
              apellido_personal,
              dni_personal
            ),
            id_anio
          `)
        .eq("isHabilitado_asignacion",true)
        .eq("id_anio",id_anioEduc)
          setDataP(profes)
      } catch (error) {
          console.log(error)
      }
    }

    
    const{id_nivel,id_anioEduc,id_division,id_tipo}=datos;

    
    //Nombre Columnas
    //MODIFICAR EL FIELD
    const columnas=[
        {title:"Nombre", field:"alumnos.nombre_alumno"},
        {title:"Apellido", field:"alumnos.apellido_alumno"},
        {title:"DNI", field:"alumnos.dni_alumno"},
        {title:"Telefono", field:"alumnos.telefono_alumno"},

    ]

    const columnasP=[
      {title:"Nombre", field:"personalEducativo.nombre_personal"},
      {title:"Apellido", field:"personalEducativo.apellido_personal"},
      {title:"DNI", field:"personalEducativo.dni_personal"},
      {title:"Telefono", field:"personalEducativo.telefono_personal"},
      {title:"Materia Asignada", field:"cargoFuncion.materias.nombre_materia"}

    ]

    


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      alumnoAgregado({
          ...datos,
          [e.target.name]: e.target.value
      })
    }

    const seleccion= (e)=>{
      if(e.target.value == 2){
        setModalTabla(true)
      }else{
        setModalTabla(false)
      }
      alumnoAgregado({
        id_nivel,
        id_anioEduc,
        id_tipo:e.target.value
      })
  }

    const[niveles,setNiveles]=useState({}) 
    const nivs=async()=>{
      const result = await supabase.from('nivelesEducativos')
      .select();
  
      setNiveles(result.data)
      return result.data
    }

    const[anios,setAnios]=useState({}) 
    const anis=async()=>{
      const result = await supabase.from('nivelesEducativos')
      .select();
  
      setAnios(result.data)
      return result.data
    }

    const[categorias,setCategorias]=useState({}) 

    const filtrarAnios = e =>{

      alumnoAgregado({
        ...datos,
        [e.target.name]: e.target.value
      })

      var selection = document.getElementById("id_nivel");
      var valor = selection.options[selection.selectedIndex].value

      if (valor == 1) {
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
          .eq("id_nivel",1)
          .gte('id_anioEduc', 1)
          .lte('id_anioEduc', 42);
      
          setAnios(result.data)
        }
        datos();

      }else if(valor == 2){
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
          .eq("id_nivel",2)
          .gte('id_anioEduc', 1)
          .lte('id_anioEduc', 42);
      
          setAnios(result.data)
        }
        datos();
      }else{
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
          .eq("id_nivel",3)
          .gte('id_anioEduc', 1)
          .lte('id_anioEduc', 42);
      
          setAnios(result.data)
        }
        datos();
      }
        
      

        
    }


    


    const {id_alumno}=datos;

    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
      console.log(data)
    }

    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }



    const seleccionarAlumno = (alumno,caso)=>{
        alumnoAgregado(alumno);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }


    useEffect(()=>{
        //funcion();
        nivs();
        anis();

    },[])


  return (
    <Main>
      <div>
        <div>
            <Titulo>Consulta de la Estructura Escolar</Titulo>
                <Campo>
                <SelectCat
                            name='id_nivel'
                            id='id_nivel'
                            value={id_nivel}
                            onChange={filtrarAnios}
                        >
                            <option value="">--Nivel Educativo--</option>
                            {Object.values(niveles).map(pr=>(
                            <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                            ))}
                        
                            
                        
                    </SelectCat>
                    <SelectCat
                            name='id_anioEduc'
                            id='id_anioEduc'
                            value={id_anioEduc}
                            onChange={actualizarState}
                        >
                            <option value="">--Año--</option>
                            {Object.values(anios).map(pr=>(
                            <option key={pr.id_anioEduc} value={pr.id_anioEduc}>{pr.nombre_anioEduc}</option>
                            ))}
                        
                            
                        
                    </SelectCat>
                    <SelectCat
                            name='id_tipo'
                            id='id_tipo'
                            value={id_tipo}
                            onChange={seleccion}
                        >
                            <option value="">--Categoria--</option>
                            <option key={1} value={1}>Alumno</option>
                            <option key={2} value={2}>Profesor</option>
                        
                    </SelectCat>

                    {/* /*La tabla tendria que estar invisible, y se hace visible en el momento en que le hariamos click a buscar  */}
                    <button  className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-500 boton2" onClick={llenarTabla}>Buscar</button>


                </Campo>
            </div>

            

            {modalTabla ? (
                    <MaterialTable
                    title="Tabla de Profesores"
                    
                    columns={columnasP}
                    data={dataP}
      
                    
      
                    options={{
                          search:false,
                          actionsColumnIndex: -1,
                          searchFieldStyle:{
                            placeContent:"Buscar"
                          }
                      }}
                    
                      localization={{
                        header:{
                          actions:"Acciones",
                          
                        }
                        
                      }}
                      
                  />
            ) : (
                  <MaterialTable
                  title="Tabla de Alumnos"
                  
                  columns={columnas}
                  data={data}

                  

                  options={{
                        search:false,
                        actionsColumnIndex: -1,
                        searchFieldStyle:{
                          placeContent:"Buscar"
                        }
                    }}
                  
                    localization={{
                      header:{
                        actions:"Acciones",
                        
                      }
                      
                    }}
                    
              />
            )}


            <br />


          

      </div>
    </Main>
  )
}


 
export default EstructuraEscolar