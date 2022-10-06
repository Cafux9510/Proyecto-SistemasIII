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
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[datos,alumnoAgregado]=useState({
        id_nivel:'',
        id_anioEduc:'',
        id_division:'',
        id_tipo:'',
        
        
    })


   
    //Funciones que tienen datos desde una api
    const funcionA = async()=>{
        try {
           const { data: alumnos, error } = await supabase
            .from('alumnos')
            .select(`
            *,
            anioEducativo(
              nombre_anioEduc,
              id_nivel(
                nombre_nivel
              )
            )
          `)
          .eq("isHabilitado_alumno",true)
            setData(alumnos)
        } catch (error) {
            console.log(error)
        }
    }

    const funcionP = async()=>{
      try {
         const { data: alumnos, error } = await supabase
          .from('alumnos')
          .select(`
          *,
          anioEducativo(
            nombre_anioEduc,
            id_nivel(
              nombre_nivel
            )
          )
        `)
        .eq("isHabilitado_alumno",true)
          setData(alumnos)
      } catch (error) {
          console.log(error)
      }
    }

    
    const{id_nivel,id_anioEduc,id_division,id_tipo}=datos;

    
    //Nombre Columnas
    //MODIFICAR EL FIELD
    const columnas=[
        {title:"Nombre", field:"anioEducativo.id_nivel.nombre_nivel"},
        {title:"Apellido", field:"anioEducativo.nombre_anioEduc"},
        {title:"DNI", field:"nombre_alumno"},
        {title:"Telefono", field:"apellido_alumno"},

      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      alumnoAgregado({
          ...datos,
          [e.target.name]: e.target.value
      })
    }

    const[niveles,setNiveles]=useState({}) 
    const nivs=async()=>{
      const result = await supabase.from('nivelesEducativos')
      .select();
  
      setNiveles(result.data)
      return result.data
    }
    const[categorias,setCategorias]=useState({}) 

    const filtrarAnios = e =>{

      alumnoAgregado({
        ...alumnos,
        [e.target.name]: e.target.value
      })

      var selection = document.getElementById("id_nivel");
      var valor = selection.options[selection.selectedIndex].value

      if (valor == 1) {
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
          .eq("id_nivel",1);
      
          setCategorias(result.data)
        }
        datos();

      }else if(valor == 2){
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
          .eq("id_nivel",2);
      
          setCategorias(result.data)
        }
        datos();
      }else{
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
          .eq("id_nivel",3);
      
          setCategorias(result.data)
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
        //nivs();

    },[])


  return (
    <Main>
      <div>
        <div>
            <Titulo>Categorias</Titulo>
                <Campo>
                <SelectCat
                            name='id_nivel'
                            id='id_nivel'
                            value={id_nivel}
                            onChange={filtrarAnios}
                        >
                            <option value="">--Nivel Educativo--</option>
                            {Object.values(nivs).map(pr=>(
                            <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                            ))}
                        
                            
                        
                    </SelectCat>
                    <SelectCat
                            name='id_nivel'
                            id='id_nivel'
                            value={id_nivel}
                            onChange={filtrarAnios}
                        >
                            <option value="">--Año--</option>
                            {Object.values(niveles).map(pr=>(
                            <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                            ))}
                        
                            
                        
                    </SelectCat>
                    <SelectCat
                            name='id_nivel'
                            id='id_nivel'
                            value={id_nivel}
                            onChange={filtrarAnios}
                        >
                            <option value="">--Division--</option>
                            {Object.values(niveles).map(pr=>(
                            <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                            ))}
                        
                            
                        
                    </SelectCat>
                    <SelectCat
                            name='id_nivel'
                            id='id_nivel'
                            value={id_nivel}
                            onChange={filtrarAnios}
                        >
                            <option value="">--Alumno o Profesor--</option>
                            {Object.values(niveles).map(pr=>(
                            <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                            ))}
                        
                            
                        
                    </SelectCat>

                    {/* /*La tabla tendria que estar invisible, y se hace visible en el momento en que le hariamos click a buscar  */}
                    <button  className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-500 boton2" onClick={()=>abrirCerrarModalInsertar()}>Buscar</button>


                </Campo>
            </div>
          <MaterialTable
              title="Consulta Estructura Escolar"
              
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
          

      </div>
    </Main>
  )
}


 
export default EstructuraEscolar