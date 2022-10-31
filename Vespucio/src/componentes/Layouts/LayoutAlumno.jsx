import {React} from 'react'
import RouterAlumnos from '../../routes/RouterAlumnos'
import SidebarAlumno from '../SideBars/SidebarAlumno'
import TopNav from '../TopNav'
import "../../estilos/estilos.css";
import "../../estilos/sidebar.css";



const LayoutAlumno = (props) => {
  
  console.log("Estoy en Layout de Alumno")

  return (
    <div id='cajaLayout' className='layout'>
      <SidebarAlumno/>
      <div className="main__layout">
            <TopNav user={props} />
            <div className="content">
                <RouterAlumnos/>
            </div>
      </div>

      { ((localStorage.getItem("tipoUsuario") === null)) && <Login /> }

    </div>
  )

}

export default LayoutAlumno