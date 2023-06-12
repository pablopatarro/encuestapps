import BarraNav from "../../Components/BarraNav";
import Bienvenida from "../../Components/Bienvenida";
import ObjetoVariables from "../../Config/Variables";
export default function Home() {
    //En el home se muestra la barra de navegación e información sobre la app.
    return (
        <div>
            <BarraNav datosNavBar={ObjetoVariables.DATOS_CARGAR_NAVBAR} />
            <Bienvenida />
        </div>
    );
}