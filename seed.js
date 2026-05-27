require('dotenv').config();
const mongoose = require('mongoose');
const { fakerES: faker } = require('@faker-js/faker'); // Usamos la versión en español

const Libro = require('./models/Libro');
const Usuario = require('./models/Usuario');
const Prestamo = require('./models/Prestamo');

async function poblarBaseDeDatos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // 1. Limpiar la base de datos para evitar duplicados en cada prueba
        await Libro.deleteMany({});
        await Usuario.deleteMany({});
        await Prestamo.deleteMany({});
        console.log('🗑️  Colecciones limpiadas');

        // Arreglo de prefijos para generar títulos de libros más realistas
        const prefijosLibros = [
            'El secreto de', 'La historia de', 'El misterio de', 
            'Crónicas de', 'Manual de', 'Introducción a', 
            'La sombra de', 'Fundamentos de'
        ];

        // 2. Generar 120 Libros
        const librosData = [];
        for (let i = 0; i < 120; i++) {
            const prefijo = faker.helpers.arrayElement(prefijosLibros);
            const palabraAleatoria = faker.lorem.word();
            // Capitalizamos la primera letra de la palabra aleatoria
            const palabraCapitalizada = palabraAleatoria.charAt(0).toUpperCase() + palabraAleatoria.slice(1);

            librosData.push({
                titulo: `${prefijo} ${palabraCapitalizada}`,
                autor: faker.person.fullName(),
                isbn: faker.commerce.isbn(13),
                genero: faker.helpers.arrayElement(['Ficción', 'Ciencia', 'Historia', 'Fantasía', 'Biografía', 'Tecnología']),
                añoPublicacion: faker.date.past({ years: 50 }).getFullYear(),
                ejemplaresDisponibles: faker.number.int({ min: 1, max: 10 })
            });
        }
        const librosInsertados = await Libro.insertMany(librosData);
        console.log(`📚 ${librosInsertados.length} libros creados.`);

        // 3. Generar 120 Usuarios
        const usuariosData = [];
        for (let i = 0; i < 120; i++) {
            usuariosData.push({
                nombre: faker.person.fullName(),
                email: faker.internet.email(),
                telefono: faker.phone.number(),
                direccion: faker.location.streetAddress(),
                fechaRegistro: faker.date.past({ years: 2 })
            });
        }
        const usuariosInsertados = await Usuario.insertMany(usuariosData);
        console.log(`👤 ${usuariosInsertados.length} usuarios creados.`);

        // 4. Generar 120 Préstamos
        const prestamosData = [];
        for (let i = 0; i < 120; i++) {
            // Seleccionar un libro y un usuario al azar de los que acabamos de insertar
            const libroAleatorio = faker.helpers.arrayElement(librosInsertados);
            const usuarioAleatorio = faker.helpers.arrayElement(usuariosInsertados);
            
            const fechaPrestamo = faker.date.recent({ days: 30 });
            const fechaDevolucionEsperada = new Date(fechaPrestamo);
            fechaDevolucionEsperada.setDate(fechaDevolucionEsperada.getDate() + 14); // 14 días de préstamo

            prestamosData.push({
                libro: libroAleatorio._id,
                usuario: usuarioAleatorio._id,
                fechaPrestamo: fechaPrestamo,
                fechaDevolucionEsperada: fechaDevolucionEsperada,
                estado: faker.helpers.arrayElement(['Activo', 'Devuelto', 'Atrasado'])
            });
        }
        const prestamosInsertados = await Prestamo.insertMany(prestamosData);
        console.log(`🔖 ${prestamosInsertados.length} préstamos creados.`);

        console.log('🟩 ¡Base de datos poblada con éxito con datos reales!');

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
}

poblarBaseDeDatos();