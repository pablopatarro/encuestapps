import { Box, Button, Card, CardContent, Typography, useMediaQuery } from "@mui/material";

import "../estilos.css";
import ObjetoVariables from "../Config/Variables";
import { useNavigate } from "react-router-dom";

export default function Bienvenida(){
// Este componente es para mostrar algo en la página principal de la app.
// Contiene un texto con una animación y dos botones. Uno para registrarse y otro para hacer login.
// Se añaden 3 cards para explicar para qué sirve la app.
    const isMobile = useMediaQuery('(max-width: 600px)');
    const navigate = useNavigate();
    
    return (
        <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        flexDirection="column"
        sx={{
            width: "100%",
            maxWidth: "1000px",
            margin: "50px auto",
            textAlign: "center"
        }}
        >
            <Typography variant="h2" sx={{ fontWeight: "bold", mb: 3, fontSize: {xs: "2rem", sm: "3rem"},  animation: "float 5s ease-in-out infinite" }}>
                ¡Bienvenido/a a nuestra plataforma de encuestas online!
            </Typography>
            {/* Zona de botones. */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{flexWrap: "wrap", flexDirection: {xs: "column",sm: "row"}}}
            >
                <Button
                // Navegación al registro cuando se hace click.
                    onClick={() => navigate(ObjetoVariables.ROUTE_REGISTRO)}
                    id="botonRegistro"
                    variant="contained"
                    sx={{ backgroundColor: "#90caf9", "&:hover": { color: "white",backgroundColor: "#ba68c8" }, mb: 2, mr: {xs: 0, sm: 2}, color: "#000000"}}
                >
                Registrarse
                </Button>
                <Button
                // Navegación al login cuando se hace click.
                    onClick={() => navigate(ObjetoVariables.ROUTE_LOGIN)}
                    id="botonLogin"
                    variant="contained"
                    sx={{ backgroundColor: "#a5d6a7", "&:hover": { backgroundColor: "#ffcc80" }, mb: 2, color: "#000000" }}
                >
                Iniciar sesión
                </Button>
            </Box>

            {/* Zona de los cards */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        display: 'grid',
                        gap: '16px',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    }}
                    >
                    <Card sx={{ backgroundColor: '#cce6ff' }}>
                        <CardContent>
                        <Box sx={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={"/images/createSurvey.png"} alt="logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Box>
                        <Typography variant="h6" sx={{ mt: 2 }}>Registrate y crea tu propia encuesta</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ backgroundColor: '#cce6ff' }}>
                        <CardContent>
                        <Box sx={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={"/images/sendSurvey.png"} alt="logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Box>
                        <Typography variant="h6" sx={{ mt: 2 }}>Envíala a un grupo de contactos</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ backgroundColor: '#cce6ff' }}>
                        <CardContent>
                        <Box sx={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={"/images/graph.png"} alt="logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Box>
                        <Typography variant="h6" sx={{ mt: 2 }}>Obtén y analiza los resultados</Typography>
                        </CardContent>
                    </Card>
                    </Box>
            </Box>
        </Box>
      );
}