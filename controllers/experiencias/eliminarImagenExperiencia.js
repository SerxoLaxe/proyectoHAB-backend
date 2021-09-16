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

    const { id, imagenId } = req.params;

    const [fotoActual] = await conexion.query(
      `
    SELECT foto FROM experiencias_fotos WHERE id=? AND experiencia_id=?
    
    `,
      [imagenId, id]
    );

    if (fotoActual.length === 0) {
      const error = new Error(
        `La foto con el id: ${imagenId} no existe en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    }

    // elimino la imagen del disco
    await eliminarImagen(fotoActual[0].foto);

    // elimino la imagen de la tabla
    await conexion.query(
      `
    DELETE FROM experiencias_fotos WHERE id=? AND experiencia_id=?
    `,
      [imagenId, id]
    );

    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: `La imagen ${fotoActual[0].foto} ha sido eliminada`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}
module.exports = eliminarImagenExperiencia;
