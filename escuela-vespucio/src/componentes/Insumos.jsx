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



const Insumos = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[proveedor,proveedorAgregado]=useState({
        categoria_proveedor:'',
        nombre_proveedor:'',
        cuit_proveedor:'',
        direccion_proveedor:'',
        localidad_proveedor:'',
        telefono_proveedor:'',
        email_proveedor:'',
    })
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('proveedores')
           .select()
           .eq("isHabilitado_proveedor",true)
           setData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_proveedor)=>{
      try {
        const result= await supabase.from("proveedores")
        .update({isHabilitado_proveedor:false})
        .eq("id_proveedor",id_proveedor)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{categoria_proveedor,nombre_proveedor,cuit_proveedor,direccion_proveedor,localidad_proveedor,telefono_proveedor,email_proveedor}=proveedor;

    const update2=async(id_proveedor)=>{
      try {
        const result= await supabase.from("proveedores")
        .update({categoria_proveedor,nombre_proveedor,cuit_proveedor,direccion_proveedor,localidad_proveedor,telefono_proveedor,email_proveedor})
        .eq("id_proveedor",id_proveedor)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("proveedores").insert({
          categoria_proveedor,
          nombre_proveedor,
          cuit_proveedor,
          direccion_proveedor,
          localidad_proveedor,
          telefono_proveedor,
          email_proveedor
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

    const handleEliminar=(id_proveedor)=>{
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
          update(id_proveedor);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"N°", field:"id_categoria_proveedor"},
        {title:"Nombre", field:"nombre_proveedor"},
        {title:"Categoria", field:"cuit_proveedor"},
        {title:"Stock", field:"direccion_proveedor"},

      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      proveedorAgregado({
          ...proveedor,
          [e.target.name]: e.target.value
      })
  }
    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nuevo Insumo</h3> {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
        <TextField className={styles.inputMaterial} label="Nombre Insumo" onChange={actualizarState} name="categoria_proveedor" value={categoria_proveedor}/> 
        <br/>
        <TextField className={styles.inputMaterial} label="Categoria"  onChange={actualizarState} name="nombre_proveedor" value={nombre_proveedor} />
        <br/>
        <TextField className={styles.inputMaterial} label="Stock" onChange={actualizarState} name="cuit_proveedor" value={cuit_proveedor}/>
        <br/>
        <TextField type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="localidad_proveedor" value={localidad_proveedor} />
        <br/>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )

    const{id_proveedor}=proveedor;

    const bodyEditar= (
      <div className={styles.modal}>
        <h3>Editar datos de Insumo</h3>
        <TextField className={styles.inputMaterial} label="Nombre Insumo" onChange={actualizarState} name="categoria_proveedor" value={proveedor&&categoria_proveedor}/>
        <br/>
        <TextField className={styles.inputMaterial} label="Categoria"  onChange={actualizarState} name="nombre_proveedor" value={proveedor&&nombre_proveedor} />
        <br/>
        <TextField className={styles.inputMaterial} label="Stock" onChange={actualizarState} name="cuit_proveedor" value={proveedor&&cuit_proveedor}/>
        <br/>
        <TextField type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="localidad_proveedor" value={proveedor&&localidad_proveedor} />
                <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_proveedor)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
        </div>
      </div>
    )


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
    }

    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarProveedor = (proveedor,caso)=>{
      proveedorAgregado(proveedor);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
    },[])
   

  return (
    <div>
       
        <MaterialTable
            title="Comprobantes"
            columns={columnas}
            data={data}
            actions={[
                {
                    icon:"edit",
                    tooltip:"Modificar",
                    onClick: (event,rowData)=>seleccionarProveedor(rowData,"Editar")
                },
                {
                    icon:"delete",
                    tooltip:"Eliminar",
                    onClick: (event,rowData)=>handleEliminar(rowData.id_proveedor)
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
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Insumo</button>

          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Actualizar Stock</button>
          {/*Yo diria que el actualizar stock lo veamos luego, que por el momento lo pueda actualizar editando el insumo jajaj */}
          <br/><br/>
        </div>
    </div>
  )
}

export default Insumos