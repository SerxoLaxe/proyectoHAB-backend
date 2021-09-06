const conexionMysql = require('../DB/conexionMysql');

/**
 * Este middleware comprueba si la experiencia o el usuario con el id proporcionado existe en la base de datos
 */
async function existe(req, res, next) {

    let conexion;
    try {
        const tabla = req.path.split('/')[1];  //O es experiencias o es usuarios.
        const id = req.params.id;
        conexion = await conexionMysql();
        const [resultado] = await conexion.query(
            `
            SELECT id 
            FROM ${tabla}
            WHERE id=?
            `,
            [id]
        );
        if (resultado.length <= 0) {
            throw new Error(`No encontrado en ${tabla}`);
        }
        next();

    } catch (error) {
        error.httpStatus = 404;
        next(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}
module.exports = existe;