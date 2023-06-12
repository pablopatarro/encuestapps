// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { SHA256 } from 'crypto-js';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCA8NyFYjnqTkQ7sKk5yF7mixsxxCA8MUg",
	authDomain: "encuestapps-877aa.firebaseapp.com",
	projectId: "encuestapps-877aa",
	storageBucket: "encuestapps-877aa.appspot.com",
	messagingSenderId: "443686945946",
	appId: "1:443686945946:web:645bb8336fb66295a8cb23"
};

//Se inicia la conexión con Firebase.
const app = initializeApp(firebaseConfig);
//Obtenemos una referencia dináminca a la base de datos.
//Todas las operaciones sobre la base de datos se hacen usando esta referencia.
const db = getFirestore(app);

/********MÉTODOS DE OPERACIONES SOBRE LA BASE DE DATOS.********/
async function getUsuarios() {
	try {
		const querySnapshot = await getDocs(collection(db, "usuarios"));
		const usuarios = [];

		querySnapshot.forEach((doc) => {
			usuarios.push({ id: doc.id, ...doc.data() });
		});
		return { success: true, usuarios };
	}
	catch (error) {
		return { success: false, message: error.message };
	}

}

//Método para hacer el registro de un usuario
async function registro(datos) {
	try {
		const collUsuarios = collection(db, 'usuarios');

		//Comprobar que el email no este registrado en la base de datos.
		const q = query(collUsuarios, where('email', '==', datos.email));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			return { success: false, message: 'El usuario ya existe' };
		}

		//Encriptación de la contraseña.
		datos.password = SHA256(datos.password).toString();
		//Por defecto, el rol del usuario es "U".
		datos.rol = "U";

		// Agregar el documento a la colección
		const docRef = await addDoc(collUsuarios, datos);

		return { success: true, message: 'Usuario registrado con éxito', id: docRef.id };
	} catch (error) {
		console.error('Error al registrar el documento: ', error);
		return { success: false, message: 'Error al registrar el documento' };
	}
}

async function login(datos) {
	const { email, password } = datos;

	// Comprobar que ni el email ni la password están en blanco
	if (!email || !password) {
		return { success: false, message: 'Email y contraseña son requeridos' };
	}

	try {
		//Recuperamos la colección de usuarios.
		const collUsuarios = collection(db, 'usuarios');

		// Buscar en la base de datos si existe algún usuario con el mismo email
		const q = query(collUsuarios, where('email', '==', email));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return { success: false, message: 'El usuario no existe' };
		}

		//Comprobación de que la contraseña sea correcta
		if (querySnapshot.docs[0].data().password === SHA256(password).toString()) {
			// No se devuelve ningún mensaje si el usuario existe
			return { success: true, id: querySnapshot.docs[0].id };
		} else {
			return { success: false, message: 'Contraseña incorrecta' };
		}

	} catch (error) {
		console.error('Error al realizar el login: ', error);
		return { success: false, message: 'Error al realizar el login' };
	}
}

async function getUsuario(id) {
	try {
		// Obtener una referencia al documento del usuario usando el ID
		const userRef = doc(collection(db, "usuarios"), id);

		// Obtener los datos del documento
		const userSnapshot = await getDoc(userRef);

		// Comprobar si el documento existe y contiene datos
		if (userSnapshot.exists()) {
			// Obtener los datos del usuario en formato JSON
			const userData = userSnapshot.data();
			return { success: true, userData };
		} else {
			// El usuario no existe en la base de datos
			return { success: false, message: 'El usuario no existe' };
		}
	} catch (error) {
		console.error("Error al buscar el usuario:", error);
		return { success: false, message: 'Error al recuperar los datos del usuario' };
	}
}

async function crearEncuesta(nuevaEncuesta) {
	try {
		const encuestasCollection = collection(db, "encuestas");
		// Guardar la nueva encuesta en la colección "encuestas" de Firestore
		await addDoc(encuestasCollection, nuevaEncuesta);

		// Devolver un objeto JSON indicando que la encuesta se guardó correctamente
		return { success: true };
	} catch (error) {

		console.error("Error al crear la encuesta:", error);
		// Devolver un objeto JSON indicando que ocurrió un error al guardar la encuesta
		return { success: false };
	}
}

async function obtenerEncuestas(idUsuario) {
	try {
		const encuestasCollection = collection(db, "encuestas");
		const usuariosCollection = collection(db, "usuarios");

		//Usamos una variable mutable para almacenar la consulta.
		let querySnapshot;
		const usuarioSnapshot = await getDoc(doc(usuariosCollection, idUsuario));

		//Si el usuario tiene el rol "A", se entra en el else y se obtienen todas las encuestas para devolverlas.
		if (usuarioSnapshot.data().rol !== "A") {
			// Crear una consulta para obtener las encuestas del usuario con rol "U"
			const q = query(encuestasCollection, where("idUsuario", "==", idUsuario));

			// Obtener los documentos que cumplen con la consulta
			querySnapshot = await getDocs(q);
		}
		else {
			// Obtener todas las encuestas
			querySnapshot = await getDocs(encuestasCollection);
		}

		// Inicializar un array vacío para almacenar las encuestas
		const encuestas = [];

		// Iterar sobre los documentos y agregarlos al array de encuestas
		querySnapshot.forEach((doc) => {
			// Añadimos el id del doc como una propiedad del objeto que queremos devolver.
			const encuesta = {
				...doc.data(),
				id: doc.id
			};

			encuestas.push(encuesta);

		});

		// Devolver un objeto JSON con el array de encuestas y el parámetro "success"
		return { success: true, encuestas };
	} catch (error) {
		console.error("Error al obtener las encuestas:", error);

		// Devolver un objeto JSON indicando que ocurrió un error al obtener las encuestas
		return { success: false, encuestas: [] };
	}
}

async function finalizarEncuesta(idEncuesta) {
	try {
		// Obtener la referencia del documento de la encuesta
		const encuestaRef = doc(collection(db, 'encuestas'), idEncuesta);

		// Obtener la encuesta actual
		const encuestaSnapshot = await getDoc(encuestaRef);
		const encuestaData = encuestaSnapshot.data();
		// Verificar si la encuesta existe
		if (!encuestaData) {
			return { success: false, message: 'La encuesta no existe' };
		}

		// Verificar si la encuesta ya está finalizada
		if (encuestaData.finalizada) {
			return { success: false, message: 'La encuesta ya está finalizada' };
		}

		// Actualizar el atributo "finalizada" de la encuesta a true
		await updateDoc(encuestaRef, { finalizada: true });

		return { success: true, message: 'La encuesta ha sido finalizada exitosamente' };
	} catch (error) {
		console.error('Error al finalizar la encuesta:', error);
		return { success: false, message: 'Error al finalizar la encuesta' };
	}
}

async function borrarEncuesta(idEncuesta) {
	try {
		const encuestaRef = doc(collection(db, 'encuestas'), idEncuesta);

		// Obtener las respuestas asociadas a la encuesta
		const respuestasQuery = query(collection(db, 'respuestas'), where('idEncuesta', '==', idEncuesta));
		const respuestasSnapshot = await getDocs(respuestasQuery);

		// Eliminar todas las respuestas asociadas a la encuesta
		const respuestasPromises = [];
		respuestasSnapshot.forEach((respuestaDoc) => {
			const respuestaRef = doc(collection(db, 'respuestas'), respuestaDoc.id);
			respuestasPromises.push(deleteDoc(respuestaRef));
		});

		// Esperar a que se eliminen todas las respuestas antes de eliminar la encuesta
		await Promise.all(respuestasPromises);
		await deleteDoc(encuestaRef);

		return { success: true, message: 'La encuesta y las respuestas asociadas se han borrado correctamente' };
	} catch (error) {
		console.error('Error al borrar la encuesta:', error);
		return { success: false, message: 'Error al borrar la encuesta y las respuestas asociadas' };
	}
}

async function borrarUsuario(idUsuario) {
	try {
		// Obtener la referencia del documento del usuario
		const usuarioRef = doc(collection(db, 'usuarios'), idUsuario);

		// Obtener las encuestas asociadas al usuario
		const encuestasQuery = query(collection(db, 'encuestas'), where('idUsuario', '==', idUsuario));
		const encuestasSnapshot = await getDocs(encuestasQuery);

		// Eliminar las encuestas asociadas al usuario y sus respuestas
		const encuestasPromises = [];
		encuestasSnapshot.forEach((encuestaDoc) => {
			const encuestaId = encuestaDoc.id;
			encuestasPromises.push(borrarEncuesta(encuestaId));
		});

		// Esperar a que se eliminen todas las encuestas antes de borrar al usuario
		await Promise.all(encuestasPromises);
		await deleteDoc(usuarioRef);

		return { success: true, message: 'El usuario y sus encuestas asociadas se han borrado correctamente' };
	} catch (error) {
		console.error('Error al borrar el usuario:', error);
		return { success: false, message: 'Error al borrar el usuario y sus encuestas asociadas' };
	}
}

async function recuperarEncuesta(idEncuesta) {
	try {
		// Obtén la referencia del documento de la encuesta
		const encuestaRef = doc(collection(db, 'encuestas'), idEncuesta);

		// Obtén el documento de la encuesta
		const encuestaSnapshot = await getDoc(encuestaRef);

		// Verifica si el documento existe
		if (encuestaSnapshot.exists()) {
			// Obtén los datos de la encuesta
			const encuesta = encuestaSnapshot.data();
			encuesta.id = encuestaSnapshot.id;
			// Devuelve un objeto JSON con la encuesta y el parámetro "success"
			return { encuesta, success: true };
		} else {
			// La encuesta no existe, devuelve el parámetro "success" como false
			return { success: false };
		}
	} catch (error) {
		console.error('Error al recuperar la encuesta:', error);
		// Maneja el error según tus necesidades
		return { success: false, error: error.message };
	}
}

async function guardarRespuestas(encuestaRespondida) {
	try {
		const respuestasCollection = collection(db, "respuestas");
		// Guardar la nueva encuesta en la colección "encuestas" de Firestore
		await addDoc(respuestasCollection, encuestaRespondida);

		// Devolver un objeto JSON indicando que la encuesta se guardó correctamente
		return { success: true, message: 'Sus respuestas se han guardado correctamente' };
	} catch (error) {
		console.error("Error al crear la encuesta:", error);
		// Devolver un objeto JSON indicando que ocurrió un error al guardar la encuesta
		return { success: false, message: 'Error al guardar sus respuestas' };
	}
}

async function updateDatosUsuario(idUsuario, datosActualizados) {
	try {
		// Obtener la referencia del documento del usuario
		const usuarioRef = doc(collection(db, 'usuarios'), idUsuario);

		// Obtener los datos actuales del usuario
		const usuarioSnapshot = await getDoc(usuarioRef);
		const usuarioData = usuarioSnapshot.data();

		// Verificar si el usuario existe
		if (!usuarioData) {
			return { success: false, message: 'El usuario no existe' };
		}

		// Si el email del usuario que quiere actualizar no es el mismo que el actual
		// buscamos en la base de datos si hay otro usuario con el mismo correo para no repetir.
		if (usuarioData.email !== datosActualizados.email) {
			// Verificar si existe otro usuario con el mismo correo electrónico
			const existingUserQuery = query(
				collection(db, 'usuarios'),
				where('email', '==', datosActualizados.email)
			);
			const existingUserSnapshot = await getDocs(existingUserQuery);
			if (!existingUserSnapshot.empty) {
				// Ya existe otro usuario con el mismo correo electrónico
				return { success: false, message: 'Ya existe otro usuario con ese correo electrónico' };
			}
		}

		// Actualizar los datos del usuario
		await updateDoc(usuarioRef, datosActualizados);

		return { success: true, message: 'Datos de usuario actualizados correctamente' };
	} catch (error) {
		console.error('Error al actualizar los datos de usuario:', error);
		return { success: false, message: 'Error al actualizar los datos de usuario' };
	}
}

//Funciones para enviar encuestas por correo.
function subirCorreosYMandar(idEncuesta) {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.csv';

	input.addEventListener('change', (event) => {
		const file = event.target.files[0];

		const reader = new FileReader();

		reader.onload = function (e) {
			const contents = e.target.result;
			const emails = extractEmailsFromCSV(contents);

			// Aquí se utilizan los correos electrónicos para enviar la encuesta.
			sendEmails(emails, idEncuesta);
		};

		reader.readAsText(file);
	});

	input.click();
}

function extractEmailsFromCSV(csvContent) {
	const lines = csvContent.split('\n');
	const emails = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line !== '') {
			const email = line.split(',')[0].trim(); // Suponiendo que el correo electrónico está en la primera columna
			emails.push(email);
		}
	}

	return emails;
}

function sendEmails(emails, idEncuesta) {
	// Aquí se implementa el código para enviar mensajes por correo electrónico
	// utilizando una librería o servicio de envío de correos electrónicos
	// En este ejemplo, simplemente se mostrarán los correos electrónicos en la consola
	const destinatarios = emails;
	const asunto = 'Correo de encuestas';
	const cuerpo = '¡Te invito a realizar una encuesta! Puedes verla en el siguiente enlace: \n\n https://encuestapps-jpgp.netlify.app/encuesta/' + idEncuesta;

	const destinatariosURL = destinatarios.join(',');
	const mailtoURL = `mailto:${destinatariosURL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

	window.open(mailtoURL);
}

//Funciones para el análisis de datos. Procesar las respuestas y luego mandarselo a Chart.js para mostrar las gráficas.
async function devolverAnalisis(idEncuesta) {
	try {
		// Obtener la encuesta
		const encuestaRef = doc(collection(db, 'encuestas'), idEncuesta);
		const encuestaSnapshot = await getDoc(encuestaRef);
		const encuesta = encuestaSnapshot.data();

		// Obtener todas las respuestas asociadas a la encuesta
		const respuestasQuery = query(collection(db, 'respuestas'), where('idEncuesta', '==', idEncuesta));
		const respuestasSnapshot = await getDocs(respuestasQuery);
		const respuestas = [];
		respuestasSnapshot.forEach((respuestaDoc) => {
			//Recuperamos las respuestas y las pasadmos de string JSON a objeto.
			const respuesta = JSON.parse(respuestaDoc.data().respuestas);
			respuestas.push(respuesta);
		});

		//Si el array de respuestas está vacío, se devuelve un "error"
		if (respuestas.length === 0) {
			return { success: false, message: 'No hay datos para analizar' };
		}

		const analisis = realizarAnalisis(encuesta, respuestas);
		return { success: true, analisis };
	} catch (error) {
		// Manejar cualquier error de Firestore
		console.error('Error al buscar la encuesta y las respuestas:', error);
		throw error;
	}
}

function realizarAnalisis(encuesta, respuestas) {
	// Realizar el análisis de las respuestas y generar los datos para el gráfico
	const analisisDatos = [];
	// Para cada pregunta de la encuesta, se crea un objeto literal de la siguiente forma:
	/** Cada uno de estos objetos es un elemento del array.
	 {
		texto,
		tipo,
		opciones,
		respuestas: []
	 }
	 */

	//Para cada pregunta de la encuesta, me creo un objeto con la forma anterior con su array de respuestas vacío.
	encuesta.preguntas.forEach((pregunta, index) => {
		const preguntaAnalisis = {
			texto: pregunta.texto,
			tipo: pregunta.tipo,
			opciones: pregunta.opciones,
			respuestas: [],
		};

		respuestas.forEach((respuesta) => {
			preguntaAnalisis.respuestas.push(respuesta[index]);
		});

		analisisDatos.push(preguntaAnalisis);
	});

	return analisisDatos;
}

//Funciones de validación con RegExp
function validarEmail(email) {
	//Escribe una funcion que compruebe si el correo es válido.
	//Ejemplo: "correo@ejemplo.com"
	const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return expresionRegular.test(email);
}

function validarContrasena(password) {
	//Escribe una funcion que compruebe si la contraseñae tiene 8 carácteres.
	//Además de añ menos un número,una mayúscula,una minúscula y un caracter especial #$%&*+-/=?^_`{|}~
	//Ejemplo: "PasS$123"
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),_+/-€¬~.?:{}|<>]).{8,}$/;
	return regex.test(password);
}



















const funciones = {
	getUsuarios, registro, login, getUsuario, crearEncuesta,
	obtenerEncuestas, finalizarEncuesta, subirCorreosYMandar, borrarEncuesta, recuperarEncuesta,
	guardarRespuestas, devolverAnalisis, validarContrasena, validarEmail, updateDatosUsuario,
	borrarUsuario,

}
export default funciones;