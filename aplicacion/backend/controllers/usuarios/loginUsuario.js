/**
 * Esta función logea a los usuarios con credenciales correctas respondiendo con un JWT. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function loginUsuario(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Login usuario',
        });
    } catch (error) {
        next(error);
    }
}
module.exports = loginUsuario;