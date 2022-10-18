import { useEffect, useState } from "react";
import {supabase} from "../Backend/client";
import MaterialTable from "@material-table/core";
import { Dialog } from 'primereact/dialog';
import { Button } from "@material-ui/core";
import {Modal,TextField} from "@material-ui/core"
import { InputText } from 'primereact/inputtext';
import {makeStyles} from "@material-ui/core/styles"
import { amber } from "@material-ui/core/colors";
import swal from "sweetalert";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";

const Main = styled.div `
  margin-top: 20%;
  margin-left: 20%
`;

const RestablecerContrasenia = () => {

    const [contrasenia, setContrasenia] = useState('');
    const [recontrasenia, setReContrasenia] = useState('');

    function verificarPasswords() {
 
        // Ontenemos los valores de los campos de contraseñas 
        pass1 = document.getElementById('pass1');
        pass2 = document.getElementById('pass2');
     
        // Verificamos si las constraseñas no coinciden 
        if (pass1.value != pass2.value) {
     
            // Si las constraseñas no coinciden mostramos un mensaje 
            document.getElementById("error").classList.add("mostrar");
     
            return false;
        } else {
     
            // Si las contraseñas coinciden ocultamos el mensaje de error
            document.getElementById("error").classList.remove("mostrar");
     
            // Mostramos un mensaje mencionando que las Contraseñas coinciden 
            document.getElementById("ok").classList.remove("ocultar");
     
            // Desabilitamos el botón de login 
            document.getElementById("login").disabled = true;
     
            // Refrescamos la página (Simulación de envío del formulario) 
            setTimeout(function() {
                location.reload();
            }, 3000);
     
            return true;
        }
     
    }


    return (
    <Main>

        <div style={{borderColor:"black", padding:"50px", border:"solid white 5px", width:"60%", color:"white"}}>
            <h2 className="text-center">Defina una nueva contraseña</h2>
            <br/>
            <form id="miformulario" className="text-center" onsubmit="verificarPasswords(); return false">
                <div class="form-group">
                    <label for="pass1">Nueva Contraseña</label>
                    <br/><br/>
                    <input type="password" class="form-control" id="pass1" required/>
                </div>
                <div class="form-group">
                <br/>
                    <label for="pass2">Vuelva a escribir la Contraseña</label><br/><br/>
                    <input type="password" class="form-control" id="pass2" required/>
                </div>
                <br/><br/>
                <button type="submit" id="login" class="btn btn-primary">Guardar Cambios</button>
            </form>

        </div>
 
        
        {/*<div className="row g-0 auth-wrapper">
            <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
                <div className="d-flex flex-column align-content-end" style={{borderColor:"black", border:"solid white 5px"}}>
                    <div className="auth-body mx-auto" style={{color:"white", fontSize:"25px", margin:"50px"}}>
                        <p style={{fontSize:"35px"}}>Restablezca su Contraseña</p>
                        <br/>
                        <div className="auth-form-container text-start text-center">
                            <form className="auth-form" method="POST">
                                <div className="password mb-3">
                                    <input type="password"
                                        
                                        id="contraseña"
                                        name="contraseña"
                                        
                                        placeholder="Constraseña"
                                        onChange={(e) => setContrasenia(e.target.value)}
                                    />
                                </div>
                                <br/>
                                <div className="password mb-3">
                                    <input type="password"
                                        
                                        id="recontraseña"
                                        name="recontraseña"
                                        
                                        placeholder="Repita Contraseña"
                                        onChange={(e) => setReContrasenia(e.target.value)}
                                    />
                                </div>
                                <br/>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary w-100 theme-btn mx-auto">Restablecer Contraseña</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>*/}
    </Main>
    )
}

export default RestablecerContrasenia

