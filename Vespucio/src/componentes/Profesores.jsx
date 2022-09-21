import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
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


const Profesores = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[profesor,profesorAgregado]=useState({
        id_tipo_personal:2,
        nombre_personal:'',
        telefono_personal:'',
        mail_personal:'',
        domicilio_personal:'',
        apellido_personal:'',
        dni_personal:'',
    })


   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const { data: personalEducativo, error } = await supabase
            .from('personalEducativo')
            .select(`
              *,
              tipoPersonal(
                nombre_tipo_personal
              )
            `)
            .eq("isHabilitado_personal",true)
            .eq("id_tipo_personal",2)
        
            setData(personalEducativo)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_personal)=>{
      try {
        const result= await supabase.from("personalEducativo")
        .update({isHabilitado_personal:false})
        .eq("id_personal",id_personal)


       console.log(result)
      } catch (error) {
        console.log(error)
      }
    }

    const{id_tipo_personal,nombre_personal,telefono_personal,mail_personal,domicilio_personal,apellido_personal,dni_personal}=profesor;

    const update2=async(id_personal)=>{
      try {
        const {result,error}= await supabase.from("personalEducativo")
        .update({id_tipo_personal,nombre_personal,telefono_personal,mail_personal,domicilio_personal,apellido_personal,dni_personal})
        .eq("id_personal",id_personal)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload();
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("personalEducativo").insert([{
            id_tipo_personal,
            nombre_personal,
            telefono_personal,
            mail_personal,
            domicilio_personal,
            apellido_personal,
            dni_personal
          
        }]);

        console.log(result)
        abrirCerrarModalInsertar();
        window.location.reload()
        setData({
          ...data,
          result
        })
       
      } catch (error) {
        console.log(error)
      }
    }

    const handleEliminar=(id_personal)=>{
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
          update(id_personal);
        }
         setTimeout(() => {
          window.location.reload()
        }, 1000); 
      });
    }

    //Configuracion del 
    const columnas=[
        {title:"Tipo de Personal", field:"tipoPersonal.nombre_tipo_personal"},
        {title:"Nombre", field:"nombre_personal"},
        {title:"Apellido", field:"apellido_personal"},
        {title:"DNI", field:"dni_personal"},
        {title:"Telefono",field:"telefono_personal"},
        {title:"Email", field:"mail_personal"},
        {title:"Domicilio", field:"domicilio_personal"}
      ]

      

    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      profesorAgregado({
          ...profesor,
          [e.target.name]: e.target.value
      })
  }

  const[categorias,setCategorias]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('tipoPersonal')
    .select()
    .eq("isHabilitado_tipoPerso",true);

    setCategorias(result.data)
  }

    const bodyInsertar= (
      
      <div className={styles.modal}>
        <h4>Agregar Nuevo Profesor</h4>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre"  onChange={actualizarState} name="nombre_personal" value={nombre_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Apellido" onChange={actualizarState} name="apellido_personal" value={apellido_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="DNI" onChange={actualizarState} name="dni_personal" value={dni_personal} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_personal" value={telefono_personal} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="mail_personal" value={mail_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="domicilio_personal" value={domicilio_personal}/>
        <br/>
        <br/><br/><br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )


    


    const {id_personal}=profesor;

    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Profesor</h4>        
        <TextField className={styles.inputMaterial} label="Nombre" onChange={actualizarState} name="nombre_personal" value={profesor&&nombre_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Apellido" onChange={actualizarState} name="apellido_personal" value={profesor&&apellido_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="DNI" onChange={actualizarState} name="dni_personal" value={profesor&&dni_personal} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_personal" value={profesor&&telefono_personal} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="email_personal" value={profesor&&mail_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="domicilio_personal" value={profesor&&domicilio_personal}/>
        <br/>
        <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_personal)} color='primary'>Editar</Button>
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

    const seleccionarProfesor = (profesor,caso)=>{
        profesorAgregado(profesor);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        datos();

    },[])


  return (
    <div>
        <h1 align="center">Sistema</h1>

        <MaterialTable
            title="Profesores"
            columns={columnas}
            data={data}
            actions={[
                {
                    icon:"edit",
                    tooltip:"Modificar",
                    onClick: (event,rowData)=>seleccionarProfesor(rowData,"Editar")
                },
                {
                    icon:"delete",
                    tooltip:"Eliminar",
                    onClick: (event,rowData)=>handleEliminar(rowData.id_personal)
                }
                
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
        
        <div className="contenedor">
          <br/>
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Profesor</button>
          <br/>
          <Link to='/CategoriasProveedores'>
            <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton">Ver Categorias de Proveedores</button>
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
    </div>
  )
}


 
export default Profesores