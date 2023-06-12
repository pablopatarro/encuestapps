import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box } from '@mui/material';
import ObjetoVariables from '../Config/Variables';
import ObjetoMensajes from '../Config/Mensajes';
import funciones from '../Firebase_setup/Conexion';
import VentanaModal from './VentanaModal';

export default function MostrarCard({ idUsuario, usuario, admin = false, setDeletedUserId }) {
    // Mostramos un componente Card con el nombre, el correo y la foto del usuario. Todo editable cuando
    // se pulsa el boton Editar.
    // Se puede cargar una foto desde el dispositivo y "serializarla" en la base de datos.
    const [isEditable, setIsEditable] = useState(false);
    const [editedUserData, setEditedUserData] = useState({ nombreEmpresa: undefined, email: undefined, urlFoto: undefined });

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

    useEffect(() => {
        if (!editedUserData.nombreEmpresa && !editedUserData.email) {
            setEditedUserData(usuario);
        }
    }, [editedUserData, usuario]);

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleSave = async () => {
        // Aquí guardamos los cambios en la base de datos.

        //Comprobamos que los campos no son vacíos.
        if (!editedUserData.nombreEmpresa || !editedUserData.email) {
            mostrarModal(ObjetoMensajes.MSG_CAMPOS_VACIOS, ObjetoMensajes.OPTION_ERROR);
        }
        else if (!funciones.validarEmail(editedUserData.email)) {
            mostrarModal(ObjetoMensajes.MSG_CAMPOS_VACIOS, ObjetoMensajes.OPTION_ERROR);
        }
        else {
            //Si no hay errores, guardamos los cambios en la base de datos.
            const datosActualizados = {
                nombreEmpresa: editedUserData.nombreEmpresa,
                email: editedUserData.email,
                urlFoto: editedUserData.urlFoto ? editedUserData.urlFoto : ObjetoVariables.URL_NO_FOTO,
            };

            const response = await funciones.updateDatosUsuario(idUsuario, datosActualizados);
            if (response.success) {
                mostrarModal(response.message, ObjetoMensajes.OPTION_CONFIRMACION);
                setEditedUserData(datosActualizados);
                setIsEditable(false);
            }
            else {
                mostrarModal(response.message, ObjetoMensajes.OPTION_ERROR);
            }
        }

    };

    const handleAddPhoto = () => {
        // Crear un elemento de entrada de archivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        // Manejar el evento de cambio de archivo seleccionado
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.size <= 5 * 1024 * 1024) {
                const reader = new FileReader();

                // Manejar el evento de carga de la imagen
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    setEditedUserData((prevState) => ({
                        ...prevState,
                        urlFoto: imageUrl,
                    }));
                };

                // Leer el contenido del archivo como una URL de datos
                reader.readAsDataURL(file);
            }
        });

        // Simular un clic en el elemento de entrada de archivo
        input.click();


    };

    const handleCancel = async () => {
        //  Hay que recuperar los datos del usuario tal y como estaba antes de pulsar Editar.
        // Es decir, hay que recuperar los datos del usuario en la base de datos.
        const response = await funciones.getUsuario(idUsuario);
        if (response.success) {
            setEditedUserData(response.userData);
            setIsEditable(false);
        }
        else {
            // Si la respuesta ese no es exitosa, mostramos un mensaje de error
            mostrarModal(ObjetoMensajes.MSG_ERROR_RECUPERAR_USUARIO, ObjetoMensajes.OPTION_ERROR);
        }

    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        // Lógica para eliminar al usuario
        const confirmacion = window.confirm("¿Está seguro que desea eliminar al usuario " + usuario.nombreEmpresa + "?");
        if (confirmacion) {
            const response = await funciones.borrarUsuario(idUsuario);
            if (response.success) {
                setDeletedUserId(idUsuario);
            }
            else
            {
                mostrarModal(response.message, ObjetoMensajes.OPTION_ERROR);
            }
        }
    };



    return (
        <>
            <Box display="flex" justifyContent="center" marginTop={2}>
                <Card sx={{ width: '80%', maxWidth: '550px', backgroundColor: "#D1C4E9" }} >
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
                            Datos de Usuario
                        </Typography>
                        <Box display="flex" justifyContent="center" mb={2}>
                            {!editedUserData.urlFoto ? (
                                <img style={{ width: '250px', height: '250px' }} src={ObjetoVariables.URL_NO_FOTO} alt="Sin imagen de perfil" />
                            ) : (
                                <img src={editedUserData.urlFoto} style={{ width: '250px', height: '250px', objectFit: 'cover' }} alt="Imagen de usuario" />
                            )}
                        </Box>
                        <form>
                            <TextField
                                label="Nombre"
                                name="nombreEmpresa"
                                value={editedUserData.nombreEmpresa}
                                onChange={handleInputChange}
                                InputProps={{
                                    readOnly: !isEditable,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={editedUserData.email}
                                onChange={handleInputChange}
                                InputProps={{
                                    readOnly: !isEditable,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                margin="normal"
                            />

                            {/* Agrega más campos de formulario según tus necesidades */}

                            {isEditable ? (
                                <Box display="inline">
                                    <Button variant="contained" color='success' onClick={handleSave} sx={{ margin: 1, color: 'black', '&:hover': { color: 'white' } }} >
                                        Guardar
                                    </Button>
                                    <Button variant="contained" color='info' onClick={handleAddPhoto} sx={{ margin: 1, color: 'black', '&:hover': { color: 'white' } }}>
                                        Añadir foto
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleCancel} sx={{ margin: 1, color: 'black', '&:hover': { color: 'white' } }}>
                                        Volver
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <Button variant="contained" color='warning' onClick={handleEdit} sx={{ margin: 1, color: 'black', '&:hover': { color: 'white' } }}>
                                        Editar
                                    </Button>
                                    {admin && (
                                        <Button variant="contained" color='error' onClick={handleDelete} sx={{ margin: 1, color: 'black', '&:hover': { color: 'white' } }}>
                                            Eliminar
                                        </Button>
                                    )}
                                </>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </Box>
            <VentanaModal open={openModal} onClose={handleClose} texto={modalText} tipo={modalTipo} />
        </>
    );
}