const conexionMysql = require("../../DB/conexionMysql");

/**
 * Selecciona de la tabla de experiencias un único registro especificando su ID. 👍
 *
 * @param req
 * @param {any} res
 * @param {any} next
 */
async function conseguirExperienciaID(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();
    const { id } = req.params;
    const [result] = await conexion.query(
      `
            SELECT * FROM experiencias WHERE id=?
            `,
      [id]
    );

    const [fotos] = await conexion.query(
      `
    SELECT id, fecha_foto, foto, thumbnail
    FROM experiencias_fotos
    WHERE experiencia_id = ? 
    `,
      [id]
    );

    const [puntuaciones] = await conexion.query(
      `
      SELECT id_usuario, puntuacion, comentario
      FROM puntuaciones
      WHERE id_experiencia=?
      `,
      [id]
    )

    res.send({
      status: "Ok",
      data: {
        ...result[0],
        fotos,
        puntuaciones
      },
    });
  } catch (err) {
    next(err);
  } finally {
    if (conexion) conexion.release();
  }
}

module.exports = conseguirExperienciaID;
