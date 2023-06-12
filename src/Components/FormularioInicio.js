import { Button, TextField,Grid,Container,Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from 'react-router-dom';

export default function FormularioInicio() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Comprobaciones de que los campos no esten vacios, el correo sea válido y la contraseña tenga el formato correcto.
        if (email === "" || password === "") {
            alert("Todos los campos son obligatorios");
        }
        else
        {
            if(comprobarCorreoConRegexp(email)){
                if (comprobarContrasena(password))
                {
                    //Enviamos los datos al servidor...
                    let datosEnviar = {email,password};
                    let respuesta = fetch("http://localhost:8080/inicio",{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(datosEnviar)
                                });
                    
                    if (respuesta.ok){
                        let resultado = respuesta.json(); 
                        //Dependiendo de la respuesta, se mostrará una alerta con el resultado de la petición.
                    }
                    else{
                        alert("Error al enviar los datos al servidor: "+respuesta.status);
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
            Inicio de sesión
        </Typography>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
          
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
           
            <Grid item xs={12} sm={12} sx={{justifyContent:'center', display:'flex' }}>
                <Button type="submit" variant="contained" color="primary" sx={{ width: '50%', margin: 'auto'}}>Iniciar sesión</Button>
            </Grid>                
        </Grid>
            
        </form>
    </Container>
    );
};



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



    

