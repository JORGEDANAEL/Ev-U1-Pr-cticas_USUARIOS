// database.js

// Conexión a SQLite3
const sqlite3 = require('sqlite3').verbose();
const dbSqlite = new sqlite3.Database(':memory:'); // SQLite en memoria

// Crear tabla de usuarios en SQLite3
dbSqlite.serialize(() => {
    dbSqlite.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            password TEXT,
            image TEXT
        )
    `);
});

// Conexión a MongoDB usando Mongoose
const mongoose = require('mongoose');

// Solo llamamos a mongoose.connect() una vez aquí
mongoose.connect('mongodb+srv://danael:21020017@cluster0.gfavu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Exportar ambas conexiones
module.exports = {
    dbSqlite,
    mongoose
};
