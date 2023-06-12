import { useParams } from "react-router-dom";
import BarraUsuario from "../../Components/BarraUsuario";
import FormularioCrearEncuesta from "../../Components/FormularioCrearEncuesta";
import Redireccion from "../../Components/Redireccion";
import ObjetoVariables from "../../Config/Variables";

export default function CrearEncuesta() {
    const { idUsuario } = useParams();
    return (
        idUsuario === sessionStorage.getItem("idUsuarioSesion") ?
            <>
                <BarraUsuario idUsuario={idUsuario} />
                <FormularioCrearEncuesta idUsuario={idUsuario} />
            </> 
            :
            <Redireccion tiempo={ObjetoVariables.TIEMPO_REDIRECCION} />

    );

}