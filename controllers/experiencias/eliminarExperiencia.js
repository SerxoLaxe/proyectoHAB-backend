const conexionMysql = require("../../DB/conexionMysql");
const { eliminarImagen } = require("../../helpers");
/**
 * Elimina un registro de la tabla de experiencias especificando un ID. ❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function eliminarExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const { id } = req.params;

    // selecciono las fotos y thumbnails.
    const [fotos] = await conexion.query(
      `
    SELECT foto, thumbnail FROM experiencias_fotos WHERE experiencia_id=?

    `,
      [id]
    );

    // borro las fotos del disco
    for (const foto of fotos) {
      await eliminarImagen(foto.foto);
      await eliminarImagen(foto.thumbnail);
    }

    // borro las fotos en la base de datos.
    await conexion.query(
      `
    DELETE FROM experiencias_fotos WHERE experiencia_id=?
    `,
      [id]
    );

    // Borro los votos de la tabla puntuaciones.
    await conexion.query(
      `
    DELETE FROM puntuaciones WHERE id_experiencia=?
    `,
      [id]
    );

    //Borro las reservas.
    await conexion.query(
      `
    DELETE FROM reservas WHERE id_experiencia=?

    `,
      [id]
    );
    // Borro la experiencia.
    await conexion.query(
      `
    DELETE FROM experiencias WHERE id=?
    `,
      [id]
    );

    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: `La experiencia con id: ${id} y todos sus elementos han sido eliminados`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}

module.exports = eliminarExperiencia;
