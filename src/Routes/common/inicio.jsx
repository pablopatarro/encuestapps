import BarraNav from "../../Components/BarraNav";
import FormularioInicio from "../../Components/FormularioInicio";
import ObjetoVariables from "../../Config/Variables";

export default function Inicio() {
    //Ruta para mostrar el formulario de registro.
    return (
        <>
            <BarraNav datosNavBar={ObjetoVariables.DATOS_CARGAR_NAVBAR} />
            <FormularioInicio />
        </>
    )

}