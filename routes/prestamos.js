const express  = require('express');
const router   = express.Router();
const Prestamo = require('../models/Prestamo');

// GET — todos los préstamos
router.get('/', async (req, res) => {
    try {
        const prestamos = await Prestamo.find()
            .populate('libro',   'titulo autor isbn')
            .populate('usuario', 'nombre email');
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener préstamos', error });
    }
});

// POST — crear préstamo
router.post('/', async (req, res) => {
    try {
        const nuevo = new Prestamo(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear préstamo', error });
    }
});

// ✅ FIX: PUT — actualizar préstamo (faltaba esta ruta)
router.put('/:id', async (req, res) => {
    try {
        const actualizado = await Prestamo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('libro', 'titulo autor isbn')
         .populate('usuario', 'nombre email');

        if (!actualizado) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar préstamo', error });
    }
});

// DELETE — eliminar préstamo
router.delete('/:id', async (req, res) => {
    try {
        await Prestamo.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Préstamo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error });
    }
});

module.exports = router;