const conexionMysql = require("../../DB/conexionMysql");
const { buscarExperienciaSchema } = require("../../schemas/index");
const { validate } = require("../../helpers");

/**
 * BuscarExperiencias() toma los parámetros definidos en la query y los usa para buscar coincidencias en la tabla experiencias. 👍
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function buscarExperiencias(req, res, next) {
  let conexion;
  try {
    // Validamos los datos con Joi.
    await validate(buscarExperienciaSchema, req.query);

    // Si no hay error, obtenemos conexión a Mysql.
    conexion = await conexionMysql();

    // Creamos una query SQL adaptada a los parámetros de la petición.
    const queryString = construirQueryString(req.query, conexion);

    // Realizamos la petición.
    const [result] = await conexion.query(queryString);

    // Si la petición no da errores, respondemos con los datos obtenidos.
    res.statusCode = 200;
    res.send({
      status: "Ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}

/**
 * Crea la string necesaria para realizar la petición correcta a Mysql.
 *
 * @param {Object} params - Parámetros a introducir en la tabla.
 * @returns {string} - La string apropiada.
 */
function construirQueryString(params, conexion) {
  const {
    texto,
    precioMinimo,
    precioMaximo,
    fechaInicial,
    fechaFinal
  } = params;

  // Parte inicial de la string que siempre se va a usar.
  const queryStartString = (
    `
    SELECT exp.* , group_concat(fotos.thumbnail) as thumbnails
    FROM experiencias AS exp
    LEFT JOIN experiencias_fotos AS fotos
    ON fotos.experiencia_id=exp.id 
    WHERE
    `);

    // Parte final de la string que siempre se va a usar
    const queryEndingString =  (
      `
      GROUP BY exp.id
      `);

  // Array en el que se irán añadiendo todas las condiciones.
  const queryArray = [];

  // Cuando el parámetro está definido se añade al queryArray el string que define la condición relativa al parámetro.
  if (typeof texto !== "undefined" && texto.length !== 0) {
    queryArray.push(
      `CONCAT(
            exp.nombre, 
            exp.descripcion, 
            exp.ubicacion) 
            LIKE ${conexion.escape(`%${texto}%`)}`
    );
  }

  if (typeof precioMinimo !== "undefined" && precioMinimo > 0) {
    queryArray.push(`exp.precio >= ${conexion.escape(precioMinimo)}`);
  }

  if (typeof precioMaximo !== "undefined" && precioMaximo > 0) {
    queryArray.push(`exp.precio <= ${conexion.escape(precioMaximo)}`);
  }

  if (typeof fechaInicial !== "undefined") {
    queryArray.push(
      `exp.fecha_inicial >= ${conexion.escape(fechaInicial)}`
    );
  }

  if (typeof fechaFinal !== "undefined") {
    queryArray.push(
      `exp.fecha_final <= ${conexion.escape(fechaFinal)}`
    );
  }

  // Concatenamos la parte invariable de la string (queryStartString y queryEndingString) junto con el array de condicionales, que es unido con el string ' AND '.
  // Pseudo resultado: 'SELECT * FROM EXPERIENCIAS WHERE' + 'columnaA = parámetroA' + ' AND ' + 'columnaB = parámetroB' + 'GROUP BY id'.
  const queryString = `${queryStartString} ${queryArray.join(" AND ")} ${queryEndingString}`;
  return queryString;
}

module.exports = buscarExperiencias;
