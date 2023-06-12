import { useEffect, useState } from "react";
import funciones from "../Firebase_setup/Conexion";
import MostrarCard from "./MostrarCard";


export default function PerfilUsuario({idUsuario}) {
    //Se muestra la información del usuario actual.
    // Aquí recuperamos al usuario actual entero, como objeto y se lo pasamos al componente card para que lo muestre.
    const [usuarioActual, setUsuarioActual] = useState({});

    useEffect(() => {
        const obtenerUsuario = async (idUsuario) => {
            const response = await funciones.getUsuario(idUsuario);
            if (response.success) {
                setUsuarioActual(response.userData);
            } 
        }

        obtenerUsuario(idUsuario);
    }, [idUsuario]);

    return (
        <>
            <MostrarCard idUsuario={idUsuario} usuario={usuarioActual}/>
        </>
    )
}