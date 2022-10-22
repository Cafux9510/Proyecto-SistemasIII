// import { useEffect, useState,useRef } from "react";
// import {supabase} from "../Backend/client";
// import MaterialTable from "@material-table/core";
// import { Button } from "@material-ui/core";
// import {Modal,TextField} from "@material-ui/core"
// import {makeStyles} from "@material-ui/core/styles"
// import swal from "sweetalert";
// import styled from '@emotion/styled'
// import { Link } from "react-router-dom";
// import { Toast } from 'primereact/toast';
// import MenuBookIcon from '@mui/icons-material/MenuBook';



// const AsistenciaXCurso = () => {
   


//   return (
//     <Main>
//         <Titulo>CURSO</Titulo>
//         <h2>profesor</h2>
//         <h2>horarios</h2>   
//         <h3>fecha</h3>
//         <br />
//         <Container>
//             <Tabla>
//             <Grid container spacing={2} justifyContent="center" alignItems="center">
//       <Grid item>{customList(left)}</Grid>
//       <Grid item>
//         <Grid container direction="column" alignItems="center">
//           <Button
//             sx={{ my: 0.5 }}
//             variant="outlined"
//             size="small"
//             onClick={handleAllRight}
//             disabled={left.length === 0}
//             aria-label="move all right"
//           >
//             ≫
//           </Button>
//           <Button
//             sx={{ my: 0.5 }}
//             variant="outlined"
//             size="small"
//             onClick={handleCheckedRight}
//             disabled={leftChecked.length === 0}
//             aria-label="move selected right"
//           >
//             &gt;
//           </Button>
//           <Button
//             sx={{ my: 0.5 }}
//             variant="outlined"
//             size="small"
//             onClick={handleCheckedLeft}
//             disabled={rightChecked.length === 0}
//             aria-label="move selected left"
//           >
//             &lt;
//           </Button>
//           <Button
//             sx={{ my: 0.5 }}
//             variant="outlined"
//             size="small"
//             onClick={handleAllLeft}
//             disabled={right.length === 0}
//             aria-label="move all left"
//           >
//             ≪
//           </Button>
//         </Grid>
//       </Grid>
//       <Grid item>{customList(right)}</Grid>
//     </Grid>
//             </Tabla>
//             <BotonesAccion>
//                 <Button className="itemBoton" variant="contained" startIcon={<MenuBookIcon />}>
//                     Registrar Asistencia
//                 </Button>
                
//                 <Button className="itemBoton" variant="outlined" startIcon={<MenuBookIcon />}>
//                     Volver Atrás
//                 </Button>
//             </BotonesAccion>
            
        
        
          
//         </Container>
        
//     </Main>
//   )
// }


 
// export default AsistenciaXCurso