const conexionMysql = require("../../DB/conexionMysql");
const { formatearDateMysql } = require('../../helpers');

/**
 * Reserva una plaza de cierta experiencia. 👍 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
async function reservarExperiencia(req, res, next) {
    let conexion;
    try {
        conexion = await conexionMysql();
        const idExperiencia = req.params.id;
        const idUsuario = req.userAuth.id;
        await existeReserva(conexion, [idUsuario, idExperiencia]);
        await quedanPlazas(conexion, idExperiencia);
        await insertarReserva(conexion, [idUsuario, idExperiencia]);
        res.send({
            status: 'Ok',
            message: 'reserva efectuada'
        });
    } catch (err) {
        next(err)
    } finally {
        if (conexion) conexion.release();
    }
}

/**
 *  Inserta en la tabla reservas la tupla necesaria.
 * @param {Object} conexion - Conexion a pool de mysql
 * @param {[number]} param1 - ID del usuario e ID de la experiencia
 */
async function insertarReserva(conexion, [idUsuario, idExperiencia]) {
    await conexion.query(
        `
        INSERT INTO reservas (fecha, id_experiencia, id_usuario)
        VALUES (?,?,?)
        `,
        [formatearDateMysql(new Date()), idExperiencia, idUsuario]
    );
}

/**
 * Comprueba si ya existe la reserva.
 * @param {Object} conexion - Conexion a pool de mysql
 * @param {[number]} param1 - ID del usuario e ID de la experiencia
 */
async function existeReserva(conexion, [idUsuario, idExperiencia]) {
    const [data] = await conexion.query(
        `
        SELECT id FROM reservas
        WHERE id_experiencia=? AND id_usuario=? 
        `,
        [idExperiencia, idUsuario]
    );

    if (data.length > 0) {
        const error = new Error('Usuario ya cuenta con reserva');
        error.httpStatus = 303;
        throw error;
    }
}

/**
 * Comprueba si quedan plazas disponibles teniendo en cuenta las plazas_totales de la experiencia y el número de reservas que hay registradas de esta en la tabla reservas.
 * @param {Object} conexion - Conexion a pool de mysql
 * @param {[number]} param1 - ID del usuario e ID de la experiencia
 */
async function quedanPlazas(conexion, idExperiencia) {
    const [plazas] = await conexion.query(
        `
        SELECT exp.plazas_totales FROM experiencias exp
        INNER JOIN reservas res ON res.id_experiencia = exp.id
        WHERE exp.id = ?
        `,
        [idExperiencia]
    );

    if (
        typeof plazas !== 'undefined' &&
        plazas.length > 0 &&
        plazas.length >= plazas[0].plazas_totales
    ) {
        const error = new Error('No quedan plazas disponibles');
        error.httpStatus = 303;
        throw error;
    }
}

module.exports = reservarExperiencia;