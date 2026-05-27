const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios con paginación
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const usuarios = await Usuario.find().skip(skip).limit(limit);
        const total = await Usuario.countDocuments();

        res.json({ totalRegistros: total, paginasTotales: Math.ceil(total / limit), paginaActual: page, datos: usuarios });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
    }
});

module.exports = router;