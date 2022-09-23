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



const CategoriasInsumos = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[categoriasInsumos,setInsumos]=useState({
        nombre_categoria:'',
        descripcion_categoria:''
    });

    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('categoriasArticulos')
           .select('*')
           .eq("isHabilitado_categoria",true)
           setData(result.data)
           console.log(result.data)

        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_categoria)=>{
      try {
        const result= await supabase.from("categoriasArticulos")
        .update({isHabilitado_categoria:false})
        .eq("id_categoria",id_categoria)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{nombre_categoria,descripcion_categoria}=categoriasInsumos;

    const update2=async(id_categoria)=>{
      try {
        const result= await supabase.from("categoriasArticulos")
        .update({nombre_categoria,descripcion_categoria})
        .eq("id_categoria",id_categoria)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("categoriasArticulos").insert({
            nombre_categoria,
            descripcion_categoria
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

    const handleEliminar=(id_categoria)=>{
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
          update(id_categoria);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"N°", field:"id_categoria"},
        {title:"Nombre", field:"nombre_categoria"},
        {title:"Descripcion", field:"descripcion_categoria"}
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      setInsumos({
          ...categoriasInsumos,
          [e.target.name]: e.target.value
      })
  }


    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nueva Categoría</h3>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre Categoría" onChange={actualizarState} name="nombre_categoria" value={nombre_categoria}/> 
        <br/>
        <br/>
        <br/>
        <textarea className={styles.inputMaterial} placeholder="Descripción de la categoría" onChange={actualizarState} name="descripcion_categoria" value={descripcion_categoria}/>
        <br/>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )



    const{id_categoria}=categoriasInsumos;

    
    const bodyEditar= (
      <div className={styles.modal}>
        <h3>Editar Categoría</h3>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre Categoría" onChange={actualizarState} name="nombre_categoria" value={nombre_categoria}/> 
        <br/>
        <br/>
        <br/>
        <textarea className={styles.inputMaterial} placeholder="Descripción de la categoría" onChange={actualizarState} name="descripcion_categoria" value={descripcion_categoria}/>
        <br/>
        <br/>
        <div align="right">
          <Button onClick={()=>update2(id_categoria)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
        </div>
      </div>
    )
    


    //Funciones
    
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
      setInsumos({})
    }


    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarInsumo = (insumo,caso)=>{
      setInsumos(insumo);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
    },[])
   

    return (
    <Main>
       
        <MaterialTable
            title="Categorías de Insumos"
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
                    onClick: (event,rowData)=>handleEliminar(rowData.id_categoria)
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

          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nueva Categoría</button>
      
          <br/><br/>
        </div>
    </Main>
  )
}

export default CategoriasInsumos