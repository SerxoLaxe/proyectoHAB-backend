/**
 * Elimina un registro de la tabla de experiencias especificando un ID. ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function eliminarExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Eliminar experiencia',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = eliminarExperiencia;