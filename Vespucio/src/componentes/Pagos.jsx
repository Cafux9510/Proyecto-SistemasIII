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
    const [ error, guardarError ] = useState(false); 
    const[pagos,setPagos]=useState({
        numero_pago:'',
        proveedor_pago:'',
        fecha_emision:'',
        total_pago:'',
        link_archivo:'',
    })

    const[cobros,setCobros]=useState([])
    const[cobro,setCobro]=useState({
      id_comprobante:'',
      modo_pago:''
    })

    const[comprobantes2,setComprobantes2]=useState({
      fecha_emision:"",
      total_comprobante:""
    })
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
        .upload('archivos-pagos/'+(generarId()), avatarFile, {
          cacheControl: '3600',
          upsert: false,
        })
  
        const principio_cadena = 'https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/';
        const final_cadena = foto.data.Key
        const link_archivo= principio_cadena + final_cadena
  
        const {error,result}= await supabase.from("pagos").insert({
          proveedor_pago,
          numero_pago,
          fecha_emision,
          total_pago,
          link_archivo
        });
  
        const resultado = await supabase.from("pagos")
        .select('id_pago')
        .eq("numero_pago",numero_pago)
  
        const valor=resultado.data[0].id_pago
  
  
        cobros.map( async(cobr)=>{
            const dato = await supabase.from("lineasPagos").insert({
              id_pago:valor,
              id_comprobante:cobr.id_comprobante,
              modo_pago:cobr.modo_pago
            })

            console.log(dato.data)
          })
         
  
          setDialog(false)
          
         
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

  const agregarDatos=()=>{
    crearDetalle(cobro)
    setCobro({})
    setComprobantes2({
      fecha_emision:"",
      total_comprobante:""
    })
    
  }


  const[comprobantes,setComprabantes]=useState([]);
  const compro= async()=>{
    const result = await supabase.from('comprobantes')
    .select()
    .eq("isHabilitado_comprobante",true);

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

    const bodyInsertar= (
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
          <Button className="p" onClick={()=>abrirCerrarDialog2(id_pago)} >Cargar Detalle</Button>
          <Button onClick={()=>vaciarState()}>Cancelar</Button>
        </div>
      </div>
    )

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

    const seleccionarPagos = (pagos,caso)=>{
      setPagos(pagos);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        dato();
        compro();
        pago();
    },[])

    //Nuevo

    const volverAnterior=()=>{
      eliminarDialog()
      insertarModal(true)
    }
    const productDialogFooter = (
      <React.Fragment>
          <Button label="Volver" icon="pi pi-times" className="p-button-text" onClick={volverAnterior} />
          <Button label="Registrar Pago" icon="pi pi-check" className="p-button-text" onClick={submit}/>
      </React.Fragment>
    );
    const abrirCerrarDialog=()=>{
      if(numero_pago.trim()===""|| proveedor_pago.trim()===""||fecha_emision.trim()===""|| total_pago.trim()===""){
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

    const eliminarDialog=()=>{
      setDialog(false)
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
      id_comprobante:seleccionado.id_comprobante
    })
    setComprobantes2({
      fecha_emision:seleccionado.fecha_emision,
      total_comprobante:seleccionado.total_comprobante
    })
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
                <Dropdown name="id_comprobante" placeholder="Numero del Comprobante" optionValue="id_comprobante" optionLabel="numero_comprobante" value={cobro.id_comprobante} onChange={seleccionaComprobante} options={comprobantes}/>
            </div>
            <div className="field mb-4">
              <label>Fecha del Comprobante</label>
              <InputText  placeholder="Fecha del Comprobante" value={comprobantes2.fecha_emision} disabled type="text"/>
            </div>
            <div className="field mb-4">
             <label>Monto Comprobante</label>
              <InputText  placeholder="Monto del Comprobante" value={comprobantes2.total_comprobante} disabled type="text"/>
            </div>
            <div className="field mb-4">
              <Dropdown name="modo_pago" placeholder="Modo de pago" onChange={actualizarStateDetalle} value={cobro.modo_pago}  options={modosPago}/>
            </div>
            <div className="field mb-4">
              <InputText   name='input=file' id='selectArchivo'  type='file' />
            </div>
            <Button onClick={agregarDatos}>Agregar</Button>
            <DataTable value={cobros}>
              <Column field="id_comprobante" header="Comprobantes"></Column>
              <Column field="modo_pago" header="Modo de pago"></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
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