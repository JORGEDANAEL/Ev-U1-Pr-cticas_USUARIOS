const express = require("express");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const { dbSqlite } = require('./database');  // Importa la conexión a SQLite3 y MongoDB

const app = express();
const PORT = 4000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Hacer pública la carpeta 'public' para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar body-parser para manejar formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Hacer pública la carpeta de imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Agregar timestamp al nombre del archivo
    }
});
const upload = multer({ storage: storage });

// ==================== RUTAS PARA SQLITE3 ====================

// Ruta principal para listar usuarios
app.get("/", (req, res) => {
    dbSqlite.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.render('index', { users: rows });
    });
});

// Formulario para agregar usuario
app.get("/add", (req, res) => {
    res.render('add');
});

// Procesar formulario de agregar usuario
app.post("/add", upload.single('image'), (req, res) => {
    const { name, password } = req.body;
    const image = req.file ? req.file.filename : null;

    dbSqlite.run('INSERT INTO users (name, password, image) VALUES (?, ?, ?)', [name, password, image], (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

// Formulario para editar usuario
app.get("/edit/:id", (req, res) => {
    const userId = req.params.id;
    dbSqlite.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.render('edit', { user: row });
    });
});

// Procesar edición de usuario
app.post("/edit/:id", upload.single('image'), (req, res) => {
    const userId = req.params.id;
    const { name, password } = req.body;
    const image = req.file ? req.file.filename : req.body.currentImage;

    dbSqlite.run('UPDATE users SET name = ?, password = ?, image = ? WHERE id = ?', [name, password, image, userId], (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

// Eliminar usuario
app.get("/delete/:id", (req, res) => {
    const userId = req.params.id;
    dbSqlite.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
