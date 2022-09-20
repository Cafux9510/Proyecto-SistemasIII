import React from 'react'

const Inicio=() => {
  return (
    <div><h1 className='titulo'>Sistema de Gestión Educativa del Colegio Vespucio</h1>
    
    {/*Esto es temporal pero es para mostrar la idea general que tenemos
       Los estilos de esto momentaneo está en estilos/estilos.css, debajo de un comentario en mayusculas,
       Lo dejo bien marcado para que despues lo borremos, total es momentáneo.*/}

      <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
      <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      {/*Include the above in your HEAD tag */}
      <div className="container login-container">
        <div className="row justify-content-between">
          <div className="col-sm-6 pr-4 pl-1">
            <div className="login-form-1" >
                <h3 >Personal Educativo</h3>
                <form>
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Usuario *" />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" placeholder="Contraseña *" />
                  </div>
                  <div className="form-group">
                    <input type="submit" className="btnSubmit" value="Ingresar" />
                  </div>
                  <div className="form-group">
                    <a href="#" className="ForgetPwd">¿Olvidaste tu contraseña?</a>
                  </div>
                </form>
            </div>
          </div>

          <div className="col-sm-6 pr-1 pl-4">
            <div className="login-form-2" >
                <h3>Alumnado</h3>
                <form>
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Usuario *" />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" placeholder="Contraseña *"  />
                  </div>
                  <div className="form-group">
                    <input type="submit" className="btnSubmit" value="Ingresar" />
                  </div>
                  <div className="form-group">
                    <a href="#" className="ForgetPwd" value="Login">¿Olvidaste tu contraseña?</a>
                  </div>
                </form>
            </div>
          </div>      
        </div>
      </div>
    </div> 
  )
}

export default Inicio