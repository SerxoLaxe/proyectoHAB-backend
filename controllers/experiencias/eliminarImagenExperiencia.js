const conexionMysql = require("../../DB/conexionMysql");
const { eliminarImagen } = require("../../helpers");
/**
 * Elimina una imagen de la experiencia especificada. ❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function eliminarImagenExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const { idImagen } = req.params;

    const [imagen] = await conexion.query(
      `
      SELECT foto, thumbnail FROM experiencias_fotos WHERE id=? 
    `,
      [idImagen]
    );

    if (imagen.length === 0) {
      const error = new Error(
        `La foto con id ${idImagen} no existe.`
      );
      error.httpStatus = 404;
      throw error;
    }

    // elimino la imagen del disco
    await eliminarImagen(imagen[0].foto);

    // Elimino el thumbnail.
    await eliminarImagen(imagen[0].thumbnail)

    // elimino la imagen de la tabla
    await conexion.query(
      `
    DELETE FROM experiencias_fotos WHERE id=?
    `,
      [idImagen]
    );

    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: `La imagen ${idImagen} ha sido eliminada`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}
module.exports = eliminarImagenExperiencia;
