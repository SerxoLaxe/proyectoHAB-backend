const conexionMysql = require('../../DB/conexionMysql');

/**
 * Elimina un usuario 👍 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function eliminarUsuario(req, res, next) {
    let conexion;
    try {
        conexion = await conexionMysql();

        // sacar el id usuario que queremos eliminar.
        const { id } = req.params;

        console.log("ID usuario", id);

        // se el usuario que quiero borrar el el id=1 (admin) salgo con error
        if (Number(id) === 1) {
            const error = new Error("El administrador no se pude eliminar");
            error.httpStatus = 403;
            throw error;
        }

        // si no es admin o el usuario que quiero borrar no coincide con el usuario de login salgo con un error
        if (req.userAuth.role !== "admin" && req.userAuth.id !== Number(id)) {
            const error = new Error(
                "No tienes los permisos para eliminar este usuario"
            );
            error.httpStatus = 403;
            throw error;
        }

        // hacemos el borrado logico del usuario:
        // UPDATE: deleted = 1, password="[BORRADO]", name="[BORRADO]", avatar=NULL, active=0, lastAuthUpdate=new Date()
        await conexion.query(
            `
        UPDATE usuarios
        SET contraseña="[BORRADO]", nombre="[BORRADO]", biografia="[BORRADO]" ,avatar=NULL, activo=0, eliminado=1, ultimo_cambio_contraseña=?
        WHERE id=?
    `,
            [new Date(), id]
        );

        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: `Eliminado usuario  con id ${req.params.id}`
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

module.exports = eliminarUsuario;