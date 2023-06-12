import { TextField, Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Container, Typography, Tooltip } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VentanaModal from './VentanaModal';
import ObjetoMensajes from '../Config/Mensajes';
import funciones from '../Firebase_setup/Conexion';

export default function FormularioCrearEncuesta({ idUsuario }) {
    //En este componente se crea la encuesta. Manejamos una lista de preguntas que acepta 3 posibles tipos de respuestas.
    //La encuesta tiene título, descripción y fecha de creación.
    //Las preguntas tienen un enunciado y un tipo de respuesta que puede seleccionar el usuario.

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaFinalizacion, setFechaFinalizacion] = useState('');
    const [preguntas, setPreguntas] = useState([]);
    const [rol, setRol] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');

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

    //Recuperamos si el usuario es admin o no.
    useEffect(() => {
        const fetchRol = async (idUsuario) => {
            const response = await funciones.getUsuario(idUsuario);
            if (response.success) {
                setRol(response.userData.rol);
            }
        }

        fetchRol(idUsuario);
    }, [idUsuario]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await funciones.getUsuarios();
            if (response.success) {
                setAllUsers(response.usuarios);
            }
        }
        fetchUsuarios();
    }, []);



    //Método que se ejecuta al enviar el formulario.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que el texto de cada pregunta no esté vacío
        const preguntasVacias = preguntas.some((pregunta) => pregunta.texto.trim() === "");

        if (preguntasVacias) {
            // Mostrar un mensaje de error si hay preguntas sin texto
            mostrarModal(ObjetoMensajes.MSG_PREGUNTAS_VACIAS, ObjetoMensajes.OPTION_ERROR);
            return;
        }

        if (preguntas.length === 0) {
            mostrarModal(ObjetoMensajes.MSG_ENCUESTA_VACIA, ObjetoMensajes.OPTION_ERROR);
            return;
        }
        //Validación de que las opciones de la pregunta de tipo "opciones", no estén vacías.
        // Vemos si en el array de opciones hay alguna opción vacía o si el array no contiene elementos.
        const opcionesVacias = preguntas.some(
            (pregunta) => pregunta.tipo === "opciones" && (pregunta.opciones.some((opcion) => opcion.trim() === "") || pregunta.opciones.length === 0)
        );

        if (opcionesVacias) {
            // Mostrar un mensaje de error si hay opciones vacías
            mostrarModal(ObjetoMensajes.MSG_OPCIONES_VACIAS, ObjetoMensajes.OPTION_ERROR);
            return;
        }

        if (rol === "A" && !usuarioSeleccionado) {
            mostrarModal(ObjetoMensajes.MSG_USUARIO_VACIO, ObjetoMensajes.OPTION_ERROR);
            return;

        }
        // Crear la nueva encuesta con los datos del formulario
        const nuevaEncuesta = {
            idUsuario: rol === "A" ? usuarioSeleccionado : idUsuario,
            titulo,
            descripcion,
            fechaCreacion: new Date().toISOString().substring(0, 10),
            fechaFinalizacion,
            preguntas,
            finalizada: false,
        };

        // Enviar la nueva encuesta a la base de datos
        const response = await funciones.crearEncuesta(nuevaEncuesta);

        // Verificar la respuesta de la base de datos.
        if (response.success) {
            //Si la respuesta es ok, se muestra un mensaje y se limpia el formulario
            mostrarModal(ObjetoMensajes.MSG_ENCUESTA_GUARDADA, ObjetoMensajes.OPTION_CONFIRMACION);
            // Limpiar el formulario
            setTitulo('');
            setDescripcion('');
            setFechaFinalizacion('');
            setPreguntas([]);
            setUsuarioSeleccionado('');
        } else {
            //Si hay algún error...
            mostrarModal(ObjetoMensajes.MSG_ERROR_GENERICO, ObjetoMensajes.OPTION_ERROR);
        }

    };

    const handleAddPregunta = (tipo) => {
        // Crear una nueva pregunta con el tipo seleccionado y agregarla a la lista de preguntas
        const nuevaPregunta = {
            id: preguntas.length + 1,
            tipo,
            texto: '',
            opciones: [],
        };
        setPreguntas([...preguntas, nuevaPregunta]);
    };

    const handlePreguntaChange = (index, value) => {
        // Actualizar el texto de una pregunta en la lista de preguntas
        const updatedPreguntas = [...preguntas];
        updatedPreguntas[index].texto = value;
        setPreguntas(updatedPreguntas);
    };

    const handleEliminarPregunta = (index) => {
        setPreguntas((prevPreguntas) => {
            // Crear una copia de la lista de preguntas
            const nuevasPreguntas = [...prevPreguntas];
            // Eliminar la pregunta en el índice especificado
            nuevasPreguntas.splice(index, 1);
            // Devolver la lista de preguntas actualizada
            return nuevasPreguntas;
        });
    };

    const handleTipoPreguntaChange = (index, tipo) => {
        setPreguntas((prevPreguntas) => {
            // Crear una copia de la lista de preguntas
            const updatedPreguntas = [...prevPreguntas];
            // Actualizar el tipo de pregunta en el índice especificado
            updatedPreguntas[index].tipo = tipo;
            // Si el tipo de pregunta es distinta de "opciones", reiniciar las opciones a un array vacío
            if (tipo !== "opciones") {
                updatedPreguntas[index].opciones = [];
            }
            // Devolver la lista de preguntas actualizada
            return updatedPreguntas;
        });
    };

    const handleOpcionChange = (preguntaIndex, opcionIndex, nuevoValor) => {
        setPreguntas((prevPreguntas) => {
            // Crear una copia de la lista de preguntas
            const nuevasPreguntas = [...prevPreguntas];
            // Actualizar el valor de la opción en el índice especificado
            nuevasPreguntas[preguntaIndex].opciones[opcionIndex] = nuevoValor;
            // Devolver la lista de preguntas actualizada
            return nuevasPreguntas;
        });
    };

    const handleAgregarOpcion = (preguntaIndex) => {
        setPreguntas((prevPreguntas) => {
            // Crear una copia de la lista de preguntas
            const nuevasPreguntas = [...prevPreguntas];
            // Agregar una nueva opción vacía a la pregunta en el índice especificado
            nuevasPreguntas[preguntaIndex].opciones.push("");
            // Devolver la lista de preguntas actualizada
            return nuevasPreguntas;
        });
    };

    return (
        <Container maxWidth="sm" sx={{
            margin: '20px auto auto auto',
            backgroundColor: "#D1C4E9",
            borderRadius: "10px",
        }}>
            <form onSubmit={handleSubmit}>
                <Grid container >
                    <Grid item xs={12} marginBottom={1}>
                        <Typography variant="h4" component="h1" align="center">
                            <u>
                                Creación de encuesta
                            </u>
                        </Typography>
                        <Typography variant="h6" component="h2" align="center" marginTop={3}>
                            <b>
                                Descripción
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} marginBottom={1}>
                        <TextField
                            label="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} marginBottom={1}>
                        <TextField
                            label="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12} marginBottom={1}>
                        <TextField
                            label="Fecha de finalización"
                            type="date"
                            value={fechaFinalizacion}
                            onChange={(e) => setFechaFinalizacion(e.target.value)}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: new Date().toISOString().split('T')[0],
                            }}
                        />
                    </Grid>
                    {rol === 'A' && (
                        <>
                            <InputLabel>Asignar a usuario</InputLabel>
                            <FormControl fullWidth>
                                <Select
                                    value={usuarioSeleccionado}
                                    onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                                >
                                    {allUsers.map((user) => 
                                    ( user.rol !== "A" ) ?
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.nombreEmpresa}
                                        </MenuItem>
                                    :
                                       <></>
                                    )}
                                </Select>
                            </FormControl>
                        </>
                    )}
                    <Grid item xs={12} margin={2}>
                        {preguntas.length !== 0 &&
                            <Typography variant="h6" component="h2" align="center" >
                                <b>
                                    Preguntas
                                </b>
                            </Typography>
                        }
                        {/* Zona donde están las preguntas. */}
                        {preguntas.map((pregunta, index) => (
                            <Grid item xs={12} key={pregunta.id}>
                                <Box margin={1}>
                                    <TextField
                                        label={`Pregunta ${index + 1}`}
                                        value={pregunta.texto}
                                        onChange={(e) => handlePreguntaChange(index, e.target.value)}
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    />

                                    <InputLabel>Tipo de pregunta</InputLabel>
                                    <FormControl fullWidth>
                                        <Select
                                            value={pregunta.tipo}
                                            onChange={(e) => handleTipoPreguntaChange(index, e.target.value)}
                                        >
                                            <MenuItem value="si_no">Si/No</MenuItem>
                                            <MenuItem value="opciones">Varias opciones posibles</MenuItem>
                                            <MenuItem value="valoracion">
                                                Escala de valoración(1 a 5,especificar en enunciado)
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* Se valora el tipo de pregunta que se quiere crear y se dan opciones...  */}
                                    {pregunta.tipo === 'opciones' && (
                                        <Fragment>
                                            <InputLabel>Opciones de respuesta</InputLabel>
                                            {pregunta.opciones.map((opcion, opcionIndex) => (
                                                <TextField
                                                    key={opcionIndex}
                                                    label={`Opción ${opcionIndex + 1}`}
                                                    value={opcion}
                                                    onChange={(e) => handleOpcionChange(index, opcionIndex, e.target.value)}
                                                    fullWidth
                                                    sx={{ margin: '5px 0 0 0' }}
                                                />
                                            ))}
                                            <Button variant="outlined" onClick={() => handleAgregarOpcion(index)}>
                                                Añadir opción
                                            </Button>
                                        </Fragment>
                                    )}
                                    <IconButton onClick={() => handleEliminarPregunta(index)}>
                                        <Tooltip title="Eliminar pregunta" arrow>
                                            <DeleteTwoToneIcon color='action' fontSize='large' />
                                        </Tooltip>
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12} marginBottom={1}>
                        <Button  onClick={handleAddPregunta} variant="contained" color="secondary" sx={{ color: 'black', '&:hover': { color:'white' } }}>
                            Añadir pregunta
                        </Button>
                    </Grid>
                    <Grid item xs={12} marginBottom={1}>
                        <Button type="submit" variant="contained" color='info' sx={{ color: 'black', '&:hover': { color:'white' } }}>
                            Crear Encuesta
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />
        </Container>
    );

}