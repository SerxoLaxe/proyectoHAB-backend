const { validate } = require("../../helpers");
const conexionMysql = require("../../DB/conexionMysql");
const { puntuarExperienciaSchema } = require("../../schemas/index");

/**
 * Puntua una experiencia del 0 al 5 añadiendo opcionalmente un comentario. 👍
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function puntuarExperiencia(req, res, next) {
  let conexion;
  try {
    await validate(puntuarExperienciaSchema, req.body);
    const idUsuario = req.userAuth.id;
    const idExperiencia = req.params.id;
    conexion = await conexionMysql();
    await existenReservaPuntuacion(conexion, idUsuario, idExperiencia);
    await haFinalizadoLaExperiencia(conexion, idExperiencia, req.body);
    await guardarPuntuacion(conexion, req);
    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: "Experiencia puntuada correctamente",
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}
/**
 * Comprueba si el usuario está en la lista de reservas y si está cancelada,
 * dando error cuando no está presente o si ha cancelado su reserva. También
 * comprueba si el usuario ha puntuado ya la experiencia en la que participó,
 * dando error si este es el caso.
 *
 * @param {any} conexion
 * @param {any} idUsuario
 * @param {any} idExperiencia
 */
async function existenReservaPuntuacion(conexion, idUsuario, idExperiencia) {
  const [resultado] = await conexion.query(
    `
        SELECT res.id AS id_reserva, punt.id AS id_puntuacion FROM reservas AS res
        LEFT JOIN puntuaciones AS punt ON punt.id_usuario = res.id_usuario AND punt.id_experiencia = res.id_experiencia

        WHERE res.id_usuario=? 
        AND res.id_experiencia=?
        AND res.cancelada=false
        `,
    [idUsuario, idExperiencia]
  );

  if (resultado.length === 0) {
    const error = new Error("no has participado en esta experiencia ");
    error.httpStatus = 404;
    throw error;
  }

  if (resultado[0].id_puntuacion !== null) {
    const error = new Error("Ya has puntuado esta experiencia");
    error.httpStatus = 401;
    throw error;
  }
}

/**
 * Comprueba si la experiencia ha finalizado para así sólo permitir al usuario
 * puntuarla después de haberla realizado.
 *
 * @param {any} conexion
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

  if (fechaActual < fechaFinalExperiencia) {
    const error = new Error("La experiencia aún no ha finalizado");
    error.httpStatus = 400;
    throw error;
  }
}

async function guardarPuntuacion(conexion, req) {
  const idUsuario = req.userAuth.id;
  const idExperiencia = req.params.id;
  const {
    body: {
      puntuacion,
      comentario
    },
  } = req;

  await conexion.query(
    `
        INSERT into puntuaciones(fecha, comentario, puntuacion, id_usuario, id_experiencia)
        VALUES (?,?,?,?,?)
        `,
    [
      new Date(),
      comentario,
      parseFloat(puntuacion).toPrecision(2),
      idUsuario,
      idExperiencia,
    ]
  );

  const [puntuaciones] = await conexion.query(
    `
    SELECT id_usuario, puntuacion, comentario
    FROM puntuaciones
    WHERE id_experiencia=?
    `,
    [idExperiencia]
  );

  await conexion.query(
    `
    UPDATE experiencias SET rating=?
    WHERE id=?
    `,
    [conseguirMediaPuntuaciones(puntuaciones),
    idExperiencia]);
}

function conseguirMediaPuntuaciones(puntuaciones) {
  let sumaDeTodasLasPuntuaciones;
  if (puntuaciones.length > 1) {
    sumaDeTodasLasPuntuaciones = puntuaciones.reduce((acc, object) => {
      return (acc + object.puntuacion)
    }, 0);
  } else if (puntuaciones.length === 0) {
    return [];
  } else {
    sumaDeTodasLasPuntuaciones = puntuaciones[0].puntuacion
  }
  const puntuacionMedia = Math.round(sumaDeTodasLasPuntuaciones / puntuaciones.length);
  return puntuacionMedia;
}

module.exports = puntuarExperiencia;
