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



const Comprobantes = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[comprobante,setComprobante]=useState({
        tipo_comprobante:'',
        proveedor_comprobante:'',
        tipo_movimiento:'',
        numero_comprobante:'',
        fecha_emision:'',
        total_comprobante:'',
        link_archivo:''
    })
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

    const submit = async()=>{
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
        
        const {error,result}= await supabase.from("comprobantes").insert({
          tipo_comprobante,
          proveedor_comprobante,
          tipo_movimiento,
          numero_comprobante,
          fecha_emision,
          total_comprobante,
          link_archivo
        });

        console.log(final_cadena)
       
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

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"Id", field:"id_comprobante"},
        {title:"Tipo", field:"tipoComprobante.nombre_tipo"},
        {title:"Proveedor", field:"proveedores.nombre_proveedor"},
        {title:"Movimiento", field:"tipo_movimiento"},
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
    const result = await supabase.from('tipoComprobante').select();

    setTipo(result.data)
  }

  const[pro,setPro]=useState({}) 
  const dato=async()=>{
    const result = await supabase.from('proveedores').select();

    setPro(result.data)
  }

  const subirImagen = async()=>{
    try {
      const avatarFile = document.getElementById('selectArchivo').files[0];
      const { data, error } = await supabase.storage
        .from('archivos-subidos')
        .upload('archivos-comprobantes/'+parseInt(avatarFile.lastModified/avatarFile.size), avatarFile, {
          cacheControl: '3600',
          upsert: false,
        })
        console.log()

        const principio_cadena = 'https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/';
        const final_cadena = data.Key
        const url_archivo= principio_cadena + final_cadena
        
        return url_archivo
      
    } catch (error) {
      
    }
  }


    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nuevo Comprobante</h3>
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
        <TextField type="date" className={styles.inputMaterial}   onChange={actualizarState} name="fecha_emision" value={fecha_emision}/>
        <br/>
        <Label>Tipo Movimiento</Label>
        <Select name="tipo_movimiento" value={tipo_movimiento} onChange={actualizarState}>
          <option value="">--Seleccione--</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>

        </Select>
        <br/>
        <input name='input=file' id='selectArchivo' type='file' />
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Monto Total" onChange={actualizarState} name="total_comprobante" value={total_comprobante} />
        <br/><br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )

    const{id_comprobante}=comprobante;

    const bodyEditar= (
      <div className={styles.modal}>
        <h3>Editar Comprobante</h3>
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
        <TextField type="date" className={styles.inputMaterial} label="Fecha Emision"  onChange={actualizarState} name="fecha_emision" value={comprobante&&fecha_emision}/>
        <br/>
        <Label>Tipo Movimiento</Label>
        <Select name="tipo_movimiento" value={comprobante&&tipo_movimiento} onChange={actualizarState}>
          <option value="">--Seleccione--</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>

        </Select>
        <br/>
        <input type="file"  name='input=file' id='selectArchivo'/>
        <a href={comprobante&&link_archivo} target="_blank">Archivo</a>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Monto Total" onChange={actualizarState} name="total_comprobante" value={comprobante&&total_comprobante} />
        <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_comprobante)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
        </div>
      </div>
    )


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
      setComprobante({})
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
        dato()
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


export default Comprobantes