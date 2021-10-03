const conexionMysql = require("../../DB/conexionMysql");

/**
 * Responde con una array de todos los datos de la tabla experiencias y las fotos. 👍
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function conseguirTodaExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const [result] = await conexion.query(
      `
      SELECT exp.* , group_concat(fotos.thumbnail) as thumbnails FROM experiencias AS exp LEFT JOIN experiencias_fotos AS fotos ON fotos.experiencia_id=exp.id GROUP BY exp.id
    `
    );

    res.statusCode = 200;
    res.send({
      status: "Ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) {
      conexion.release();
    }
  }
}

module.exports = conseguirTodaExperiencia;
