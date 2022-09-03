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



const Insumos = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[insumos,setInsumos]=useState({
        nombre_producto:'',
        categoria_producto:'',
        descripcion_producto:'',
        stock_producto:'',
        id_proveedor:''
    })
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('articulos')
           .select(`
              *,
              categoriasArticulos(
                nombre_categoria
              ),
              proveedores(
                nombre_proveedor
              )
          `)
           .eq("isHabilitado_producto",true)
           setData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_producto)=>{
      try {
        const result= await supabase.from("articulos")
        .update({isHabilitado_producto:false})
        .eq("id_producto",id_producto)


       
      } catch (error) {
        console.log(error)
      }
    }

    const{nombre_producto,categoria_producto,descripcion_producto,stock_producto,id_proveedor}=insumos;

    const update2=async(id_producto)=>{
      try {
        const result= await supabase.from("articulos")
        .update({nombre_producto,categoria_producto,descripcion_producto,stock_producto,id_proveedor})
        .eq("id_producto",id_producto)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload()
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("articulos").insert({
          nombre_producto,
          categoria_producto,
          descripcion_producto,
          stock_producto,
          id_proveedor
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

    const handleEliminar=(id_producto)=>{
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
          update(id_producto);
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      });
    }

    //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
    const columnas=[ 
        {title:"N°", field:"id_producto"},
        {title:"Nombre", field:"nombre_producto"},
        {title:"Categoria", field:"categoriasArticulos.nombre_categoria"},
        {title:"Stock", field:"stock_producto"},
        {title:"Descripcion", field:"descripcion_producto"},
        {title:"Proveedor", field:"proveedores.nombre_proveedor"},
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      setInsumos({
          ...insumos,
          [e.target.name]: e.target.value
      })
  }

  //Funcion que me trae la lista de categorias y lo agrega a la lista desplegable
  const[categorias,setCategorias]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('categoriasArticulos').select();

    setCategorias(result.data)
  }

  const[proveedo,setProveedo]=useState({}) 
  const prove=async()=>{
    const result = await supabase.from('proveedores').select();

    setProveedo(result.data)
  }


    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nuevo Insumo</h3> {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
        <TextField className={styles.inputMaterial} label="Nombre Insumo" onChange={actualizarState} name="nombre_producto" value={nombre_producto}/> 
        <br/>
        <Campo>
          <Select
                    name='categoria_producto'
                    value={categoria_producto}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(categorias).map(pr=>(
                      <option key={pr.id_categoria} value={pr.id_categoria}>{pr.nombre_categoria}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <TextField className={styles.inputMaterial} label="Stock" onChange={actualizarState} name="stock_producto" value={stock_producto}/>
        <br/>
        <TextField type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="descripcion_producto" value={descripcion_producto} />
        <br/>
        <br/>
        <Campo>
          <Select
                    name='id_proveedor'
                    value={id_proveedor}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(proveedo).map(prr=>(
                      <option key={prr.id_proveedor} value={prr.id_proveedor}>{prr.nombre_proveedor}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )

    const{id_producto}=insumos;

    const bodyEditar= (
      <div className={styles.modal}>
        <h3>Editar datos de Insumo</h3>
        <TextField className={styles.inputMaterial} label="Nombre Insumo" onChange={actualizarState} name="nombre_producto" value={insumos&&nombre_producto}/>
        <br/>
        <Campo>
          <Select
                    name='categoria_producto'
                    value={insumos&&categoria_producto}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(categorias).map(pr=>(
                      <option key={pr.id_categoria} value={pr.id_categoria}>{pr.nombre_categoria}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <TextField className={styles.inputMaterial} label="Stock" onChange={actualizarState} name="stock_producto" value={insumos&&stock_producto}/>
        <br/>
        <Campo>
          <Select
                    name='id_proveedor'
                    value={insumos&&id_proveedor}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(proveedo).map(prr=>(
                      <option key={prr.id_proveedor} value={prr.id_proveedor}>{prr.nombre_proveedor}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        
         <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_producto)} color='primary'>Editar</Button>
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

    const seleccionarInsumo = (insumos,caso)=>{
      setInsumos(insumos);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        datos();
        prove();
    },[])
   

  return (
    <div>
       
        <MaterialTable
            title="Insumos"
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
                    onClick: (event,rowData)=>handleEliminar(rowData.id_producto)
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