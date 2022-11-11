import React from 'react'
import RouterAdministrativos from '../../routes/RouterAdministrativos'
import SidebarAdministrativo from '../SideBars/SidebarAdministrativo'
import TopNav from '../TopNav'
import "../../estilos/estilos.css";
import "../../estilos/sidebar.css";



const LayoutAdministrativo = (props) => {
  return (
    <div className='layout'>
      <SidebarAdministrativo/>
      <div className="main__layout">
            <TopNav user={props} />
            <div className="content">
                <RouterAdministrativos/>
            </div>
      </div>  
    </div>
  )
}

export default LayoutAdministrativo