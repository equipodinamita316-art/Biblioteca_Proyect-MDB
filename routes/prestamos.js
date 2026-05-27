const express = require('express');
const router = express.Router();
const Prestamo = require('../models/Prestamo');

// Obtener todos los préstamos con los datos del libro y usuario
router.get('/', async (req, res) => {
    try {
        const prestamos = await Prestamo.find()
            .populate('libro', 'titulo autor isbn') // Trae solo título, autor e ISBN del libro
            .populate('usuario', 'nombre email');   // Trae solo nombre y email del usuario
            
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener préstamos', error });
    }
});

module.exports = router;