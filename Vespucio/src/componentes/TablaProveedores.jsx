import { useEffect, useState,useRef } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import swal from "sweetalert";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";
import { Toast } from 'primereact/toast';

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


const TablaProveedores = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[proveedor,proveedorAgregado]=useState({
        nombre_proveedor:'',
        cuit_proveedor:'',
        direccion_proveedor:'',
        localidad_proveedor:'',
        telefono_proveedor:'',
        email_proveedor:'',
        id_categoria_proveedor:'',
    })
    const toast = useRef(null);


   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           /* const result= await supabase.from('proveedores')
           .select()
           .eq("isHabilitado_proveedor",true)
           setData(result.data) */
           const { data: proveedores, error } = await supabase
            .from('proveedores')
            .select(`
              *,
              categoriasProveedores(
                nombre_categoria
              )
            `)
            .eq("isHabilitado_proveedor",true)
            .order("id_proveedor",{ascending:true})
        
            setData(proveedores)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_proveedor)=>{
      try {
        const result= await supabase.from("proveedores")
        .update({isHabilitado_proveedor:false})
        .eq("id_proveedor",id_proveedor)

        const arrayProveedores = data.filter(provee=>provee.id_proveedor !==id_proveedor)
        setData(arrayProveedores)

      } catch (error) {
        console.log(error)
      }
    }

    const{id_categoria_proveedor,nombre_proveedor,cuit_proveedor,direccion_proveedor,localidad_proveedor,telefono_proveedor,email_proveedor}=proveedor;

    const update2=async(id_proveedor)=>{
      try {
        const {result,error}= await supabase.from("proveedores")
        .update({cuit_proveedor,nombre_proveedor,direccion_proveedor,localidad_proveedor,telefono_proveedor,email_proveedor,id_categoria_proveedor})
        .eq("id_proveedor",id_proveedor)
        funcion()


        const arrayProveedores = data.map((prove)=>{
          if(prove.id_proveedor === id_proveedor ){
            return{
              ...prove,
              cuit_proveedor,
              nombre_proveedor,
              direccion_proveedor,
              localidad_proveedor,
              telefono_proveedor,
              email_proveedor,
              id_categoria_proveedor
            }
          }
          return prove
        })

        setData(arrayProveedores)
        abrirCerrarModalEditar();
        toast.current.show({ severity: 'success', summary: 'Exito!', detail: 'Registro Modificado', life: 3000 });    
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const result= await supabase.from("proveedores").insert({
          cuit_proveedor,
          nombre_proveedor,
          direccion_proveedor,
          localidad_proveedor,
          telefono_proveedor,
          email_proveedor,
          id_categoria_proveedor,
        });
        funcion()

        const resultado=result.data[0]
        console.log(resultado)
        setData([...data,resultado])
        abrirCerrarModalInsertar();
       
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
     /*     setTimeout(() => {
          window.location.reload()
        }, 1000);  */
      });
    }

    //Configuracion del 
    const columnas=[
        {title:"Categoria", field:"categoriasProveedores.nombre_categoria"},
        {title:"Nombre", field:"nombre_proveedor"},
        {title:"CUIT", field:"cuit_proveedor"},
        {title:"Direccion", field:"direccion_proveedor"},
        {title:"Localidad",field:"localidad_proveedor"},
        {title:"Telefono",field:"telefono_proveedor"},
        {title:"Email", field:"email_proveedor"},
      ]



    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      proveedorAgregado({
          ...proveedor,
          [e.target.name]: e.target.value
      })
  }

  const[categorias,setCategorias]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('categoriasProveedores')
    .select()
    .eq("isHabilitado_categoria",true);

    setCategorias(result.data)
  }

    const bodyInsertar= (
      
      <div className={styles.modal}>
        <h4>Agregar Nuevo Proveedor</h4>
        <br/>
        <Label>Categoria</Label>
        <Campo>
          <Select
                    name='id_categoria_proveedor'
                    value={id_categoria_proveedor || ''}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(categorias).map(pr=>(
                      <option key={pr.id_categoria} value={pr.id_categoria}>{pr.nombre_categoria}</option>
                    ))}
                
                    
                ''
            </Select>
        </Campo>
        <TextField className={styles.inputMaterial} label="Nombre"  onChange={actualizarState} name="nombre_proveedor" value={nombre_proveedor || ''} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="CUIT" onChange={actualizarState} name="cuit_proveedor" value={cuit_proveedor || ''}/>
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="direccion_proveedor" value={direccion_proveedor || ''}/>
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Localidad" onChange={actualizarState} name="localidad_proveedor" value={localidad_proveedor || ''} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_proveedor" value={telefono_proveedor || ''} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="email_proveedor" value={email_proveedor || ''} />
        <br/><br/><br/>
        <div align="right">
          <Button color='primary' onClick={submit} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )


    


    const {id_proveedor}=proveedor;


    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Proveedor</h4>
        <br/>
        <Label>Categoria</Label>
        <br/>
        <Campo>
          <Select
                    name='id_categoria_proveedor'
                    value={proveedor&&id_categoria_proveedor}
                    onChange={actualizarState}
                    
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(categorias).map(pr=>(
                      <option key={pr.id_categoria} value={pr.id_categoria}>{pr.nombre_categoria}</option>
                    ))}     
            </Select>
        </Campo>
        <TextField className={styles.inputMaterial} label="Nombre"  onChange={actualizarState} name="nombre_proveedor" value={proveedor&&nombre_proveedor} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="CUIT" onChange={actualizarState} name="cuit_proveedor" value={proveedor&&cuit_proveedor}/>
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="direccion_proveedor" value={proveedor&&direccion_proveedor}/>
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Localidad" onChange={actualizarState} name="localidad_proveedor" value={proveedor&&localidad_proveedor} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_proveedor" value={proveedor&&telefono_proveedor} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="email_proveedor" value={proveedor&&email_proveedor} />
        <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_proveedor)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar2()}>Cancelar</Button>
        </div>
      </div>
    )


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      proveedorAgregado({})
      insertarModal(!modal)
    }

    const abrirCerrarModalEditar2= ()=>{
      setModalEditar(!modalEditar)
      proveedorAgregado({})
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
        datos();

    },[])


  return (
    <Main>


        <MaterialTable
            title="Proveedores"
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
                }
                
            ]}
            

            options={{
                  actionsColumnIndex: -1,
                  
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
        
        <div className="contenedor">
          <br/>
          <button className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Insertar Proveedor</button>
          <br/>
          <Link to='/CategoriasProveedores'>
            <button className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-700 boton">Ver Categorias de Proveedores</button>
          </Link>
          <br/>
          
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
    </Main>
  )
}


 
export default TablaProveedores