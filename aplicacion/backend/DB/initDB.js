/* Conjunto de funciones que crean la base de datos y la llenan con datos generados con el módulo Faker. */

const faker = require('faker');
const lodash = require('lodash'); //Módulo usado para generar números random.
const path = require('path'); //Módulo para creación de rutas de directorios y archivos.
const helpers = require('../helpers'); //Módulo que incluye los helpers globales.
const tablas = require('./tablasDD'); // Módulo con los objetos que definen las tablas de la base de datos.
const conexionMysql = require('./conexionMysql'); //Modulo para obtener conexión a MYSQL

/**
 * Esta función elimina las tablas definidas en módulo tablasDD de la base de datos si es que existen y las crea de nuevo.
 */
async function resetDB(conexion) {
    for (let tabla in tablas) {
        //eliminamos la tabla.
        await conexion.query(
            `
            DROP TABLE IF EXISTS ${tablas[tabla].nombre} 
            `
        );
        //La creamos de nuevo.
        await conexion.query(tablas[tabla].query);
        helpers.log(`Creada tabla ${tablas[tabla].nombre}`);
    }
}

/**
 * Esta función inserta determinado número de usuarios con datos generado automáticamente por Faker, usando una conexion a MYSQL.
 * @param {number} numeroDeUsuarios - Número de usuarios que se desea insertar en la tabla.
 * @param {Object} conexion - Conexión a MYSQL
 */
async function llenarTablaUsuarios(numeroDeUsuarios, conexion) {

    for (let i = 0; i < numeroDeUsuarios; i++) {
        const nombre = faker.name.findName();
        const biografia = faker.lorem.paragraph(2);
        const email = faker.internet.email();
        const contraseña = faker.internet.password();
        const avatar = path.join(faker.system.directoryPath(), faker.system.fileName());

        await conexion.query(
            `
            INSERT INTO usuarios ( nombre, biografia, email, contraseña, avatar, fecha, codigo_validacion )
            VALUES( ?, ?, ?, SHA2(?,512), ? ,?,?)
            `,
            [nombre, biografia, email, contraseña, avatar, helpers.formatearDateMysql(new Date()), helpers.generateRandomString()]
        );
    }
    helpers.log(`Insertados ${numeroDeUsuarios} registros en la tabla usuarios`);
}

/**
 * Esta función inserta un número determinado de experiencias con datos generados automáticamente por Faker, usando una conexion a MYSQL.
 * @param {number} numeroDeExperiencias 
 * @param {Object} conexion 
 */
async function llenarTablaExperiencias(numeroDeExperiencias, conexion) {

    for (let i = 0; i < numeroDeExperiencias; i++) {
        const nombre = faker.commerce.productName();
        const descripcion = faker.lorem.paragraph(3);
        const precio = lodash.random(20, 500);
        const ubicacion = faker.address.city();
        const rating = lodash.random(0, 5);
        const plazasTotales = lodash.random(5, 45);
        const fechaInicial = helpers.formatearDateMysql(new Date());
        const fechaFinal = helpers.formatearDateMysql(new Date());

        await conexion.query(
            `
            INSERT INTO experiencias (nombre, descripcion, fecha_inicial, fecha_final,rating,precio,ubicacion,plazas_totales)
            VALUES(?,?,?,?,?,?,?,?)
            `,
            [nombre, descripcion, fechaInicial, fechaFinal, rating, precio, ubicacion, plazasTotales]
        )
    }
    helpers.log(`Insertados ${numeroDeExperiencias} registros en la tabla experiencias`);
}

/**
 * Esta función inserta en la tabla usuarios al usuario administrador, tomando como credenciales las variables de entorno ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD
 * @param {Object} conexion 
 */
async function crearAdministrador(conexion) {

    await conexion.query(
        `
        INSERT INTO usuarios ( nombre,  email, contraseña, fecha, privilegios, activo )
        VALUES( ?, ?, SHA2(?,512), ? ,?,?)
        `,
        [
            process.env.ADMIN_NAME,
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD,
            helpers.formatearDateMysql(new Date()),
            'admin',
            true,

        ]
    );
    helpers.log('Cuenta de administrador creada');
}

/**
 * Configura completamente la base de datos
 */
async function config(resetDB) {

    let conexion;
    try {
        conexion = await conexionMysql();
        if (resetDB) {      //Si la variable de entorno RESET_DB es true reseteamos la base de datos.
            await resetDB(conexion);
            await llenarTablaUsuarios(10, conexion);
            await llenarTablaExperiencias(10, conexion);
            await crearAdministrador(conexion);
        } else if (!resetDB){
            await fixDB(conexion); 
        }
    } catch (error) {
        helpers.logError(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }

}

module.exports = { config };
