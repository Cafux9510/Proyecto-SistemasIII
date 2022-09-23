import React from 'react'
import { Link } from 'react-router-dom'
import profileImg from '../assets/imagenes/profile.jpg'
import "../estilos/top-nav.css"
const TopNav = () => {
  return (
    <div className="top__nav">
      <div className="top__nav-wrapper">
        <div className="search__box">
          <input type="text" placeholder='Buscar...' />
          <span><i class="ri-search-line"></i></span>
        </div>
        <div className="top__nav-right">
          <span className='notification'><i class="ri-notification-3-line"></i>
          </span>
          <div className="profile">
            <Link to="/inicio">
              <img src={profileImg} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav