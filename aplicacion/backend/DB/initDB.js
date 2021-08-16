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
 * Configura completamente la base de datos
 */
async function config() {

    let conexion;
    try {
        conexion = await conexionMysql();
        await resetDB(conexion);
        await llenarTablaUsuarios(10,conexion);
    } catch (error) {
        helpers.logError(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }

}

module.exports = { config };
