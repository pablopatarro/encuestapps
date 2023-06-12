import { useEffect, useState } from "react";
import funciones from "../Firebase_setup/Conexion";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, CategoryScale, LinearScale, BarElement, Title, } from 'chart.js';
import { Bar, Doughnut, PolarArea, } from 'react-chartjs-2';


ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title,);

export default function MostrarAnalisis({ idEncuesta }) {
    const [analisis, setAnalisis] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState("");
    //Para el pdf.

    useEffect(() => {
        const recuperarAnalisis = async (idEncuesta) => {
            const response = await funciones.devolverAnalisis(idEncuesta);

            if (response.success) {
                setAnalisis(response.analisis);
            } else {
                setNoDataMessage(response.message);
            }
        };

        recuperarAnalisis(idEncuesta);
    }, [idEncuesta]);

    const generarGraficos = (objeto) => {
        switch (objeto.tipo) {
            case "si_no":
                return (
                    <Grid item xs={12} marginTop={2}>
                        {generarGraficoSiNo(objeto)}
                    </Grid>
                );

            case "opciones":
                return (
                    <Grid item xs={12} marginTop={2}>
                        {generarGraficoOpciones(objeto)}
                    </Grid>
                );

            case "valoracion":
                return (
                    <Grid item xs={12} marginTop={2}>
                        {generarGraficoValoracion(objeto)}
                    </Grid>
                );
            default:
                break;
        }
    };

    const generarGraficoSiNo = (objeto) => {
        const datos = {
            labels: ["Sí", "No"],
            datasets: [
                {
                    label: "Votos",
                    data: [
                        objeto.respuestas.filter((respuesta) => respuesta === "si").length,
                        objeto.respuestas.filter((respuesta) => respuesta === "no").length,
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(255, 99, 132, 0.3)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const opciones = {
            responsive: true,
            maintainAspectRatio: true,
        };

        return (
            <Box key={objeto.id} sx={{ display: 'grid', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h5">Estadísticas de la pregunta: {objeto.texto}</Typography>
                <Box sx={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                    <Doughnut data={datos} options={opciones} />
                </Box>
            </Box>
        );
    };

    const generarGraficoOpciones = (objeto) => {
        //Se tiene que contar cuantas veces aparece cada opción en el array de las respuestas asociadas a la pregunta.
        const datosProcesados = objeto.opciones.map((opcion) => {
            //Para cada opción, contamos cuantas veces está en cara array de respuestas.
            let contador = 0;
            objeto.respuestas.forEach((respuesta) => {
                if (respuesta.includes(opcion)) {
                    contador++;
                }
            });
            return contador;
        });

        //Construcción de los datos
        const datos = {
            labels: objeto.opciones,
            datasets: [
                {
                    label: "Votos",
                    data: datosProcesados,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 0, 0, 0.5)',
                        'rgba(0, 255, 0, 0.5)',
                        'rgba(0, 0, 255, 0.5)',
                        'rgba(128, 128, 128, 0.5)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        //Construcción de las opciones.
        const opciones = {
            responsive: true,
            maintainAspectRatio: true,
        };

        return (
            <Box key={objeto.id} sx={{ display: 'grid', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h5">Estadísticas de la pregunta: {objeto.texto}</Typography>
                <Box sx={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                    <PolarArea data={datos} options={opciones} />
                </Box>
            </Box>
        );
    };

    const generarGraficoValoracion = (objeto) => {
        const posiblesOpciones = ["1", "2", "3", "4", "5"];
        //Se tiene que contar cuantas veces aparece cada opción en el array de las respuestas asociadas a la pregunta.
        const contador = posiblesOpciones.reduce((acc, opcion) => {
            acc[opcion] = objeto.respuestas.filter(respuesta => respuesta === opcion).length;
            return acc;
        }, {});

        //Recuperamos los valores del objeto. Ya vienen ordenados.
        const datosProcesados = Object.values(contador);

        const datos = {
            labels: posiblesOpciones,
            datasets: [{
                label: "Votos",
                data: datosProcesados,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                ],
                borderWidth: 1,
            }],
        };

        const opciones = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        };

        return (
            <Box key={objeto.id} sx={{ display: 'grid', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h5">Estadísticas de la pregunta: {objeto.texto}</Typography>
                <Box sx={{ width: '100%', maxWidth: '550px', margin: '0 auto' }}>
                    <Bar options={opciones} data={datos} />
                </Box>
            </Box>
        );


    }

    //Creamos un array con el análisis de datos hecho y las gráficas generadas.
    const graficos = analisis.map((objetoAnalizar, index) => {
        objetoAnalizar.id = index;
        return generarGraficos(objetoAnalizar);
    })

    const handleClick = (event) => {
        event.currentTarget.style.visibility = 'hidden';
        document.querySelector("#btnVolver").style.visibility = 'hidden';
        window.print();
        event.currentTarget.style.visibility = 'visible';
        document.querySelector("#btnVolver").style.visibility = 'visible';
    };

    return (
        <Box    display="flex"
        justifyContent="center"
        alignItems="center"
        width="80%"
        flexDirection="column"
        margin="0 auto"
        maxWidth="800px">
            {analisis.length === 0 ? (
                <Grid item xs={12}>
                    <Typography variant="h2">{noDataMessage}</Typography>
                </Grid>
            ) : (
                <>
                    <Box id={"BoxGraficos"}>
                        {graficos}
                    </Box>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={6} md={4} sx={{ margin: '10px' }}>
                            <Button id="btnVolver" variant="contained" color="secondary" fullWidth onClick={() => window.history.back()}>
                                Volver
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} sx={{ margin: '10px' }}>
                            <Button variant="contained" sx={{ color: 'black', backgroundColor: '#64B5F6', '&:hover': { color: 'white' } }} fullWidth onClick={handleClick}>
                                Imprimir resultados
                            </Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}