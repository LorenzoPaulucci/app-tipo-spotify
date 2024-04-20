const mongoose = require("mongoose");

const connection = async () => {
    try {   
        await mongoose.connect("mongodb://127.0.0.1:27017/app-musica"); // si pongo localhost en vez de 127.0.0.1, no me conecta
        console.log("Database connected");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { connection };    