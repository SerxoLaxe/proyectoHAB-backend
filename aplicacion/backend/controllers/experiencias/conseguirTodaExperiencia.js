const conexionMysql = require('../../DB/conexionMysql');
/** 
 * Responde con una array de todos los datos de la tabla experiencias. ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirTodaExperiencia(req, res, next) {
    let conexion
    try {
        conexion = await conexionMysql();
        const result = await conexion.query(
            `
            SELECT * FROM experiencias
            `
        )
        res.statusCode = 200;
        res.send(result);
    } catch (error) {
        next(error)
    } finally {
        if (conexion) {
            conexion.release();
        }
    }

}
module.exports = conseguirTodaExperiencia;