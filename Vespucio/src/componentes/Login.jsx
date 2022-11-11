import { useEffect, useState } from "react";
import { supabase } from "../Backend/client";
import { makeStyles } from "@material-ui/core/styles";
import styled from "@emotion/styled";

import LayoutAlumno from "./Layouts/LayoutAlumno";
import LayoutProfesor from "./Layouts/LayoutProfesor";
import LayoutAdministrativo from "./Layouts/LayoutAdministrativo";
import LayoutDirector from "./Layouts/LayoutDirector";
import LayoutPreceptor from "./Layouts/LayoutPreceptor";

const Login = () => {

  const[miLogin, setMiLogin] = useState("false");
  const[usu, setUsu] = useState("");
  const[pas, setPas] = useState("");
  const[tipoUsuario, setTipoUsuario] = useState(0);

  async function verificarIngreso(e) {
    e.preventDefault();

    let usuario = document.getElementById("user").value;
    let password = document.getElementById("pass").value;

    if(usuario.length===0 || password.length===0){
      alert("Complete los datos faltantes!");
    }else{
        try {
          const user_id = await supabase
            .from("usuarios")
            .select()
            .eq("nombre_usuario", usuario)
            .eq("contrasenia_usuario", password);

            //Ahora preguntamos si el tipo de usuario corresponde a un
            // alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)

          if (user_id.data.length !== 0) {

            let tipo_usuario = user_id.data[0].tipo_usuario;
            setTipoUsuario(tipo_usuario);
            let userID = user_id.data[0].id_usuario;    
            let isSesionActiva;

            if (tipo_usuario === 1) {

              const idAlumno = await supabase
              .from("alumnos")
              .select("id_alumno")
              .eq("id_usuario", userID)

              let id = idAlumno.data[0].id_alumno;

              localStorage.setItem( "idUsuario", id )

              
            }else{

              const idPersonal = await supabase
              .from("personalEducativo")
              .select("id_personal")
              .eq("id_usuario", userID)

              let id = idPersonal.data[0].id_personal;

              localStorage.setItem( "idUsuario", id )

            }


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

                isSesionActiva = true;
                localStorage.setItem( "sesionActiva", isSesionActiva )
                localStorage.setItem( "tipoUsuario", tipo_usuario )

                setMiLogin("true");
                document.getElementById("formLogin").style.display = "none";

                break;
              case 2:
                console.log("Profesor");
                const { resultPr, errorPro } = await supabase
                  .from("usuarios")
                  .update({ isActivo: true })
                  .eq("id_usuario", userID);

                isSesionActiva = true;
                localStorage.setItem( "sesionActiva", isSesionActiva )
                localStorage.setItem( "tipoUsuario", tipo_usuario )

                setMiLogin("true");
                document.getElementById("formLogin").style.display = "none";

                break;
              case 3:
                console.log("Administrativo");
                const { resultAd, errorAd } = await supabase
                  .from("usuarios")
                  .update({ isActivo: true })
                  .eq("id_usuario", userID);

                isSesionActiva = true;
                localStorage.setItem( "sesionActiva", isSesionActiva )
                localStorage.setItem( "tipoUsuario", tipo_usuario )

                setMiLogin("true");
                document.getElementById("formLogin").style.display = "none";

                break;
              case 4:
                console.log("Director");
                const { resultD, errorD } = await supabase
                  .from("usuarios")
                  .update({ isActivo: true })
                  .eq("id_usuario", userID);

                isSesionActiva = true;
                localStorage.setItem( "sesionActiva", isSesionActiva )
                localStorage.setItem( "tipoUsuario", tipo_usuario )

                setMiLogin("true");
                document.getElementById("formLogin").style.display = "none";

                break;
              case 5:
                console.log("Preceptor");
                const { resultPre, errorPre } = await supabase
                  .from("usuarios")
                  .update({ isActivo: true })
                  .eq("id_usuario", userID);

                isSesionActiva = true;
                localStorage.setItem( "sesionActiva", isSesionActiva )
                localStorage.setItem( "tipoUsuario", tipo_usuario )

                setMiLogin("true");
                document.getElementById("formLogin").style.display = "none";
                  
                break;
              default:
                console.log(
                  "Seria raro ingresar acá pero bueno, che no tenes un tipo de usuario valido"
                );
                break;
            }

          }else{
            setMiLogin("false");
            alert("Error de Usuario y/o Contraseña");
            document.getElementById("user").value = "";
            document.getElementById("pass").value = "";
            document.getElementById("user").focus();
          }
        } catch (errorLogin) {
          console.log(errorLogin);
        }

      }

  }


    // try {
    //   let usuario = document.getElementById("user");
    //   let valorUsuario = usuario.value;
    //   let password = document.getElementById("pass");
    //   let valorPass = password.value;

    //   console.log("Ingresando al Cielo");

    //   try {
    //     const user_id = await supabase
    //       .from("usuarios")
    //       .select()
    //       .eq("nombre_usuario", valorUsuario)
    //       .eq("contrasenia_usuario", valorPass);

    //     if (user_id.data.length !== 0) {
    //       console.log("Bienvenido al Valhala");

    //       //Ahora preguntamos si el tipo de usuario corresponde a un
    //       // alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)

    //       let tipo_usuario = user_id.data[0].tipo_usuario;
    //       let userID = user_id.data[0].id_usuario;    
    //       let isSesionActiva;      

    //       switch (tipo_usuario) {
    //         case 1:
    //           console.log("Alumno");
    //           /*Aca cambia el estado de la sesion a activo,
    //           cosa de saber que esta logeado en todo momento y movernos con este atributo,
    //           hasta que cierre sesión, cambiando ese atributo a false cuando lo haga*/
    //           const { resultAl, errorA } = await supabase
    //             .from("usuarios")
    //             .update({ isActivo: true })
    //             .eq("id_usuario", userID);

    //           isSesionActiva = true;
    //           localStorage.setItem( "sesionActiva", isSesionActiva )
    //           localStorage.setItem( "tipoUsuario", tipo_usuario )

    //           break;
    //         case 2:
    //           console.log("Profesor");
    //           const { resultPr, errorPro } = await supabase
    //             .from("usuarios")
    //             .update({ isActivo: true })
    //             .eq("id_usuario", userID);

    //           isSesionActiva = true;
    //           localStorage.setItem( "sesionActiva", isSesionActiva )
    //           localStorage.setItem( "tipoUsuario", tipo_usuario )


    //           break;
    //         case 3:
    //           console.log("Administrativo");
    //           const { resultAd, errorAd } = await supabase
    //             .from("usuarios")
    //             .update({ isActivo: true })
    //             .eq("id_usuario", userID);

    //           isSesionActiva = true;
    //           localStorage.setItem( "sesionActiva", isSesionActiva )
    //           localStorage.setItem( "tipoUsuario", tipo_usuario )


    //           break;
    //         case 4:
    //           console.log("Director");
    //           const { resultD, errorD } = await supabase
    //             .from("usuarios")
    //             .update({ isActivo: true })
    //             .eq("id_usuario", userID);

    //           isSesionActiva = true;
    //           localStorage.setItem( "sesionActiva", isSesionActiva )
    //           localStorage.setItem( "tipoUsuario", tipo_usuario )


    //           break;
    //         case 5:
    //           console.log("Preceptor");
    //           const { resultPre, errorPre } = await supabase
    //             .from("usuarios")
    //             .update({ isActivo: true })
    //             .eq("id_usuario", userID);

    //           isSesionActiva = true;
    //           localStorage.setItem( "sesionActiva", isSesionActiva )
    //           localStorage.setItem( "tipoUsuario", tipo_usuario )

                
    //           break;
    //         default:
    //           console.log(
    //             "Seria raro ingresar acá pero bueno, che no tenes un tipo de usuario valido"
    //           );
    //           break;
    //       }

    //       /*setTimeout(function() {
    //             location.reload();
    //             }, 3000);*/
    //     } else {
    //       console.log("Amigo no estas registrado");
    //     }
    //   } catch (errorLogin) {
    //     console.log(errorLogin);
    //   }
    // } catch (errorDatos) {
    //   console.log(errorDatos);
    //   console.log("Amigo completa los datos");
    // }

  // const RenderLayout = () =>{
  //   //alumno(1), profesor(2), administrativo(3), director(4), preceptor(5)
  
  //   if(localStorage.getItem( "tipoUsuario" ) === 1){
        
  //     return(
  //       <LayoutAlumno/>                  
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 2){
  //     return(
  //       <LayoutProfesor/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 3){
  //     return(
  //       <LayoutAdministrativo/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 4){
  //     return(
  //       <LayoutDirector/>
  //     )
  //   }else if(localStorage.getItem( "tipoUsuario" ) === 5){
  //     console.log("Entre a prece")
  //     return(
  //       <LayoutPreceptor/>
  //     )
  //   }

  // }


  return (
    <div>
      <div id="formLogin">

      <div id="bg"></div>
      <form>
        <div className="form-field">
          <input
            id="user"
            type="text"
            placeholder="Usuario"
            onChange={(e) => setUsu(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <input
            id="pass"
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPas(e.target.value)}
            required
          />{" "}
        </div>

        <div class="form-field">
          <button class="btn" type="button" onClick={verificarIngreso}>
            Iniciar Sesion
          </button>
        </div>
      </form>

      </div>
      
      { ((miLogin === "true") && (tipoUsuario===1)) && <LayoutAlumno usu={usu} />  }
      { ((miLogin === "true") && (tipoUsuario===2)) && <LayoutProfesor usu={usu} />  }
      { ((miLogin === "true") && (tipoUsuario===3)) && <LayoutAdministrativo usu={usu} />  }
      { ((miLogin === "true") && (tipoUsuario===4)) && <LayoutDirector usu={usu} />  }
      { ((miLogin === "true") && (tipoUsuario===5)) && <LayoutPreceptor usu={usu} />  }

    </div>
  );
  
}


export default Login