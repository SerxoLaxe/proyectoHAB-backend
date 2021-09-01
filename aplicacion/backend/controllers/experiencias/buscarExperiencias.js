const conexionMysql = require("../../DB/conexionMysql");
const { buscarExperienciaSchema } = require('../../schemas/index');
const { validate } = require('../../helpers');

/**
 * buscarExperiencias() toma los parámetros definidos en la query ylos usa para buscar coincidencias en la tabla experiencias.❌ 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function buscarExperiencias(req, res, next) {
    let conexion;
    try {

        // Validamos los datos con Joi.
        await validate(buscarExperienciaSchema, req.query);

        // Creamos una query SQL adaptada a los parámetros de la petición.
        const queryString = construirQueryString(req.query);

        // Si no hay error, obtenemos conexión a Mysql.
        conexion = await conexionMysql();

        //Realizamos la petición
        const [result] = await conexion.query(queryString);

        //Si la petición no da errores, respondemos con los datos obtenidos.
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

/**
 * Crea la string necesaria para realizar la petición correcta a Mysql.
 * @param {Object} params - parámetros a introducir en la tabla.
 * @returns {string} - La string apropiada.
 */
function construirQueryString(params) {
    const { texto, precioMinimo, precioMaximo, fechaInicial, fechaFinal } = params;

    //Parte de la string que siempre se va a usar
    const queryBase = `SELECT * FROM experiencias WHERE`;

    //Array en el que se irán añadiendo todas las condiciones
    let queryArray = [];

    //Cuando el parámetro está definido se añade al queryArray el string que define la condición relativa al parámetro.
    if (texto !== undefined && texto.length !== 0) {
        queryArray.push(
            `CONCAT(
            experiencias.nombre, 
            experiencias.descripcion, 
            experiencias.ubicacion) 
            LIKE '%${texto}%'`);
    }

    if (precioMinimo !== undefined && precioMinimo > 0) {
        queryArray.push(`experiencias.precio >= ${precioMinimo}`);
    }

    if (precioMaximo !== undefined && precioMaximo > 0) {
        queryArray.push(`experiencias.precio <= ${precioMaximo}`);
    }

    if (fechaInicial !== undefined) {
        queryArray.push(`experiencias.fecha_inicial >= '${fechaInicial}'`);
    }

    if (fechaFinal !== undefined) {
        queryArray.push(`experiencias.fecha_final <= '${fechaFinal}'`);
    }

    // Concatenamos la parte invariable de la string (queryBase) junto con el array de condicionales, que es unido con el string ' AND '.
    // Pseudo resultado: 'SELECT * FROM EXPERIENCIAS WHERE' + 'columnaA = parámetroA' + ' AND ' + 'columnaB = parámetroB'.
    const queryString = queryBase + ' ' + queryArray.join(' AND ');
    return queryString;
}

module.exports = buscarExperiencias;