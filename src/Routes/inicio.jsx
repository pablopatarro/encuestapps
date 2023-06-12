import BarraNav from "../Components/BarraNav";
import FormularioInicio from "../Components/FormularioInicio";

export default function Inicio(){
    //Ruta para mostrar el formulario de registro.
    return(
        <div>
            <BarraNav datosNavBar={"datos.json"}/>
            <FormularioInicio />
        </div>
    )
    
}