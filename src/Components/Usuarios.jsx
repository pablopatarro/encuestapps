import { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import funciones from "../Firebase_setup/Conexion";
import MostrarCard from "./MostrarCard";
import VentanaModal from "./VentanaModal";
import ObjetoMensajes from "../Config/Mensajes";

export default function Usuarios() {
    //Recuperar los usuarios de la base de datos, mostrarlos en cards y añadir un botón que permita crear usuarios a través de un formulario. 
    const [usuarios, setUsuarios] = useState([]);
    const [deletedUserId, setDeletedUserId] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalTipo, setModalTipo] = useState("");
    //Funciones para mostrar y cerrar la ventana modal.
    const mostrarModal = (mensaje, tipo) => {
        setModalText(mensaje);
        setModalTipo(tipo);
        setOpenModal(true);
    };
    const handleClose = () => {
        setOpenModal(false);
    };
    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await funciones.getUsuarios();
            if (response.success) {
                setUsuarios(response.usuarios);
            }
        }
        
        if(deletedUserId)
        {
            mostrarModal(ObjetoMensajes.MSG_USUARIO_BORRADO, ObjetoMensajes.OPTION_CONFIRMACION);
        }
        fetchUsuarios();
    }, [deletedUserId]);


    return (
        <>
            <Container maxWidth="lg">
                <Grid container>
                    {usuarios.map((usuario) => {
                        if (usuario.rol !== "A")
                            return (
                                <Grid item xs={12} sm={6} md={4} key={usuario.id}>
                                    <MostrarCard idUsuario={usuario.id} usuario={usuario} admin={true} setDeletedUserId={setDeletedUserId} />
                                </Grid>);
                        else return (<></>);
                    }
                    )}
                </Grid>
                <VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />            </Container>
        </>
    );
}