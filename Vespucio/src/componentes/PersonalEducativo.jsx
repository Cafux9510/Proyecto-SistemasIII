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
  width:70em;
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


const PersonalEducativo = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);
    const[personal,personalAgregado]=useState({
        nombre_personal:'',
        telefono_personal:'',
        mail_personal:'',
        domicilio_personal:'',
        apellido_personal:'',
        dni_personal:'',
    })
    const toast = useRef(null);


   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const { data: personal, error } = await supabase
            .from('personalEducativo')
            .select(`*`)
            .eq("isHabilitado_personal",true)
            .order("id_personal",{ascending:true})
        
            setData(personal)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_personal)=>{
      try {
        const result= await supabase.from("personalEducativo")
        .update({isHabilitado_personal:false})
        .eq("id_personal",id_personal)

        const arrayProveedores = data.filter(provee=>provee.id_personal !==id_personal)
        setData(arrayProveedores)

      } catch (error) {
        console.log(error)
      }
    }

    const{nombre_personal,telefono_personal,mail_personal,domicilio_personal,apellido_personal,dni_personal}=personal;

    const update2=async(id_personal)=>{
      try {
        const {result,error}= await supabase.from("personalEducativo")
        .update({nombre_personal,telefono_personal,mail_personal,domicilio_personal,apellido_personal,dni_personal})
        .eq("id_personal",id_personal)
        funcion()


        const arrayProveedores = data.map((prove)=>{
          if(prove.id_personal === id_personal ){
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

        let primerN = (nombre_personal.substring(0,1)).toLowerCase();
        let tresA = (apellido_personal.substring(0,3)).toLowerCase();
        let dni = parseInt(dni_personal);
        let numA = (Math.floor(Math.random() * (dni - 1000) + 1000)).toString()
        let tresUltN = numA.substring(numA.length-3);
        let usuario = primerN + tresA + tresUltN;

        const {errorr,usuarioT}= await supabase.from("usuarios").insert([{
          nombre_usuario:usuario,
          contrasenia_usuario:dni_personal
        }]);

      const user_id = await supabase.from('usuarios')
      .select('id_usuario')
      .eq("nombre_usuario",usuario);

      const valor=user_id.data[0].id_usuario
    
      console.log(valor)

      const result= await supabase.from("personalEducativo").insert({
          nombre_personal,
          telefono_personal,
          mail_personal,
          domicilio_personal,
          apellido_personal,
          dni_personal,
          id_usuario:valor
      });
      funcion()

      window.location.reload()

      abrirCerrarModalInsertar();
       
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
     /*     setTimeout(() => {
          window.location.reload()
        }, 1000);  */
      });
    }

    //Configuracion del 
    const columnas=[
        {title:"Identificador", field:"id_personal"},
        {title:"Nombre", field:"nombre_personal"},
        {title:"Apellido", field:"apellido_personal"},
        {title:"DNI", field:"dni_personal"},
        {title:"Domicilio", field:"domicilio_personal"},
        {title:"Telefono",field:"telefono_personal"},
        {title:"Email", field:"mail_personal"},
      ]



    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
        personalAgregado({
          ...personal,
          [e.target.name]: e.target.value
      })
  }


    const bodyInsertar= (
        
        <div className={styles.modal}>
        <h4>Agregar Nuevo Personal Educativo</h4>
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
        <TextField className={styles.inputMaterial} label="Domicilio" onChange={actualizarState} name="domicilio_personal" value={domicilio_personal}/>
        <br/>
        <br/><br/><br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
      
    )


    


    const {id_personal}=personal;


    const bodyEditar= (
        <div className={styles.modal}>
        <h4>Editar Personal Educativo</h4>        
        <TextField className={styles.inputMaterial} label="Nombre" onChange={actualizarState} name="nombre_personal" value={personal&&nombre_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Apellido" onChange={actualizarState} name="apellido_personal" value={personal&&apellido_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="DNI" onChange={actualizarState} name="dni_personal" value={personal&&dni_personal} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_personal" value={personal&&telefono_personal} />
        <br/>
        <br/>
        <TextField type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="mail_personal" value={personal&&mail_personal} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="domicilio_personal" value={personal&&domicilio_personal}/>
        <br/>
        <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_personal)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar2()}>Cancelar</Button>
        </div>
      </div>
    )


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
        personalAgregado({})
      insertarModal(!modal)
    }

    const abrirCerrarModalEditar2= ()=>{
      setModalEditar(!modalEditar)
      personalAgregado({})
    }
    const abrirCerrarModalEditar= ()=>{
      setModalEditar(!modalEditar)
      
    }

    const seleccionarProveedor = (personal,caso)=>{
        personalAgregado(personal);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }

    useEffect(()=>{
        funcion();

    },[])


  return (
    <Main>


        <MaterialTable
            title="Personal Educativo"
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
                    onClick: (event,rowData)=>handleEliminar(rowData.id_personal)
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
          <button className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Agregar Nuevo Personal Educativo</button>
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


 
export default PersonalEducativo