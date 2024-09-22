const mongoose = require('mongoose');

// Definir el esquema del Usuario
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String } // Ruta de la imagen subida
});

// Crear el modelo Usuario
const Usuario = mongoose.model('Usuario', userSchema);

module.exports = Usuario;
