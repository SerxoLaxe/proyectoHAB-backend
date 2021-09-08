const conexionMysql = require("../../DB/conexionMysql");
const { formatearDateMysql, validate, guardarImagenesExperiencia } = require("../../helpers");
const { añadirExperienciaSchema } = require('../../schemas')

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
        await validate(añadirExperienciaSchema, req);                   //Validamos la petición mediante Joi.
        conexion = await conexionMysql();                               //Creamos una conexión a la BD.
        const idExperiencia = await procesarBody(req, conexion);        //Procesamos los parámetros del body.
        await procesarImagenes(req.files, conexion, idExperiencia);     //Procesamos las imágenes.
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

    const now = formatearDateMysql(new Date());     //Almacenamos la fecha actual
    const {                                         //saco los datos del body.
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        precio,
        ubicacion,
        plazas_totales,
    } = req.body;
    const [result] = await conexion.query(          // hacemos la INSERT en el DB
        `
        INSERT INTO experiencias (fecha_insert, nombre, descripcion, fecha_inicial, fecha_final, precio, ubicacion, plazas_totales)
        VALUES (?,?,?,?,?,?,?,?)
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
        ]
    );
    return result.insertId;
}

async function procesarImagenes(files, conexion, idExperiencia) {
    //proceso las fotos
    const now = formatearDateMysql(new Date());     //Almacenamos la fecha actual
    const fotos = [];
    for (const foto of Object.values(files)) {
        const nombreFoto = await guardarImagenesExperiencia(foto);
        fotos.push(nombreFoto);
        await conexion.query(       //las inserto en el DB
            `
            INSERT INTO experiencias_fotos (fecha_foto, foto, experiencia_id)
            VALUES (?,?,?)
            `,
            [now, nombreFoto, idExperiencia]
        );
    }
}

module.exports = añadirExperiencia;
