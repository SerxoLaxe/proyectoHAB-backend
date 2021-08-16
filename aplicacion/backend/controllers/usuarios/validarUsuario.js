/**
 *  Valida usuarios mediante una petición GET, que usa la ruta /usuarios/validar/:código de validación. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function validarUsuario(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'validar usuario',
        });
    } catch (error) {
        next(error);
    }
}
module.exports = validarUsuario;