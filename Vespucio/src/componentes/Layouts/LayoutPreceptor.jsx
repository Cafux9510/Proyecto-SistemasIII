import React from 'react'
import RouterPreceptores from '../../routes/RouterPreceptores'
import SidebarPreceptor from '../SideBars/SidebarPreceptor'
import TopNav from '../TopNav'
import "../../estilos/estilos.css";
import "../../estilos/sidebar.css";



const LayoutPreceptor = () => {
  return (
    <div className='layout'>
      <SidebarPreceptor/>
      <div className="main__layout">
            <TopNav/>
            <div className="content">
                <RouterPreceptores/>
            </div>
      </div>  
    </div>
  )
}

export default LayoutPreceptor