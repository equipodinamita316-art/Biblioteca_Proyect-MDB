const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
    libro:   { type: mongoose.Schema.Types.ObjectId, ref: 'Libro',   required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaPrestamo:    { type: Date, required: true },
    // ✅ FIX: nombre unificado (antes "fechaDevolucionEsperada" en BD vs "fechaDevolucion" en HTML)
    fechaDevolucion:  { type: Date, required: true },
    fechaDevolucionReal: { type: Date }, // cuándo se devolvió realmente
    estado: { type: String, enum: ['Activo', 'Devuelto', 'Atrasado'], default: 'Activo' }
});

module.exports = mongoose.model('Prestamo', prestamoSchema);