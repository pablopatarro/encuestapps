import FormularioRegistro from "../../Components/FormularioRegistro";
import BarraNav from "../../Components/BarraNav";
import ObjetoVariables from "../../Config/Variables";
export default function Registro() {
    //Ruta para mostrar el formulario de registro. 
    return (
        <div>
            <BarraNav datosNavBar={ObjetoVariables.DATOS_CARGAR_NAVBAR} />
            <FormularioRegistro />
        </div>
    )

}