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
        SELECT experiencias.id, experiencias.nombre, experiencias.descripcion, experiencias.fecha_inicial, 
        experiencias.fecha_final, experiencias.rating, experiencias.precio, experiencias.ubicacion, experiencias.plazas_totales
        FROM experiencias
        WHERE experiencias.id LIKE ?
    `,
      [id]
    );

    let [single] = result;

    const [fotos] = await conexion.query(
      `
    SELECT id, fecha_foto, foto
    FROM experiencias_fotos
    WHERE experiencia_id = ? 
    `,
      [id]
    );

    res.send({
      status: "Ok",
      data: {
        ...single,
        fotos,
      },
    });
  } catch (err) {
    next(err);
  } finally {
    if (conexion) conexion.release();
  }
}

module.exports = conseguirExperienciaID;
