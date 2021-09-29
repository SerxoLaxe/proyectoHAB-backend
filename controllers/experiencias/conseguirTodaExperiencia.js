const conexionMysql = require("../../DB/conexionMysql");

/**
 * Responde con una array de todos los datos de la tabla experiencias y las fotos. 👍
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function conseguirTodaExperiencia(req, res, next) {
  let conexion;
  try {
    conexion = await conexionMysql();

    const [result] = await conexion.query(
      `
    SELECT * FROM experiencias
    `
    );

    //añado las fotos a los resultados
    let resultConFotos = [];
    if (result.length > 0) {
      // saco los ids de los resultados
      const ids = result.map((result) => result.id);

      //selecciono las fotos
      const [fotos] = await conexion.query(`
    SELECT * FROM experiencias_fotos WHERE experiencia_id IN (${ids.join(",")})
    `);
      console.log("result", result);
      // uno el array de fotos con el resultado
      resultConFotos = result.map((result) => {
        const resultFotos = fotos.filter(
          (foto) => foto.experiencia_id === result.id
        );
        //devuelvo el resultado y el array de fotos
        return {
          ...result,
          fotos: resultFotos,
        };
      });

      res.statusCode = 200;
      res.send({
        status: "Ok",
        data: resultConFotos,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (conexion) {
      conexion.release();
    }
  }
}

module.exports = conseguirTodaExperiencia;
