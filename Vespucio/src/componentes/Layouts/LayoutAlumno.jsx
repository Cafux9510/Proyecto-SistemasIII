import React from 'react'
import RouterAlumnos from '../../routes/RouterAlumnos'
import SidebarAlumno from '../SideBars/SidebarAlumno'
import TopNav from '../TopNav'
import "../../estilos/estilos.css";
import "../../estilos/sidebar.css";



const LayoutAlumno = () => {
  return (
    <div className='layout'>
      <SidebarAlumno/>
      <div className="main__layout">
            <TopNav/>
            <div className="content">
                <RouterAlumnos/>
            </div>
      </div>  
    </div>
  )
}

export default LayoutAlumno