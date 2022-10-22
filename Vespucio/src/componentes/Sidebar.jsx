import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import navLinksDirector from '../assets/navLinksDirector'
import navLinksGeneric from '../assets/navLinksGeneric'
import navLinksProfesores from '../assets/navLinksProfesores'
import navLinksAdm from '../assets/navLinksAdm'
import navLinksSecret from '../assets/navLinksSecret'
import "../estilos/sidebar.css";

const Sidebar = () => {
    const[open1, setOpen1]=useState(false)
    const[open2, setOpen2]=useState(false)
    const[open3, setOpen3]=useState(false)
    const[open4, setOpen4]=useState(false)

  return (
    <div className="sidebar">
        <div className="sidebar__top">
            <h3>
               <span><i className="ri-vimeo-line"></i></span> Colegio Americo Vespucio
            </h3>
        </div>
        <div className="sidebar__content">
            <div className="nav">
                <ul className="nav__list">
                    <li className='list__item'>
                        <div className="list__button">
                        <i className="ri-home-3-line list__img"></i>
                        {
                            navLinksGeneric.map((item,index)=>(
                                <li className="nav__item" key={index}>
                                    <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
                                    {item.display}</NavLink>
                                </li>
                            ))
                        }
                        </div>
                    </li>
                    <li className={open1?"list__arrow arrow": "list__item"}>
                        <div className="list__button" onClick={()=>setOpen1(!open1)}>
                            <i className="ri-quill-pen-fill list__img"></i>
                            <a href="#"  className='nav__link'>Director</a>
                            <i className="ri-arrow-right-line list__arrow"></i>
                        </div>
                        <ul className={open1? null: "list__show"}>
                            {
                                navLinksDirector.map((item,index)=>(
                                    <li className="nav__item" key={index}>
                                        <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
                                        <i className={item.icon}></i>{item.display}</NavLink>
                                    </li>
                                ))
                            }
                        </ul>
                    </li>
                   
                    <li className={open2?"list__arrow arrow": "list__item"}>
                        <div className="list__button" onClick={()=>setOpen2(!open2)}>
                            <i className="ri-user-settings-fill list__img"></i>
                            <a href="#"  className='nav__link'> Administrativo</a>
                            <i className="ri-arrow-right-line list__arrow"></i>
                        </div>
                        <ul className={open2? null: "list__show"}>
                        {
                            navLinksAdm.map((item,index)=>(
                                <li className="nav__item" key={index}>
                                    <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
                                    <i className={item.icon}></i>{item.display}</NavLink>
                                </li>
                            ))
                        }
                    
                        </ul>
                    </li>
                    <li className={open3?"list__arrow arrow": "list__item"}>
                        <div className="list__button"  onClick={()=>setOpen3(!open3)}>
                            <i className="ri-pencil-ruler-2-fill list__img"></i>
                            <a href="#" className='nav__link'> Profesores</a>
                            <i className="ri-arrow-right-line list__arrow"></i>
                        </div>
                        <ul className={open3? null: "list__show"}>
                        {
                            navLinksProfesores.map((item,index)=>(
                                <li className="nav__item" key={index}>
                                    <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
                                    <i className={item.icon}></i>{item.display}</NavLink>
                                </li>
                            ))
                        }
                    
                        </ul>
                    </li>
                    <li className={open4?"list__arrow arrow": "list__item"}>
                        <div className="list__button"  onClick={()=>setOpen4(!open4)}>
                            <i className="ri-pencil-ruler-2-fill list__img"></i>
                            <a href="#" className='nav__link'> Preceptores</a>
                            <i className="ri-arrow-right-line list__arrow"></i>
                        </div>
                        <ul className={open4? null: "list__show"}>
                        {
                            navLinksSecret.map((item,index)=>(
                                <li className="nav__item" key={index}>
                                    <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
                                    <i className={item.icon}></i>{item.display}</NavLink>
                                </li>
                            ))
                        }
                    
                        </ul>
                    </li>
                </ul>
            
            </div>
        
        </div>
    </div>
  );
}

export default Sidebar


// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import 'remixicon/fonts/remixicon.css'
// import navLinksDirector from '../assets/navLinksDirector'
// import navLinksGeneric from '../assets/navLinksGeneric'
// import navLinksProfesores from '../assets/navLinksProfesores'
// import navLinksAdm from '../assets/navLinksAdm'
// import "../estilos/sidebar.css";


// let listElements = document.querySelectorAll('.list__button--click');
// listElements.forEach(listElement=>{
//     listElement.addEventListener('click',()=>{
//         listElement.classList.toggle('arrow')
//         let height=0;
//         let menu = listElement.nextElementSibling;
//         if(menu.clientHeight=="0"){
//             height=menu.scrollHeight;
//         }
//         menu.style.height=`${height}px`
//     })
// })

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//         <div className="sidebar__top">
//             <h3>
//                <span><i class="ri-vimeo-line"></i></span> Colegio Americo Vespucio
//             </h3>
//         </div>
//         <div className="sidebar__content">
//             <div className="nav">
//                 <ul className="nav__list">
//                     <li className='list__item'>
//                         <div className="list__button">
//                         <i class="ri-home-3-line list__img"></i>
//                         {
//                             navLinksGeneric.map((item,index)=>(
//                                 <li className="nav__item" key={index}>
//                                     <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
//                                     {item.display}</NavLink>
//                                 </li>
//                             ))
//                             }
//                         </div>
//                     </li>
//                     <li className='list__item list__item--click'>
//                         <div className="list__button list__button--click">
//                             <i class="ri-quill-pen-fill list__img"></i>
//                             <a href="#" className='nav__link'> Director</a>
//                             <i class="ri-arrow-right-line list__arrow"></i>
//                         </div>
//                         <ul className='list__show'>
//                             {
//                             navLinksDirector.map((item,index)=>(
//                                 <li className="nav__item" key={index}>
//                                     <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
//                                     <i className={item.icon}></i>{item.display}</NavLink>
//                                 </li>
//                             ))
//                             }
//                         </ul>
//                     </li>
                   
//                     <li className='list__item list__item--click'>
//                         <div className="list__button list__button--click">
//                             <i class="ri-user-settings-fill list__img"></i>
//                             <a href="#" className='nav__link'> Administrativo</a>
//                             <i class="ri-arrow-right-line list__arrow"></i>
//                         </div>
//                         <ul className='list__show'>
//                         {
//                         navLinksAdm.map((item,index)=>(
//                             <li className="nav__item" key={index}>
//                                 <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
//                                 <i className={item.icon}></i>{item.display}</NavLink>
//                             </li>
//                         ))
//                     }
                    
//                         </ul>
//                     </li>
//                     <li className='list__item list__item--click'>
//                         <div className="list__button list__button--click">
//                             <i class="ri-pencil-ruler-2-fill list__img"></i>
//                             <a href="#" className='nav__link'> Profesores</a>
//                             <i class="ri-arrow-right-line list__arrow"></i>
//                         </div>
//                         <ul className='list__show'>
//                         {
//                         navLinksProfesores.map((item,index)=>(
//                             <li className="nav__item" key={index}>
//                                 <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
//                                 <i className={item.icon}></i>{item.display}</NavLink>
//                             </li>
//                         ))
//                     }
                    
//                         </ul>
//                     </li>
                    
                    
//                     {/* {
//                         navLinks.map((item,index)=>(
//                             <li className="nav__item" key={index}>
//                                 <NavLink to={item.path} className={navClass =>navClass.isActive ? 'nav__active nav__link':'nav__link'}>
//                                 <i className={item.icon}></i>{item.display}</NavLink>
//                             </li>
//                         ))
//                     } */}
//                 </ul>
            
//             </div>
//             <div className="sidebar__bottom">
//                 <span><i class="ri-logout-box-line"></i>Cerrar Sesión</span>
//             </div>
//         </div>
//     </div>
//   );
// }

// export default Sidebar