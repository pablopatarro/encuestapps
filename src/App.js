//Para el control de rutas...
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import ObjetoVariables from "./Config/Variables"; 
import ErrorPage from "./Components/error-page";
import Home from "./Routes/common/home";
import Registro from "./Routes/common/registro";
import Inicio from "./Routes/common/inicio";
import Usuario from "./Routes/common/usuario";
import CrearEncuesta from "./Routes/common/crear_encuesta";
import MostrarEncuestas from "./Routes/common/mostar_encuestas";
import Perfil from "./Routes/common/perfil";
import Encuesta from "./Routes/user/encuesta";
import ResultadoEncuesta from "./Routes/user/resultado_encuesta";
import MostrarUsuarios from "./Routes/admin/mostrar_usuarios";

//Cada elemento del array es una "página" que se va a cargar.
const router = createBrowserRouter([
  {
    path: ObjetoVariables.ROUTE_HOME,
    element: <Home/>,
    errorElement: <ErrorPage />,
  },
  {
    path: ObjetoVariables.ROUTE_REGISTRO,
    element: <Registro/>,
    errorElement: <ErrorPage />,
  },
  {
    path: ObjetoVariables.ROUTE_LOGIN,
    element: <Inicio/>,
    errorElement: <ErrorPage />,
  },
  {
    path: ObjetoVariables.ROUTE_USUARIO+":idUsuario",
    element: <Usuario/>,
    errorElement: <ErrorPage />,
  },
  {
    path: ObjetoVariables.ROUTE_USUARIO_CREAR_ENCUESTA,
    element: <CrearEncuesta/>,
    errorElement: <ErrorPage />
  },
  {
    path: ObjetoVariables.ROUTE_USUARIO_MOSTRAR_TODO,
    element: <MostrarEncuestas/>,
    errorElement: <ErrorPage />
  },
  {
    path: ObjetoVariables.ROUTE_USUARIO_PERFIL,
    element: <Perfil/>,
    errorElement: <ErrorPage />
  },
  {
    path: ObjetoVariables.ROUTE_ENCUESTA_REALIZAR+":idEncuesta",
    element: <Encuesta/>,
    errorElement: <ErrorPage />
  },
  {
    path: ObjetoVariables.ROUTE_ADMIN_MOSTRAR_USUARIOS,
    element: <MostrarUsuarios/>,
    errorElement: <ErrorPage />
  },
  {
    path: ObjetoVariables.ROUTE_USUARIO_OBTENER_RESULTADOS+":idEncuesta",
    element: <ResultadoEncuesta/>,
    errorElement: <ErrorPage />
  },
]);

export default function App() {
  return (
    <RouterProvider router={router}/>
  );
}