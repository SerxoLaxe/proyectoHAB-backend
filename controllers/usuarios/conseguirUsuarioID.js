const conexionMysql = require("../../DB/conexionMysql");

/**
 * Devuelve el usuario con id introducido como parámetro. 👍
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function conseguirUsuarioID(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();
    const [resultado] = await conexion.query(
      `SELECT id, nombre, biografia, avatar, privilegios FROM usuarios WHERE id=?`,
      [req.params.id]
    );
    res.statusCode = 200;
    res.send({
      status: "Ok",
      data: resultado,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) {
      conexion.release();
    }
  }
}

module.exports = conseguirUsuarioID;
