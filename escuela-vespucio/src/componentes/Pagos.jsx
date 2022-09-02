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



const Pagos = () => {
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
        {title:"N° de Pago", field:"nombre_proveedor"},
        {title:"Proveedor", field:"cuit_proveedor"},
        {title:"CUIT", field:"direccion_proveedor"},
        {title:"Fecha Pago",field:"localidad_proveedor"},
        {title:"Monto",field:"telefono_proveedor"},
        
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
        <h3>Registrar Nuevo Pago</h3> {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
        <TextField className={styles.inputMaterial} label="Numero de Pago" onChange={actualizarState} name="numero_Pago" value={categoria_proveedor}/> 
        <br/>
        <TextField className={styles.inputMaterial} label="Proveedor"  onChange={actualizarState} name="nombre_proveedor" value={nombre_proveedor} />
        <br/>
        <TextField className={styles.inputMaterial} label="CUIT" onChange={actualizarState} name="cuit_proveedor" value={cuit_proveedor}/>
        <br/>
        <TextField type="date" className={styles.inputMaterial} label=""  onChange={actualizarState} name="fecha_Pago" value={direccion_proveedor}/>
        <br/>
        <TextField className={styles.inputMaterial} label="Monto" onChange={actualizarState} name="monto_Pago" value={localidad_proveedor} />
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
        <h3>Editar Pago</h3>
        <TextField className={styles.inputMaterial} label="Numero de Pago" onChange={actualizarState} name="numero_Pago" value={proveedor&&categoria_proveedor}/>
        <br/>
        <TextField className={styles.inputMaterial} label="Proveedor"  onChange={actualizarState} name="nombre_proveedor" value={proveedor&&nombre_proveedor} />
        <br/>
        <TextField className={styles.inputMaterial} label="CUIT" onChange={actualizarState} name="cuit_proveedor" value={proveedor&&cuit_proveedor}/>
        <br/>
        <TextField type="date" className={styles.inputMaterial} label="" onChange={actualizarState} name="fecha_Pago" value={proveedor&&direccion_proveedor}/>
        <br/>
        <TextField className={styles.inputMaterial} label="Monto" onChange={actualizarState} name="monto_Pago" value={proveedor&&localidad_proveedor} />
        <br/>
        <TextField type="file" className={styles.inputMaterial} /*BORRE A PATIR DE LABEL O CRASHEABA, PORQUE NO ACEPTABA ARCHIVOS QUE NO SEAN FILES */ />
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="email_proveedor" value={proveedor&&email_proveedor} />
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
            title="Pagos"
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
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Comprobante</button>
          <br/><br/>
        </div>
    </div>
  )
}

export default Pagos