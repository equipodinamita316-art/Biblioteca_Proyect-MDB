require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error:', err));

const rutasLibros    = require('./routes/libros');
const rutasUsuarios  = require('./routes/usuarios');
const rutasPrestamos = require('./routes/prestamos');

app.use('/api/libros',    rutasLibros);
app.use('/api/usuarios',  rutasUsuarios);
app.use('/api/prestamos', rutasPrestamos);

// Página pública
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
// Panel de administración
app.get('/admin', (req, res) => res.sendFile(__dirname + '/admin.html'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));