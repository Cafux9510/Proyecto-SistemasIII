import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import { useState } from 'react';


function App() {

  const dataProveedores = [
    {id:1,nombre:'Muebleria La de Sola', email: 'asdasd@gmail.com'},
    
    {id:2, nombre:'Papa Noel', email: 'papanoelo@gmail.com'},
    
    {id:3, nombre:'Papel Markey', email: 'Markey@gmail.com'},
    
    {id:4,nombre:'InformaticaCall', email: 'infCal@gmail.com'},
    
    {id:5,nombre:'Ropa Piquetera', email: 'Piquete@gmail.com'},
  ];

  const [data, setData] = useState(dataProveedores);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState({
    id:'',
    nombre:'',
    correo:''
  }
  )

  const seleccionarProveedor=(elemento, caso)=>{
    setProveedorSeleccionado(elemento);
    (caso==='Editar')?setModalEditar(true):setModalEliminar(true)
  }

  const handleChange=e=>{
    const {name,value}=e.target;
    setProveedorSeleccionado((prevState)=>({
      ...prevState,
      [name]:value
    }));
  }

  const editar=()=>{
    var dataNueva=data;
    dataNueva.map(proveedor=>{
      if(proveedor.id===proveedorSeleccionado.id){
        proveedor.nombre=proveedorSeleccionado.nombre;
        proveedor.email=proveedorSeleccionado.email;
      }
    });
    setData(dataNueva);
    setModalEditar(false);
  }

  const eliminar =()=>{
    setData(data.filter(proveedor=>proveedor.id!==proveedorSeleccionado.id));
    setModalEliminar(false);
  };

  const abrirModalInsertar=()=>{
    setProveedorSeleccionado(null);
    setModalInsertar(true);
  }

  const insertar=()=>{
    var valorInsertar=proveedorSeleccionado;
    valorInsertar.id=data[data.length-1].id+1;
    var dataNueva=data;
    dataNueva.push(valorInsertar);
    setData(dataNueva);
    setModalInsertar(false);
  }
  return (
    <div className="App">
      <h2>Lista de Proveedores</h2>
      
      <br/>
      <button className='btn btn-success' onClick={()=>abrirModalInsertar(true)}>Insertar</button>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(elemento=>(
            <tr>
              <td>{elemento.id}</td>
              <td>{elemento.nombre}</td>
              <td>{elemento.email}</td>
              <td>
                <button className='btn btn-primary' onClick={()=>seleccionarProveedor(elemento,'Editar')}>Editar</button> {"   "}
                <button className='btn btn-danger' onClick={()=>seleccionarProveedor(elemento,'Eliminar')}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalEditar}>
        <ModalHeader>
            <div>
              <h3>Editar Proveedor</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <div className='form-group'>
              <label>ID</label>
              <input 
              className='form-control'
              readOnly
              type='text'
              name='id'
              value={proveedorSeleccionado && proveedorSeleccionado.id}
              />
              <br/>
              <label>Proveedor</label>
              <input 
              className='form-control'
              type='text'
              name='nombre'
              value={proveedorSeleccionado && proveedorSeleccionado.nombre}
              onChange={handleChange}
              />
              <br/>

              <br/>
              <label>Email</label>
              <input 
              className='form-control'
              type='text'
              name='email'
              value={proveedorSeleccionado && proveedorSeleccionado.email}
              onChange={handleChange}
              />
              <br/>
            </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>editar()}>
            Actualizar
          </button>
          <button className='btn btn-danger'
            onClick={()=>setModalEditar(false)}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estas seguro que deseas eliminar el Proveedor {proveedorSeleccionado && proveedorSeleccionado.nombre}
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>eliminar()}>
            Si
          </button>
          <button className='btn btn-secondary'
            onClick={()=>setModalEliminar(false)}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
              <ModalHeader>
                  <div>
                    <h3>Insertar Proveedor</h3>
                  </div>
              </ModalHeader>
              <ModalBody>
                  <div className='form-group'>
                    <label>ID</label>
                    <input 
                    className='form-control'
                    readOnly
                    type='text'
                    name='id'
                    value={data[data.length-1].id+1}
                    
                    />
                    <br/>
                    <label>Proveedor</label>
                    <input 
                    className='form-control'
                    type='text'
                    name='nombre'
                    value={proveedorSeleccionado?proveedorSeleccionado.nombre:''}
                    onChange={handleChange}
                    
                    />
                    <br/>

                    <br/>
                    <label>Email</label>
                    <input 
                    className='form-control'
                    type='text'
                    name='email'
                    value={proveedorSeleccionado?proveedorSeleccionado.correo:''}
                    onChange={handleChange}
                    />
                    <br/>
                  </div>
              </ModalBody>
              <ModalFooter>
                <button className='btn btn-primary' onClick={()=>insertar()}>
                  Actualizar
                </button>
                <button className='btn btn-danger'
                  onClick={()=>setModalInsertar(false)}>
                  Cancelar
                </button>
              </ModalFooter>
            </Modal>
            
          </div>
  );
}

export default App;
