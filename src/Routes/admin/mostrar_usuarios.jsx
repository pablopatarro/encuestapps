import { useParams } from "react-router-dom";
import Usuarios from "../../Components/Usuarios";
import BarraUsuario from "../../Components/BarraUsuario";
import Redireccion from "../../Components/Redireccion";
import ObjetoVariables from "../../Config/Variables";

export default function MostrarUsuarios() {
    //hay que hacer la comprobación de que el usuario es el que está guardado en la variable de sesion
    const { idUsuario } = useParams();
    
    return (
        idUsuario === sessionStorage.getItem("idUsuarioSesion") ?
            (
                <>
                    <BarraUsuario idUsuario={idUsuario} />
                    <Usuarios />
                </>
            ) :
            (<>
                <Redireccion tiempo={ObjetoVariables.TIEMPO_REDIRECCION} />
            </>)
    );


}