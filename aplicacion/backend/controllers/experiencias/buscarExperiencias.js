/**
 * buscarExperiencias() toma los parámetros definidos en la query ylos usa para buscar coincidencias en la tabla experiencias.❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function buscarExperiencias(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'buscar experiencias',
        });
    } catch (error) {
        next(error);
    }
}
module.exports = buscarExperiencias;