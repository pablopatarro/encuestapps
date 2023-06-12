import { Button, TextField, Grid, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ObjetoVariables from "../Config/Variables";
import ObjetoMensajes from "../Config/Mensajes";
import VentanaModal from "./VentanaModal";
import funciones from "../Firebase_setup/Conexion";

export default function FormularioInicio() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Estados de la ventana modal.
    const [openModal, setOpenModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalTipo, setModalTipo] = useState("");
    //Funciones para mostrar y cerrar la ventana modal.
    function mostrarModal(mensaje, tipo) {
        setModalText(mensaje);
        setModalTipo(tipo);
        setOpenModal(true);
    }
    const handleClose = () => {
        setOpenModal(false);
    };

    //Navegación
    const navigation = useNavigate();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Comprobaciones de que los campos no esten vacios, el correo sea válido y la contraseña tenga el formato correcto.
        if (email === "" || password === "") {
            mostrarModal(ObjetoMensajes.MSG_CAMPOS_OBLIGATORIOS, ObjetoMensajes.OPTION_ERROR);
        }
        else {
            if (funciones.validarEmail(email)) {
                if (funciones.validarContrasena(password)) {
                    //Enviamos los datos al servidor...
                    let datosEnviar = { email, password };

                    let respuesta = await funciones.login(datosEnviar);

                    if (respuesta.success) {
                        //Almacenamos el id del usuario en la variable de sesión y navegamos al usuario.
                        sessionStorage.setItem('idUsuarioSesion', respuesta.id);
                        navigation(ObjetoVariables.ROUTE_USUARIO + respuesta.id);
                    }
                    else {
                        mostrarModal(respuesta.message, ObjetoMensajes.OPTION_ERROR)
                    }
                }
                else {
                    mostrarModal(ObjetoMensajes.MSG_CONTRASEÑA_INVALIDA, ObjetoMensajes.OPTION_ERROR)
                }
            }
            else {
                mostrarModal(ObjetoMensajes.MSG_CORREO_INVALIDO, ObjetoMensajes.OPTION_ERROR);
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ margin: '70px auto auto auto' ,backgroundColor: "#D1C4E9" ,borderRadius: "5px" }} >
            <Typography component="h1" variant="h4" align="center">
                Inicio de sesión
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container sx={{ margin: 'auto auto auto auto' }}>
                    <Grid item xs={12} sm={12} sx={{ marginBottom: '5px' }}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ marginBottom: '5px' }}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ marginBottom: '5px' }}>
                        <Typography>
                            <i>Los campos marcados con * son obligatorios</i>
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ justifyContent: 'center', display: 'flex' }}>
                        <Button id="botonLogin" type="submit" variant="contained" sx={{ color: 'black', backgroundColor: "#a5d6a7", "&:hover": { color: 'black', backgroundColor: "#ffcc80" }, width: '50%', margin: '10px auto ' }}>Iniciar sesión</Button>
                    </Grid>
                </Grid>

            </form>
            <VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />

        </Container>
    );
};
