const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

// conexion a la base de datos
connection();

const app = express();

app.use(cors());

app.listen(3910, () => {
  console.log("Server is running on port 3910");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

//Configuración de rutas
app.use("/api/user", require("./routes/user"));
app.use("/api/song", require("./routes/song"));
app.use("/api/album", require("./routes/album"));
app.use("/api/artist", require("./routes/artist"));
