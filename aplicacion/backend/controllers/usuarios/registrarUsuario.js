const conexionMysql = require('../../DB/conexionMysql');

/**
 * Registra un nuevo usuario tomando del body de la petición el email y la contraseña, genera para el usuario un código de registro. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function registrarUsuario(req, res, next) {
    let conexion
    try {
        conexion = await conexionMysql();
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Registrar usuario',
        });
    } catch (error) {
        next(error);
    } finally{
        if (conexion){
            conexion.release()
        }
    }
}
module.exports = registrarUsuario;