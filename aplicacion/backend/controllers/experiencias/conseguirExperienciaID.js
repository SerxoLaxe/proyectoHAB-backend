/**
 * Selecciona de la tabla de experiencias un único registro especificando su ID. ❌ 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirExperienciaID(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Conseguir experiencia mediante ID',
        });
    } catch (error) {
        next(error)
    }
}
module.exports = conseguirExperienciaID;