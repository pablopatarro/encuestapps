import React, { useState, useEffect } from 'react';
import { AppBar, Box,Collapse , Button, Toolbar, Typography } from '@mui/material';
import {Link} from 'react-router-dom';
import { Divide as Hamburger } from 'hamburger-react';

export default function BarraNav({datosNavBar}) {
    const [datos, setDatos] = useState({listaItem:[],url:"",titulo:""});
    const [open, setOpen] = useState(false);

    //Para controlar la visibilidad de las opciones de la barra de navegación.
    const handleMenuToggle = () => {
      setOpen(!open);
    };

    useEffect(()=>{
        async function fechtDatos(nombreFicheroDatos){
            let respuesta = await fetch("./json/"+nombreFicheroDatos);
            if(respuesta.ok)
            {
                let resultado = await respuesta.json();
                setDatos(resultado);
            }
        }

        fechtDatos(datosNavBar);
    },[datosNavBar]);


  return (
    <Box sx={{ display: 'flex' }}>
    <AppBar component="nav">
        <Toolbar sx={{ display: 'inline-flex', flexWrap: 'wrap' }}>
        <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'absolute', right: 0 }}>
            <Hamburger toggled={open} toggle={setOpen} />
        </Box>

        <Typography variant="h4" component="div" sx={{ display: { xs: 'block', sm: 'inline-flex' }, marginLeft: { sm: '20px' } }}>
            <Link key={"0"}  to={datos.url} style={{ color: 'white', textDecoration: 'none' }}>
            {datos.titulo}
            </Link>
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {datos.listaItem.map((navLink) => (
            <Link key={navLink.id} to={navLink.url} style={{ color: 'black', marginInline: '16px', textDecoration: 'none', fontFamily: 'Arial' }}>
                {navLink.titulo}
            </Link>
            ))}
        </Box>

        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Collapse in={open} sx={{ width: '100%' }}>
            {datos.listaItem.map((navLink) => (
                <Link
                key={navLink.id}
                to={navLink.url}
                onClick={handleMenuToggle}
                style={{ color: 'black', marginInline: '16px', textDecoration: 'none', fontFamily: 'Arial' }}
                >
                {navLink.titulo}
                </Link>
            ))}
            </Collapse>
        </Box>
        </Toolbar>
    </AppBar>
    </Box>
  );
}

