import { Button } from 'primereact/button';
// import "../estilos/gestionMateriaXProfesor.css";
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { Dropdown } from 'primereact/dropdown';


const MateriaXProfesor = () => {

 
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  
    const materias = [
        {label: 'Matematicas', value: 'Mat'},
        {label: 'Lengua', value: 'Leng'},
        {label: 'Fisica', value: 'Fis'},
        {label: 'Educacion Fisica', value: 'PE'},
        {label: 'Historia', value: 'Hist'}
    ];
  return (

        <div className="grid grid-nogutter surface-0 text-800 contenedor">
            <h1 className='h1Titulo'>titulo</h1>
            <br />
            <div className="grid grid-nogutter text-800 contenedor2">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center tabla ">
                    <div style={{ height: 400, width: '100%' }}>
                     <DataGrid
                         rows={rows}
                         columns={columns}
                         pageSize={5}
                         rowsPerPageOptions={[5]}
                         checkboxSelection
                     />
                    </div>
                </div>
                <div className="col-12 md:col-6 overflow-hidden botones">
                <Button label="Crear Tarea" icon="pi pi-book"  className="botonTarea"/>
                <Button label="Calificar Tarea" icon="pi pi-pencil" className="botonTarea"/>
                <Button label="Volver" className="p-button-secondary botonTarea"/>        
                </div>
            </div>
        </div>
    // <div className="main">
    //     <h1 className='h1Titulo'>titulo</h1>
    //     <br />
    //     <div className="grid grid-nogutter surface-0 text-800 contenedor">
        //     <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center tabla ">
        //         <div style={{ height: 400, width: '100%' }}>
        //             <DataGrid
        //                 rows={rows}
        //                 columns={columns}
        //                 pageSize={5}
        //                 rowsPerPageOptions={[5]}
        //                 checkboxSelection
        //             />
        //           </div>
        //     </div>
        //     <div className="col-12 md:col-6 overflow-hidden botones">
        //         <Button label="Submit" icon="pi pi-check" />
        //         <Button label="Submit" icon="pi pi-check" />
        //         <Button label="Secondary" className="p-button-secondary"/> 
        //     </div>
    //     </div>

    // </div>
    
    
  )
}
export default MateriaXProfesor
