const conexionMysql = require('../../DB/conexionMysql');

/**
 * Responde con un array de todos los usuarios registrados. 👍
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirTodoUsuario(req, res, next){
    let conexion;
    try {
        conexion = await conexionMysql();

        const [resultado] = await conexion.query(
            `
            SELECT * FROM usuarios
            `
        )

        res.statusCode = 200;
        res.send({
            status: 'Ok',
            data: resultado,
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

module.exports = conseguirTodoUsuario;