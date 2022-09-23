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
import { Link } from "react-router-dom";


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
    });



    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const result= await supabase.from('articulos')
           .select(`
              *,
              categoriasArticulos(
                nombre_categoria
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

    const{nombre_producto,categoria_producto,descripcion_producto}=insumos;

    const update2=async(id_producto)=>{
      try {
        const result= await supabase.from("articulos")
        .update({nombre_producto,categoria_producto,descripcion_producto})
        .eq("id_producto",id_producto)
        
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
          descripcion_producto
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
        {title:"Descripcion", field:"descripcion_producto"}
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
    const result = await supabase.from('categoriasArticulos')
    .select()
    .eq("isHabilitado_categoria",true);

    setCategorias(result.data)
  }

  //Funcion que me trae la lista de proveedores y lo agrega a la lista desplegable
  const[proveedo,setProveedo]=useState({}) 
  const prove=async()=>{
    const result = await supabase.from('proveedores')
    .select()
    .eq("isHabilitado_proveedor",true);

    setProveedo(result.data)
  }

  /*ACA MODIFICO FACUNDO-C1*/

  //Funcion que me trae la lista de productos y lo agrega a la lista desplegable
  const[nombres_prod,setNombresProd]=useState({})
  const nombresProd=async()=>{
    const result = await supabase.from('articulos')
    .select()
    .eq("isHabilitado_producto",true);

    setNombresProd(result.data)
  }


  /*HASTA ACA*/

    const bodyInsertar= (
      <div className={styles.modal}>
        <h3>Agregar Nuevo Insumo</h3> {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
        <TextField className={styles.inputMaterial} label="Nombre Insumo" onChange={actualizarState} name="nombre_producto" value={nombre_producto}/> 
        <br/>
        <br/>
        <label>Seleccione una Categoría</label>
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
        <label>Descripcion del Insumo</label>
        <br/>
        <br/>
        <textarea type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="descripcion_producto" value={descripcion_producto} />
        <br/>
        <br/>
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
        <h4>Editar datos de Insumo</h4>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre Insumo" onChange={actualizarState} name="nombre_producto" value={insumos&&nombre_producto}/>
        <br/>
        <br/>
        <label>Categoría</label>
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

        <br/>
        <label>Descripcion del Insumo</label>
        <br/>
        <br/>
        <textarea type="text" className={styles.inputMaterial} label="Descripcion" onChange={actualizarState} name="descripcion_producto" value={descripcion_producto} />
        
         <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_producto)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
        </div>
      </div>
    )


    /*ACA TAMBIEN MODIFICO FACUNDO-C1*/

    const selectProduct=(event)=>{
      
      const product= nombres_prod.find(producto=>producto.id_producto == event.target.value);
      console.log(product)
      setInsumos(product)
    }

  
    const sumar = e=>{
      setInsumos({
        ...insumos,
        [e.target.name]: e.target.value
    })
      
    }

  
    const bodyEditarStock= (
      <div className={styles.modal}>
        <h3>Registrar nuevo ingreso de un Insumo</h3>
        <br/>
        <Label>Insumo que ingresó</Label>
        <br/>
        <br/>
        <Campo>
          <Select
                    name='id_producto'
                    value={id_producto}
                    onChange={selectProduct}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(nombres_prod).map(pr=>(
                      <option key={pr.id_producto} value={pr.id_producto}>{pr.nombre_producto}</option> 
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <Label>Cantidad del Insumo que ingresó</Label>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Nuevo Ingreso" onChange={sumar} name="stock_producto" />
        <br/>
        <br/>
        <br/>{/*AYUDA DE FRANCO, FACUNDO-C1, PARA SUMAR EL STOCK QUE YA HABIA CON EL QUE ESTA INGRESANDO EL USUARIO*/}
        <Label>En su depósito habrá la siguiente cantidad:</Label>
        <br/>
        <br/>  
        <TextField type="number" className={styles.inputMaterial} disabled onChange={actualizarState} name="stock_producto" />
        <br/>  
        <br/>
        <br/>
        <div align="right">
          <Button onClick={()=>update2(id_producto)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalActualizarStock()}>Cancelar</Button>
        </div>
      </div>
    )

    /*HASTA ACA*/


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
      setInsumos({})
    }

    /*agregado por FACUNDO-C1*/
    const abrirCerrarModalActualizarStock= ()=>{
      stockModal(!modalEditarStock)
      setInsumos({})
    }
    /*HASTA ACA*/

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
        nombresProd();
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
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Insumo</button>
          
          {/*CAMBIO DE FACUNDO-C2*/}

          <Link to='/CategoriasInsumos'>
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton">Ver Categorias de Insumos</button>
          </Link>

          {/*HASTA ACA*/}       

          <br/><br/>
        </div>
    </div>
  )
}

export default Insumos