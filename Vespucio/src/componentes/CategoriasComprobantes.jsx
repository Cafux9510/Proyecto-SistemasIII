import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Dialog } from 'primereact/dialog';
import { Button } from "@material-ui/core";
import {Modal,TextField,TextareaAutosize} from "@material-ui/core"
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
  margin-top: 7%;
  height : 50%;
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



const CategoriasComprobantes = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[categoriasComprobantes,setInsumos]=useState({
        nombre_tipo:'',
        descripcion_tipo:''
    });


    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('tipoComprobante')
           .select('*')
           .eq("isHabilitado_comprobante",true)
           setData(result.data)

        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_tipo)=>{
      try {
        const result= await supabase.from("tipoComprobante")
        .update({isHabilitado_comprobante:false})
        .eq("id_tipo",id_tipo)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{nombre_tipo,descripcion_tipo}=categoriasComprobantes;

    const update2=async(id_tipo)=>{
      try {
        const result= await supabase.from("tipoComprobante")
        .update({nombre_tipo,descripcion_tipo})
        .eq("id_tipo",id_tipo)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("tipoComprobante").insert({
            nombre_tipo,
            descripcion_tipo
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

    const handleEliminar=(id_tipo)=>{
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
          update(id_tipo);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"N°", field:"id_tipo"},
        {title:"Nombre", field:"nombre_tipo"},
        {title:"Descripcion", field:"descripcion_tipo"}
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      setInsumos({
          ...categoriasComprobantes,
          [e.target.name]: e.target.value
      })
  }


    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nuevo Tipo</h3>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre de Tipo de Comprobante" onChange={actualizarState} name="nombre_tipo" value={nombre_tipo ||''}/> 
        <br/>
        <br/>
        <br/>
        <textarea className={styles.inputMaterial} placeholder="Descripción del Tipo de Comprobante" onChange={actualizarState} name="descripcion_tipo" value={descripcion_tipo || ''}/>
        <br/>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )



    const{id_tipo}=CategoriasComprobantes;

    
    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Tipo de Comprobante</h4>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre Categoría" onChange={actualizarState} name="nombre_tipo" value={nombre_tipo}/> 
        <br/>
        <br/>
        <br/>
        <textarea className={styles.inputMaterial} placeholder="Descripción de la categoría" onChange={actualizarState} name="descripcion_tipo" value={descripcion_tipo}/>
        <br/>
        <br/>
        <div align="right">
          <Button onClick={()=>update2(id_tipo)} color='primary'>Editar</Button>
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
       <div>
        <MaterialTable
            title="Tipos de Comprobantes"
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
                    onClick: (event,rowData)=>handleEliminar(rowData.id_tipo)
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
          </div>

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

          <button className="bg-indigo-600 w-15 p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Tipo de Comprobante</button>
      
          <br/><br/>
        </div>
    </Main>
  )
}

export default CategoriasComprobantes