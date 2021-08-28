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
        const now = formatearDateMysql(new Date());
        const data = await procesarBody(req, conexion, now);
        await procesarImagenes(req.files, conexion, now, data.idExperiencia);
        res.statusCode = 200;
        res.send({
            status: "Ok",
            data
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

async function procesarBody(req, conexion, now) {
    //saco los datos del body.
    const {
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        precio,
        ubicacion,
        plazas_totales,
    } = req.body;

    //comprobamos si faltan campos por rellenar
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

    //comprobamos si no hay imágenes
    if (
        !req.files ||
        Object.keys(req.files).length === 0
    ) {
        const error = new Error("Faltan imágenes obligatorias");
        error.httpStatus = 400;
        throw error;
    }

    // hacemos la INSERT en el DB
    const [result] = await conexion.query(
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
    //Creamos un objeto data con toda la información necesaria para el resto de funciones.
    const data = {
        now,
        nombre,
        descripcion,
        fecha_inicial,
        fecha_final,
        precio,
        ubicacion,
        plazas_totales,
        idExperiencia: result.insertId,
    };

    return data;
}

async function procesarImagenes(files, conexion, now, idExperiencia) {
    //proceso las fotos
    const fotos = [];
    if (files && Object.keys(files).length > 0) {
        for (const foto of Object.values(files).slice(0, 4)) {
            //creo en helpers una funcion que me guarda las fotos
            const nombreFoto = await guardarFoto(foto);
            fotos.push(nombreFoto);

            //las inserto en el DB
            await conexion.query(
                `
                INSERT INTO experiencias_fotos (fecha_foto, foto, experiencia_id)
                VALUES (?,?,?)
                `,
                [now, nombreFoto, idExperiencia]
            );
        }
    }
}

module.exports = añadirExperiencia;
