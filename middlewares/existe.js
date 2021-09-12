const conexionMysql = require("../DB/conexionMysql");

/**
 * Este middleware comprueba si la experiencia o el usuario con el id
 * proporcionado existe en la base de datos
 */
async function existe(req, res, next) {
  let conexion;
  try {
    const tabla = req.path.split("/")[1]; //O es experiencias o es usuarios.

    const { params: { id } = {} } = req;
    conexion = await conexionMysql();
    let resultado;
    if (tabla === "experiencias") {
      [resultado] = await conexion.query(
        `
                SELECT id 
                FROM experiencias
                WHERE id=?
                `,
        [id]
      );
    } else if (tabla === "usuarios") {
      [resultado] = await conexion.query(
        `
                SELECT id 
                FROM usuarios
                WHERE id=?
                `,
        [id]
      );
    } else if (tabla === "experiencias_fotos") {
      [resultado] = await conexion.query(
        `
            SELECT id FROM experiencias_fotos WHERE id=? AND experiencia_id=?
            
            `,
        [id]
      );
    }

    if (resultado.length <= 0) {
      throw new Error(`${tabla.slice(0, -1)} no existe`);
    }
    next();
  } catch (error) {
    error.httpStatus = 404;
    next(error);
  }
}
module.exports = existe;
