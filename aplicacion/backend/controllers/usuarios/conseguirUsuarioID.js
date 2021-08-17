/**
 * Devuelve el usuario con id introducido como parámetro. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirUsuarioID(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Conseguir usuario mediante ID',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = conseguirUsuarioID;