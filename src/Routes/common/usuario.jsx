import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ObjetoVariables from "../../Config/Variables";
import Redireccion from "../../Components/Redireccion";
import BarraUsuario from "../../Components/BarraUsuario";
import BienvenidaUsuario from "../../Components/BienvenidaUsuario";
import funciones from "../../Firebase_setup/Conexion";

export default function Usuario() {
  //Se usa useParams para obtener los parámetros de la ruta.
  //Guardamos el id del usuario que se acaba de registrar en la variable id.
  const { idUsuario } = useParams();
  const [redirigir, setRedirigir] = useState(null);
  const [usuarioSesion] = useState(sessionStorage.getItem("idUsuarioSesion"));
  const [usuarioActual, setUsuarioActual] = useState({});
  useEffect(() => {

    if (!usuarioSesion || idUsuario !== usuarioSesion) {
      setRedirigir(true);
      return;
    }

    const obtenerUsuario = async (idUsuario) => {
      const response = await funciones.getUsuario(idUsuario);
      if (response.success) {
        setUsuarioActual(response.userData);
      }
    }

    obtenerUsuario(idUsuario);
  }, [idUsuario, usuarioSesion]);

  return (
    <div>
      {(idUsuario === usuarioSesion) && (
        // Barra de navegación con lo que quiero mostrar del usuario.
        <>
          <BarraUsuario idUsuario={idUsuario} />
          <BienvenidaUsuario rol={usuarioActual.rol} /> 
        </>
      )}
      {redirigir && (
        //Si se intenta acceder sin logear desde la url, se redirige a la pagina home.
        <Redireccion tiempo={ObjetoVariables.TIEMPO_REDIRECCION} />
      )}
    </div>
  );
}