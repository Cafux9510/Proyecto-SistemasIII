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
import { Link } from "react-router-dom";
import {DataTable} from "primereact/datatable";
import { Column } from 'primereact/column';
import {Dropdown} from "primereact/dropdown";

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

const Error = styled.div`
    background-color: red;
    color: white;
    padding: 1rem;
    width:100%;
    text-align: center;
    margin-bottom: 2rem;
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



const Comprobantes = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[dialog,setDialog]=useState(false) 
    const[comprobante,setComprobante]=useState({
        tipo_comprobante:'',
        proveedor_comprobante:'',
        tipo_movimiento:'',
        numero_comprobante:'',
        fecha_emision:'',
        total_comprobante:'',
        link_archivo:'',
    })
    const[detalles,setDetalles]=useState([])
    const[detalle,setDetalle]=useState({
      id_articulo:"",
      cantidad_articulo:"",
      precio_unitario:"",
      total:""
    })
    const [ error, guardarError ] = useState(false);
    const[totales,setTotales]=useState(0)
    let{cantidad_articulo,precio_unitario,total}=detalle;
  
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('comprobantes')
           .select(`
           *,
           tipoComprobante(
             nombre_tipo
           ),
           proveedores(
            nombre_proveedor
           )
         `)
           .eq("isHabilitado_comprobante",true)
           setData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_comprobante)=>{
      try {
        const result= await supabase.from("comprobantes")
        .update({isHabilitado_comprobante:false})
        .eq("id_comprobante",id_comprobante)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{tipo_comprobante,proveedor_comprobante,tipo_movimiento,numero_comprobante,fecha_emision,total_comprobante,link_archivo}=comprobante;

    const update2=async(id_comprobante)=>{
      try {
          const avatarFile = document.getElementById('selectArchivo').files[0];
          const  foto = await supabase.storage
          .from('archivos-subidos')
          .upload('archivos-comprobantes/'+parseInt(avatarFile.lastModified/avatarFile.size), avatarFile, {
            cacheControl: '3600',
            upsert: false,
          })

          const principio_cadena = 'https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/';
          const final_cadena = foto.data.Key
          const link_archivo= principio_cadena + final_cadena
        
        
        const result= await supabase.from("comprobantes")
        .update({tipo_comprobante,proveedor_comprobante,tipo_movimiento,numero_comprobante,fecha_emision,total_comprobante,link_archivo})
        .eq("id_comprobante",id_comprobante)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload(); 
       } catch (error) {
        console.log(error)
      }
    }

    const generarId = () => {
      const random = Math.random().toString(36).substr(2);
      const fecha = Date.now().toString(36)
      return random + fecha
  }
  
    const submit = async()=>{

      try {
        const avatarFile = document.getElementById('selectArchivo').files[0];
        const  foto = await supabase.storage
        .from('archivos-subidos')
        .upload('archivos-comprobantes/'+(generarId()), avatarFile, {
          cacheControl: '3600',
          upsert: false,
        })

        const principio_cadena = 'https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/';
        const final_cadena = foto.data.Key
        const link_archivo= principio_cadena + final_cadena

        const {error,result}= await supabase.from("comprobantes").insert({
          tipo_comprobante,
          proveedor_comprobante,
          tipo_movimiento,
          numero_comprobante,
          fecha_emision,
          total_comprobante,
          link_archivo
        });

        const resultado = await supabase.from("comprobantes")
        .select('id_comprobante')
        .eq("numero_comprobante",numero_comprobante)

        const valor=resultado.data[0].id_comprobante


        detalles.map( async(deta)=>{
            const dato = await supabase.from("lineasComprobantes").insert({
              id_comprobante:valor,
              id_articulo:deta.id_articulo,
              cantidad_articulo:deta.cantidad_articulo,
              precio_unitario:deta.precio_unitario
            })
          })

          setDialog(false)
          location.reload();
          
         
      } catch (error) {
        console.log(error)
      }
    }


    const handleEliminar=(id_comprobante)=>{
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
          update(id_comprobante);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    const[lineaComprobantes, setLineaComprobante]=useState([])

    const lineaComprobante= async()=>{
      const result= await supabase.from("lineasComprobantes")
      .select()
      .eq("isHabilitado_linea",true)

      setLineaComprobante(result.data)
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"Id", field:"id_comprobante"},
        {title:"Tipo", field:"tipoComprobante.nombre_tipo"},
        {title:"Proveedor", field:"proveedores.nombre_proveedor"},
        /*{title:"Movimiento", field:"tipo_movimiento"},*/
        {title:"Numero", field:"numero_comprobante"},
        {title:"Fecha Emision",field:"fecha_emision"},
        {title:"Valor total",field:"total_comprobante"},
        
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      setComprobante({
          ...comprobante,
          [e.target.name]: e.target.value
      })
  }



  //Funciones de extraccion de proveedores y tipo comprobante
  const[tipo,setTipo]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('tipoComprobante')
    .select()
    .eq("isHabilitado_comprobante",true);

    setTipo(result.data)
  }

  const[pro,setPro]=useState({}) 
  const dato=async()=>{
    const result = await supabase.from('proveedores')
    .select()
    .eq("isHabilitado_proveedor",true);;

    setPro(result.data)
  }

  const abrirCerrarDialog=()=>{
    if(tipo_comprobante.trim() ==="" || proveedor_comprobante.trim() ==="" || tipo_movimiento.trim()==="" || numero_comprobante.trim() ==="" || fecha_emision.trim() ==="" || total_comprobante.trim() ===""){
        guardarError(true)

        setTimeout(()=>{
          guardarError(false)
        },3000)
        return;
      }
    guardarError(false);
    abrirCerrarModalInsertar();
    
    setDialog(true);
  }
  const abrirCerrarDialog2=(id)=>{
    const array= lineaComprobantes.filter(comprobante=>comprobante.id_comprobante !==id )
    setDetalles(array)
    abrirCerrarModalEditar();
    setDialog(true);
  }
  const eliminarDialog=()=>{
    setDialog(false)
  }

  const volverAnterior=()=>{
    eliminarDialog()
    insertarModal(true)
  }

    const bodyInsertar= (
      <div className={styles.modal}>
        <h4>Agregar Nuevo Comprobante</h4>
        {error ? <Error>Todos los campos son obligatorios</Error>:null}
        <br/>
        <Campo>
        <Label>Tipo Comprobante</Label>
          <Select
                    name='tipo_comprobante'
                    value={tipo_comprobante}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(tipo).map(pr=>(
                      <option key={pr.id_tipo} value={pr.id_tipo}>{pr.nombre_tipo}</option>
                    ))}
            </Select>
        </Campo>
        <br/>
        <Campo>
        <Label>Nombre Proveedor</Label>
          <Select
                    name='proveedor_comprobante'
                    value={proveedor_comprobante}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(pro).map(pr=>(
                      <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre_proveedor}</option>
                    ))}
            </Select>
        </Campo>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="N° Comprobante" onChange={actualizarState} name="numero_comprobante" value={numero_comprobante}/>
        <br/>
        <br/>
        <br/>
        <TextField type="date" className={styles.inputMaterial}   onChange={actualizarState} name="fecha_emision" value={fecha_emision}/>
        <br/>
        <br/>
        <br/>
        {/*<Label>Tipo Movimiento</Label>
        <Select name="tipo_movimiento" value={tipo_movimiento} onChange={actualizarState}>
          <option value="">--Seleccione--</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>

        </Select>*/}
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Monto Total" onChange={actualizarState} name="total_comprobante" value={total_comprobante} />
        <br/><br/>
        <div align="right">
          <Button className="p" onClick={()=>abrirCerrarDialog()} >Cargar Detalle</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )

    const{id_comprobante}=comprobante;

    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Comprobante</h4>
        <br/>
        <Campo>
        <Label>Tipo Comprobante</Label>
          <Select
                    name='tipo_comprobante'
                    value={comprobante&&tipo_comprobante}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(tipo).map(pr=>(
                      <option key={pr.id_tipo} value={pr.id_tipo}>{pr.nombre_tipo}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <Campo>
        <Label>Nombre Proveedor</Label>
          <Select
                    name='proveedor_comprobante'
                    value={comprobante&&proveedor_comprobante}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(pro).map(pr=>(
                      <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre_proveedor}</option>
                    ))}
            </Select>
        </Campo>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="N° Comprobante" onChange={actualizarState} name="numero_comprobante" value={comprobante&&numero_comprobante}/>
        <br/>
        <br/>
        <br/>
        <TextField type="date" className={styles.inputMaterial} label="Fecha Emision"  onChange={actualizarState} name="fecha_emision" value={comprobante&&fecha_emision}/>
        <br/>
        <br/>
        <br/>
        {/*<Label>Tipo Movimiento</Label>
        <Select name="tipo_movimiento" value={comprobante&&tipo_movimiento} onChange={actualizarState}>
          <option value="">--Seleccione--</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>

        </Select>*/}
        <br/>
        <br/>
        <input type="file"  name='input=file' id='selectArchivo'/>
        <br/>
        <br/>
        <a href={comprobante&&link_archivo} target="_blank"><b>Previsualización del Archivo Subido</b></a>
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Monto Total" onChange={actualizarState} name="total_comprobante" value={comprobante&&total_comprobante} />
        <br/><br/>
        <div  align="right">
          <Button className="p" onClick={()=>abrirCerrarDialog2(id_comprobante)} >Cargar Detalle</Button>
          <Button onClick={()=>vaciarState()}>Cancelar</Button>
        </div>
      </div>
    )

    //Nuevos states
    const vaciarState=()=>{
      setComprobante({})
      setModalEditar(!modalEditar)
    }
  
    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
    }

    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarProveedor = (id_comprobante,caso)=>{
      setComprobante(id_comprobante);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        datos();
        dato();
        lineaComprobante();
    },[])
   
    const productDialogFooter = (
      <React.Fragment>
          <Button label="Volver" icon="pi pi-times" className="p-button-text" onClick={volverAnterior} />
          <Button label="Registrar Comprobante" icon="pi pi-check" className="p-button-text" onClick={submit}/>
      </React.Fragment>
    );

    //Funciones para agregar datos a la tabla de detalles fiumba

    useEffect(()=>{
      const variable=detalles.reduce((total,detalle)=>detalle.total+total,0)
      console.log(variable)
      setTotales(variable)

    },[detalles])

    const crearDetalle=(de)=>{
      total= Number(cantidad_articulo)*Number(precio_unitario);
      console.log(total)
      de.total=total
      setDetalles([...detalles,de]);
    }
    const actualizarStateDetalle = e =>{
      setDetalle({
          ...detalle,
          [e.target.name]: e.target.value
      })
  }
  const agregarDatos=()=>{
    crearDetalle(detalle)
    setDetalle({
      id_articulo:"",
      cantidad_articulo:"",
      precio_unitario:"",
      total:""
    })
  }

  const[articulos,setArticulos]=useState([]);

  const articulosBD= async()=>{
    try {
       const result= await supabase.from('articulos')
       .select(`
          id_producto,
          nombre_producto
      `)
       .eq("isHabilitado_producto",true)
       setArticulos(result.data)
    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{
  articulosBD();
},[])

const eliminarDetalle=id=>{
  const actualizacion=detalles.filter(detalle=>detalle.id_articulo!== id )
  setDetalles(actualizacion)
}

const actionBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={()=>eliminarDetalle(rowData.id_articulo)} />
      </React.Fragment>
  );
}

const seleccionArticulo=(e)=>{
  let seleccionado= articulos.find(articulo=>articulo.id_producto == e.target.value)
  setDetalle({
    id_articulo:seleccionado.id_producto,
    nombre_producto:seleccionado.nombre_producto
  })
}


  return (

    <Main>       
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
                    onClick: (event,rowData)=>handleEliminar(rowData.id_comprobante)
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

        {/*MODAL DEL DETALLE AGREGADO ESTO ES NUEVO FRANCO PAAAA*/}
        <Dialog visible={dialog} header="Detalle" style={{ width: '600px' }} modal className="p-fluid" onHide={eliminarDialog} footer={productDialogFooter}>
          <div className="field mb-4">
             
              <Dropdown name="id_articulo" optionLabel="nombre_producto" optionValue="id_producto" value={detalle.id_articulo || ""} options={articulos} onChange={seleccionArticulo} placeholder="Seleccione articulo"/>
          </div>
          <div className="field mb-4">
                <InputText name="cantidad_articulo" type="number"  value={detalle.cantidad_articulo || ""} onChange={actualizarStateDetalle} placeholder="Cantidad" required autoFocus />  
          </div>

            <div className="field mb-4">
                <InputText name="precio_unitario" value={detalle.precio_unitario || ""} type="number" onChange={actualizarStateDetalle} placeholder="precio unitario"  />  
            </div>

            <div className="field mb-4">
              <InputText   name='input=file' id='selectArchivo'  type='file' />
            </div>
            <div className="field w-min mb-4">
                <Button onClick={agregarDatos} className="w-6">Agregar</Button> 
            </div>
          <DataTable value={detalles} showGridlines >
              <Column field="nombre_producto" header="Nombre Articulo"></Column>
              <Column field="cantidad_articulo" header="Cantidad"></Column>
              <Column field="precio_unitario" header="Precio Unitario"></Column>
              <Column field="total" header="Subtotal"></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} header="Acciones"></Column>
          </DataTable>
          <p>
              <span>Total</span> {totales}
          </p>
        </Dialog>
        <div className="contenedor">
          <br/>
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Comprobante</button>
          <Link to='/CategoriasComprobantes'>
            <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton">Ver Tipos de Comprobantes</button>          
          </Link>
          <br/><br/>
        </div>
    </Main>
  )
}


export default Comprobantes