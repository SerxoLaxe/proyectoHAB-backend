/**
 * Cambia la contraseña del usuario ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function cambiarContraseña(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Cambiar contraseña',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = cambiarContraseña;