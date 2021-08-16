/**
 * Elimina un usuario. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function eliminarUsuario(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'eliminar usuario',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = eliminarUsuario;