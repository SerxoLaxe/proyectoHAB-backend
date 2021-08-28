const chalk = require('chalk');
const crypto = require('crypto');
const format = require('date-fns').format;
const { ensureDir } = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");

/**
 * Esta función guarda imagenes en el directorio determinado por la variable de entorno UPLOAD_DIRECTORY.
 * @param {Object} foto - Objeto imagen de Sharp.
 * @returns {string} - Nombre de la imagen.
 */
async function guardarImagenesExperiencia(foto) {
    const { UPLOAD_DIRECTORY } = process.env;
    const recursosDir = path.join(__dirname, UPLOAD_DIRECTORY);
    await ensureDir(recursosDir);                               //compruebo si hay en el directorio de recursos y sino lo creo 
    const imagen = sharp(foto.data);                            //leo el buffer (foto.data) con sharp
    imagen.resize(600);                                         //controlo el tamaño
    const nombreImagen = `${uuid.v4()}.jpg`;                    //genero un nombre para la foto con uuid sin controlar el formato
    await imagen.toFile(path.join(recursosDir, nombreImagen));  //guardo la imagen en mi directorio de recursos 
    return nombreImagen;                                         //devuelvo el nombre de la foto
}

/**
 * Genera y retorna una string aleatoria de 40 bytes de longitud.
 * @returns {string}
 */
function generateRandomString() {
    return crypto.randomBytes(40).toString("hex");
}

/**
* Formatea y estiliza mensajes de log.
* @param {string} message 
*/
function log(message) {
    console.log(chalk.green.bold('==> ') + message);
}

/**
 * Formatea y estiliza mensajes de error. Si la variable de entorno VERBOSE es true, muestra el stacktrace, de lo contrario sólo muestra el mensaje de error.
 * @param {Object} error 
 */
function logError(error) {

    if (process.env.VERBOSE === 'true') {
        console.error(chalk.red(error.stack));
    } else {
        console.error(chalk.red.bold(error));
    }
}

/**
 * Formatea una fecha de tipo Date para que esta pueda ser introducida en una columna DATA de MYSQL.
 * @param {Date} dateObject 
 * @returns {string}
 */
function formatearDateMysql(dateObject) {
    return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

/**
 * Valida los datos introducidos en el body o query de las peticiones.
 * @param {Object} schema - Esquema de requisitos a analizar
 * @param {Object} data - Objeto que posee los datos a validar
 */
async function validate(schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}


module.exports = { validate, guardarImagenesExperiencia, generateRandomString, log, logError, formatearDateMysql }