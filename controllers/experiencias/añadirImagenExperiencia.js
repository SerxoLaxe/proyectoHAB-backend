const conexionMysql = require("../../DB/conexionMysql");
const { formatearDateMysql, validate, guardarImagenExperiencia } = require("../../helpers");
const { imagenesExperienciaSchema } = require('../../schemas')

/**
 * Añade una imagen a la experiencia especificada. 👍
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function añadirImagenExperiencia(req, res, next) {
  let conexion;
  try {
    await validate(imagenesExperienciaSchema, req.files);
    const { params: { id } } = req;
    conexion = await conexionMysql();
    await cabenMasImagenes(conexion, id, req.files);
    await guardarImagenes(conexion, req.files, id);
    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: `Añadidas ${Object.values(req.files).length} imágenes a experiencia ${id}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}

async function cabenMasImagenes(conexion, id, files) {

  // Controlo si la experiencia tiene un máximo de 4 fotos
  const [currentFotos] = await conexion.query(
    `
    SELECT id FROM experiencias_fotos WHERE experiencia_id=?
    `,
    [id]
  );

  if (currentFotos.length >= 4) {
    const error = new Error(`La experiencia ${id} ya cuenta con 4 imágenes`);
    error.httpStatus = 403;
    throw error;
  }

  if (currentFotos.length > (4 - Object.values(files).length)) {
    const error = new Error(`No queda espacio para ${Object.values(files).length} imágenes, introduce como máximo ${4 - currentFotos.length}`);
    error.httpStatus = 403;
    throw error;
  }
}

async function guardarImagenes(conexion, files, id) {

  const now = formatearDateMysql(new Date());
  const fotos = [];
  for (const foto of Object.values(files)) {
    const [nombreFotoNormal, nombreFotoThumbnail] = await guardarImagenExperiencia(foto);
    fotos.push(
      [now, nombreFotoNormal, nombreFotoThumbnail, id]
    )
  }

  //añade la foto en la Base de Datos
  await conexion.query(
    `
    INSERT INTO experiencias_fotos (fecha_foto, foto, thumbnail, experiencia_id) VALUES ?
    `,
    [fotos]
  );
}

module.exports = añadirImagenExperiencia;
