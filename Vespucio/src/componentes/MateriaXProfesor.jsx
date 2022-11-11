import { useEffect, useState, useRef } from "react";
import { supabase } from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import { Modal, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Label = styled.label`
  flex: 0 0 100px;
  text-align: center;
`;
const Titulo = styled.h1`
  margin-left: 12px;
`;
const Main = styled.div`
  margin-top: 7%;
  background-color: white;
  height: 100%;
  width: 78vw;
  overflow: hidden;
`;
const Datos = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const Tabla = styled.div`
  width: 70%;
`;
const BotonesAccion = styled.div`
  width: 30%;
  /* margin:3px; */
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  -webkit-appearance: none;
`;

const Campo = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

const MateriaXProfesor = () => {
  const navigate = useNavigate();
  //Statest
  const [data, setData] = useState([]);
  const [modal, calificarModal] = useState(false);
  const [modalIns, insertarModal] = useState(false);
  const [titulo, setTitulo] = useState([]);
  const [value2, setValue2] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [displayBasic, setDisplayBasic] = useState(false);

  const [tarea, setTarea] = useState({
    id_tarea:"",
    titulo_tarea: "",
    descripcion_tarea: "",
    plazo_tarea: "",
    contador_corregidas:"",
  });

  const [carga, setCarga] = useState({
    id_alumno:"",
    id_tarea: "",
    plazo_tarea: "",
    nota_tarea: "",
    id_carga: "",
    link_archivo:""
  });

  let tiempoTranscurrido = Date.now();
  let hoy = new Date(tiempoTranscurrido).toLocaleDateString();

  const navigateTo = useNavigate();

  function cargarArchivo() {
    document.getElementById("archivoAlumno").href = selectedProduct5.link_archivo;
    document.getElementById("archivoAlumno").target = "_blank";
    document.getElementById("divArchivo").style.display = "";

    let url = (document.getElementById("archivoAlumno").href).substring(22)
    localStorage.setItem("url", url);

    console.log(url)


    // console.log() 
  }

  function irArchivo() {
    console.log(selectedProduct5.link_archivo)
    navigateTo(selectedProduct5.link_archivo)
  }

  //Funciones que tienen datos desde una api
  

const calificar = async () => {
  try {

      let idPerso = parseInt(localStorage.getItem( "idUsuario" ))      
      let carga = parseInt(selectedProduct5.id_carga)
      let nota = parseFloat(value2.toString())

    
      const result7 = await supabase.from("tareaNota").insert([
        {
          id_carga:carga,
          id_personal:idPerso,
          nota_tarea:nota
        },
      ]);
    
      const result= await supabase.from("cargaTareas")
        .update({tiene_nota:true})
        .eq("id_carga",selectedProduct5.id_carga)
    
      window.location.reload();

    } catch (error) {
      console.log(error);
    }
  };

  const funcion = async () => {
    try {
      let idMateria = localStorage.getItem("idMateria");

      const result = await supabase
        .from("materiasProfesView")
        .select("concatenado")
        .eq("id_materia", idMateria);

      setTitulo(result.data[0].concatenado);

      const result2 = await supabase
        .from("tareasPorMateria")
        .select("id_tarea, titulo_tarea, cantidadEntregadas, descripcion_tarea")
        .eq("id_materia", idMateria);

      setData(result2.data);
    } catch (error) {
      console.log(error);
    }
  };

      const dialogFuncMap = {
      'displayBasic': setDisplayBasic
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


    const alumnos = async (tarea) => {
    try {
      let idMateria = localStorage.getItem("idMateria");

      const result = await supabase
        .from("notasTareasView")
        .select()
        .eq("id_tarea", tarea.id_tarea);

      console.log(result.data)

      setProducts(result.data)

      // const result2 = await supabase
      //   .from("tareasPorMateria")
      //   .select("id_tarea, titulo_tarea, cantidadEntregadas, descripcion_tarea")
      //   .eq("id_materia", idMateria);

      // setData(result2.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {
    try {
      const { error, result } = await supabase.from("tareas").insert({
        id_materia: localStorage.getItem("idMateria"),
        titulo_tarea:tarea.titulo_tarea,
        descripcion_tarea:tarea.descripcion_tarea,
        plazo_tarea:tarea.descripcion_tarea,
        id_anio: localStorage.getItem("idAnio")
      });

      abrirCerrarModalInsertar();
      setData({
        ...data,
        result,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //Configuracion del
  const columnas = [
    { title: "Título de la Tarea", field: "titulo_tarea" },
    { title: "Detalle de la Tarea", field: "descripcion_tarea" },
    { title: "Cantidad de Tareas Sin Calificar", field: "cantidadEntregadas" },

  ];

  //Estilos
  const styles = useStyles();

  const abrirCerrarModalInsertar = (tarea) => {
    calificarModal(!modal);
    alumnos(tarea);
  };
  
  function atras() {
    setDisplayBasic(false)
  }

  const abrirCerrarModalNuevaTarea = () => {
    insertarModal(!modalIns);
  };

  // const bodyCalif = (
  //   <div className={styles.modal}>
  //     <h4 style={{ textAlign: "center" }}>Calificar</h4>
  //     <br />
  //     <h5>Seleccione Trabajo de Alumno</h5>
  //     <br />
  //     <DataTable
  //       value={products}
  //       selection={selectedProduct5}
  //       onSelectionChange={(e) => setSelectedProduct5(e.value)}
  //       dataKey="id"
  //       responsiveLayout="scroll"
  //       paginator
  //       rows={3}
  //     >
  //       <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
  //       <Column field="concatenado" header="Alumno"></Column>
  //       <Column field="link_archivo" header="Tarea Subida"></Column>
  //       <Column field="updated_at" header="Fecha de Entrega"></Column>
  //     </DataTable>
  //     <br />
  //     <label>
  //       <b>Archivo Subido</b>
  //     </label>
  //     <br />
  //     <div style={{ display: "none" }}>
  //       <a href="">Archivo</a>
  //     </div>
  //     <br />
  //     <br />
  //     <label>
  //       <b>Ingrese Calificación</b>
  //     </label>
  //     <br />
  //     <br />
  //     <InputNumber
  //       value={value2}
  //       onValueChange={(e) => setValue2(e.value)}
  //       min={1}
  //       max={10}
  //       mode="decimal"
  //       minFractionDigits={0}
  //       maxFractionDigits={2}
  //     />
  //     <br />
  //     <br />
  //     <Button onClick={() => abrirCerrarModalPagar()}>Cancelar</Button>
  //     <br /> <br />
  //     <Button onClick={() => registrarPago()} color="primary">
  //       Registrar Cobro
  //     </Button>
  //   </div>
  // );

    const eliminarTarea = async(id_tarea)=>{
      try {
        const result= await supabase.from("tareas")
        .update({isHabilitada_tarea:false})
        .eq("id_tarea",id_tarea)
       
      } catch (error) {
        console.log(error)
      }
    }

  const actualizarState = (e) => {
    setTarea({
      ...tarea,
      [e.target.name]: e.target.value,
    });
  };

  const handleEliminar=(id_tarea)=>{
      swal({
        title: "Estas seguro de eliminar esta tarea?",
        text: "Una vez eliminado, no podras recuperar la tarea de vuelta!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Tarea eliminada con exito!", {
            icon: "success",
          });
          eliminarTarea(id_tarea);
          window.location.reload();

        }
      });
    }

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar Nueva Tarea</h3>
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Titulo de la Tarea"
        onChange={actualizarState}
        name="titulo_tarea"
        value={tarea.titulo_tarea}
      />
      <br />
      <br />
      <label>Descripcion de la Tarea</label>
      <br />
      <textarea
        type="text"
        cols="20"
        className={styles.inputMaterial}
        label="Descripcion de la Tarea"
        onChange={actualizarState}
        name="descripcion_tarea"
        value={tarea.descripcion_tarea}
      />
      <br />
      <br />
      <label>Plazo para la Tarea</label>
      <br />
      <br />
      <TextField
        type="date"
        className={styles.inputMaterial}
        onChange={actualizarState}
        name="plazo_tarea"
        value={tarea.plazo_tarea}
      />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => submit()}>
          Insertar
        </Button>
        <Button onClick={() => abrirCerrarModalNuevaTarea()}>Cancelar</Button>
      </div>
    </div>
  );



  useEffect(() => {
    funcion();
  }, []);
  //Funciones

  const calif = (tarea) => {
    alumnos(tarea);
    onClick('displayBasic');
  };

        const eliminarDialog=()=>{
      setDialog(false)
    }

      const productDialogFooter = (
      <React.Fragment>
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={eliminarDialog} />
          <Button label="Registrar Pago" icon="pi pi-check" className="p-button-text" onClick={submit}/>
      </React.Fragment>
    );

  return (
    <Main>
      <br />
      <Titulo>{titulo}</Titulo>
      <br />
      <Datos>
        <TextField
          id="outlined-read-only-input"
          label="Ciclo Lectivo"
          defaultValue="2022"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Fecha"
          defaultValue={hoy}
          InputProps={{
            readOnly: true,
          }}
        />
      </Datos>
      <br />
      <br />
      <Container>
        <Tabla>
          <MaterialTable
            title="Listado de Trabajos Prácticos"
            columns={columnas}
            data={data}
            actions={[
              {
                icon: "task",
                tooltip: "Calificar",
                onClick: (event, rowData) => calif(rowData),
              },
              {
                    icon: "delete",
                    tooltip:"Borrar",
                    onClick: (event,rowData)=>handleEliminar(rowData.id_tarea)
                  }
            ]}
            options={{
              actionsColumnIndex: -1,
            }}
            localization={{
              header: {
                actions: "Calificar / Borrar",
              },
              toolbar: {
                searchPlaceholder: "Buscar",
              },
            }}
          />
          {/* <Modal open={modal} onClose={abrirCerrarModalInsertar}>
            {bodyCalif}
          </Modal> */}
          <Modal open={modalIns} onClose={abrirCerrarModalNuevaTarea}>
            {bodyInsertar}
          </Modal>
        </Tabla>

<Dialog style={{ width: '600px' }} modal className="p-fluid" visible={displayBasic} footer={productDialogFooter} onHide={() => onHide('displayBasic')}>
            <h4 style={{ textAlign: "center" }}>Calificar</h4>
              <br />
              <h5>Seleccione Trabajo de Alumno</h5>
              <br />
              <DataTable
                value={products}
                selection={selectedProduct5}
                onSelectionChange={(e) => setSelectedProduct5(e.value) || cargarArchivo(e)}
                dataKey="id_carga"
                responsiveLayout="scroll"
                paginator
                rows={3}
              >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="concatenado" header="Alumno"></Column>
                <Column field="plazo_tarea" header="Plazo de la Tarea"></Column>
                <Column field="plazo" header="Fecha de Entrega"></Column>
              </DataTable>
              <br />
              <label>
                <b>Archivo Subido</b>
              </label>
              <br />
          <div id="divArchivo" style={{ display: "none" }}>
                <button id="archivoAlumno" target="_blank" onClick={irArchivo}>Archivo del Alumno</button>
              </div>
              <br />
              <br />
              <label>
                <b>Ingrese Calificación</b>
              </label>
              <br />
              <br />
              <InputNumber
                value={value2}
                onValueChange={(e) => setValue2(e.value)}
                min={1}
                max={10}
                mode="decimal"
                minFractionDigits={0}
                maxFractionDigits={2}
              />
          <br />
          <br />
          <center>
          <button className="boton1" onClick={calificar}>Calificar</button>
          <button className="boton1" onClick={atras}>Volver</button>
          </center>

          </Dialog>

        <BotonesAccion>
          <Button
            className="itemBoton"
            onClick={abrirCerrarModalNuevaTarea}
            variant="contained"
            startIcon={<MenuBookIcon />}
          >
            Nueva Tarea
          </Button>
          <Button
            className="itemBoton"
            onClick={() => navigate("/GestionMateriasProfesor")}
            variant="outlined"
            startIcon={<MenuBookIcon />}
          >
            Volver Atrás
          </Button>
        </BotonesAccion>
      </Container>
    </Main>
  );
};

export default MateriaXProfesor;
