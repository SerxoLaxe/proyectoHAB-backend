/**
 * Añade una imagen a la experiencia especificada. ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function añadirImagenExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Añadir imagen experiencia',
        });
    } catch (error) {
        next(error)
    } 
}
module.exports = añadirImagenExperiencia;