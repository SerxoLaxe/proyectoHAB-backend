/* Conjunto de funciones que crean la base de datos y la llenan con datos generados con el módulo Faker. */
const faker = require('faker');
const lodash = require('lodash'); //Módulo usado para generar números random.
const path = require('path'); //Módulo para creación de rutas de directorios y archivos.
const helpers = require('../helpers'); //Módulo que incluye los helpers globales.
const tablas = require('./tablasDD'); // Módulo con los objetos que definen las tablas de la base de datos.
const conexionMysql = require('./conexionMysql'); //Modulo para obtener conexión a MYSQL
const {fakerConfig }= require('../config');

/**
 * Esta función elimina las tablas definidas en módulo tablasDD de la base de datos si es que existen.
 * @param {Object} conexion - Conexión a Mysql
 */
async function eliminarTablas(conexion) {

    //Desactivamos el check de foreign keys para eliminar las tablas que contengan foreign keys.
    await conexion.query(
        ` SET foreign_key_checks = 0;`
    );
    for (let tabla in tablas) {
        await conexion.query(
            `
            DROP TABLE IF EXISTS ${tablas[tabla].nombre} 
            `
        );
    }
    //Volvemos a activar el check de foreign keys de nuevo.
    await conexion.query(
        ` SET foreign_key_checks = 1;`
    );
    helpers.log(`Tablas eliminadas`);
}
/**
 * Crea las tablas del array de tablas del módulo tablasDD si es que no existen en la base de datos.
 * @param {Object} conexion - Conexión a Mysql
 */
async function crearTablas(conexion) {
    for (let tabla in tablas) {
        await conexion.query(
            `
            CREATE TABLE IF NOT EXISTS ${tablas[tabla].nombre} ${tablas[tabla].columnas}
            `
        );
    }
    helpers.log(`Tablas creadas`);

}

/**
 * Esta función inserta determinado número de usuarios con datos generado
 * automáticamente por Faker, usando una conexion a MYSQL.
 *
 * @param {number} numeroDeUsuarios - Número de usuarios que se desea insertar
 *   en la tabla.
 * @param {Object} conexion - Conexión a MYSQL
 */
async function llenarTablaUsuarios(numeroDeUsuarios, conexion) {
    for (let i = 0; i < numeroDeUsuarios; i++) {
        const nombre = faker.name.findName();
        const biografia = faker.lorem.paragraph(fakerConfig.usuarios.parrafosBiografia);
        const email = faker.internet.email();
        const contraseña = faker.internet.password();
        const avatar = path.join(
            faker.system.directoryPath(),
            faker.system.fileName()
        );

        await conexion.query(
            `
            INSERT INTO usuarios ( nombre, biografia, email, contraseña, avatar, fecha, codigo_validacion )
            VALUES( ?, ?, ?, SHA2(?,512), ? ,?,?)
            `,
            [
                nombre,
                biografia,
                email,
                contraseña,
                avatar,
                helpers.formatearDateMysql(new Date()),
                helpers.generateRandomString(),
            ]
        );
    }
    helpers.log(`Insertados ${numeroDeUsuarios} registros en la tabla usuarios`);
}

/**
 * Esta función inserta un número determinado de experiencias con datos
 * generados automáticamente por Faker, usando una conexion a MYSQL.
 *
 * @param {number} numeroDeExperiencias
 * @param {Object} conexion
 */
async function llenarTablaExperiencias(numeroDeExperiencias, conexion) {
    const { experiencias } = fakerConfig;
    for (let i = 0; i < numeroDeExperiencias; i++) {
        const fecha_insert = helpers.formatearDateMysql(new Date());
        const nombre = faker.commerce.productName();
        const descripcion = faker.lorem.paragraph(experiencias.parrafosDescripcion);
        const precio = lodash.random(experiencias.precio.minimo, experiencias.precio.maximo);
        const ubicacion = faker.address.city();
        const rating = lodash.random(experiencias.rating.minimo, experiencias.rating.maximo);
        const plazasTotales = lodash.random(experiencias.plazas.minimas, experiencias.plazas.maximas);
        const fechaInicial = helpers.formatearDateMysql(new Date());
        const fechaFinal = helpers.formatearDateMysql(new Date());

        await conexion.query(
            `
            INSERT INTO experiencias (fecha_insert, nombre, descripcion, fecha_inicial, fecha_final,rating,precio,ubicacion,plazas_totales)
            VALUES(?,?,?,?,?,?,?,?,?)
            `,
            [
                fecha_insert,
                nombre,
                descripcion,
                fechaInicial,
                fechaFinal,
                rating,
                precio,
                ubicacion,
                plazasTotales,
            ]
        );
    }
    helpers.log(
        `Insertados ${numeroDeExperiencias} registros en la tabla experiencias`
    );
}

/**
 * Esta función inserta en la tabla usuarios al usuario administrador, tomando
 * como credenciales las variables de entorno ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD
 *
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
            "admin",
            true,
        ]
    );
    helpers.log("Cuenta de administrador creada");
}

/** Configura completamente la base de datos */
async function config() {

    const { RESET_DB } = process.env;
    let conexion;
    try {
        conexion = await conexionMysql();
        if (RESET_DB === 'true') {      //Si la variable de entorno RESET_DB es true reseteamos la base de datos.
            await eliminarTablas(conexion);
            await crearTablas(conexion);
            await llenarTablaUsuarios(fakerConfig.usuarios.cantidad, conexion);
            await llenarTablaExperiencias(fakerConfig.experiencias.cantidad, conexion);
            await crearAdministrador(conexion);
        } else if (RESET_DB === 'false') {       //De lo contrario sólo creamos las tablas si no existen.
            await crearTablas(conexion);
        } else {
            throw new Error('Valor de variable de entorno RESET_DB no válido')
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
