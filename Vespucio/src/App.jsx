import { BrowserRouter,Routes,Route} from "react-router-dom";
import Inicio from "./componentes/Inicio";
import Pagos from "./componentes/Pagos"
import Insumos from "./componentes/Insumos"
import Comprobantes from "./componentes/Comprobantes"
import Navbar from './componentes/Navbar'
import TablaProveedores from "./componentes/TablaProveedores";
function App() {


  return (
    <BrowserRouter>
      <Navbar/>
        <Routes>
        <Route exact path="/" element={<Inicio/>}/>
        <Route exact path="/inicio" element={<Inicio/>}/>
        <Route exact path="/comprobantes" element={<Comprobantes/>}/>
        <Route exact path="/insumos" element={<Insumos/>}/>
        <Route exact path="/TablaProveedores" element={<TablaProveedores/>}/>
        <Route exact path="/pagos" element={<Pagos/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App