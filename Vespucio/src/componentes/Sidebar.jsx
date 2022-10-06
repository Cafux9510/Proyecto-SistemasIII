import React from 'react'
import { NavLink } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import navLinks from '../assets/navLinks'
import "../estilos/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
        <div className="sidebar__top">
            <h3>
               <span><i class="ri-vimeo-line"></i></span> Colegio Americo Vespucio
            </h3>
        </div>
        <div className="sidebar__content">
            <div className="menu">
                <ul className="nav__list">
                    {
                        navLinks.map((item,index)=>(
                            <li className="nav__item" key={index}>
                                <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
                                <i className={item.icon}></i>{item.display}</NavLink>
                            </li>
                        ))
                    }
                </ul>
            
            </div>
            <div className="sidebar__bottom">
                <span><i class="ri-logout-box-line"></i>Cerrar Sesión</span>
            </div>
        </div>
    </div>
  );
}

export default Sidebar