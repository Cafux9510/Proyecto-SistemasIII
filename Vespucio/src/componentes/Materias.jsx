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


const Materias = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[materias,setMaterias]=useState({
        nombre_materia:'',
        descripcion_materia:'',
        id_grado:'',
        id_nivel:'',
    });



    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('materias')
           .select(`
              *,
              grados(
                nombre_grado,
                nivelesEducativos(
                    nombre_nivel
                )
              )
          `)
           .eq("isHabilitada_materia",true)
           setData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_materia)=>{
      try {
        const result= await supabase.from("materias")
        .update({isHabilitada_materia:false})
        .eq("id_materia",id_materia)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{nombre_materia,descripcion_materia,id_grado,id_nivel}=materias;

    const update2=async(id_materia)=>{
      try {
        const result= await supabase.from("materias")
        .update({nombre_materia,descripcion_materia})
        .eq("id_materia",id_materia)
        
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("materias").insert({
            nombre_materia,
            descripcion_materia,
            id_grado
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

  const handleEliminar = (id_materia) => {
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
          update(id_materia);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"Nombre", field:"nombre_materia"},
        {title:"Nivel", field:"grados.nivelesEducativos.nombre_nivel"},
        {title:"Grado", field:"grados.nombre_grado"},
        {title:"Descripcion", field:"descripcion_materia"}
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
        
        setMaterias({
          ...materias,
          [e.target.name]: e.target.value
      })
    }
  

  //Funcion que me trae la lista de categorias y lo agrega a la lista desplegable
  const[gradosMaterias,setGrados]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('grados')
    .select()
    .eq("isHabilitado_grado",true);

    setGrados(result.data)
    console.log(result.data)
  }

  const[niveles,setNiveles]=useState({}) 
  const nivs=async()=>{
    const result = await supabase.from('nivelesEducativos')
    .select();

    setNiveles(result.data)
    return result.data
  }

  const filtrarAnios = e =>{

    setMaterias({
      ...materias,
      [e.target.name]: e.target.value
    })

    var selection = document.getElementById("id_nivel");
    var valor = selection.options[selection.selectedIndex].value

    if (valor == 1) {
      const datos=async()=>{
        const result = await supabase.from('grados')
        .select()
        .eq("isHabilitado_grado",true)
        .eq("nivelEduc",1);
    
        setGrados(result.data)
      }
      datos();

    }else if(valor == 2){
      const datos=async()=>{
        const result = await supabase.from('grados')
        .select()
        .eq("isHabilitado_grado",true)
        .eq("nivelEduc",2);
    
        setGrados(result.data)
      }
      datos();
    }else{
      const datos=async()=>{
        const result = await supabase.from('grados')
        .select()
        .eq("isHabilitado_grado",true)
        .eq("nivelEduc",3);
    
        setGrados(result.data)
      }
      datos();
    }
      
    

      
  }


    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nuevo Insumo</h3> {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
        <TextField className={styles.inputMaterial} label="Nombre Materia" onChange={actualizarState} name="nombre_materia" value={nombre_materia}/> 
        <br/>
        <br/>
        <label>Indique el Nivel Educativo de la Materia</label>
         <br/>
         <br/>
            <Campo>
            <Select
                        name='id_nivel'
                        id='id_nivel'
                        value={id_nivel}
                        onChange={filtrarAnios}
                    >
                        <option value="">--Seleccione--</option>
                        {Object.values(niveles).map(pr=>(
                        <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                        ))}
                    
                        
                    
                </Select>
            </Campo>
         <br/>
         <label>Indique el Grado de la Materia</label>
         <br/>
        <Campo>
          <Select
                    name='id_grado'
                    value={id_grado}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(gradosMaterias).map(pr=>(
                      <option key={pr.id_grado} value={pr.id_grado}>{pr.nombre_grado}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <label>Descripcion de la Materia</label>
        <br/>
        <br/>
        <textarea type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="descripcion_materia" value={descripcion_materia} />
        <br/>
        <br/>
        <br/>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )

    const{id_materia}=materias;

    const bodyEditar= (
        <div className={styles.modal}>
        <h3>Agregar Nuevo Insumo</h3> {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre Materia" onChange={actualizarState} name="nombre_materia" value={materias&&nombre_materia}/> 
        <br/><br/>

        <br/>
        <label>Descripcion de la Materia</label>
        <br/>
        <br/>
        <textarea type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="descripcion_materia" value={materias&&descripcion_materia} />
        <br/>
        <br/>
        <br/>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>update2(materias&&id_materia)} >Editar</Button>
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

    /*agregado por FACUNDO-C1*/
    const abrirCerrarModalActualizarStock= ()=>{
      stockModal(!modalEditarStock)
      setMaterias({})
    }
    /*HASTA ACA*/

    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarInsumo = (materias,caso)=>{
        setMaterias(materias);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        datos();
        nivs();
    },[])
   

  return (
    <Main>
       
        <MaterialTable
            title="Materias"
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
                    onClick: (event,rowData)=>handleEliminar(rowData.id_materia)
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
          <button className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nueva Materia</button>
           

          <br/><br/>
        </div>
    </Main>
  )
}

export default Materias