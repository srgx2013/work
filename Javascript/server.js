const express = require("express");
const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
