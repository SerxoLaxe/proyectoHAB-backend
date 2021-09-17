const conexionMysql = require("../../DB/conexionMysql");
const {
  formatearDateMysql,
  validate,
  guardarImagen,
} = require("../../helpers");
const { añadirExperienciaSchema } = require("../../schemas");

/**
 * Añade una experiencia a la tabla de experiencias 👍
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function añadirExperiencia(req, res, next) {
  let conexion;
  try {
    // Validamos la petición mediante Joi.
    await validate(añadirExperienciaSchema, req);

    // Creamos una conexión a la BD.
    conexion = await conexionMysql();

    // Procesamos los parámetros del body.
    const idExperiencia = await procesarBody(req, conexion);

    // Procesamos las imágenes.
    await procesarImagenes(req.files, conexion, idExperiencia);
    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: `Experiencia ${idExperiencia} guardada correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) {
      conexion.release();
    }
  }
}

async function procesarBody(req, conexion) {
  // Almacenamos la fecha actual.
  const now = formatearDateMysql(new Date());

  // Saco los datos del body.
  const {
    nombre,
    descripcion,
    fecha_inicial,
    fecha_final,
    precio,
    ubicacion,
    plazas_totales,
  } = req.body;
  const idAutor = req.userAuth.id;

  // hacemos la INSERT en el DB.
  const [result] = await conexion.query(
    `
        INSERT INTO experiencias (fecha_insert, nombre, descripcion, fecha_inicial, fecha_final, precio, ubicacion, plazas_totales, id_autor)
        VALUES (?,?,?,?,?,?,?,?,?)
        `,
    [
      now,
      nombre,
      descripcion,
      fecha_inicial,
      fecha_final,
      precio,
      ubicacion,
      plazas_totales,
      idAutor,
    ]
  );
  return result.insertId;
}

async function procesarImagenes(files, conexion, idExperiencia) {
  // Almacenamos la fecha actual
  const now = formatearDateMysql(new Date());
  const fotos = [];

  //Iteramos por cada archivo presente en files.
  for (const foto of Object.values(files)) {
    const nombreFotoNormal = await guardarImagen(foto, 600);
    const nombreFotoThumbnail = await guardarImagen(foto, 75);
    fotos.push(
      [now, nombreFotoNormal, idExperiencia, "normal"],
      [now, nombreFotoThumbnail, idExperiencia, "thumbnail"],
    );
  }
  
  //Las inserto en la DB.
  await conexion.query(
    `
            INSERT INTO experiencias_fotos (fecha_foto, foto, experiencia_id, tipo)
            VALUES ?
            `, [fotos]
  );

}

module.exports = añadirExperiencia;
