/** 
 * Responde con una array de todos los datos de la tabla experiencias. ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirTodaExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Conseguir toda experiencia',
        });
    } catch (error) {
        next(error)
    } 

}
module.exports = conseguirTodaExperiencia;