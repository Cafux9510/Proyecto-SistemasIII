import { useEffect, useState, useRef } from "react";
import { supabase } from "../Backend/client";
import { Dialog } from 'primereact/dialog';
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import swal from "sweetalert";
import styled from '@emotion/styled'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Link } from "react-router-dom";

const Label = styled.label`
    flex: 0 0 100px;
    text-align:center;

`;

const Main = styled.div `
  margin-top:5vh;
  margin-left:2vw;
  width:75vw;
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
    width:530,
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
    const [modalRegPago, setModalRegPago]= useState(false);

    var currentTime = new Date();
    var year = currentTime.getFullYear()

    const[alumnos,alumnoAgregado]=useState({
        id_anioEduc:'',
        id_nivel:'',
        nombre_alumno:'',
        telefono_alumno:'',
        mail_alumno:'',
        domicilio_alumno:'',
        dni_alumno:'',
        apellido_alumno:'',
        id_alumno:'',
        id_cuota: '',
        valorPagado_cuota:'',
        metodoPago_cuota:'',
        numMes_cuota:'',
        periodo_lectivo:year,
    })
  
    const toast = useRef(null);
  
  const [displayBasic, setDisplayBasic] = useState(false);

const dialogFuncMap = {
    'displayBasic': setDisplayBasic
  }
  function cambiarConstrasenia() {
    onClick('displayBasic');
  }
  const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }
 
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const { data: alumnos, error } = await supabase
            .from('alumnos')
            .select(`
            *,
            anioEducativo(
              nombre_anioEduc,
              id_nivel(
                id_nivel,
                nombre_nivel
              )
            )
          `)
          .eq("isHabilitado_alumno",true)
            setData(alumnos)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_alumno)=>{
      try {
        const result= await supabase.from("alumnos")
        .update({isHabilitado_alumno:false})
        .eq("id_alumno",id_alumno)


       console.log(result)
      } catch (error) {
        console.log(error)
      }
    }

    const{id_anioEduc,id_nivel,nombre_alumno,telefono_alumno,mail_alumno,domicilio_alumno,dni_alumno,apellido_alumno,
      id_cuota,valorPagado_cuota,metodoPago_cuota,numMes_cuota,periodo_lectivo}=alumnos;


    const registrarPago=async() =>{
      const result7 = await supabase.from("cobranzas").insert([
        {
          id_alumno,
          id_cuota,
          valorPagado_cuota,
          metodoPago_cuota,
          numMes_cuota,
          periodo_lectivo
        },
      ]);
      window.location.reload();
    }

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
  
  const validarEmail = async(valor)=>{
      let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(valor)) {
        
      const resultad = await supabase.from('alumnos')
        .select()
        .eq("dni_alumno", parseInt(dni_alumno))
        .eq("isHabilitado_alumno", true);
      
        if (resultad.data.length === 0) {
          let primerN = (nombre_alumno.substring(0,1)).toLowerCase();
          let tresA = (apellido_alumno.substring(0,3)).toLowerCase();
          let dni = parseInt(dni_alumno);
          let numA = (Math.floor(Math.random() * (dni - 1000) + 1000)).toString()
          let tresUltN = numA.substring(numA.length-3);
          let usuario = primerN + tresA + tresUltN;

          const {errorr,usuarioT}= await supabase.from("usuarios").insert([{
            nombre_usuario:usuario,
            contrasenia_usuario:dni_alumno,
            tipo_usuario:1
          }]);

          const user_id = await supabase.from('usuarios')
          .select('id_usuario')
          .eq("nombre_usuario",usuario);

          const valor=user_id.data[0].id_usuario
        
          console.log(valor)

          const result = await supabase.from("alumnos").insert([{
              id_anioEduc,
              nombre_alumno,
              telefono_alumno,
              mail_alumno,
              domicilio_alumno,
              dni_alumno,
              apellido_alumno,
              id_usuario:valor
          }]);

          const { idAl } = await supabase.from('alumnos')
          .select('id_alumno')
            .eq("id_usuario", valor);
          
          console.log(idAl)

          const {errorrr,result22}= await supabase.from("cuotasCobros").insert([{
              periodoLectivo_cuotaC:2022,
              mes_cuotaC:13,
              vencimiento_cuotaC:"10/2",
              concepto_cuotaC:"Inscripcion",
              valor_cuotaC:8000,
              saldoActual_cuotaC:8000,
              id_alumno:idAl.data[0].id_alumno
          }]);

          console.log(result22)
          

          localStorage.setItem("usu", usuario)
          localStorage.setItem( "pass", dni )

          abrirCerrarModalInsertar();

          onClick('displayBasic')
        
        } else {
          alert("Ya se encuentra registrado un alumno con ese DNI.");
        }
  
        

      } else {
        alert("La dirección de email es incorrecta.");
      }
    }


    const submit = async()=>{
      try {

        var input = document.getElementById("textfieldMail");
        validarEmail(input.value);
        

        // abrirCerrarModalInsertar();
        // window.location.reload()
       
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
    
    function Aceptar() {
      
      funcion()

      setTimeout(() => {
        window.location.reload();
      }, 5000);
      
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={Aceptar} />
            </div>
        );
    }
  
    //Configuracion del 
    const columnas=[
        {title:"Nivel Educativo", field:"anioEducativo.id_nivel.nombre_nivel"},
        {title:"Año Educativo", field:"anioEducativo.nombre_anioEduc"},
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
          ...alumnos,
          [e.target.name]: e.target.value
      })
    }

    const[niveles,setNiveles]=useState({}) 
    const nivs=async()=>{
      const result = await supabase.from('nivelesEducativos')
      .select();
  
      setNiveles(result.data)
      
    }
    const[categorias,setCategorias]=useState({}) 

    const filtrarAnios = e =>{

      alumnoAgregado({
        ...alumnos,
        [e.target.name]: e.target.value
      })

      var selection = document.getElementById("id_nivel");
      var valor = selection.options[selection.selectedIndex].value

      if (valor == 1) {
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
            .eq("id_nivel", 1)
            .neq("id_anioEduc", 43)
            .neq("id_anioEduc", 46)
            .neq("id_anioEduc", 49);
      
          setCategorias(result.data)
        }
        datos();

      }else if(valor == 2){
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
            .eq("id_nivel", 2)
            .neq("id_anioEduc", 44)
            .neq("id_anioEduc", 47)
            .neq("id_anioEduc", 50);
      
          setCategorias(result.data)
        }
        datos();
      }else{
        const datos=async()=>{
          const result = await supabase.from('anioEducativo')
          .select()
          .eq("isHabilitado_anio",true)
            .eq("id_nivel", 3)
            .neq("id_anioEduc", 45)
            .neq("id_anioEduc", 48)
            .neq("id_anioEduc", 51)
            .neq("id_anioEduc", 52);
      
          setCategorias(result.data)
        }
        datos();
      }  
    }

    const cargarDatos=async(alumno)=>{
      let nombreNivel = alumno.anioEducativo.id_nivel.nombre_nivel;
      let idAlumno = alumno.id_alumno;

      //Voy a buscar el nombre de la cuota, segun el nivel del alumno

      const result = await supabase
        .from("nivelesEducativos")
        .select("id_nivel")
        .eq("nombre_nivel",nombreNivel);

      let idNivel = result.data[0].id_nivel;

      const result2 = await supabase
        .from("cuotas")
        .select("nombre_cuota")
        .eq("id_nivel",idNivel);

      var selection = document.getElementById("cuotaNivel");
      selection.value = result2.data[0].nombre_cuota;

      //A partir de aca voy a buscar el valor de la cuota

      const result3 = await supabase
        .from("cobranzas")
        .select("id_cobro, numMes_cuota")
        .eq("id_alumno",idAlumno)
        .eq("periodo_lectivo",year);
      
      if(result3.data.length !== 0){

        let cobrosMayMin = result3.data.sort(((a, b) => b.numMes_cuota - a.numMes_cuota));

        if(cobrosMayMin[0].numMes_cuota !== 12){

          let idUltCobro = cobrosMayMin[0].id_cobro
  
          const result4 = await supabase
            .from("cobranzas")
            .select("id_cuota, numMes_cuota, periodo_lectivo")
            .eq("id_cobro", idUltCobro);
    
          let ultMesPagado = result4.data[0].numMes_cuota;
          let idCuota = result4.data[0].id_cuota;
          let proxMes = ultMesPagado+1;
    
          const result5 = await supabase
            .from("meses")
            .select("nombre_mes")
            .eq("numero_mes",proxMes);
    
          const result6 = await supabase
            .from("cuotas")
            .select("valor_cuota")
            .eq("id_cuota",idCuota);
    
    
          var selection2 = document.getElementById("cuotaDisponible");
          var valorCuota = result6.data[0].valor_cuota
          selection2.value = result5.data[0].nombre_mes+"/"+result4.data[0].periodo_lectivo+" - $"+valorCuota; 
    
          alumnoAgregado({
            id_alumno:idAlumno,
            id_cuota:idCuota,
            valorPagado_cuota:valorCuota,
            metodoPago_cuota,
            numMes_cuota:proxMes,
            periodo_lectivo,
          })

        }else{
          var selection2 = document.getElementById("cuotaDisponible");
          selection2.value = "Todas las cuotas del Periodo Lectivo "+year+" están abonadas.";
          var divBoton = document.getElementById('botReg');
          divBoton.style.display = 'none';

        }

        

      }else{

        const result6 = await supabase
          .from("cuotas")
          .select("valor_cuota")
          .eq("id_cuota",idNivel);

        var selection2 = document.getElementById("cuotaDisponible");
        var valorCuota = result6.data[0].valor_cuota
        selection2.value = "Enero"+"/"+year+" - $"+valorCuota;

        alumnoAgregado({
          id_alumno:idAlumno,
          id_cuota:idNivel,
          valorPagado_cuota:valorCuota,
          metodoPago_cuota,
          numMes_cuota:1,
          periodo_lectivo,
        })

      }
     



    }


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
        <Label>Nivel Educativo</Label>
        <Campo>
          <Select
                    name='id_nivel'
                    id='id_nivel'
                    value={id_nivel}
                    onChange={filtrarAnios}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(niveles).map(pr=>(
                      <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <Label>Año a Cursar</Label>
        <br/>
        <Campo>
          <Select
                    name='id_anioEduc'
                    value={id_anioEduc}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(categorias).map(pr=>(
                      <option key={pr.id_anioEduc} value={pr.id_anioEduc}>{pr.nombre_anioEduc}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_alumno" value={telefono_alumno} />
        <br/>
        <br/>
        <TextField id="textfieldMail" type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="mail_alumno" value={mail_alumno} />
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


    


    const {id_alumno}=alumnos;

    const bodyEditar= (
      <div className={styles.modal}>
        <h4>Editar Alumno</h4>        
        <TextField className={styles.inputMaterial} label="Nombre" onChange={actualizarState} name="nombre_alumno" value={alumnos&&nombre_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Apellido" onChange={actualizarState} name="apellido_alumno" value={alumnos&&apellido_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="DNI" onChange={actualizarState} name="dni_alumno" value={alumnos&&dni_alumno} />
        <br/>
        <br/>
        <TextField type="number" className={styles.inputMaterial} label="Telefono" onChange={actualizarState} name="telefono_alumno" value={alumnos&&telefono_alumno} />
        <br/>
        <br/>
        <TextField id="textfieldMail" type="email" className={styles.inputMaterial} label="Email" onChange={actualizarState} name="mail_alumno" value={alumnos&&mail_alumno} />
        <br/>
        <br/>
        <TextField className={styles.inputMaterial} label="Direccion" onChange={actualizarState} name="domicilio_alumno" value={alumnos&&domicilio_alumno}/>
        <br/>
        <br/><br/>
        <div align="right">
          <Button onClick={()=>update2(id_alumno)} color='primary'>Editar</Button>
          <Button onClick={()=>abrirCerrarModalEditar2()}>Cancelar</Button>
        </div>
      </div>
    )
    const bodyRegistrarPago= (
      <div className={styles.modal}>
        <h4>Registrar Pago Alumno</h4>
        <br/> 
        <label><b>Nombre del Alumno</b></label>
        <br/>
        <TextField className={styles.inputMaterial} disabled onChange={actualizarState} name="nombre_alumno" value={alumnos&&nombre_alumno} />
        <br/><br/>
        <label><b>Apellido del Alumno</b></label>
        <br/>
        <TextField className={styles.inputMaterial} disabled onChange={actualizarState} name="apellido_alumno" value={alumnos&&apellido_alumno} />
        <br/><br/>
        <label><b>DNI del Alumno</b></label>
        <br/>
        <TextField type="text" className={styles.inputMaterial} disabled onChange={actualizarState} name="dni_alumno" value={alumnos&&dni_alumno} />
        <br/>
        <br/>
        <label><b>Tipo de Cuota</b></label>
        <br/>
        <TextField className={styles.inputMaterial} disabled onChange={actualizarState} id="cuotaNivel" name="cuotaNivel"/>     
        <br/><br/>
        <label><b>Mes Disponible a Pagar</b></label>
        <TextField className={styles.inputMaterial} disabled onChange={actualizarState} id="cuotaDisponible" name="cuotaDisponible"/>     
        <br/><br/>
        <label><b>Metodo de Pago</b></label>
        <Campo>
          <Select
                    name='metodoPago_cuota'
                    value={metodoPago_cuota}
                    onChange={actualizarState}
                >
                    <option value="0">--Seleccione--</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Debito">Debito</option>
                    <option value="Efectivo">Efectivo</option>               
          </Select>
        </Campo>
     
        <p><b>Periodo Lectivo Actual</b></p>
                  <input type="number" style={{textAlign: "center"}} disabled value={year}/>
                  <br/>
        <br/><br/>

        <div align="right">
          <div id="botReg">
            <Button onClick={()=>registrarPago()} color='primary'>Registrar Cobro</Button>
          </div>
          <br/>
          <div>
            <Button onClick={()=>abrirCerrarModalPagar()}>Cancelar</Button>
          </div>
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

    const abrirCerrarModalPagar= ()=>{
      setModalRegPago(!modalRegPago)
    
    }

    const abrirCerrarModalRegPago= (alumno,caso)=>{
      alumnoAgregado(alumno);
      (caso === "Pagar")&&abrirCerrarModalPagar();
      cargarDatos(alumno);

    }

    const abrirCerrarModalEditar2= ()=>{
      setModalEditar(!modalEditar)
      alumnoAgregado({})
    }

    const seleccionarAlumno = (alumno,caso)=>{
      console.log(alumno)
        alumnoAgregado(alumno);     
      (caso === "Editar")&&abrirCerrarModalEditar();
    }


    useEffect(()=>{
        funcion();
        nivs();

    },[])


  return (
    <Main>
      <div>
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
            <button className="bg-indigo-600 w-45 p-3 text-white uppercase font-bold hover:bg-slate-700 boton" onClick={()=>abrirCerrarModalInsertar()}>Registrar Nuevo Alumno</button>
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
          
          <Modal 
            open={modalRegPago}
            onClose={abrirCerrarModalRegPago}
          >
                {bodyRegistrarPago}
        </Modal>
        
        <Dialog header="Credenciales" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
            <center><p><strong>Las credenciales del nuevo alumno son:</strong></p></center>
            <br />
            <center><h6>Usuario: <b>{ localStorage.getItem( "usu" ) }</b></h6></center>
            <br /><br />
            <center><h6>Contraseña: <b>{ localStorage.getItem( "pass" ) }</b></h6></center>
          </Dialog>

      </div>
    </Main>
  )
}


 
export default Alumnos