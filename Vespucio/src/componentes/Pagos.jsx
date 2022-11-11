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
  margin-top: 7%;
  width:70em;
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



const Pagos = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[dialog,setDialog]=useState(false)
    const[dialogFactura,setDialogFactura]=useState(false)
    const [ error, guardarError ] = useState(false); 
    const[pagos,setPagos]=useState({
        numero_pago:'',
        fecha_emision:'',
        total_pago:'',
    })
  
    const[totales,setTotales]=useState(0)

    const[cobros,setCobros]=useState([])
    const[cobro,setCobro]=useState({
      id_comprobante:'',
      modo_pago:''
    })

    const[comprobantes2,setComprobantes2]=useState({
      fecha_emision:"",
      total_comprobante:""
    })
  
  const { proveedor_pago } = cobros;
    
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('pagos')
           .select(`
           *,
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
          .eq("id_pago", id_pago)
        
        const result22= await supabase.from("lineasPagos")
        .select("id_comprobante")
        .eq("isHabilitado_linea",true)
        .eq("id_pago",id_pago)
        


        const result2= await supabase.from("comprobantes")
        .update({isPagado:false})
        .eq("id_comprobante",result22.data[0].id_comprobante)

        console.log(result2)
      } catch (error) {
        console.log(error)
      }
    }


    const{numero_pago,fecha_emision,total_pago,id_comprobante}=pagos;

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

    const generarId = () => {
      const random = Math.random().toString(36).substr(2);
      const fecha = Date.now().toString(36)
      return random + fecha
  }
    const submit = async()=>{
      try {
        
        cobros.map( async(cobr)=>{
            
          const pago = await supabase.from("pagos").insert({
            proveedor_pago:cobr.proveedor_pago,
            numero_pago,
            fecha_emision,
            total_pago:totales
          });
            
        })
        
        const resultado = await supabase.from("pagos")
        .select('id_pago')
        .eq("numero_pago",numero_pago)
  
        const valor=resultado.data[0].id_pago
  
        console.log(cobros)
  
        cobros.map( async(cobr)=>{
            const dato = await supabase.from("lineasPagos").insert({
              id_pago:valor,
              id_comprobante:cobr.id_comprobante,
              modo_pago:cobr.modo_pago
            })
          
            console.log(dato)
          
            const ressult= await supabase.from("comprobantes")
            .update({isPagado:true})
            .eq("id_comprobante",cobr.id_comprobante)

            console.log(ressult)
        })
         
  
        setDialog(false)
        
        setTimeout(() => {
          window.location.reload()
        }, 2000);
          
         
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
        {title:"N° de Pago", field:"numero_pago"},
        {title:"Proveedor", field:"proveedores.nombre_proveedor"},
        {title:"Fecha Pago", field:"fecha_emision"},
        {title:"Monto",field:"total_pago"},

        
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
       setPagos({
          ...pagos,
          [e.target.name]: e.target.value
      })
  }

  const actualizarStateDetalle = e =>{
    setCobro({
        ...cobro,
        [e.target.name]: e.target.value
    })
}

  const crearDetalle=(co)=>{
    setCobros([...cobros,co]);
  }

  useEffect(()=>{
        const variable=cobros.reduce((total,cobro)=>cobro.total_comprobante+total,0)
        console.log(Number(variable))
        setTotales(Number(variable))
    },[cobros])

  const agregarDatos=()=>{
    crearDetalle(cobro)
    setCobro({})
    setComprobantes2({
      fecha_emision:"",
      total_comprobante:""
    })
    
  }

    useEffect(()=>{
      funcion();
        compro();
        dato();
        pago();
   },[])

  const[comprobantes,setComprabantes]=useState([]);
  const compro= async()=>{
    const result = await supabase.from('comprobantesPagarView')
      .select();

    setComprabantes(result.data)
  }

  const[lineaPago,setLineaPago]=useState([])

  const pago= async()=>{
    const result= await supabase.from("lineasPagos")
    .select()
    .eq("isHabilitado_linea",true)


    setLineaPago(result.data)
  }
  
  const[pro,setPro]=useState({}) 
  const dato=async()=>{
    const result = await supabase.from('proveedores')
    .select()
    .eq("isHabilitado_proveedor",true);;

    setPro(result.data)
  }

   /*  const bodyInsertar= (
      <div className={styles.modal}>
        <h4>Registrar Nuevo Pago</h4>
        {error ? <Error>Todos los campos son obligatorios</Error>:null}
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
        <div align="right">
          <Button className="p" onClick={()=>abrirCerrarDialog()} >Cargar Detalle</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )
 */
    const{id_pago}=pagos;

/*     const bodyEditar= (
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
          <Button className="p" onClick={()=>abrirCerrarDialog2(id_pago)} >Cargar Detalle</Button>
          <Button onClick={()=>vaciarState()}>Cancelar</Button>
        </div>
      </div>
    ) */

    const modosPago = [
      {label: 'Efectivo', value: 'Efectivo'},
      {label: 'Debito', value: 'Debito'},
      {label: 'Transferencia', value: 'Transferencia'},
      {label: 'Credito', value: 'Credito'},
  ];

    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
  
    }

    const vaciarState=()=>{
      setPagos({})
      setModalEditar(!modalEditar)
    }
    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
    }

    const seleccionarPagos = (pagos)=>{
      console.log(pagos)
      console.log(lineaPago)
      const detalis=lineaPago.filter(pago=>pago.id_pago == pagos.id_pago);
      console.log(detalis)
      setPagos(pagos);
      setCobros([...detalis])
      setDialog(true)
     
    }


    //Nuevo

    
    const eliminarDialog=()=>{
      setDialog(false)
      setPagos({})
      setComprobantes2({})
      setCobro({})
      setCobros([])
    }
    const productDialogFooter = (
      <React.Fragment>
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={eliminarDialog} />
          <Button label="Registrar Pago" icon="pi pi-check" className="p-button-text" onClick={submit}/>
      </React.Fragment>
    );
    const abrirCerrarDialog=()=>{
      setDialog(true);
    }

    const actionBodyTemplate = (rowData) => {
      return (
          <React.Fragment>
              <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={()=>eliminarCobro(rowData.id_comprobante)} />
          </React.Fragment>
      );
    }
    const eliminarCobro=id=>{
      const actualizacion=cobros.filter(cobro=>cobro.id_comprobante!== id )
      setCobros(actualizacion)
    }
  const abrirCerrarDialog2=(id_pago)=>{
    const array=lineaPago.filter(pago=>pago.id_pago == id_pago)
    setCobros(array)
    abrirCerrarModalEditar();
    setDialog(true);
  }


  const seleccionaComprobante= (e)=>{
    let seleccionado=comprobantes.find(comprobante =>comprobante.id_comprobante===e.target.value );
    setCobro({
      id_comprobante: seleccionado.id_comprobante,
      concatenado: seleccionado.concatenado,
      total_comprobante: seleccionado.total_comprobante,
      proveedor_pago: seleccionado.proveedor_pago
    })

    

  }

  const mostrarFactura= (pago)=>{
    setPagos({
      numero_pago:pago.numero_pago,
      fecha_emision: pago.fecha_emision,
      proveedor: pago.proveedores["nombre_proveedor"]
    })
    setDialogFactura(true)
  }

  const hideDialog= ()=>{
    setDialogFactura(false)
    setPagos({})
}
  return (
    <Main>
       
        <MaterialTable
            title="Pagos"
            columns={columnas}
            data={data}
            actions={[
                {
                    icon:"visibility",
                    tooltip:"Modificar",
                    onClick: (event,rowData)=>seleccionarPagos(rowData)
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
         
        </Modal>
            
        <Modal
          open={modalEditar}
          onClose={abrirCerrarModalEditar}
        >
        
        </Modal>

        <Dialog visible={dialog}  header={pagos.id_pago? "Ver Pago": "Registrar Pago"} style={{ width: '700px' }} modal className="p-fluid"  footer={productDialogFooter} onHide={eliminarDialog}>
          <div className="grid">
            <div className="col">
              <div className='field'>
                <label>Numero de Pago</label>
                <InputText name="numero_pago" value={pagos.numero_pago || ""} required autoFocus onChange={actualizarState} type="number"/>
              </div>

              <div className="field mb-4">
                <InputText name="fecha_emision" value={pagos.fecha_emision || ""} onChange={actualizarState} type="date"/>
              </div>

            </div>
            <div className="col">
              <div className="field mb-4">
                <label>Comprobantes</label>
                <Dropdown name="id_comprobante" placeholder="Numero del Comprobante" optionValue="id_comprobante" optionLabel="concatenado" value={cobro.id_comprobante || ""} onChange={seleccionaComprobante} options={comprobantes}/>
              </div>
        
              <div className="field mb-4">
                <Dropdown name="modo_pago" placeholder="Modo de pago" onChange={actualizarStateDetalle} value={cobro.modo_pago || ""}  options={modosPago}/>
              </div>
              <div className="field w-min mb-4 m-auto">
                <Button className="w-15 "  onClick={agregarDatos}>Agregar</Button> 
              </div>
            </div>
            <div className="field m-auto">
              <DataTable value={cobros || ""} showGridlines>
                <Column field="concatenado" header="Comprobantes"></Column>
                <Column field="modo_pago" header="Modo de pago"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
              </DataTable>
           </div>
          <div>
            <br />
              <label className="text-2xl uppercase">Total: <span>{totales}</span></label>
             </div>
          </div>
        </Dialog>



        <div className="contenedor">
          <br/>
          <button className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={abrirCerrarDialog}>Registrar Nuevo Pago</button>
          <br/><br/>
        </div>
    </Main>
  )
}

export default Pagos