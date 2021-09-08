/**
 * Puntua una experiencia del 0 al 5. (posiblemente exista un módulo npm que facilite esta función). ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function puntuarExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Puntuar experiencia',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = puntuarExperiencia;