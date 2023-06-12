import { useState } from "react";
import {Button,Container,Grid,TextField,Typography,} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function FormularioRegistro() {
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    
    const navigation = useNavigate();
    
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

    const handleRegistro = (e) => {
        
        e.preventDefault();
        // Hacemos comprobaciones de que los campos no esten vacios, el correo sea válido: "cualquiercosa@loquesea.algo"
        // y las contraseñas coincidan. Hacemos también las mismas comprobaciones en el servidor.
        if (nombreEmpresa === "" || email === "" || password === "" || confirmarPassword === "") {
            alert("Todos los campos son obligatorios");
        }
        else{
            if(comprobarCorreoConRegexp(email)){
                if (comprobarContrasena(password))
                {
                    if(password===confirmarPassword)
                    {
                        //Enviamos los datos al servidor...
                        let datosEnviar = {nombreEmpresa,email,password};  
                        let respuesta = fetch("http://localhost:8080/registro",{
                                        method:"POST",
                                        headers:{
                                            "Content-Type":"application/json"
                                        },
                                        body:JSON.stringify(datosEnviar)
                                        });
                        
                        if (respuesta.ok){
                            let resultado = respuesta.json(); 
                            //Dependiendo de la respuesta, se mostrará una alerta con el resultado de la petición.
                            //Se usa useNavigation para hacer la navegación entre rutas.
                            navigation("/inicio");
                        }
                        else{
                            alert("Error al enviar los datos al servidor"+respuesta.status);
                        }
                       
    
                    }
                    else{
                        alert("Las contraseñas no coinciden");
                    }
                }
                else
                {
                    alert("La contraseña debe tener 8 carácteres y contener una letra minúscula, "
                        +"una mayúscula, un número y un carácter especial:  #$%&*+-/=?^_`{|}~ \n"+
                        "Un ejemplo de contraseña válida es: Pass$123")
                   
                }
              
            }
            else{
                alert("El formato de correo no es válido. Un formato válido es: correodeejemplo@ejemplo.com");
            }
        }
    };



    return (
        <Container maxWidth="sm" sx={{margin:'60px auto auto auto'}} >
            <Typography component="h1" variant="h4" align="center">
                Registro de usuario
            </Typography>
            <form onSubmit={handleRegistro}>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
                   <Typography>
                        <i>Los campos marcados con * son obligatorios</i>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} sx={{justifyContent:'center', display:'flex' }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ width: '50%', margin: 'auto'}}>Registrarse</Button>
                </Grid>                
        </Grid>
                
            </form>
        </Container>
      );
}
    


//Zona de definición de funciones de utilidad.
function comprobarCorreoConRegexp(email){
    //Escribe una funcion que compruebe si el correo es válido.
    //Ejemplo: "correo@ejemplo.com"
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(email);
}

function comprobarContrasena(password){
    //Escribe una funcion que compruebe si la contraseñae tiene 8 carácteres.
    //Además de añ menos un número,una mayúscula,una minúscula y un caracter especial #$%&*+-/=?^_`{|}~
    //Ejemplo: "PasS$123"

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
    
}
