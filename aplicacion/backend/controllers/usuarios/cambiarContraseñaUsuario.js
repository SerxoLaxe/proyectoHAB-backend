const conexionMysql = require('../../DB/conexionMysql')
/**
 * Cambia la contraseña del usuario ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function cambiarContraseña(req, res, next) {
    let conexion;
    console.log(res.query);
    try {
        conexion = await conexionMysql();
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Cambiar contraseña',
        });
    } catch (error) {
        next(error)
    } finally{
        if (conexion) conexion.release();
    }
}
module.exports = cambiarContraseña;