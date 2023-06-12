import { useParams } from "react-router-dom";
import BarraUsuario from "../../Components/BarraUsuario";
import PerfilUsuario from "../../Components/PerfilUsuario";
import Redireccion from "../../Components/Redireccion";
import ObjetoVariables from "../../Config/Variables";

export default function Perfil() {
    const { idUsuario } = useParams();

    return (
        idUsuario === sessionStorage.getItem("idUsuarioSesion") ?
        (
            <>
                <BarraUsuario idUsuario={idUsuario}/>
                <PerfilUsuario idUsuario={idUsuario}/>
            </>
            ):
        ( <Redireccion tiempo={ObjetoVariables.TIEMPO_REDIRECCION} />)

    );
}