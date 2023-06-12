import { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Container, Tooltip, } from '@mui/material';
import "../estilos.css";
import funciones from "../Firebase_setup/Conexion";
import { useNavigate } from "react-router-dom";
import VentanaModal from "./VentanaModal";
import ObjetoMensajes from "../Config/Mensajes";

export default function TablaEncuestas({ idUsuario }) {
	//Este componente muestra en una tabla todas las encuestas del usuario actual.
	//En cada fila de la tabla aparece el nombre de la encuesta, si está finalizada, el número de respuestas que se han dado 
	// y un botón por si se quiere borrar la encuesta de la base de datos.
	const [encuestas, setEncuestas] = useState(null);
	const navigation = useNavigate();

	//Estados de la ventana modal.
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const [modalTipo, setModalTipo] = useState("");
	//Funciones para mostrar y cerrar la ventana modal.
	const mostrarModal = (mensaje, tipo) => {
		setModalText(mensaje);
		setModalTipo(tipo);
		setOpenModal(true);
		return true;
	};
	const handleClose = () => {
		setOpenModal(false);
	};

	useEffect(() => {
		//Definición del método.
		const obtenerEncuestas = async (idUsuario) => {
			// Se llama a la función que se trae todas las encuestas asociadas al usuario pasado por parámetro.
			const response = await funciones.obtenerEncuestas(idUsuario);
			if (response.success) {
				const encuestasActualizadas = response.encuestas.map(encuesta => {
					if (!encuesta.finalizada && !validarFechaFinalizacion(encuesta.fechaFinalizacion)) {
						//Si la encuesta no está finalizada y la fecha de finalización es anterior a la actual
						// se marca como finalizada y se actualiza en la BD con el metodo finalizar encuesta.
						encuesta.finalizada = true;
						funciones.finalizarEncuesta(encuesta.id);
					}
					return encuesta;
				});

				setEncuestas(encuestasActualizadas);
			}
		};

		// Método que se ejecuta al entrar en el componente
		obtenerEncuestas(idUsuario);
	}, [idUsuario]);

	const borrarEncuesta = async (idEncuesta) => {

		const confirmacion = window.confirm('¿Está seguro de que desea borrar esta encuesta?');
		if (confirmacion) {
			// Realizar la solicitud Fetch para borrar la encuesta
			const response = await funciones.borrarEncuesta(idEncuesta);

			if (response.success) {
				// La encuesta se ha borrado correctamente
				// Actualizar la lista de encuestas después de borrar
				setEncuestas(encuestas.filter(encuesta => encuesta.id !== idEncuesta));
				mostrarModal(response.message, ObjetoMensajes.OPTION_CONFIRMACION);
			} else {
				// Hubo un error al borrar la encuesta
				mostrarModal(response.message, ObjetoMensajes.OPTION_ERROR);
			}
		}
	}

	const finalizarEncuesta = async (idEncuesta) => {
		//Hacemos que el atributo "finalizada" de la encuesta actual cambie a true. 
		//Esto sirve para bloquear que no se acepten más respuestas a la encuesta.
		const response = await funciones.finalizarEncuesta(idEncuesta);
		if (response.success) {
			//Si la respuesta es exitosa, se muestra un modal con el mensaje y se cambia el estado de la encuesta.
			mostrarModal(response.message, ObjetoMensajes.OPTION_CONFIRMACION);
			setEncuestas(encuestas.map(encuesta => encuesta.id === idEncuesta ? { ...encuesta, finalizada: true } : encuesta));
		}
		else {
			mostrarModal(response.message, ObjetoMensajes.OPTION_ERROR);
		}
	}

	const obtenerResultados = (idEncuesta) => {
		//Análisis de los resultados de la encuesta hasta el momento actual.
		//Se navega a la pantalla de resultados de la encuesta.
		navigation(`/usuario/${idUsuario}/resultados/${idEncuesta}`);
	}

	const enviarEncuesta = async (idEncuesta, bFinalizada) => {
		if (!bFinalizada) {
			//Cargar emails desde fichero CSV o Excel y mandar por correo..
			funciones.subirCorreosYMandar(idEncuesta);
		}
		else {
			mostrarModal(ObjetoMensajes.MSG_NO_ENVIAR_ENCUESTA, ObjetoMensajes.OPTION_ERROR);
		}
	}
	return (
		<>
			{!encuestas ? <p>Cargando encuestas...</p> : encuestas.length === 0 ? (
				<Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '85%', margin: '10px auto' }}>
					<h2>No existen encuestas actualmente</h2>
					<Button onClick={() => navigation(`/usuario/${idUsuario}/crear_encuesta`)}
						sx={{ marginX: 1, color: 'black', backgroundColor: 'lightgreen' }} variant="contained">Crear nueva encuesta</Button>
				</Container>

			) : (
				<Box sx={{ width: '88%', margin: '10px auto', display: 'flex', justifyContent: 'center' }}>
					<TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
						<Table className="tablaEncuestas">
							<TableHead>
								<TableRow>
									<TableCell>Título</TableCell>
									<TableCell>Fecha de Creación</TableCell>
									<TableCell>Fecha de Finalización</TableCell>
									<TableCell>Estado</TableCell>
									<TableCell>Acciones</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{encuestas.map((encuesta) => (
									<TableRow key={encuesta.id}>
										<TableCell>{encuesta.titulo}</TableCell>
										<TableCell>{encuesta.fechaCreacion}</TableCell>
										<TableCell>{encuesta.fechaFinalizacion}</TableCell>
										<TableCell>{encuesta.finalizada ? 'Finalizada' : 'Abierta'}</TableCell>
										<TableCell>
											<Box
												sx={{
													display: 'inline-flex',
													gap: '8px',
													justifyContent: 'center',
												}}
											>
												<Button
													sx={{
														color: 'white',
														backgroundColor: 'red',
														'&:hover': { color: 'black', backgroundColor: 'orange' },
													}}
													onClick={() => borrarEncuesta(encuesta.id)}
												>
													Borrar
												</Button>
												<Button
													sx={{
														color: 'white',
														backgroundColor: 'blue',
														'&:hover': { color: 'black', backgroundColor: 'lightBlue' },
													}}
													onClick={() => finalizarEncuesta(encuesta.id)}
												>
													Finalizar
												</Button>
												<Button
													sx={{
														color: 'white',
														backgroundColor: 'green',
														'&:hover': { color: 'black', backgroundColor: 'lightgreen' },
													}}
													onClick={() => obtenerResultados(encuesta.id)}
												>
													Obtener resultados
												</Button>
												<Tooltip title={ObjetoMensajes.MSG_INFO_CORREOS} arrow>
													<Button type="file"
														title={ObjetoMensajes.MSG_INFO_CORREOS}
														sx={{
															color: 'white',
															backgroundColor: 'darkorchid',
															'&:hover': { color: 'black', backgroundColor: 'plum' },
														}}

														onClick={() => enviarEncuesta(encuesta.id, encuesta.finalizada)}
													>
														Enviar por correo
													</Button>
												</Tooltip>	
												<Button
													sx={{
														color: 'white',
														backgroundColor: 'GoldenRod',
														'&:hover': { color: 'black', backgroundColor: 'LemonChiffon' },
													}}
													onClick={() => navigation("/encuesta/" + encuesta.id , { state: { rol: "U" } })}
												>
													Ver encuesta
												</Button>
											</Box>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			)}
			<VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />
		</>
	);
}

const validarFechaFinalizacion = (fechaFinalizacion) => {
	// Obtener la fecha actual en formato yyyy-mm-dd
	const fechaActual = new Date().toISOString().split("T")[0];
	// Comparar las fechas. Si la fecha de finalización es posterior o igual a la fecha actual,
	// se devuelve true.
	return (fechaFinalizacion >= fechaActual)
};