import { useState, useEffect } from "react";
import { Button, Container, Grid, TextField, Typography, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ObjetoVariables from "../Config/Variables";
import ObjetoMensajes from "../Config/Mensajes";
import VentanaModal from "./VentanaModal";
import funciones from "../Firebase_setup/Conexion";
import "../estilos.css";
export default function FormularioRegistro() {
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [idUsuario, setIdUsuario] = useState(undefined);
    //Estados de la ventana modal.
    const [openModal, setOpenModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalTipo, setModalTipo] = useState("");

    //Función para mostrar la ventana modal.
    function mostrarModal(mensaje, tipo) {
        setModalText(mensaje);
        setModalTipo(tipo);
        setOpenModal(true);
    }

    //Creamos la navegación.
    const navigation = useNavigate();

    useEffect(() => {
        // solo se ejecuta la navegación cuando la ventana modal se ha mostrado
        if (idUsuario !== undefined && !openModal) {
            navigation(ObjetoVariables.ROUTE_USUARIO + idUsuario);
        }
    }, [idUsuario, openModal]);


    //Asignaciones a los estados...
    const handleNombreEmpresaChange = (event) => {
        setNombreEmpresa(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmarPasswordChange = (event) => {
        setConfirmarPassword(event.target.value);
    };

    //Para cerrar la ventana modal.
    const handleClose = () => {
        setOpenModal(false);
    };

    const handleRegistro = async (e) => {

        e.preventDefault();
        // Hacemos comprobaciones de que los campos no esten vacios, el correo sea válido: "cualquiercosa@loquesea.algo"
        // y las contraseñas coincidan. Hacemos también las mismas comprobaciones en el servidor.
        if (nombreEmpresa === "" || email === "" || password === "" || confirmarPassword === "") {
            mostrarModal(ObjetoMensajes.MSG_CAMPOS_OBLIGATORIOS, ObjetoMensajes.OPTION_ERROR);
        }
        else {
            if (funciones.validarEmail(email)) {
                if (funciones.validarContrasena(password)) {
                    if (password === confirmarPassword) {
                        //Enviamos los datos al servidor...
                        let datosEnviar = { nombreEmpresa, email, password };
                        // let respuesta = await fetch(ObjetoVariables.URL_API_REGISTRO,{
                        //                 method:"POST",
                        //                 headers:{
                        //                     "Content-Type":"application/json"
                        //                 },
                        //                 body:JSON.stringify(datosEnviar)
                        //                 });
                        let respuesta = await funciones.registro(datosEnviar);
                        if (respuesta.success) {

                            // console.log(resultado);
                            //Dependiendo de la respuesta, se mostrará una ventana modal con el resultado de la petición.
                            //Se usa useNavigation para hacer la navegación entre rutas.
                            mostrarModal(respuesta.message, ObjetoMensajes.OPTION_CONFIRMACION);
                            sessionStorage.setItem('idUsuarioSesion', respuesta.id);
                            setIdUsuario(respuesta.id);

                        }
                        else {
                            //alert("Error al enviar los datos al servidor: "+resultado.message);
                            mostrarModal(respuesta.message, ObjetoMensajes.OPTION_ERROR)
                        }


                    }
                    else {
                        //alert("Las contraseñas no coinciden");
                        mostrarModal(ObjetoMensajes.MSG_CONTRASEÑAS_DISTINTAS, ObjetoMensajes.OPTION_ERROR);

                    }
                }
                else {
                    // alert("La contraseña debe tener 8 carácteres y contener una letra minúscula, "
                    //     +"una mayúscula, un número y un carácter especial:  #$%&*+-/=?^_`{|}~ \n"+
                    //     "Un ejemplo de contraseña válida es: Pass$123")
                    mostrarModal(ObjetoMensajes.MSG_CONTRASEÑA_INVALIDA, ObjetoMensajes.OPTION_ERROR);
                }

            }
            else {
                // alert("El formato de correo no es válido. Un formato válido es: correodeejemplo@ejemplo.com");
                mostrarModal(ObjetoMensajes.MSG_CORREO_INVALIDO, ObjetoMensajes.OPTION_ERROR);
            }
        }
    };



    return (
        <Container maxWidth="sm" sx={{ margin: '70px auto auto auto' ,backgroundColor: "#D1C4E9" ,borderRadius: "5px" }} >
            <Typography component="h1" variant="h4" align="center" >
                Registro de usuario
            </Typography>
            <form onSubmit={handleRegistro}>
                <Grid container sx={{ margin: 'auto auto auto auto' }}>
                    <Grid item xs={12} sm={12} sx={{ marginBottom: '5px' }}>
                        <TextField
                            autoComplete="fname"
                            name="name"
                            variant="outlined"
                            required
                            fullWidth
                            id="name"
                            label="Nombre empresa"
                            value={nombreEmpresa}
                            onChange={handleNombreEmpresaChange}
                        />
                    </Grid>
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
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="repeat_password"
                            label="Repetir contraseña"
                            type="password"
                            id="repeat_password"
                            autoComplete="current-password"
                            value={confirmarPassword}
                            onChange={handleConfirmarPasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ marginBottom: '5px' }}>
                        <Typography>
                            <i>Los campos marcados con * son obligatorios</i>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ justifyContent: 'center', display: 'flex' }}>
                        <Button id="botonRegistrar" type="submit" variant="contained" sx={{ color: 'black', backgroundColor: "#90caf9", "&:hover": { color: "white", backgroundColor: "#ba68c8" }, width: '50%', margin: '10px auto' }}>Registrarse</Button>
                    </Grid>
                </Grid>

            </form>
            <VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />
        </Container>
    );
}
