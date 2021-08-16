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
 * Configura completamente la base de datos
 */
async function config() {

    let conexion;
    try {
        conexion = await conexionMysql();
        await resetDB(conexion);
    } catch (error) {
        helpers.logError(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }

}

module.exports = { config };
