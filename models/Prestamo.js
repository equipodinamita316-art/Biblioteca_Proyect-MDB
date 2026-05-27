const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
    libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaPrestamo: { type: Date, required: true },
    fechaDevolucionEsperada: { type: Date, required: true },
    estado: { type: String, enum: ['Activo', 'Devuelto', 'Atrasado'], default: 'Activo' }
});

module.exports = mongoose.model('Prestamo', prestamoSchema);