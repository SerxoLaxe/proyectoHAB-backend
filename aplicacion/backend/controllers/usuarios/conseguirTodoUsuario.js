/**
 * Responde con un array de todos los usuarios registrados. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirTodoUsuario(req, res, next){
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'conseguir todo usuario',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = conseguirTodoUsuario;