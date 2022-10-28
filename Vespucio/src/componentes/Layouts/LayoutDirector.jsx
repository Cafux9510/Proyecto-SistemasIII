import React from 'react'
import RouterDirectores from '../../routes/RouterDirectores'
import SidebarDirector from '../SideBars/SidebarDirector'
import TopNav from '../TopNav'
import "../../estilos/estilos.css";
import "../../estilos/sidebar.css";



const LayoutDirector = () => {
  return (
    <div className='layout'>
      <SidebarDirector/>
      <div className="main__layout">
            <TopNav/>
            <div className="content">
                <RouterDirectores/>
            </div>
      </div>  
    </div>
  )
}

export default LayoutDirector