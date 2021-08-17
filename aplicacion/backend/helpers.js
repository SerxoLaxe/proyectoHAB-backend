const chalk = require('chalk');
const crypto = require('crypto');
const format = require('date-fns').format;
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

module.exports = { generateRandomString, log, logError, formatearDateMysql }