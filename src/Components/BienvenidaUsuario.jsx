import { Container, Typography, Box, List } from '@mui/material';

export default function BienvenidaUsuario({ rol }) {

    //Componente que se muestra para informar al usuario de lo que puede hacer una vez que está dentro 
    // de la aplicación.
    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                <Typography variant="h4" align="center" sx={{ margin: '20px 10px' }}>
                    Aquí tienes acceso a las siguientes opciones y funcionalidades:
                </Typography>
                {rol === 'U' ? (
                    <List sx={{ textAlign: 'center', padding: '0' }}>
                        <Typography variant='h5'>
                            · Crear encuestas
                        </Typography>
                        <Typography variant='h5'>
                            · Visualizar todas las encuesta, consultarlas y borrarlas
                        </Typography>
                        <Typography variant='h5'>
                            · Puedes enviar tus encuestas a una lista de contactos por email y realizar un análisis de los resultados
                        </Typography>
                        <Typography variant='h5'>
                            · Consultar y modificar tus datos de usuario
                        </Typography>
                    </List>
                ) :
                    (
                        <List sx={{ textAlign: 'center', padding: '0' }}>
                            <Typography variant='h5'>
                                · Visualizar y crear usuarios
                            </Typography>
                            <Typography variant='h5'>
                                · Visualizar todas las encuesta, consultarlas y borrarlas
                            </Typography>
                            <Typography variant='h5'>
                                · Crear una encuesta y asignarla a un usuario
                            </Typography>
                            <Typography variant='h5'>
                                · Consultar y modificar tus datos de usuario
                            </Typography>
                        </List>
                    )
                }
            </Box>
        </Container>
    );
};