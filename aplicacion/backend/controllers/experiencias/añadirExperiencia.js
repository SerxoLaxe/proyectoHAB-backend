const conexionMysql = require("../../DB/conexionMysql");
const { formatearDateMysql, guardarFoto } = require("../../helpers");
/**
 * Añade una experiencia a la tabla de experiencias ❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function añadirExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    //saco los datos del body, instalo express-fileupload
    const {
      nombre,
      descripcion,
      fecha_inicial,
      fecha_final,
      rating,
      precio,
      ubicacion,
      plazas_totales,
    } = req.body;

    console.log(req.body);

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
      error.httpStatus = 400;
      throw error;
    }
    // hacemos la INSERT en el DB
    const now = new Date();

    const [result] = await conexion.query(
      `
		INSERT INTO experiencias (fecha_insert, nombre, descripcion, fecha_inicial, fecha_final, rating, precio, ubicacion, plazas_totales)
		VALUES (?,?,?,?,?,?,?,?,?)
	
	`,
      [
        formatearDateMysql(now),
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        rating,
        precio,
        ubicacion,
        plazas_totales,
      ]
    );

    console.log(req);

    //saco el id de la nueva experiencia
    const { insertId } = [result];

    //proceso las fotos
    const fotos = [];
    if (req.files && Object.keys(req.files).length > 0) {
      for (const foto of Object.values(req.files).slice(0, 4)) {
        console.log(foto);
        //creo en helpers una funcion que me guarda las fotos
        const nombreFoto = await guardarFoto(foto);
        fotos.push(nombreFoto);

        //las inserto en el DB
        await conexion.query(
          `
				INSERT INTO experiencias_fotos (fecha_foto, foto, experiencia_id)
				VALUES (?,?,?)
				`,
          [formatearDateMysql(now), nombreFoto, result.insertId]
        );
      }
    }

    res.statusCode = 200;
    res.send({
      status: "Ok",
      data: {
        id: insertId,
        fecha_insert: now,
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        rating,
        precio,
        ubicacion,
        plazas_totales,
        fotos: fotos,
      },
    });
  } catch (error) {
    next(error);
  }
}
module.exports = añadirExperiencia;
