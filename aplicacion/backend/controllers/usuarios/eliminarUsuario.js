const conexionMysql = require('../../DB/conexionMysql');

/**
 * Elimina un usuario 👍 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function eliminarUsuario(req, res, next) {
    let conexion;
    try {
        conexion = await conexionMysql();
        await conexion.query(
            `
            DELETE FROM usuarios WHERE id=?
            `,
            [req.params.id])

        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: `Eliminado usuario  con id ${req.params.id}`
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

module.exports = eliminarUsuario;