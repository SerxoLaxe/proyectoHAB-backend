/**
 * Edita el usuario indicado por su ID, introduciendo nuevos valores en las columnas de nombre, biografía y avatar. ❌
 */
async function editarUsuario(req, res, next) {

    try {
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'editar usuario',
        });

    } catch (error) {
        next(error);
    }
}
module.exports = editarUsuario;