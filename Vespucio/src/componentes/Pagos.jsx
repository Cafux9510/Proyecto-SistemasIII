import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import {Modal,TextField} from "@material-ui/core"
import { InputText } from 'primereact/inputtext';
import {makeStyles} from "@material-ui/core/styles"
import { amber } from "@material-ui/core/colors";
import swal from "sweetalert";
import styled from '@emotion/styled'
import {DataTable} from "primereact/datatable";
import { Column } from 'primereact/column';
import {Dropdown} from "primereact/dropdown"

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



const Pagos = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[dialog,setDialog]=useState(false) 
    const[pagos,setPagos]=useState({
        numero_pago:'',
        proveedor_pago:'',
        fecha_emision:'',
        total_pago:'',
        id_comprobante:'',
        link_archivo:'',
    })
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('pagos')
           .select(`
           *,
            comprobantes(
              numero_comprobante
           ),
            proveedores(
              nombre_proveedor
           )
         `)
           .eq("isHabilitado_pago",true)
           setData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_pago)=>{
      try {
        const result= await supabase.from("pagos")
        .update({isHabilitado_pago:false})
        .eq("id_pago",id_pago)

        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }


    const{proveedor_pago,numero_pago,fecha_emision,total_pago,id_comprobante,link_archivo}=pagos;

    const update2=async(id_pago)=>{
      try {
        const avatarFile = document.getElementById('selectArchivo').files[0];
        const  foto = await supabase.storage
        .from('archivos-subidos')
        .upload('archivos-pagos/'+parseInt(avatarFile.lastModified/avatarFile.size), avatarFile, {
          cacheControl: '3600',
          upsert: false,
        })

        const principio_cadena = 'https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/';
        const final_cadena = foto.data.Key
        const link_archivo= principio_cadena + final_cadena
      
        const result= await supabase.from("pagos")
        .update({proveedor_pago,numero_pago,fecha_emision,total_pago,id_comprobante,link_archivo})
        .eq("id_pago",id_pago)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
          const avatarFile = document.getElementById('selectArchivo').files[0];
          const  foto = await supabase.storage
          .from('archivos-subidos')
          .upload('archivos-pagos/'+parseInt(avatarFile.lastModified/avatarFile.size), avatarFile, {
            cacheControl: '3600',
            upsert: false,
          })

          const principio_cadena = 'https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/';
          const final_cadena = foto.data.Key
          const link_archivo= principio_cadena + final_cadena
            const {error,result}= await supabase.from("pagos").insert({
                numero_pago,
                proveedor_pago,
                fecha_emision,
                total_pago,
                id_comprobante,
                link_archivo
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

    const handleEliminar=(id_pago)=>{
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
          update(id_pago);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"N°", field:"id_pago"},
        {title:"N° de Pago", field:"numero_pago"},
        {title:"Proveedor", field:"proveedores.nombre_proveedor"},
        {title:"Fecha Pago", field:"fecha_emision"},
        {title:"Monto",field:"total_pago"},
        {title:"Comprobante",field:"comprobantes.numero_comprobante"},

        
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
       setPagos({
          ...pagos,
          [e.target.name]: e.target.value
      })
  }


  const[comprobantes,setComprabantes]=useState({});
  const compro= async()=>{
    const result = await supabase.from('comprobantes')
    .select()
    .eq("isHabilitado_comprobante",true);;

    setComprabantes(result.data)
  }
  
  const[pro,setPro]=useState({}) 
  const dato=async()=>{
    const result = await supabase.from('proveedores')
    .select()
    .eq("isHabilitado_proveedor",true);;

    setPro(result.data)
  }

    const bodyInsertar= (
      <div className={styles.modal}>
        <h4>Registrar Nuevo Pago</h4>
        <br/>
        
        <TextField type="number" className={styles.inputMaterial} label="Numero de Pago" onChange={actualizarState} name="numero_pago" value={numero_pago}/>
        <br/> 
        <br/>
        <br/>
        <Campo>
        <Label>Nombre Proveedor</Label>
          <Select
                    name='proveedor_pago'
                    value={proveedor_pago}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(pro).map(pr=>(
                      <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre_proveedor}</option>
                    ))}
            </Select>
        </Campo>
        <br/>

        <TextField type="date" className={styles.inputMaterial} label=""  onChange={actualizarState} name="fecha_emision" value={fecha_emision}/>
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Monto" onChange={actualizarState} name="total_pago" value={total_pago} />
        <br/>
        <br/>
        <Campo>
        <Label>Comprobante:</Label>
          <Select
                    name='id_comprobante'
                    value={id_comprobante}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(comprobantes).map(pr=>(
                      <option key={pr.id_comprobante} value={pr.id_comprobante}>{pr.numero_comprobante}</option>
                    ))}
            </Select>
        </Campo>
        <br/>
        <input name='input=file' id='selectArchivo' type='file' />
        <br/>
        <br/>
        <div align="right">
          <Button className="p" onClick={()=>abrirCerrarDialog()} >Cargar Detalle</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )

    const{id_pago}=pagos;

    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Pago</h4>
        <br/>
        <TextField className={styles.inputMaterial} label="Numero de Pago" onChange={actualizarState} name="numero_Pago" value={pagos&&numero_pago}/> 
        <br/>
        <br/>
        <Campo>
        <Label>Nombre Proveedor</Label>
          <Select
                    name='proveedor_pago'
                    value={pagos&&proveedor_pago}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(pro).map(pr=>(
                      <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre_proveedor}</option>
                    ))}
            </Select>
        </Campo>
        <br/>
        <TextField type="date" className={styles.inputMaterial} label=""  onChange={actualizarState} name="fecha_emision" value={pagos&&fecha_emision}/>
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Monto" onChange={actualizarState} name="total_pago" value={pagos&&total_pago} />
        <br/>
        <br/>
        <Campo>
        <Label>Comprobante:</Label>
          <Select
                    name='id_comprobante'
                    value={pagos&&id_comprobante}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(comprobantes).map(pr=>(
                      <option key={pr.id_comprobante} value={pr.id_comprobante}>{pr.numero_comprobante}</option>
                    ))}
            </Select>
        </Campo>
        <br/>
          <input type="file"  name='input=file' id='selectArchivo'/>
          <br/>
          <br/>
          <a href={pagos&&link_archivo} target="_blank"><b>Previsualización del Archivo Subido</b></a>
        <br/>
        <br/>
        <div align="right">
          <Button className="p" onClick={()=>abrirCerrarDialog2()} >Cargar Detalle</Button>
          <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
        </div>
      </div>
    )


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
      setPagos({})
    }

    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarPagos = (pagos,caso)=>{
      setPagos(pagos);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        dato();
        compro();
    },[])

    //Nuevo
    const volverAnterior=()=>{
      eliminarDialog()
      insertarModal(true)
    }
    const productDialogFooter = (
      <React.Fragment>
          <Button label="Volver" icon="pi pi-times" className="p-button-text" onClick={volverAnterior} />
          <Button label="Registrar Pago" icon="pi pi-check" className="p-button-text"/>
      </React.Fragment>
    );
    const abrirCerrarDialog=()=>{
      abrirCerrarModalInsertar();
      setDialog(true);
    }

    const eliminarDialog=()=>{
      setDialog(false)
    }

    
  const abrirCerrarDialog2=()=>{
    abrirCerrarModalEditar();
    setDialog(true);
  }

  return (
    <Main>
       
        <MaterialTable
            title="Pagos"
            columns={columnas}
            data={data}
            actions={[
                {
                    icon:"edit",
                    tooltip:"Modificar",
                    onClick: (event,rowData)=>seleccionarPagos(rowData,"Editar")
                },
                {
                    icon:"delete",
                    tooltip:"Eliminar",
                    onClick: (event,rowData)=>handleEliminar(rowData.id_pago)
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

        <Dialog visible={dialog}  header="Detalle" style={{ width: '450px' }} modal className="p-fluid"  footer={productDialogFooter} onHide={eliminarDialog}>
            <div className="field mb-4">
                <Dropdown placeholder="Comprobantes"/>
            </div>
            <div className="field mb-4">
              <Dropdown  placeholder="Modo de pago"/>
            </div>
            <Button>Agregar</Button>
            <DataTable>
              <Column field="nombre_articulo" header="Comprobantes"></Column>
              <Column field="cantidad" header="Modo de pago"></Column>
            </DataTable>
        </Dialog>




        <div className="contenedor">
          <br/>
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Pago</button>
          <br/><br/>
        </div>
    </Main>
  )
}

export default Pagos