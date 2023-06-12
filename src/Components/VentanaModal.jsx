import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function VentanaModal({open,onClose,texto,tipo}) {

  let titulo = "";
  let color = "";
  if (tipo === "error") {
    titulo = "Error";
    color = "red";
  } else if (tipo === "confirmacion") {
    titulo = "Confirmación";
    color = "green";
  }else if(tipo === "info"){
    titulo = "Información";
    color = "blue";
  }

  return (
    <Dialog open={open} onClose={onClose} BackdropProps={{ invisible: false}} >
      <DialogTitle style={{ color: color }}>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{texto}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button id="cerrarModal" onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

