import { React, useRef, useState } from 'react';
import {supabase} from "../Backend/client";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


import "../estilos/top-nav.css"

import styled from '@emotion/styled'

const Desplegable = styled.div`
  display:flex;
  flex-direction:column;
  column-gap:2px;
`;
const TopTitle = styled.h2`
  display:flex;
  width:57vw;
  margin-top:2vh;
  margin-left:23vw;
  color: white;


`;

const TopNav = () => {
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const menu = useRef(null);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const dialogFuncMap = {
    'displayBasic': setDisplayBasic
  }
  function cambiarConstrasenia() {
    onClick('displayBasic');
  }
  const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }
    
    const confirmarCambio = async () => {
      try {
            
        let id = parseInt(localStorage.getItem("idUsuario"));
        let tipo = parseInt(localStorage.getItem("tipoUsuario"));
        console.log(id)
        
        if (tipo === 1) {

          const resultado = await supabase.from("alumnos")
          .select('id_usuario')
          .eq("id_alumno",id)
          
          let id_user = resultado.data[0].id_usuario
  
          if (value1 != '' && value2 != '') {
            
            const resultado22 = await supabase.from("usuarios")
            .select('contrasenia_usuario')
            .eq("id_usuario",id_user)
            
            let contraActual = resultado22.data[0].contrasenia_usuario;
            let contraActualIngresada = value1

            console.log(contraActual)
            console.log(contraActualIngresada)

            if (contraActual === contraActualIngresada) {
                const resultado2 = await supabase.from("usuarios")
                .update({"contrasenia_usuario":value2})
                .eq("id_usuario", id_user)
                
                cerrarSesion()
              
            } else {
              alert("¡Esa no es su contraseña actual!")
            }

          }

          
            
          } else {
            
            //queda ver el tema de como se llaman los atributos en personal educativo para el cambio de contra
            
            const resultados = await supabase.from("personalEducativo")
            .select('id_usuario')
            .eq("id_personal",id)
          
          let id_user = resultados.data[0].id_usuario
  
          if (value1 != '' && value2 != '') {
            
            const resultado22 = await supabase.from("usuarios")
            .select('contrasenia_usuario')
            .eq("id_usuario",id_user)
            
            let contraActual = resultado22.data[0].contrasenia_usuario;
            let contraActualIngresada = value1

            console.log(contraActual)
            console.log(contraActualIngresada)

            if (contraActual === contraActualIngresada) {
                const resultado2 = await supabase.from("usuarios")
                .update({"contrasenia_usuario":value2})
                .eq("id_usuario", id_user)
                
                cerrarSesion()
              
            } else {
              alert("¡Esa no es su contraseña actual!")
            }

          }
          
          }

          } catch (error) {
              console.log(error)
          }
      }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Confirmar Cambio" icon="pi pi-check" onClick={confirmarCambio} autoFocus />
            </div>
        );
    }

  const items = [
        {
            label: 'Opciones',
            items: [
                {
                    label: 'Cambiar Contraseña',
                    icon: 'pi pi-refresh',
                    command: () => {cambiarConstrasenia()}
                },
                {
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-times',
                    command: () => {cerrarSesion()}
                }
            ]
        }
    ];


  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };


  function cerrarSesion() {

    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('sesionActiva');
    
    window.location.reload()


  }

  return (
    <div className="top__nav">
      <div className="top__nav-wrapper">
        {/* <div className="search__box">
          <input type="text" placeholder='Buscar...' />
          <span><i className="ri-search-line"></i></span>
        </div> */}
        <TopTitle> Bienvenido de Nuevo</TopTitle>
        <div className="top__nav-right">

            <Menu model={items} popup ref={menu} id="popup_menu" />
            <Button label="Perfil" icon="pi pi-bars" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
         

          {/* prueba avatar */}
          
          <Dialog header="Cambio de Contraseña" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
            <center><p><strong>Aclaración: Si cambia la contraseña, se cerrará la sesión y deberá ingresar nuevamente con la nueva contraseña</strong></p></center>
            <br />
            <h6>Contraseña Actual</h6>
            <InputText type="password" value={value1} onChange={(e) => setValue1(e.target.value)} />
            <br /><br />
            <h6>Nueva Contraseña</h6>
            <InputText type="password" value={value2} onChange={(e) => setValue2(e.target.value)} />
          </Dialog>


    {/* <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Desplegable>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar />
        </MenuItem>
     
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Editar Mi Perfil
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small"/>
          </ListItemIcon>
          Cerrar sesion
        </MenuItem>
      </Menu>
      </Desplegable>
    </React.Fragment> */}

        </div>
      </div>
    </div>
  )
}

export default TopNav