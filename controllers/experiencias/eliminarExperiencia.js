const conexionMysql = require("../../DB/conexionMysql");
const { eliminarImagen } = require("../../helpers");
/**
 * Elimina un registro de la tabla de experiencias especificando un ID. ❌
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function eliminarExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const { id } = req.params;

    // selecciono las fotos
    const [fotos] = await conexion.query(
      `
    SELECT foto FROM experiencias_fotos WHERE experiencia_id=?

    `,
      [id]
    );
    // borro las fotos en la base de datos
    await conexion.query(
      `
    DELETE FROM experiencias_fotos WHERE experiencia_id=?
    `,
      [id]
    );

    // console.log(fotos);

    // borro las fotos del disco
    for (const foto of fotos) {
      await eliminarImagen(foto.foto);
    }

    // //borro los votos de la tabla puntuaciones
    await conexion.query(
      `
    DELETE FROM puntuaciones WHERE id_experiencia=?
    `,
      [id]
    );

    //borro las reservas

    await conexion.query(
      `
    DELETE FROM reservas WHERE id_experiencia=?

    `,
      [id]
    );
    // borro la experiencia
    await conexion.query(
      `
    DELETE FROM experiencias WHERE id=?
    `,
      [id]
    );

    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: `La experiencia con id: ${id} y todos sus elementos han sido eliminados`,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = eliminarExperiencia;
