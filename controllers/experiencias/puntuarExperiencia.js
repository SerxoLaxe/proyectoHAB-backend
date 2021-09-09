const { validate } = require('../../helpers');
const conexionMysql = require('../../DB/conexionMysql');
const { puntuarExperienciaSchema } = require('../../schemas/index');
const { id } = require('date-fns/locale');
/**
 * Puntua una experiencia del 0 al 5. (posiblemente exista un módulo npm que facilite esta función). ❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function puntuarExperiencia(req, res, next) {
    let conexion;
    try {
        await validate(puntuarExperienciaSchema, req.body);
        const idUsuario = req.userAuth.id
        const idExperiencia = req.params.id;
        conexion = await conexionMysql();
        await existenReservaPuntuacion(conexion, idUsuario, idExperiencia);
        await haFinalizadoLaExperiencia(conexion, idExperiencia, req.body);
        await guardarPuntuacion(conexion, req)
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'lalala',
        });
    } catch (error) {
        next(error)
    } finally {
        if (conexion) conexion.release();
    }
}
/**
 * Comprueba si el usuario está en la lista de reservas y si está cancelada, dando error cuando no está presente o si ha cancelado su reserva.
 * También comprueba si el usuario ha puntuado ya su experiencia, dando error si este es el caso.
 * @param {*} conexion 
 * @param {*} idUsuario 
 * @param {*} idExperiencia 
 */
async function existenReservaPuntuacion(conexion, idUsuario, idExperiencia) {
    const [resultado] = await conexion.query(
        `
        SELECT res.id, punt.id FROM reservas AS res
        LEFT JOIN puntuaciones AS punt ON punt.id_usuario = res.id_usuario
        WHERE res.id_usuario=? 
        AND res.id_experiencia=?
        AND res.cancelada=false
        `,
        [idUsuario, idExperiencia]);

    if (resultado.length === 0) {
        const error = new Error('no has participado en esta experiencia ');
        error.httpStatus = 404;
        throw error;
    }
    if (resultado[0].id !== null) {
        const error = new Error('Ya has puntuado esta experiencia');
        error.httpStatus = 401;
        throw error;
    }
}

/**
 * Comprueba si la experiencia ha finalizado para así sólo permitir al usuario puntuarla después de haberla realizado.
 * @param {*} conexion 
 */
async function haFinalizadoLaExperiencia(conexion, idExperiencia) {

    const [resultado] = await conexion.query(
        `
    SELECT fecha_final FROM experiencias
    WHERE id=?
    `,
        [idExperiencia]
    );
    const fechaFinalExperiencia = resultado[0].fecha_final;
    const fechaActual = new Date();

    console.log(
        'fecha actual:', fechaActual,
        'fecha final Experiencia:', fechaFinalExperiencia
    );

    if (fechaActual <= fechaFinalExperiencia) {
        const error = new Error('La experiencia aún no ha finalizado');
        error.httpStatus = 400;
        throw error;
    }
}

async function guardarPuntuacion(conexion, req) {
    const idUsuario = req.userAuth.id
    const idExperiencia = req.params.id;
    const {
        body: {
            puntuacion,
            comentario
        }
    } = req

    await conexion.query(
        `
        INSERT into puntuaciones(fecha, comentario, puntuacion, id_usuario, id_experiencia)
        VALUES (?,?,?,?,?)
        `,
        [new Date, comentario, parseFloat(puntuacion).toPrecision(2), idUsuario, idExperiencia]
    )
}
module.exports = puntuarExperiencia;