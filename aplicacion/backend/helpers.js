const chalk = require('chalk');
const crypto = require('crypto');
const format = require('date-fns').format;
const { ensureDir } = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");

/**
 * 
 * @returns {string}
 */


async function guardarFoto(foto) {
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
 * Formatea y estiliza mensajes de error.
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

module.exports = { guardarFoto, generateRandomString, log, logError, formatearDateMysql }