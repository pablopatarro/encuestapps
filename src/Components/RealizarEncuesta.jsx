import { useEffect, useState } from "react";
import { Box, Typography, FormControl, FormGroup, FormControlLabel, Checkbox, Radio, RadioGroup, Button, Container, Grid } from '@mui/material';
import ObjetoMensajes from "../Config/Mensajes";
import VentanaModal from "./VentanaModal";
import funciones from "../Firebase_setup/Conexion";
import { useNavigate } from "react-router-dom";

export default function RealizarEncuesta({ encuesta, rol }) {
    //Si se entra en este componente es porque la encuesta sigue activa. Recuperamos la encuesta y la mostramos.
    // para que el usuario pueda rellenarla.
    const [encuestaActual, setEncuestaActual] = useState(encuesta);
    const [respuestas, setRespuestas] = useState([]);
    const [limpiarCampos, setLimpiarCampos] = useState(false);
    const [redirigirHome, setRedirigirHome] = useState(false);

    const [respuestasControladas, setRespuestasControladas] = useState([]);

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
    };
    const handleClose = () => {
        setOpenModal(false);
    };

    // Función para procesar cada pregunta de la encuesta
    const procesarPreguntas = () => {
        return encuestaActual.preguntas.map((pregunta, index) => {
            switch (pregunta.tipo) {
                case 'si_no':
                    return (
                        <Grid item xs={12} key={pregunta.id}>
                            <FormControl component="fieldset" key={pregunta.id}>
                                <Typography>Pregunta {index + 1}: {pregunta.texto}</Typography>
                                <RadioGroup row
                                    value={pregunta.respuesta || ''}
                                    onChange={(e) => handlePreguntaChange(index, e.target.value)}
                                >
                                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    );
                case 'opciones':
                    return (
                        <Grid item xs={12} key={pregunta.id}>
                            <FormControl component="fieldset" key={pregunta.id}>
                                <Typography>Pregunta {index + 1}: {pregunta.texto}</Typography>
                                <FormGroup row >
                                    {pregunta.opciones.map((opcion) => (
                                        <FormControlLabel
                                            key={opcion}
                                            control={<Checkbox checked={limpiarCampos ? false : respuestasControladas.includes(opcion)} />}
                                            label={opcion}
                                            onChange={(e) => handlePreguntaChange(index, opcion, e.target.checked)}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    );
                case 'valoracion':
                    return (
                        <Grid item xs={12} key={pregunta.id}>
                            <FormControl component="fieldset" key={pregunta.id}>
                                <Typography>Pregunta {index + 1}: {pregunta.texto}</Typography>
                                <RadioGroup row
                                    value={pregunta.respuesta || ''}
                                    onChange={(e) => handlePreguntaChange(index, e.target.value)}>
                                    {[1, 2, 3, 4, 5].map((valor) => (
                                        <FormControlLabel key={valor} value={valor.toString()} control={<Radio />} label={valor.toString()} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    );
                default:
                    return null;
            }
        });
    };

    const handlePreguntaChange = (preguntaIndex, respuesta, isChecked = false) => {

        // Actualizar el estado de la encuesta actual
        setEncuestaActual((prevEncuesta) => {
            // Copiar el array de preguntas para no modificar el estado directamente
            const preguntas = [...prevEncuesta.preguntas];
            // Copiar la pregunta específica en la que se produjo el cambio
            const pregunta = { ...preguntas[preguntaIndex] };

            if (pregunta.tipo === 'opciones') {
                // Si la pregunta es de tipo 'opciones'
                const respuestas = pregunta.respuestas || [];

                if (isChecked) {
                    // Si el checkbox se marcó, agregar la respuesta al array de respuestas
                    respuestas.push(respuesta);
                } else {
                    // Si el checkbox se desmarcó, eliminar la respuesta del array de respuestas
                    const index = respuestas.indexOf(respuesta);
                    if (index !== -1) {
                        respuestas.splice(index, 1);
                    }
                }

                pregunta.respuestas = respuestas;
            } else {
                // Si la pregunta no es de tipo 'opciones', actualizar la respuesta directamente
                pregunta.respuesta = respuesta;
            }

            // Reemplazar la pregunta modificada en el array de preguntas
            preguntas[preguntaIndex] = pregunta;

            // Devolver el nuevo estado actualizado con las preguntas modificadas
            return {
                ...prevEncuesta,
                preguntas
            };
        });

        // Actualizar el estado de las respuestas controladas
        setRespuestasControladas((prevRespuestasControladas) => {
            const respuestas = [...prevRespuestasControladas];

            if (isChecked) {
                // Si el checkbox se marcó, agregar la respuesta al array de respuestas controladas
                respuestas.push(respuesta);
            } else {
                // Si el checkbox se desmarcó, eliminar la respuesta del array de respuestas controladas
                const index = respuestas.indexOf(respuesta);
                if (index !== -1) {
                    respuestas.splice(index, 1);
                }
            }

            // Devolver el nuevo estado actualizado con las respuestas controladas
            return respuestas;
        });
    };


    // Manejador de evento para finalizar la encuesta
    const handleFinalizarEncuesta = async () => {
        // Lógica para finalizar la encuesta
        const idEncuesta = encuestaActual.id;
        const respuestas = encuestaActual.preguntas.map((pregunta) => {
            if (pregunta.respuesta) {
                return pregunta.respuesta;
            } else if (pregunta.respuestas && pregunta.respuestas.length > 0) {
                return pregunta.respuestas;
            } else {
                return null; // Marcar preguntas sin respuesta como null para controlar luego
            }
        });

        //Objeto con las respuestas y el id de la encuesta.
        const encuestaRespondida = {
            idEncuesta,
            respuestas: JSON.stringify(respuestas),
        };

        // Aquí debo obligar al usuario a que ninguna pregunta esté sin respuesta.Es decir, si el array de respuestas contine null.
        if (respuestas.includes(null)) {
            mostrarModal(ObjetoMensajes.MSG_CONTESTAR_TODO, ObjetoMensajes.OPTION_ERROR);
            return;
        }

        // La lógica para enviar los datos de la encuestaRespondida
        const response = await funciones.guardarRespuestas(encuestaRespondida);
        if (response.success) {
            mostrarModal(response.message, ObjetoMensajes.OPTION_CONFIRMACION);
            setEncuestaActual(encuesta);
            setRespuestasControladas([]);
        }
        else {
            mostrarModal(response.message, ObjetoMensajes.OPTION_ERROR);
        }
        setRedirigirHome(true);
    };

    useEffect(() => {
        if(limpiarCampos){
            setLimpiarCampos(false);
        }
        
    },[limpiarCampos])

    //Redirigimos al home cuando finaliza la encuesta y la ventana modal se cierra.
    if (redirigirHome && !openModal && rol !== "U") {
        navigation('/');
    }

    return (
        <Container maxWidth="lg" display="flex" width="75%" margin="10px auto">
            <Box backgroundColor="#D1C4E9" boxShadow={3} padding="20px">
                {/* Título de la encuesta */}
                <Typography variant="h4" component="h4">
                    Título: {encuesta.titulo}
                </Typography>
                {/* Descripción de la encuesta */}
                <Typography variant="h6" paragraph>
                    Descripción de la encuesta: {encuesta.descripcion}
                </Typography>
                {/* Procesar y mostrar las preguntas */}
                <form id="formPreguntas">
                    {procesarPreguntas()}
                </form>

            </Box>
            {/* Botón para finalizar la encuesta */}
            <Box display="flex" flexDirection='column' justifyContent='center' alignItems='center' margin="10px auto">
                <Button variant="contained" style={{ width: '40%' }} sx={{color: 'black', backgroundColor: '#64B5F6', '&:hover': { color: 'white' }}} onClick={handleFinalizarEncuesta}>
                    Finalizar Encuesta
                </Button>
                {rol === "U" &&
                <Button variant="contained" color="secondary" sx={{ color:'black', marginTop: '10px','&:hover': { color: 'white' } }} style={{ width: '40%' }}  onClick={() => window.history.back()}>
                    Volver
                </Button>}
            </Box>

            <VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />

        </Container>
    );
}