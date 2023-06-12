import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ObjetoVariables from "../Config/Variables";
export default function Redireccion({tiempo}){
    const [timeRemaining, setTimeRemaining] = useState(tiempo);
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
          setTimeRemaining((prev) => prev - 1);
        }, 1000);
    
        if (timeRemaining === -1) {
            //Cuando la cuenta llega a 0, navegamos al home. Podríamos navegar al registro o login también...
          navigate(ObjetoVariables.ROUTE_HOME);
        }

        return () => clearInterval(intervalId);
      }, [navigate, timeRemaining]);
    
      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
      };
    
      const calcularProgreso = () => {
        return  Math.floor((timeRemaining / tiempo) * 100)-100;
      };
    

      return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ backgroundColor: '#d7f9e9', borderRadius: '20px', p: '20px', maxWidth: '75%', mx: 'auto', textAlign: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ mb: '20px' }}>Usuario incorrecto. Será redirigido a la página principal.</Typography>
            <Typography variant="h2">{formatTime(timeRemaining)}</Typography>
            <Box sx={{ mt: '20px' }}>
            <CircularProgress variant="determinate" value={calcularProgreso()} />
            </Box>
        </Grid>
        </Box>

      );

}