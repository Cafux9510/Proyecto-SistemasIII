import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import swal from "sweetalert";
import styled from '@emotion/styled'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import UpgradeIcon from '@mui/icons-material/Upgrade';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { Link } from "react-router-dom";

const Label = styled.label`
    flex: 0 0 100px;
    text-align:center;

`;

const Titulo = styled.h1`
  margin-left:12px;
`;
const Main = styled.div `
  margin-top:6%;
  background-color:white;
  height:90vh;
  width: 78vw;
  overflow:scroll;
`;
const Datos= styled.div`
    width:100%;
    display:flex;
    justify-content:space-evenly
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


const Cobranzas = () => {
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


    const submit = async()=>{
      try {

        let primerN = (nombre_alumno.substring(0,1)).toLowerCase();
        let tresA = (apellido_alumno.substring(0,3)).toLowerCase();
        let dni = parseInt(dni_alumno);
        let numA = (Math.floor(Math.random() * (dni - 1000) + 1000)).toString()
        let tresUltN = numA.substring(numA.length-3);
        let usuario = primerN + tresA + tresUltN;

        const {errorr,usuarioT}= await supabase.from("usuarios").insert([{
          nombre_usuario:usuario,
          contrasenia_usuario:dni_alumno
        }]);

      const user_id = await supabase.from('usuarios')
      .select('id_usuario')
      .eq("nombre_usuario",usuario);

      const valor=user_id.data[0].id_usuario
    
      console.log(valor)

        const {error,result}= await supabase.from("alumnos").insert([{
            id_anioEduc,
            nombre_alumno,
            telefono_alumno,
            mail_alumno,
            domicilio_alumno,
            dni_alumno,
            apellido_alumno,
            id_usuario:valor
        }]);

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


    const {id_alumno}=alumnos;

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


    const abrirCerrarModalPagar= ()=>{
      setModalRegPago(!modalRegPago)
    
    }

    const abrirCerrarModalRegPago= (alumno,caso)=>{
      alumnoAgregado(alumno);
      (caso === "Pagar")&&abrirCerrarModalPagar();
      cargarDatos(alumno);

    }



    useEffect(()=>{
        funcion();
        nivs();

    },[])


  return (
    <Main>
    <Titulo>Gestión de Cobranzas</Titulo>
        <br />
        <Datos>
            <TextField
            id="outlined-read-only-input"
            label="Cantidad de Alumnos"
            defaultValue="400"
            InputProps={{
                readOnly: true,
            }}
            />
            <TextField
            id="outlined-read-only-input"
            label="Cant. Alumnos que adeudan"
            defaultValue="40"
            InputProps={{
                readOnly: true,
            }}
            />
            <TextField
            id="outlined-read-only-input"
            label="Dinero a Recaudar"
            defaultValue="$50000"
            InputProps={{
                readOnly: true,
            }}
            />
        </Datos> 
        <br />
        <Datos> 
            <Button className="itemBoton" color="primary" startIcon={<MonetizationOnIcon />} variant="contained" >
                Costos de Cuota
            </Button>
            <Button className="itemBoton" variant="contained" color="primary" startIcon={<UpgradeIcon />}>
                Actualizar Costos
            </Button>
            <Button className="itemBoton" variant="contained" color="primary" startIcon={<NotificationImportantIcon />}>
                Ver Alumnos Deudores
            </Button>
        </Datos> 
      <div>
          <MaterialTable
              title="Alumnos"
              columns={columnas}
              data={data}
              actions={[
                 
                  //**AGREGUE LA ACCION PARA REGISTRAR PAGO */
                  {
                    icon: ()=> <MonetizationOnIcon/>,
                    tooltip:"Registrar Pago",
                    onClick: (event,rowData)=>abrirCerrarModalRegPago(rowData,"Pagar")
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
         
          
          <Modal 
            open={modalRegPago}
            onClose={abrirCerrarModalRegPago}
          >
                {bodyRegistrarPago}
          </Modal>
      </div>
    </Main>
  )
}


 
export default Cobranzas