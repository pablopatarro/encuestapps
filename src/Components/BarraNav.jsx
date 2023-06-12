import React, { useState, useEffect } from 'react';
import { AppBar, Box, Collapse, Button, Toolbar, Typography, Icon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Divide as Hamburger } from 'hamburger-react';
import ObjetoVariables from '../Config/Variables';

export default function BarraNav({ datosNavBar }) {
    const [datos, setDatos] = useState({ listaItem: [], url: "", titulo: "" });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    //Para controlar la visibilidad de las opciones de la barra de navegación en tamaño móvil.
    const handleMenuToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        async function fechtDatos(nombreFicheroDatos) {
            let respuesta = await fetch(ObjetoVariables.DIR_JSON + nombreFicheroDatos);
            if (respuesta.ok) {
                let resultado = await respuesta.json();
                setDatos(resultado);
            }
        }

        fechtDatos(datosNavBar);
    }, [datosNavBar]);


    return (
        <Box sx={{ display: 'flex' }} >
            <AppBar component="nav" sx={{ backgroundColor: "#6b7dc7" }}>
                <Toolbar sx={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'absolute', right: 0 }}>
                        <Hamburger toggled={open} toggle={setOpen} />
                    </Box>
                    <Icon sx={{ height: 50, width: 50 }}>
                        <img src={"./images/iconoApp.png"} alt="Icono de la app" style={{ objectFit: 'scale-down', height: '100%' }} />
                    </Icon>
                    <Typography variant="h4" component="div" sx={{ display: { xs: 'block', sm: 'inline-flex' }, marginLeft: { sm: '20px' } }}>
                        <Link key={"0"} to={datos.url} style={{ color: 'white', textDecoration: 'none' }}>
                            {datos.titulo}
                        </Link>
                    </Typography>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {/* Donde se rellena la barra de navegación */}
                        {datos.listaItem.map((navLink) => (
                            <Button key={navLink.id} onClick={() => { navigate(navLink.url) }} sx={{ color: 'black', '&:hover': { color: 'white' }, marginInline: '16px', textDecoration: 'none', fontFamily: 'Arial' }}>
                                {navLink.titulo}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <Collapse in={open} sx={{ width: '100%' }}>
                            {datos.listaItem.map((navLink) => (
                                <Button key={navLink.id} onClick={() => { navigate(navLink.url) }} sx={{ color: 'black', '&:hover': { color: 'white' }, marginInline: '16px', textDecoration: 'none', fontFamily: 'Arial' }}>
                                    {navLink.titulo}
                                </Button>
                            ))}
                        </Collapse>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

