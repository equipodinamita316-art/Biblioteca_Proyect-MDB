const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    isbn: { type: String, unique: true },
    genero: { type: String },
    añoPublicacion: { type: Number },
    ejemplaresDisponibles: { type: Number, default: 1 }
});

module.exports = mongoose.model('Libro', libroSchema);