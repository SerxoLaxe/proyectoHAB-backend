/**
 * Realiza un UPDATE en la tabla experiencias introduciendo los datos proporcionados en el body de la petición. ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function editarExperiencia(req, res, next) {
    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Editar experiencia',
        });

    } catch (error) {
        next(error);
    }
}
module.exports = editarExperiencia;