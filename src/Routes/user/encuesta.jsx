import { useLocation, useParams } from "react-router-dom"
import RealizarEncuesta from "../../Components/RealizarEncuesta"
import { useEffect, useState } from "react";
import funciones from "../../Firebase_setup/Conexion";
import { Box, Button, Typography } from "@mui/material";

export default function Encuesta() {
	const location = useLocation();
	const { idEncuesta } = useParams();
	//Usamos un parámetro oculto para saber si la visualización de la encuesta la está haciendo un usuario registrado o uno externo.
	const  [rol,setRol] = useState (location.state?location.state.rol:"");

	const [encuestaActual, setEncuestaActual] = useState(null);
	const [encuestaInexistente, setEncuestaInexistente] = useState(false);
	//Debería comprobrar primero que el id que se pasa existe en la base de datos...
	// Si existe, hay que comprobar si la encuesta está finalizada. 
	// Si está finalizada, no se puede responder. Se le dice al usuario.
	useEffect(() => {
		const obtenerEncuesta = async (idEncuesta) => {

			// Llamar a la función para recuperar la encuesta por su ID
			const response = await funciones.recuperarEncuesta(idEncuesta);
			//	Si la encuesta no es null ni undefined, se cambia el estado.
			if (response.success) {
				if (validarFechaFinalizacion(response.encuesta.fechaFinalizacion)) {
					setEncuestaActual(response.encuesta);
				} else {
					response.encuesta.finalizada = true;
					setEncuestaActual(response.encuesta);
				}
			}
			else {
				setEncuestaInexistente(true);
			}
		};

		obtenerEncuesta(idEncuesta);
	}, [idEncuesta]);

	if (encuestaInexistente) {
		// Si la petición a la base de datos va mal...
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<Typography variant="h4">La encuesta a la que intenta acceder no existe</Typography>
			</Box>
		);
	}

	if (!encuestaActual) {
		// Mostrar mensaje de carga mientras se obtiene la encuesta
		return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<Typography variant="h4">Cargando encuesta...</Typography>
		</Box>;
	}

	// Comprobar si la encuesta está finalizada.
	if (encuestaActual.finalizada) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh', // Ajustar la altura al 100% del viewport
				}}>
				<Typography variant="h4">Esta encuesta está finalizada y no se puede responder.</Typography>
				{rol === "U" &&
					<Button variant="contained" sx={{ marginTop: '1rem' }} color="secondary" onClick={() => window.history.back()}>
						Volver
					</Button>}
			</Box>

		);
	}

	// Renderizar el componente RealizarEncuesta. Solo se hace si la encuesta existe y no está finalizada.
	return (
		<div>
			<RealizarEncuesta encuesta={encuestaActual} rol={rol} />
		</div>
	);
}

const validarFechaFinalizacion = (fechaFinalizacion) => {
	// Obtener la fecha actual en formato yyyy-mm-dd
	const fechaActual = new Date().toISOString().split("T")[0];
	// Comparar las fechas. Si la fecha de finalización es posterior o igual a la fecha actual,
	// se devuelve true.
	return (fechaFinalizacion >= fechaActual)
};