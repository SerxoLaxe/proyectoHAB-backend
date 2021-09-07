const conexionMysql = require("../../DB/conexionMysql");

/**
 * Cancela la reserva de cierta experiencia 👍 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
async function cancelarExperiencia(req, res, next) {
    let conexion;
    try {
        conexion = await conexionMysql();
        const idExperiencia = req.params.id;
        const idUsuario = req.userAuth.id;
        await existeReserva(conexion, idUsuario, idExperiencia);
        await cancelarReserva(conexion, idUsuario, idExperiencia)
        res.send({
            status: 'Ok',
            data: 'reserva cancelada'
        });
    } catch (err) {
        next(err)
    } finally {
        if (conexion) conexion.release();
    }
}

/**
 * Comprueba si ya existe la reserva.
 * @param {Object} conexion 
 * @param {number} idUsuario 
 * @param {number} idExperiencia 
 */
async function existeReserva(conexion, idUsuario, idExperiencia) {
    const [data] = await conexion.query(
        `
        SELECT id FROM reservas
        WHERE id_experiencia=? AND id_usuario=? AND cancelada=false
        `,
        [idExperiencia, idUsuario]
    );

    if (data.length === 0) {
        const error = new Error('Reserva no encontrada');
        error.httpStatus = 404;
        throw error;
    }
}

/**
 * Actualiza la el regitro pertinente de la tabla reservas.
 * @param {Object} conexion 
 * @param {number} idUsuario 
 * @param {number} idExperiencia 
 */
async function cancelarReserva(conexion, idUsuario, idExperiencia) {
    await conexion.query(
        `
        UPDATE reservas
        SET cancelada=true
        WHERE id_usuario=? AND id_experiencia=?
        `,
        [idUsuario, idExperiencia]
    );
}

module.exports = cancelarExperiencia;