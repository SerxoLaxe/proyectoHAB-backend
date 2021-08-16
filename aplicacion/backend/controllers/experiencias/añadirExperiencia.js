/**
 * Añade una experiencia a la tabla de experiencias ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function añadirExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Añadir experiencia',
        });
    } catch (error) {
        next(error);
    } 
}
module.exports = añadirExperiencia;