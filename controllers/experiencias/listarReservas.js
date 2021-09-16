const conexionMysql = require("../../DB/conexionMysql");

/**
 * Responde con una selección de los usuarios que cuentan con reserva en cierta
 * experiencia. 👍
 *
 * @param req
 * @param {any} res
 * @param {any} next
 */
async function listarReservas(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();
    const { id } = req.params;
    const [result] = await conexion.query(
      `
            SELECT res.id, res.fecha, res.cancelada, usr.nombre, usr.avatar FROM reservas res
            INNER JOIN usuarios usr ON res.id_usuario=usr.id
            WHERE res.cancelada=false
            AND res.id_experiencia=? 
            `,
      [id]
    );

    res.send({
      status: "Ok",
      data: result,
    });
  } catch (err) {
    next(err);
  } finally {
    if (conexion) conexion.release();
  }
}

module.exports = listarReservas;
