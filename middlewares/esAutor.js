const conexionMysql = require("../DB/conexionMysql");

const esAdmin = async (req, res, next) => {
  let conexion;
  try {
    const { id } = req.params;

    conexion = await conexionMysql();
    // controlo si el usuario logeado puede modificar la entry
    // controlar el usuario que creó la entry, si no es el mismo del token o admin --> error
    const [usuario] = await conexion.query(
      `
          SELECT id_autor
          FROM experiencias
          WHERE id=?
        `,
      [id]
    );
    if (usuario[0].id_autor !== req.userAuth.id) {
      // ERROR
      const error = new Error("Acción śolo permitida a autores de experiencia");
      error.httpStatus = 401;
      throw error;
    }
    // Continuo en el siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
};

module.exports = esAdmin;
