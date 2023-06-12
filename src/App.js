//Para el control de rutas...
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import ErrorPage from "./Components/error-page";
import Home from "./Routes/home";
import Registro from "./Routes/registro";
import Inicio from "./Routes/inicio";

//Cada elemento del array es una "página" que se va a cargar.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/registro",
    element: <Registro/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/inicio",
    element: <Inicio/>,
    errorElement: <ErrorPage />,
  }
]);

export default function App() {
  return (
    <RouterProvider router={router}/>
  );
}


