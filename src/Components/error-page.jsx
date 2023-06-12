import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Oops!</h1>
      <p>Ha habido un error inesperado.</p>
      <Link to="/">Volver a la página principal</Link>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}