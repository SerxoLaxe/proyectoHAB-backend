/**
 * Elimina una imagen de la experiencia especificada. ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function eliminarImagenExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Eliminar imagen experiencia',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = eliminarImagenExperiencia;