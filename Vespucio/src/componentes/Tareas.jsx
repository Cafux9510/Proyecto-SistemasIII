import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Dialog } from 'primereact/dialog';
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import { InputText } from 'primereact/inputtext';
import {makeStyles} from "@material-ui/core/styles"
import { amber } from "@material-ui/core/colors";
import swal from "sweetalert";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";


const Label = styled.label`
    flex: 0 0 100px;
    text-align:center;

`;

const Main = styled.div `
  margin-top: 7%
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



const Tareas = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[tareas,setMaterias]=useState({
        id_materia:'',
        titulo_tarea:'',
        descripcion_tarea:'',
        plazo_tarea:'',
        trimestre_tarea:'',
    });



    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('tareas')
           .select(`
                *,
              materias(
                nombre_materia,
                *
              )
          `)
           .eq("isHabilitada_tarea",true)
           setData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_tarea)=>{
      try {
        const result= await supabase.from("tareas")
        .update({isHabilitada_tarea:false})
        .eq("id_tarea",id_tarea)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{id_materia,titulo_tarea,descripcion_tarea,plazo_tarea,trimestre_tarea}=tareas;

    const update2=async(id_tarea)=>{
      try {
        const result= await supabase.from("tareas")
        .update({id_materia,titulo_tarea,descripcion_tarea,plazo_tarea,trimestre_tarea})
        .eq("id_tarea",id_tarea)
        
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("tareas").insert({
            id_materia,
            titulo_tarea,
            descripcion_tarea,
            plazo_tarea,
            trimestre_tarea
        });

        abrirCerrarModalInsertar();
        setData({
          ...data,
          result
        })
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    }

    const handleEliminar=(id_tarea)=>{
      swal({
        title: "Estas seguro de eliminar este registro?",
        text: "Una vez eliminado, no podras recuperar el archivo de vuelta!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Registro eliminado con exito!", {
            icon: "success",
          });
          update(id_tarea);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[
        {title:"N°", field:"id_tarea"}, 
        {title:"Titulo", field:"titulo_tarea"},
        {title:"Materia", field:"materias.nombre_materia"},
        {title:"Descripcion", field:"descripcion_tarea"},
        {title:"Plazo de la Tarea", field:"plazo_tarea"},
        {title:"Trimestre de la Tarea", field:"trimestre_tarea"}
      ]

    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
        
        setMaterias({
          ...tareas,
          [e.target.name]: e.target.value
      })
    }
  

  //Funcion que me trae la lista de categorias y lo agrega a la lista desplegable
  const[materias,setGrados]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('materias')
    .select()
    .eq("isHabilitada_materia",true);

    setGrados(result.data)
  }

  //ACA TENGO QUE TRAER LA MATERIAS DEL PROFESOR QUE ESTOY LOGEADO, ENTONCES SACO EL ID DEL PROFE Y PREGUNTO EN LA TABLA
  // PROFESOR X MATERIA Y LLENO EL DESPLEGABLE



    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nueva Tarea</h3> 
        <br/>
        <label>Indique la Materia de la Tarea</label>
        <br/>
            <Campo>
                <Select
                        name='id_materia'
                        id='id_materia'
                        value={id_materia}
                        onChange={actualizarState}
                    >
                        <option value="">--Seleccione--</option>
                        {Object.values(materias).map(pr=>(
                        <option key={pr.id_materia} value={pr.id_materia}>{pr.nombre_materia}</option>
                        ))}
                    
                        
                    
                </Select>
            </Campo>
        <TextField className={styles.inputMaterial} label="Titulo de la Tarea" onChange={actualizarState} name="titulo_tarea" value={titulo_tarea}/> 
        <br/>
        <br/>
        <label>Descripcion de la Tarea</label>
        <br/>
        <textarea type="text" className={styles.inputMaterial} label="Descripcion de la Tarea" onChange={actualizarState} name="descripcion_tarea" value={descripcion_tarea} />
        <br/>
        <br/>
        <label>Plazo para la Tarea</label>
        <br/>
        <br/>
        <TextField type="date" className={styles.inputMaterial} onChange={actualizarState} name="plazo_tarea" value={plazo_tarea}/> 
        <br/>
        <br/>
        <label>Indique el Trimestre Actual</label>
        <br/>
        <br/>
            <Campo>
                <Select
                        name='trimestre_tarea'
                        id='trimestre_tarea'
                        value={trimestre_tarea}
                        onChange={actualizarState}
                    >
                        <option value="">--Seleccione--</option>
                        <option value="Primer Trimestre">1° Trimestre</option>
                        <option value="Segundo Trimestre">2° Trimestre</option>
                        <option value="Tercer Trimestre">3° Trimestre</option>                  
                </Select>
            </Campo>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )




    const{id_tarea}=materias;

    const bodyEditar= (
        <div className={styles.modal}>
        <h3>Agregar Nueva Tarea</h3> 
        <br/>
        <label>Indique la Materia de la Tarea</label>
        <br/>
            <Campo>
                <Select
                        name='id_materia'
                        id='id_materia'
                        value={tareas&&id_materia}
                        onChange={actualizarState}
                    >
                        <option value="">--Seleccione--</option>
                        {Object.values(materias).map(pr=>(
                        <option key={pr.id_materia} value={pr.id_materia}>{pr.nombre_materia}</option>
                        ))}
                    
                        
                    
                </Select>
            </Campo>
        <TextField className={styles.inputMaterial} label="Titulo de la Tarea" onChange={actualizarState} name="titulo_tarea" value={tareas&&titulo_tarea}/> 
        <br/>
        <br/>
        <label>Descripcion de la Tarea</label>
        <br/>
        <textarea type="text" className={styles.inputMaterial} label="Descripcion de la Tarea" onChange={actualizarState} name="descripcion_tarea" value={tareas&&descripcion_tarea} />
        <br/>
        <br/>
        <label>Plazo para la Tarea</label>
        <br/>
        <br/>
        <TextField type="date" className={styles.inputMaterial} onChange={actualizarState} name="plazo_tarea" value={tareas&&plazo_tarea}/> 
        <br/>
        <br/>
        <label>Indique el Trimestre Actual</label>
        <br/>
        <br/>
            <Campo>
                <Select
                        name='trimestre_tarea'
                        id='trimestre_tarea'
                        value={trimestre_tarea}
                        onChange={actualizarState}
                    >
                        <option value="">--Seleccione--</option>
                        <option value="Primer Trimestre">1° Trimestre</option>
                        <option value="Segundo Trimestre">2° Trimestre</option>
                        <option value="Tercer Trimestre">3° Trimestre</option>                  
                </Select>
            </Campo>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )




    /*ACA TAMBIEN MODIFICO FACUNDO-C1*/

    const selectProduct=(event)=>{
      
      const product= nombres_prod.find(materia=>materia.id_materia == event.target.value);
      console.log(product)
      setMaterias(product)
    }

  
    const sumar = e=>{
        setMaterias({
        ...materias,
        [e.target.name]: e.target.value
    })
      
    }

  
    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
      setMaterias({})
    }

    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarInsumo = (tareas,caso)=>{
        setMaterias(tareas);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        datos();
    },[])
   

  return (
    <Main>
       
        <MaterialTable
            title="Tareas"
            columns={columnas}
            data={data}
            actions={[
                {
                    icon:"edit",
                    tooltip:"Modificar",
                    onClick: (event,rowData)=>seleccionarInsumo(rowData,"Editar")
                },
                {
                    icon:"delete",
                    tooltip:"Eliminar",
                    onClick: (event,rowData)=>handleEliminar(rowData.id_tarea)
                },
                //COMO AGREGAR OTRO ICONO BOTON?

                
            ]}
            

            options={{
                  actionsColumnIndex: -1,
                  searchFieldStyle:{
                    placeContent:"Buscar"
                  }
              }}
            
              localization={{
                header:{
                  actions:"Acciones",
                  
                },
                toolbar:{
                  searchPlaceholder:"Buscar"
                }
                
              }}
              
        />

        <Modal
          open={modal}
          onClose={abrirCerrarModalInsertar}
        >
          {bodyInsertar}
        </Modal>
            
        <Modal
          open={modalEditar}
          onClose={abrirCerrarModalEditar}
        >
          {bodyEditar}
        </Modal>


        <div className="contenedor">
          <br/>
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nueva Tarea</button>
           

          <br/><br/>
        </div>
    </Main>
  )
}

export default Tareas