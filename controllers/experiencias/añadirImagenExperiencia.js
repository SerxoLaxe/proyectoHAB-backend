const conexionMysql = require("../../DB/conexionMysql");
const { guardarImagen, formatearDateMysql } = require("../../helpers");
/**
 * Añade una imagen a la experiencia especificada. ❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function añadirImagenExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const { id } = req.params;

    //controlo si la experiencia tiene un maximo de 4 fotos
    const [currentFotos] = await conexion.query(
      `
    SELECT id FROM experiencias_fotos WHERE experiencia_id=?
    `,
      [id]
    );

    console.log(currentFotos);

    if (currentFotos.length >= 4) {
      const error = new Error(`La experiencia ${id} ya tiene 4 fotos`);
      error.httpStatus = 403;
      throw error;
    }

    let nuevaFoto;
    console.log(Object.values(req.files)[0]);
    if (req.files && Object.keys(req.files).length > 0) {
      nuevaFoto = await guardarImagen(Object.values(req.files)[0]);
    }
    //añade la foto en la Base de Datos
    await conexion.query(
      `
    INSERT INTO experiencias_fotos (fecha_foto, foto, experiencia_id) VALUES (?, ?, ?)
    `,
      [formatearDateMysql(new Date()), nuevaFoto, id]
    );
    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: "Añadir imagen experiencia",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = añadirImagenExperiencia;
