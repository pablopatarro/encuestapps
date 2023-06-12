import { useParams } from "react-router-dom";
import MostrarAnalisis from "../../Components/MostrarAnalisis";
import Redireccion from "../../Components/Redireccion";
import ObjetoVariables from "../../Config/Variables";
export default function ResultadoEncuesta() {
    const { idUsuario, idEncuesta } = useParams();


    return (
        idUsuario === sessionStorage.getItem("idUsuarioSesion") ?
            (<MostrarAnalisis idEncuesta={idEncuesta} />) :
            (<Redireccion tiempo={ObjetoVariables.TIEMPO_REDIRECCION} />)

    );
}