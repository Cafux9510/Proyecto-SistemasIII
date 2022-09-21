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


const Alumnos = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[alumno,alumnoAgregado]=useState({
        id_anioEduc:'',
        nombre_alumno:'',
        telefono_alumno:'',
        mail_alumno:'',
        domicilio_alumno:'',
        dni_alumno:'',
        apellido_alumno:''
    })


   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const { data: alumnos, error } = await supabase
            .from('alumnos')
            .select(`*,anioEducativo(nombre_anioEduc)`)
            .eq("isHabilitado_alumno",true)
        
            setData(alumnos)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_alumno)=>{
      try {
        const result= await supabase.from("alumnos")
        .update({isHabilitado_anio:false})
        .eq("id_alumno",id_alumno)


       console.log(result)
      } catch (error) {
        console.log(error)
      }
    }

    const{id_anioEduc,nombre_alumno,telefono_alumno,mail_alumno,domicilio_alumno,dni_alumno,apellido_alumno}=alumno;

    const update2=async(id_alumno)=>{
      try {
        const {result,error}= await supabase.from("alumnos")
        .update({id_anioEduc,nombre_alumno,telefono_alumno,mail_alumno,domicilio_alumno,dni_alumno,apellido_alumno})
        .eq("id_alumno",id_alumno)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload();
       } catch (error) {
        console.log(error)
      }
    }

    const submit = async()=>{
      try {
        const {error,result}= await supabase.from("alumnos").insert([{
            id_anioEduc,
            nombre_alumno,
            telefono_alumno,
            mail_alumno,
            domicilio_alumno,
            dni_alumno,
            apellido_alumno
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

    const handleEliminar=(id_alumno)=>{
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
          update(id_alumno);
        }
         setTimeout(() => {
          window.location.reload()
        }, 1000); 
      });
    }

    //Configuracion del 
    const columnas=[
        {title:"Año Educativo", field:"id_anioEduc"},
        {title:"Nombre", field:"nombre_alumno"},
        {title:"Apellido", field:"apellido_alumno"},
        {title:"DNI", field:"dni_alumno"},
        {title:"Telefono",field:"telefono_alumno"},
        {title:"Email", field:"mail_alumno"},
        {title:"Domicilio", field:"domicilio_alumno"}
      ]


    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      alumnoAgregado({
          ...alumno,
          [e.target.name]: e.target.value
      })
  }

  /*const[categorias,setCategorias]=useState({}) 
  const datos=async()=>{
    const result = await supabase.from('tipoPersonal')
    .select()
    .eq("isHabilitado_tipoPerso",true);

    setCategorias(result.data)
  }*/

    const bodyInsertar= (
      
      <div className={styles.modal}>
        <h4>Agregar Nuevo Alumno</h4>
        <br/>
        <TextField className={styles.inputMaterial} label="Nombre"  onChange={actualizarState} name="nombre_alumno" value={nombre_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Apellido" onChange={actualizarState} name="apellido_alumno" value={apellido_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="DNI" onChange={actualizarState} name="dni_alumno" value={dni_alumno} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_alumno" value={telefono_alumno} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="mail_alumno" value={mail_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="domicilio_alumno" value={domicilio_alumno}/>
        <br/>
        <br/><br/><br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )


    


    const {id_alumno}=alumno;

    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Alumno</h4>        
        <TextField className={styles.inputMaterial} label="Nombre" onChange={actualizarState} name="nombre_alumno" value={alumno&&nombre_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Apellido" onChange={actualizarState} name="apellido_alumno" value={alumno&&apellido_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="DNI" onChange={actualizarState} name="dni_alumno" value={alumno&&dni_alumno} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_alumno" value={alumno&&telefono_alumno} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="mail_alumno" value={alumno&&mail_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="domicilio_alumno" value={alumno&&domicilio_alumno}/>
        <br/>
        <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_alumno)} color='primary'>Editar</Button>
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

    const seleccionarAlumno = (alumno,caso)=>{
        alumnoAgregado(alumno);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();
        /*datos();*/

    },[])


  return (
    <div>
        <h1 align="center">Sistema</h1>

        <MaterialTable
            title="Alumnos"
            columns={columnas}
            data={data}
            actions={[
                {
                    icon:"edit",
                    tooltip:"Modificar",
                    onClick: (event,rowData)=>seleccionarAlumno(rowData,"Editar")
                },
                {
                    icon:"delete",
                    tooltip:"Eliminar",
                    onClick: (event,rowData)=>handleEliminar(rowData.id_alumno)
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
          <button className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Alumno</button>
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


 
export default Alumnos