import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
/*import { Button } from "@material-ui/core";*/
import {Modal,TextField} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import swal from "sweetalert";
import styled from '@emotion/styled'
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


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


const AsignacionPersonal = () => {
    //Statest
    const [data,setData]=useState([])
    const[modal,insertarModal]=useState(false)
    const [modalEditar, setModalEditar]= useState(false);

    //STATES DEL DROPDOWN LIST DE PERSONAS QUE SE AUTOCOMPLETA

    const [displayBasic, setDisplayBasic] = useState(false);

    const [dialogEditar, setDialogEditar] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState(false);

    
    var currentTime = new Date();
    var year = currentTime.getFullYear()

    const[profesor,profesorAgregado]=useState({
        id_cargo:'',
        id_personal:'',
        periodo_lectivo:year,
        id_nivel:0,
        id_tipo_personal:'',
        id_anioEduc:'',
        id_materia:0,
        id_grado:1,
    })

    const dialogFuncMap = {
      'displayBasic': setDisplayBasic,
      'dialogEditar': setDialogEditar,
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

  const renderFooter = (name) => {
      return (
          <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
              <Button label="Registrar" icon="pi pi-check" onClick={submit} autoFocus />
          </div>
      );
  }

  const onCountryChange = (e) => {
    setSelectedCountry(e.value);
     /*const datosPersonalE=async()=>{
       const result = await supabase.from('personalEducativo')
       .select(`nombre_personal,apellido_personal`)
       .eq("dni_personal",selectedCountry.dni_personal);

     }
    datosPersonalE();
    setSelectedCountry(e.value);*/
  }
   
    //Funciones que tienen datos desde una api
    const funcion = async()=>{
        try {
           const { data: personalEducativo, error } = await supabase
            .from('personalPorAnio')
            .select(`
              *,
              cargoFuncion(
                anioEducativo(
                  nombre_anioEduc
                ),
                materias(
                  nombre_materia
                ),
                tipoPersonal(
                  nombre_tipo_personal
                )
              ),
              personalEducativo(
                nombre_personal,
                apellido_personal
              )
            `)
            .eq("isHabilitado_asignacion",true)
            setData(personalEducativo)
        } catch (error) {
            console.log(error)
        }
    }
    const update = async(id_docAnio)=>{
      try {
        const result= await supabase.from("personalPorAnio")
        .update({isHabilitado_asignacion:false})
        .eq("id_docAnio",id_docAnio)


       console.log(result)
      } catch (error) {
        console.log(error)
      }
    }

    const{id_cargo,id_personal,periodo_lectivo,id_nivel,id_tipo_personal,id_anioEduc,id_materia,id_grado}=profesor;

    const update2=async(id_docAnio)=>{
      try {
        const {result,error}= await supabase.from("personalPorAnio")
        .update({id_cargo,id_personal,periodo_lectivo})
        .eq("id_docAnio",id_docAnio)
        
        console.log(result)
        abrirCerrarModalEditar();
        window.location.reload();
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

        var numR = generarId()

        const {error,regCargo}= await supabase.from("cargoFuncion").insert([{
          id_anioEduc,
          id_tipo_personal,
          id_materia,
          random:numR
        }]);

        
        const resultado = await supabase.from("cargoFuncion")
        .select('id_cargo')
        .eq("random",numR)

        const valor=resultado.data[0].id_cargo

        console.log(valor)

        const result= await supabase.from("personalPorAnio").insert([{
          id_cargo:valor,
          id_personal,
          periodo_lectivo,
          id_anio:id_anioEduc
        
        }]);

        
        window.location.reload()
        setData({
          ...data,
          result
        })
       
      } catch (error) {
        console.log(error)
      }
    }

    const handleEliminar=(id_docAnio)=>{
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
          update(id_docAnio);
        }
         setTimeout(() => {
          window.location.reload()
        }, 1000); 
      });
    }

    let arr = new Object();
    arr = {     
      name: "John"     
    };

    const[personalE,setPersonalE]=useState({}) 


    //Configuracion del 
    const columnas=[
        {title:"Tipo de Personal", field:"cargoFuncion.tipoPersonal.nombre_tipo_personal" /*, lookup:{1:"Directivo",2:"Profesor",3:"Administrativo Educativo",4:"Preceptor",5:"Horas Cátedra"}*/},
        {title:"Categoría de Cargo", field:"cargoFuncion.anioEducativo.nombre_anioEduc", filtering:false},
        {title:"Nombre", field:"personalEducativo.nombre_personal", filtering:false},
        {title:"Apellido", field:"personalEducativo.apellido_personal", filtering:false},
        {title:"Periodo Lectivo", field:"periodo_lectivo", filtering:false},
        {title:"Materia Asignada",field:"cargoFuncion.materias.nombre_materia", filtering:false}
      ]

      

    //Estilos
    const styles=useStyles();
    const actualizarState = e =>{
      profesorAgregado({
        ...profesor,
        [e.target.name]: e.target.value,
      });
    }

    const actualizarMaterias = e =>{
      datosMaterias();
    }
  
    const datosPersonalE=async()=>{

      const resultado = await supabase.from('DatosCompletosPersonalView')
      .select(`id_personal, concatenado`);

      setPersonalE(resultado.data)

      /*const result = await supabase.from('personalEducativo')
      .select(`id_personal,nombre_personal,apellido_personal,dni_personal`)
      .eq("isHabilitado_personal",true);

      setPersonalE(result.data)*/



    }

  const[niveles,setNiveles]=useState({}) 
  const datosNiveles=async()=>{
    const result = await supabase.from('nivelesEducativos')
    .select()
    setNiveles(result.data)
  }


  const[materias,setMaterias]=useState({}) 
  const datosMaterias=async()=>{
    const result = await supabase.from('materias')
    .select()
    .eq("isHabilitada_materia",true)
    .eq("id_grado",id_grado)
    setMaterias(result.data)
  }

  const[grados,setGrados]=useState({}) 
  const datosGrados=async()=>{
    const result = await supabase.from('grados')
    .select()
    .eq("isHabilitado_grado",true)
    .eq("nivelEduc",id_nivel)
    setGrados(result.data)
  }

  const[anioCargo,setAnioCargo]=useState({})

  const[cargos,setCargos]=useState({})

  const filtrarPorNivel = e => {
    profesorAgregado({
      ...profesor,
      [e.target.name]: e.target.value,
      
    })

    var selection = document.getElementById("select");
    var idNivel = parseInt(selection.options[selection.selectedIndex].value)

    if (idNivel === 1 || idNivel === 2) {
      console.log("1 o 2")
      const datos=async()=>{
      const resultA = await supabase
        .from("tipoPersonal")
        .select()
        .eq("isHabilitado_tipoPerso", true)
        .neq("id_tipo_personal",5);
      setCargos(resultA.data);
      }
      datos();
    }else{
      const datos=async()=>{
        const resultB = await supabase
          .from("tipoPersonal")
          .select()
          .eq("isHabilitado_tipoPerso", true)
          .neq("id_tipo_personal", 2);
        setCargos(resultB.data);
      }
      datos();
    }

  }

  const filtrarPorPersonal = e =>{

    profesorAgregado({
      ...profesor,
      [e.target.name]: e.target.value,
      
    })

    const div = document.getElementById('divMateria');

    var selection = document.getElementById("id_tipo_personal");
    var valor = selection.options[selection.selectedIndex].value

    if (valor == 1 && id_nivel == 1) {
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",1)
        .gte('id_anioEduc', 43)
        .lte('id_anioEduc', 45)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';

        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })
   
      }

      

      datos();

    }else if(valor == 1 && id_nivel == 2){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",2)
        .gte('id_anioEduc', 43)
        .lte('id_anioEduc', 45)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';

        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();
    }else if(valor == 1 && id_nivel == 3){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",3)
        .gte('id_anioEduc', 43)
        .lte('id_anioEduc', 45)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';

        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();  
    }else if(valor == 2 && id_nivel == 1){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",1)
        .gte('id_anioEduc', 1)
        .lte('id_anioEduc', 42)
    
        setAnioCargo(result.data)

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("id_anioEduc");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("divPersonalNotProfe");
        listaDesp.style.display = 'none';

        profesorAgregado({
          id_anioEduc,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }
      div.style.display = '';
      datos();
      datosGrados();
    }else if(valor == 2 && id_nivel == 2){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",2)
        .gte('id_anioEduc', 2)
        .lte('id_anioEduc', 42)
    
        setAnioCargo(result.data)

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("id_anioEduc");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("divPersonalNotProfe");
        listaDesp.style.display = 'none';

        profesorAgregado({
          id_anioEduc,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = '';
      datos();
      datosGrados();
      datosMaterias();
    }else if(valor == 2 && id_nivel == 3){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",3)
        .gte('id_anioEduc', 3)
        .lte('id_anioEduc', 42)
    
        setAnioCargo(result.data)

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("id_anioEduc");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("divPersonalNotProfe");
        listaDesp.style.display = 'none';

        profesorAgregado({
          id_anioEduc,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = '';
      datos();
      datosGrados();
      datosMaterias();
    }else if(valor == 3 && id_nivel == 1){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",1)
        .gte('id_anioEduc', 46)
        .lte('id_anioEduc', 48)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';
  
        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';
  
        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();
    }else if(valor == 3 && id_nivel == 2){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",2)
        .gte('id_anioEduc', 46)
        .lte('id_anioEduc', 48)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal
      
        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';
  
        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';
  
        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();
    }else if(valor == 3 && id_nivel == 3){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",3)
        .gte('id_anioEduc', 46)
        .lte('id_anioEduc', 48)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal
      
        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';
  
        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';
  
        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })
      
      }

      div.style.display = 'none';

      datos();
    }else if(valor == 4 && id_nivel == 1){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",1)
        .gte('id_anioEduc', 49)
        .lte('id_anioEduc', 51)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';
  
        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';
  
        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();
    }else if(valor == 4 && id_nivel == 2){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",2)
        .gte('id_anioEduc', 49)
        .lte('id_anioEduc', 51)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';
  
        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';
  
        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();
    }else if(valor == 4 && id_nivel == 3){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .eq("id_nivel",3)
        .gte('id_anioEduc', 49)
        .lte('id_anioEduc', 51)
    
        setAnioCargo(result.data)

        let anio = result.data[0].id_anioEduc

        let personal = selectedCountry.id_personal

        var divDirec = document.getElementById("divPersonalNotProfe");
        divDirec.style.display = '';
  
        var listaDesp = document.getElementById("id_anioEduc");
        listaDesp.style.display = 'none';
  
        var input = document.getElementById("cargoPersonal");
        input.value = result.data[0].nombre_anioEduc;

        profesorAgregado({
          id_anioEduc:anio,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo
        })

      }

      div.style.display = 'none';

      datos();
    }else if(valor == 5 && id_nivel == 3){
      const datos=async()=>{
        const result = await supabase.from('anioEducativo')
        .select()
        .eq("isHabilitado_anio",true)
        .gte('id_anioEduc', 28)
        .lte('id_anioEduc', 42);
    
        setAnioCargo(result.data)
        
        let personal = selectedCountry.id_personal;

        var divDirec = document.getElementById("id_anioEduc");
        divDirec.style.display = '';

        var listaDesp = document.getElementById("divPersonalNotProfe");
        listaDesp.style.display = 'none';

        profesorAgregado({
          id_anioEduc,
          id_nivel,
          id_personal:personal,
          id_tipo_personal:valor,
          periodo_lectivo,
          id_grado
        })

      }

      div.style.display = '';
      datosGrados();
      datos();
      datosMaterias();
    }else{
      profesorAgregado({
      ...profesor,
      [id_nivel]:'',
      [id_tipo_personal]:'',
      [id_anioEduc]:'',
        
    })
    }
      
    

      
  }

  const filtrarPorAnio = e => {
    profesorAgregado({
      ...profesor,
      [e.target.name]: e.target.value,
      
    })

    var selection = document.getElementById("id_anioEduc");
    var valor = selection.options[selection.selectedIndex].value

    const buscaGrado=async()=>{
      const resultA = await supabase
        .from("anioEducativo")
        .select('id_grado')
        .eq("isHabilitado_anio", true)
        .eq("id_anioEduc",valor);

      const grado = resultA.data[0].id_grado;

      const resultB = await supabase
        .from("grados")
        .select('id_grado, nombre_grado')
        .eq("isHabilitado_grado", true)
        .eq("id_grado",grado);

      var selection2 = document.getElementById("gradoMateria");
      selection2.value = resultB.data[0].nombre_grado;

      const idGradoActual = resultB.data[0].id_grado

      profesorAgregado({
        id_anioEduc:valor,
        id_nivel,
        id_personal,
        id_tipo_personal,
        periodo_lectivo,
        id_grado:idGradoActual
      })

      const resultMat = await supabase.from('materias')
        .select()
        .eq("isHabilitada_materia",true)
        .eq("id_grado",idGradoActual)
        setMaterias(resultMat.data)
        console.log(resultMat.data)

    }

    buscaGrado();

  }
  

    /*const bodyInsertar= (
      
      <div className={styles.modal}>
        <h4>Registrar una Nueva Asignación</h4>
        <br/>
        <br/>
        <Label>Nivel Educativo</Label>
        <Campo>
          <Select
                    name='selectNivel'
                    id='selectNivel'
                    value={id_nivel}
                    onChange={filtrarPorNivel}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(niveles).map(pr=>(
                      <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                    ))}
                
                  
            </Select>
        </Campo>
        <br/>
        <Label>Cargo/Función</Label>
        <Campo>
          <Select
                    name='selectCargos'
                    id='selectCargos'
                    value={id_tipo_personal}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(cargos).map(pre=>(
                      <option key={pre.id_tipo_personal} value={pre.id_tipo_personal}>{pre.nombre_tipo_personal}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>        <br/>
        <br/>
        <Label>Año Educativo</Label>
        <Campo>
          <Select
                    name='id_nivel'
                    id='id_nivel'
                    value={id_nivel}
                    onChange={actualizarState}
                >
                    <option value="">--Seleccione--</option>
                    {Object.values(niveles).map(pr=>(
                      <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                    ))}
                
                    
                  
            </Select>
        </Campo>
        <br/>
        <br/>
        <br/>
        <br/><br/><br/>
        <div align="right">
          <Button color='primary' onClick={()=>submit()} >Insertar</Button>
          <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    )
    */

      
    


    const {id_docAnio}=profesor;


    //Funciones
    const abrirCerrarModalInsertar= ()=>{
      insertarModal(!modal)
    }

    const abrirCerrarModalEditar= ()=>{
    }

    const seleccionarProfesor = (profesor,caso)=>{
        profesorAgregado(profesor);
      (caso === "Editar")&&abrirCerrarModalEditar();
    }


    useEffect(()=>{
        funcion();
        datosNiveles();
        datosPersonalE();

    },[])


  return (
    <Main>  
      <div>
          <MaterialTable
              title="Asignaciones de Personal"
              columns={columnas}
              data={data}
              actions={[
                  {
                      icon:"delete",
                      tooltip:"Eliminar",
                      onClick: (event,rowData)=>handleEliminar(rowData.id_personal)
                  }
                  
              ]}
              

              options={{
                    search:true,
                    filtering:false,                    
                }}
              
                localization={{
                  header:{
                    actions:"Acciones",
                    
                  }
                  
                }}
                
          />
          
          <div className="contenedor">
            <br/>
            <Button className="bg-indigo-600 w-full p-5 text-white uppercase font-bold hover:bg-slate-900 boton" label="Registrar Nueva Asignación de Personal" onClick={() => onClick('displayBasic')} />
                <Dialog style={{ width: '600px', textAlign:"center" }} modal className="p-fluid" visible={displayBasic} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                  <h4><b>Registrar una Nueva Asignación</b></h4>
                  <br/>
                  <p style={{textAlign:"center"}}><b>DNI del Personal a Asignar</b></p>
                  <Dropdown
                    value={selectedCountry}
                    options={personalE}
                    onChange={onCountryChange}
                    optionLabel="concatenado"
                    filter showClear filterBy="concatenado"
                    placeholder="Seleccione un Personal"
                  />
                  <br/>
                  <br/>
                  <Label><b>Nivel Educativo del Cargo</b></Label>
                  <Campo>
                    <Select
                              name='id_nivel'
                              id='select'
                              value={id_nivel}
                              onChange={filtrarPorNivel}
                          >
                              <option value="">--Seleccione--</option>
                              {Object.values(niveles).map(pr=>(
                                <option key={pr.id_nivel} value={pr.id_nivel}>{pr.nombre_nivel}</option>
                              ))}
                          
                            
                      </Select>
                  </Campo>
                  <br/>
                  <Label><b>Cargo/Función</b></Label>
                  <Campo>
                    <Select
                            name='id_tipo_personal'
                            id='id_tipo_personal'
                            value={id_tipo_personal}
                            onChange={filtrarPorPersonal}
                      >
                            <option value="">--Seleccione--</option>
                            {Object.values(cargos).map(pre=>(
                              <option key={pre.id_tipo_personal} value={pre.id_tipo_personal}>{pre.nombre_tipo_personal}</option>
                            ))}                                  
                    </Select>
                  </Campo>
                  <br/>
                  <Label><b>Curso a Asignar / Cargo por Nivel</b></Label>
                  <div id="divPersonalNotProfe" style={{display: "none"}}>
                    <br/>
                      <input disabled style={{textAlign:"center"}} type="text" name="cargoPersonal" id="cargoPersonal" />
                    <br/>
                    <br/>
                  </div>
                  <Campo>
                    <Select
                              name='id_anioEduc'
                              id='id_anioEduc'
                              value={id_anioEduc}
                              onChange={filtrarPorAnio}
                          >
                              <option value="">--Seleccione--</option>
                              {Object.values(anioCargo).map(pr=>(
                                <option key={pr.id_anioEduc} value={pr.id_anioEduc}>{pr.nombre_anioEduc}</option>
                              ))}
                          
                              
                            
                      </Select>
                  </Campo>
                  <div id="divMateria" name="divMateria" onChange={datosGrados} style={{display: "none"}}>
                    <Label><b>Grado de la Materia</b></Label>
                    <br/>
                    <br/>
                      <input disabled style={{textAlign:"center"}} type="text" name="gradoMateria" id="gradoMateria" />
                    <br/>
                    <br/>
                    <Label><b>Materia a Asignar</b></Label>
                    <Campo>
                      <Select
                                name='id_materia'
                                id='id_materia'
                                value={id_materia}
                                onChange={actualizarState}
                            >
                                <option value="">--Seleccione--</option>
                                {Object.values(materias).map(pr=>(
                                  <option key={pr.id_materia} value={pr.id_materia}>{pr.nombre_materia}</option>
                                ))}
                            
                              
                        </Select>
                    </Campo>
                  </div>
                  <p><b>Periodo Lectivo Actual</b></p>
                  <input type="number" style={{textAlign: "center"}} disabled value={year}/>
                  <br/><br/>
                </Dialog>

                
          </div>
          
          <Modal
            open={modal}
            onClose={abrirCerrarModalInsertar}
          >
            {/*bodyInsertar*/}
          </Modal>
              
          
      </div>
                
    </Main>
    
  )
}


 
export default AsignacionPersonal