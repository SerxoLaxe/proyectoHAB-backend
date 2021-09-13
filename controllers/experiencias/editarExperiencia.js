const conexionMysql = require("../../DB/conexionMysql");
const { formatearDateMysql, validate } = require("../../helpers");
const { editarExperienciaSchema } = require("../../schemas");

/**
 * Realiza un UPDATE en la tabla experiencias introduciendo los datos
 * proporcionados en el body de la petición. ❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function editarExperiencia(req, res, next) {
  let conexion;
  try {
    // validamos la peticion mediante Joi.
    await validate(editarExperienciaSchema, req);

    conexion = await conexionMysql();

    const { id } = req.params;

    const {
      nombre,
      descripcion,
      fecha_inicial,
      fecha_final,
      precio,
      ubicacion,
      plazas_totales,
    } = req.body;

    // compruebo si esta vacio
    if (id.length === 0) {
      const error = new Error("No existe ninguna experiencia con ese id");
      error.httpStatus = 404;
      throw error;
    }

    // compruebo los campos minimos
    if (
      !nombre ||
      !descripcion ||
      !fecha_inicial ||
      !fecha_final ||
      !precio ||
      !ubicacion ||
      !plazas_totales
    ) {
      const error = new Error("Faltan campos obligatorios");
      console.log(error);
    }
    const fecha_mod = new Date();
    await conexion.query(
      `
    UPDATE experiencias SET fecha_insert=?, nombre=?, descripcion=?, fecha_inicial=?, fecha_final=?, precio=?, ubicacion=?, plazas_totales=?
    WHERE id=?
    `,
      [
        formatearDateMysql(fecha_mod),
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        precio,
        ubicacion,
        plazas_totales,
        id,
      ]
    );

    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: {
        id,
        fecha_mod,
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        precio,
        ubicacion,
        plazas_totales,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}
module.exports = editarExperiencia;
