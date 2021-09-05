const conexionMysql = require("../../DB/conexionMysql");

/**
 * BuscarExperiencias() toma los parámetros definidos en la query ylos usa para
 * buscar coincidencias en la tabla experiencias.❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function buscarExperiencias(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const { texto } = req.query;

    let result;

    if (texto) {
      [result] = await conexion.query(
        `
                SELECT experiencias.id, experiencias.nombre, experiencias.descripcion, experiencias.fecha_inicial, 
                experiencias.fecha_final, experiencias.rating, experiencias.precio, experiencias.ubicacion, experiencias.plazas_totales
                FROM experiencias
                WHERE experiencias.nombre LIKE ? OR experiencias.descripcion LIKE ?
            `,
        [`%${texto}%`, `%${texto}%`]
      );
    } else {
      [result] = await conexion.query(`
            SELECT * FROM experiencias
        `);
    }

    //console.log(result);

    res.statusCode = 200;
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}
module.exports = buscarExperiencias;
