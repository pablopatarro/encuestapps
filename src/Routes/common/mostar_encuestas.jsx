import { useParams } from "react-router-dom";
import BarraUsuario from "../../Components/BarraUsuario";
import TablaEncuestas from "../../Components/TablaEncuestas";
import Redireccion from "../../Components/Redireccion";
import ObjetoVariables from "../../Config/Variables";

export default function MostrarEncuestas() {
    const { idUsuario } = useParams();

    return (
        idUsuario === sessionStorage.getItem("idUsuarioSesion") ?
            (
                <>
                    <BarraUsuario idUsuario={idUsuario} />
                    <TablaEncuestas idUsuario={idUsuario} />
                </>
            ) :
            (<>
                <Redireccion tiempo={ObjetoVariables.TIEMPO_REDIRECCION} />
            </>)
    );
}