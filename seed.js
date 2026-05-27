require('dotenv').config();
const mongoose = require('mongoose');
const { fakerES: faker } = require('@faker-js/faker');

const Libro    = require('./models/Libro');
const Usuario  = require('./models/Usuario');
const Prestamo = require('./models/Prestamo');

async function poblarBaseDeDatos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        await Libro.deleteMany({});
        await Usuario.deleteMany({});
        await Prestamo.deleteMany({});
        console.log('🗑️  Colecciones limpiadas');

        const prefijosLibros = [
            'El secreto de', 'La historia de', 'El misterio de',
            'Crónicas de', 'Manual de', 'Introducción a',
            'La sombra de', 'Fundamentos de'
        ];

        // 120 Libros
        const librosData = [];
        for (let i = 0; i < 120; i++) {
            const prefijo = faker.helpers.arrayElement(prefijosLibros);
            const palabra = faker.lorem.word();
            const capitalizada = palabra.charAt(0).toUpperCase() + palabra.slice(1);
            librosData.push({
                titulo: `${prefijo} ${capitalizada}`,
                autor:  faker.person.fullName(),
                isbn:   faker.commerce.isbn(13),
                genero: faker.helpers.arrayElement(['Ficción','Ciencia','Historia','Fantasía','Biografía','Tecnología']),
                añoPublicacion: faker.date.past({ years: 50 }).getFullYear(),
                ejemplaresDisponibles: faker.number.int({ min: 1, max: 10 })
            });
        }
        const librosInsertados = await Libro.insertMany(librosData);
        console.log(`📚 ${librosInsertados.length} libros creados.`);

        // 120 Usuarios
        const usuariosData = [];
        for (let i = 0; i < 120; i++) {
            usuariosData.push({
                nombre:        faker.person.fullName(),
                email:         faker.internet.email(),
                telefono:      faker.phone.number(),
                direccion:     faker.location.streetAddress(),
                fechaRegistro: faker.date.past({ years: 2 })
            });
        }
        const usuariosInsertados = await Usuario.insertMany(usuariosData);
        console.log(`👤 ${usuariosInsertados.length} usuarios creados.`);

        // ✅ FIX: Estado calculado en base a fechas reales (no aleatorio)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const prestamosData = [];
        for (let i = 0; i < 120; i++) {
            const libro   = faker.helpers.arrayElement(librosInsertados);
            const usuario = faker.helpers.arrayElement(usuariosInsertados);

            // ~40% préstamos pasados (posibles atrasados/devueltos), ~60% recientes (activos)
            const diasAtras = faker.number.int({ min: 1, max: 45 });
            const fechaPrestamo = new Date(hoy);
            fechaPrestamo.setDate(hoy.getDate() - diasAtras);

            const fechaDevolucion = new Date(fechaPrestamo);
            fechaDevolucion.setDate(fechaPrestamo.getDate() + 14); // 14 días de préstamo

            // ✅ Estado calculado lógicamente:
            let estado;
            if (fechaDevolucion < hoy) {
                // Ya venció — puede estar devuelto o atrasado
                estado = faker.helpers.arrayElement(['Devuelto', 'Devuelto', 'Atrasado']); // 66% devuelto, 33% atrasado
            } else {
                // Aún no vence → siempre Activo
                estado = 'Activo';
            }

            const prestamo = {
                libro:          libro._id,
                usuario:        usuario._id,
                fechaPrestamo,
                fechaDevolucion, // ✅ campo unificado
                estado
            };

            // Si fue devuelto, agregar fecha real de devolución
            if (estado === 'Devuelto') {
                const diasDespues = faker.number.int({ min: 1, max: 14 });
                const devReal = new Date(fechaPrestamo);
                devReal.setDate(fechaPrestamo.getDate() + diasDespues);
                prestamo.fechaDevolucionReal = devReal;
            }

            prestamosData.push(prestamo);
        }

        const prestamosInsertados = await Prestamo.insertMany(prestamosData);
        console.log(`🔖 ${prestamosInsertados.length} préstamos creados.`);
        console.log('🟩 ¡Base de datos poblada con datos coherentes!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
}

poblarBaseDeDatos();