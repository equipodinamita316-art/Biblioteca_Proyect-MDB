require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Importar Rutas (Aquí usamos ./ porque entramos a la carpeta routes)
const rutasLibros = require('./routes/libros');
const rutasUsuarios = require('./routes/usuarios');
const rutasPrestamos = require('./routes/prestamos');

// Usar Rutas
app.use('/api/libros', rutasLibros);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/prestamos', rutasPrestamos);

// Servir la interfaz web de forma estática (Tu diseño Hacker/Neón)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de gestión corriendo en el puerto ${PORT}`);
});