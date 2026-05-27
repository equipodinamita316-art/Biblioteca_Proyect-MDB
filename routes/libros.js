const express = require('express');
const router = express.Router();
const Libro = require('../models/Libro');

// 1. OBTENER TODOS LOS LIBROS (CON PAGINACIÓN Y BÚSQUEDA)
router.get('/', async (req, res) => {
    try {
        // Paginación: ?page=1&limit=10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Búsqueda opcional por título: ?search=anillo
        const search = req.query.search;
        const query = search ? { titulo: { $regex: search, $options: 'i' } } : {};

        const libros = await Libro.find(query).skip(skip).limit(limit);
        const total = await Libro.countDocuments(query);

        res.json({
            totalRegistros: total,
            paginasTotales: Math.ceil(total / limit),
            paginaActual: page,
            datos: libros
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los libros', error });
    }
});

// 2. CREAR UN NUEVO LIBRO
router.post('/', async (req, res) => {
    try {
        const nuevoLibro = new Libro(req.body);
        const libroGuardado = await nuevoLibro.save();
        res.status(201).json(libroGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el libro', error });
    }
});

// 3. ACTUALIZAR UN LIBRO (Por ID)
router.put('/:id', async (req, res) => {
    try {
        const libroActualizado = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(libroActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error });
    }
});

// 4. ELIMINAR UN LIBRO
router.delete('/:id', async (req, res) => {
    try {
        await Libro.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error });
    }
});

module.exports = router;