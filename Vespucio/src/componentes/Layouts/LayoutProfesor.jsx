import React from 'react'
import RouterProfesores from '../../routes/RouterProfesores'
import SidebarProfesor from '../SideBars/SidebarProfesor'
import TopNav from '../TopNav'
import "../../estilos/estilos.css";
import "../../estilos/sidebar.css";



const LayoutProfesor = (props) => {
  return (
    <div className='layout'>
      <SidebarProfesor/>
      <div className="main__layout">
            <TopNav user={props} />
            <div className="content">
                <RouterProfesores/>
            </div>
      </div>  
    </div>
  )
}

export default LayoutProfesor