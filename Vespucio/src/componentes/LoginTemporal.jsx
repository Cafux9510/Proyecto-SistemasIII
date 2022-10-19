import { useEffect, useState } from "react";
import { supabase } from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Button } from "@material-ui/core";
import { Modal, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import styled from "@emotion/styled";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Link } from "react-router-dom";

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

const Alumnos = () => {
  //Statest

  const [alumnos, alumnoAgregado] = useState({
    id_anioEduc: "",
    nombre_alumno: "",
    telefono_alumno: "",
    mail_alumno: "",
    domicilio_alumno: "",
    dni_alumno: "",
    apellido_alumno: "",
    id_nivel: "",
  });

  async function verificarIngreso() {
    try {
      let usuario = document.getElementById("user");
      let valorUsuario = usuario.value;
      let password = document.getElementById("pass");
      let valorPass = password.value;

      console.log("Ingresando al Cielo");

      try {
        const user_id = await supabase
          .from("usuarios")
          .select()
          .eq("nombre_usuario", valorUsuario)
          .eq("contrasenia_usuario", valorPass);

        if (user_id.data.length !== 0) {
          console.log("Bienvenido al Valhala");

          //Ahora preguntamos si el tipo de usuario corresponde a un
          // alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)

          let tipo_usuario = user_id.data[0].tipo_usuario;
          let userID = user_id.data[0].id_usuario;          

          switch (tipo_usuario) {
            case 1:
              console.log("Alumno");
              /*Aca cambia el estado de la sesion a activo,
              cosa de saber que esta logeado en todo momento y movernos con este atributo,
              hasta que cierre sesión, cambiando ese atributo a false cuando lo haga*/
              const { resultAl, errorA } = await supabase
                .from("usuarios")
                .update({ isActivo: true })
                .eq("id_usuario", userID);
              //acá se redirecciona a lo que le pongas.
              window.location.href = "https://google.com";
              break;
            case 2:
              console.log("Profesor");
              const { resultPr, errorPro } = await supabase
                .from("usuarios")
                .update({ isActivo: true })
                .eq("id_usuario", userID);
              break;
            case 3:
              console.log("Administrativo");
              const { resultAd, errorAd } = await supabase
                .from("usuarios")
                .update({ isActivo: true })
                .eq("id_usuario", userID);
              break;
            case 4:
              console.log("Director");
              const { resultD, errorD } = await supabase
                .from("usuarios")
                .update({ isActivo: true })
                .eq("id_usuario", userID);
              break;
            case 5:
              console.log("Preceptor");
              const { resultPre, errorPre } = await supabase
                .from("usuarios")
                .update({ isActivo: true })
                .eq("id_usuario", userID);
              break;
            default:
              console.log(
                "Seria raro ingresar acá pero bueno, che no tenes un tipo de usuario valido"
              );
              break;
          }

          /*setTimeout(function() {
                location.reload();
                }, 3000);*/
        } else {
          console.log("Amigo no estas registrado");
        }
      } catch (errorLogin) {
        console.log(errorLogin);
      }
    } catch (errorDatos) {
      console.log(errorDatos);
      console.log("Amigo completa los datos");
    }
  }

  return (
    <Main>
      <div>
        <div id="bg"></div>
        <form>
          <div class="form-field">
            <input id="user" type="text" placeholder="Usuario" required />
          </div>

          <div class="form-field">
            <input
              id="pass"
              type="password"
              placeholder="Contraseña"
              required
            />{" "}
          </div>

          <div class="form-field">
            <button class="btn" type="button" onClick={verificarIngreso}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </Main>
  );
};

export default Alumnos;
