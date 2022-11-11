import { useEffect, useState } from "react";
import { supabase } from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Modal, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import styled from "@emotion/styled";

const Label = styled.label`
  flex: 0 0 100px;
  text-align: center;
`;

const Main = styled.div`
  margin-top: 7%;
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

//

const CargaTareas = () => {
  //Statest
  const [data, setData] = useState([]);
  const [modal, insertarModal] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [tareas, setMaterias] = useState({
    id_alumno: localStorage.getItem("idUsuario"),
    id_materia: "",
    link_archivo: "",
    id_tarea: "",
    id_anio: ""
  });

  //Funciones que tienen datos desde una api
  const funcion = async () => {
    try {
      const result1 = await supabase
        .from("alumnos")
        .select(
          `id_anioEduc`
        )
        .eq("isHabilitado_alumno", true)
        .eq("id_alumno", localStorage.getItem("idUsuario"));

      console.log(result1.data[0].id_anioEduc);

      const result = await supabase
        .from("tareas")
        .select(`*,materias(nombre_materia),*`)
        .eq("id_anio", result1.data[0].id_anioEduc)
        .eq("isHabilitada_tarea", true);

      setData(result.data);

      //  for (let index = 0; index < result.data.length; index++) {

      //     let idTarea = result.data[index].id_tarea

      //     const result2= await supabase.from('cargaTareas')
      //     .select(`
      //     isCargada_tarea,
      //     id_tarea`)
      //     .eq("id_tarea",idTarea)

      //     row result2.data[0].isCargada_tarea

      // }
    } catch (error) {
      console.log(error);
    }
  };

  const { id_alumno, estado_tarea, id_materia, link_archivo } = tareas;

  const generarId = () => {
    const random = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36);
    return random + fecha;
  };

      const borrar = async(id_tarea)=>{
      try {
        const result= await supabase.from("cargaTareas")
        .update({isCargada_tarea:false})
        .eq("id_tarea",id_tarea)

      } catch (error) {
        console.log(error)
      }
    }

  const submit = async () => {
    try {

      let idTarea = tareas.id_tarea
      let idAlum = parseInt(localStorage.getItem("idUsuario")) 

      console.log(typeof idTarea)
      console.log(typeof idAlum)

      const result1 = await supabase
        .from("cargaTareas")
        .select(
          `link_archivo`
        )
        .eq("id_alumno", idAlum)
        .eq("id_tarea", idTarea)
        .eq("isCargada_tarea", true);
      
      if (result1.data.length !== 0) {

        const avatarFile = document.getElementById("input-tarea").files[0];
        const foto = await supabase.storage
        .from("archivos-subidos")
        .upload("archivos-tareas/" + generarId(), avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });

        const principio_cadena =
        "https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/";
        const final_cadena = foto.data.path;
        console.log(final_cadena)
        const link_archivo = principio_cadena + final_cadena;

        var dia  = new Date(Date.now()).getDate();
        var mes  = new Date(Date.now()).getMonth()+1;
        var anio = new Date(Date.now()).getFullYear();
 
       var fecha = dia + "/" + mes + "/" + anio

        const result= await supabase.from("cargaTareas")
          .update({
            updated_at:fecha,
            link_archivo:link_archivo
          })
          .eq("id_tarea", idTarea)
          .eq("id_alumno", idAlum)
          .eq("isCargada_tarea", true)
        
        console.log(result)
        
      } else {
        const avatarFile = document.getElementById("input-tarea").files[0];
        const foto = await supabase.storage
        .from("archivos-subidos")
        .upload("archivos-tareas/" + generarId(), avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });

        const principio_cadena =
        "https://nnlzmdwuqwxgdrnutujk.supabase.co/storage/v1/object/public/";
        const final_cadena = foto.data.path;
        console.log(final_cadena)
        const link_archivo = principio_cadena + final_cadena;

        const { error, result } = await supabase.from("cargaTareas").insert({
          id_alumno:localStorage.getItem("idUsuario"),
          id_materia,
          link_archivo: link_archivo,
          id_tarea:tareas.id_tarea
        });

      }
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEliminar = (id_tarea) => {
    swal({
      title: "Estas seguro de eliminar este registro?",
      text: "Una vez eliminado, no podras recuperar el archivo de vuelta!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Registro eliminado con exito!", {
          icon: "success",
        });
        borrar(id_tarea);
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const buscarDocumento = async (tareas) => {
    try {
      let idTarea = tareas.id_tarea
      let idAlum = parseInt(localStorage.getItem("idUsuario")) 

      console.log(typeof idTarea)
      console.log(typeof idAlum)

      const result1 = await supabase
        .from("cargaTareas")
        .select(
          `link_archivo`
        )
        .eq("id_alumno", idAlum)
        .eq("id_tarea", idTarea)
        .eq("isCargada_tarea", true);
      
      if (result1.data.length !== 0) {
        console.log("a")
       document.getElementById('mensajeDoc').innerHTML = "<h5><strong>Ya tiene un documento subido para esta materia, si sube otro, lo sobrescribirá<strong></h5>" ;  
      } else {
       document.getElementById('mensajeDoc').innerHTML = "<h5><strong>No ha subido ningun archivo para esta tarea<strong></h5>" ; 
      }

    } catch (error) {
      console.log(error);
    }
  };

  //Configuracion del {/*DEJO LOS PARAMETROS DEL VALUE, SINO ME CRASHEA */}
  const columnas = [
    { title: "Titulo", field: "titulo_tarea" },
    { title: "Materia", field: "materias.nombre_materia" },
    { title: "Descripcion", field: "descripcion_tarea" },
    { title: "Plazo de la Tarea", field: "plazo_tarea" }
  ];

  //Estilos
  const styles = useStyles();
  const actualizarState = (e) => {
    setMaterias({
      ...tareas,
      [e.target.name]: e.target.value,
    });
  };

  //Funcion que me trae la lista de categorias y lo agrega a la lista desplegable
  const [materias, setGrados] = useState({});
  const datos = async () => {
    const result = await supabase
      .from("materias")
      .select()
      .eq("isHabilitada_materia", true);

    setGrados(result.data);
  };

  //ACA TENGO QUE TRAER LA MATERIAS DEL PROFESOR QUE ESTOY LOGEADO, ENTONCES SACO EL ID DEL PROFE Y PREGUNTO EN LA TABLA
  // PROFESOR X MATERIA Y LLENO EL DESPLEGABLE

  const vernombre = async () => {
    try {
      var nombre = document.getElementById("input-tarea").files[0].name;
      var punto = nombre.indexOf(".");
      if (
        (nombre.substring(punto) == ".doc") |
        (nombre.substring(punto) == ".docx")
      ) {
        document.getElementById("word").hidden = false;
        document.getElementById("pdf").hidden = true;
        document.getElementById("nombre-archivo").hidden = false;
        document.getElementById("nombre-archivo").innerHTML = nombre;
        document.getElementById("boton-carga").hidden = false;
      } else if (nombre.substring(punto) == ".pdf") {
        document.getElementById("pdf").hidden = false;
        document.getElementById("word").hidden = true;
        document.getElementById("nombre-archivo").hidden = false;
        document.getElementById("nombre-archivo").innerHTML = nombre;
        document.getElementById("boton-carga").hidden = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bodyInsertar = (
    <div className={styles.modal} style={{ width: "40%", height: "65%" }}>
      {/* <center><h5>Cargar Tarea</h5></center><br/>
                <br/>
                <input type="file" name="input" id="input" accept=".doc,.pdf" /> */}
      <center>
        <h4>Cargar Documento de Tarea</h4>
      </center>
      <br />
      <center>
        <label id="mensajeDoc"><h5><b>No ha subido ningun archivo para esta tarea</b></h5></label>
      </center>
      <br />
      <div class="custom-input-file col-md-6 col-sm-6 col-xs-6">
        <input
          type="file"
          accept=".doc,.docx,.pdf"
          name="input"
          id="input-tarea"
          class="input-file"
          onChange={vernombre}
        />
        Cargar Documento
      </div>
      <br />
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignitems: "center",
          }}
        >
          Archivo Cargado:
        </p>
      </div>
      <div id="word" hidden="true">
        <img
          style={{
            width: "20%",
            height: "20%",
            display: "block",
            margin: "auto",
          }}
          src="https://anthoncode.com/wp-content/uploads/2020/02/logo-word-office.png"
          alt="Archivo Word"
        />
      </div>
      <br />
      <div id="pdf" hidden="true">
        <img
          style={{
            width: "20%",
            height: "20%",
            display: "block",
            margin: "auto",
          }}
          src="https://www.nicepng.com/png/detail/196-1963029_adobe-pdf-file-icon-logo-vector-pdf-file.png"
          alt="Archivo Pdf"
        />
      </div>
      <br />
      <div>
        <label
          style={{
            display: "flex",
            justifyContent: "center",
            alignitems: "center",
          }}
          id="nombre-archivo"
          hidden="true"
        ></label>
      </div>
      <br />
      <button
        type="button"
        id="boton-carga"
        style={{ display: "block", margin: "auto" }}
        class="button"
        onClick={submit}
        hidden="true"
      >
        Subir Entrega
      </button>
    </div>
  );

  const { id_tarea } = materias;

  /*ACA TAMBIEN MODIFICO FACUNDO-C1*/

  const selectProduct = (event) => {
    const product = nombres_prod.find(
      (materia) => materia.id_materia == event.target.value
    );
    console.log(product);
    setMaterias(product);
  };

  const sumar = (e) => {
    setMaterias({
      ...materias,
      [e.target.name]: e.target.value,
    });
  };

  //Funciones
  const abrirCerrarModalInsertar = () => {
    insertarModal(!modal);
    setMaterias({});
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalAdd = () => {
    setModalAdd(!modalAdd);
  };

  const seleccionarInsumo = (tareas, caso) => {
    setMaterias(tareas);
    caso === "Editar" && abrirCerrarModalEditar();
  };

  const handleAdd = (tareas, caso) => {
    setMaterias(tareas);
    buscarDocumento(tareas);
    caso === "Add" && abrirCerrarModalAdd();
  };

  useEffect(() => {
    funcion();
    datos();
  }, []);

  return (
    <Main>
      <MaterialTable
        title="Tareas Próximas a Vencer"
        columns={columnas}
        data={data}
        actions={[
          {
             icon:"delete",
             tooltip:"Eliminar",
             onClick: (event,rowData)=>handleEliminar(rowData.id_tarea)
          },
          {
            icon: "add",
            tooltip: "Añadir Entrega",
            onClick: (event, rowData) => handleAdd(rowData, "Add"),
          },
          //COMO AGREGAR OTRO ICONO BOTON?
        ]}
        options={{
          actionsColumnIndex: -1,
          searchFieldStyle: {
            placeContent: "Buscar",
          },
        }}
        localization={{
          header: {
            actions: "Borrar / Subir Tarea",
          },
          toolbar: {
            searchPlaceholder: "Buscar",
          },
        }}
      />

      <Modal open={modalAdd} onClose={abrirCerrarModalAdd}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {/*bodyEditar*/}
      </Modal>
    </Main>
  );
};

export default CargaTareas;
