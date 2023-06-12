import { AppBar, Box, Button, Collapse, Icon, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Hamburger from "hamburger-react";
import funciones from "../Firebase_setup/Conexion";

export default function BarraUsuario({ idUsuario }) {
    const [datosUsuario, setDatosUsuario] = useState(null)
    const [open, setOpen] = useState(false);
    const navigation = useNavigate();

    //Recuperamos los datos del usuario actual para usarlos cuando sea necesario.
    useEffect(() => {
        const fetchUsuario = async () => {

            const response = await funciones.getUsuario(idUsuario);

            if (response.success) {
                //guardamos los datos del usuario en la variable de estado.
                setDatosUsuario(response.userData);
            }
        };
        fetchUsuario();

    }, [idUsuario]);


    //Recibo el id del usuario por prop y debo mostrar una barra de navegación con "Mi Perfil","Mis encuestas"
    // "Mostrar todo" y "Cerrar sesión".
    //Dependiendo de si el usuario que entra es Administrador o Usuario, se deberían mostrar diferentes cosas en la barra.

    const cerrarSesion = () => {
        const confirmacion = window.confirm('¿Está seguro de que desea cerrar sesión?');
        if (confirmacion) {
            // Borrar la variable de sessionStorage que hace referencia al idUsuario actual
            sessionStorage.removeItem('idUsuarioSesion');
            // Redirigir a la ruta "/"
            navigation('/');

        }
    }

    // Si los datos del usuario aún no se han cargado, mostrar null
    if (!datosUsuario) {
        return null;
    }

    return (
        <div>
            { /* Si los datos del usuario no son null o undefined, se muestra la barra de navegación.   */
                datosUsuario ? (
                    <AppBar position="static" sx={{ backgroundColor: '#6b7dc7' }}>
                        <Toolbar>
                            <Icon sx={{ height: 50, width: 50, marginRight: 1 }}>
                                <img src={"/images/iconoApp.png"} alt="Icono de la app" style={{ objectFit: 'scale-down', height: '100%' }} />
                            </Icon>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                ¡Bienvenido/a {datosUsuario.nombreEmpresa}!
                            </Typography>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>

                                {datosUsuario.rol === 'U' && (
                                    // las opciones que se muestran cuando el usuario tiene rol "U"
                                    <>
                                        <Button onClick={() => navigation(`/usuario/${idUsuario}/crear_encuesta`)} color="inherit">
                                            Crear encuesta
                                        </Button>
                                        <Button onClick={() => navigation(`/usuario/${idUsuario}/mostrar_encuestas`)} color="inherit">
                                            Mostrar encuestas
                                        </Button>
                                    </>
                                )}
                                {datosUsuario.rol === 'A' && (
                                    <>
                                        <Button color="inherit" onClick={() => navigation(`/usuario/${idUsuario}/crear_encuesta`)}>Crear encuesta</Button>
                                        <Button color="inherit" onClick={() => navigation(`/usuario/${idUsuario}/mostrar_encuestas`)}>Mostrar encuestas</Button>
                                        <Button color="inherit" onClick={() => navigation(`/usuario/${idUsuario}/mostrar_usuarios`)}> Usuarios</Button>                                    </>
                                )}
                                <Button onClick={() => navigation(`/usuario/${idUsuario}/perfil`)} color="inherit">Mi perfil</Button>
                                <Button onClick={cerrarSesion} color="inherit">Cerrar sesión</Button>
                            </Box>

                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <Collapse in={open} sx={{ width: '100%' }}>

                                    {datosUsuario.rol === 'U' && (
                                        // las opciones que se muestran cuando el usuario tiene rol "U"
                                        <>
                                            <Button onClick={() => navigation(`/usuario/${idUsuario}/crear_encuesta`)} color="inherit">
                                                Crear encuesta
                                            </Button>
                                            <Button onClick={() => navigation(`/usuario/${idUsuario}/mostrar_encuestas`)} color="inherit">
                                                Mostrar encuestas
                                            </Button>
                                        </>
                                    )}
                                    {datosUsuario.rol === 'A' && (
                                        <>
                                            <Button color="inherit" onClick={() => navigation(`/usuario/${idUsuario}/crear_encuesta`)}>Crear encuesta</Button>
                                            <Button color="inherit" onClick={() => navigation(`/usuario/${idUsuario}/mostrar_encuestas`)}>Mostrar encuestas</Button>
                                            <Button color="inherit" onClick={() => navigation(`/usuario/${idUsuario}/mostrar_usuarios`)}> Usuarios</Button>
                                        </>
                                    )}
                                    <Button onClick={() => navigation(`/usuario/${idUsuario}/perfil`)} color="inherit">Mi perfil</Button>
                                    <Button color="inherit">Cerrar sesión</Button>
                                </Collapse>
                            </Box>

                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                                    <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'absolute', right: 0 }}>
                                        <Hamburger toggled={open} toggle={setOpen} />
                                    </Box>
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </AppBar>
                )
                    :
                    (
                        <p>Cargando barra de navegación...</p>
                    )
            }
        </div>
    );
}