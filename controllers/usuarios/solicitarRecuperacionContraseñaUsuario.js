const conexionMysql = require("../../DB/conexionMysql");
const { validate, generateRandomString, sendMail } = require("../../helpers");
const { emailSchema } = require("../../schemas");

async function solicitarRecuperacionContraseña(req, res, next) {
  let conexion;
  try {
    // sacamos el correo desde el body.
    const { email } = req.body;

    // Validamos el email.
    await validate(emailSchema, email);

    //Obtenemos una conexion a la BD.
    conexion = await conexionMysql();

    // comprobar que el email exista (usuario exista) en el DB
    const [currentEmail] = await conexion.query(
      `
        SELECT id
        FROM usuarios
        WHERE email=?
    `,
      [email]
    );

    if (currentEmail.length === 0) {
      const error = new Error("Ningun usuario registrado con esta email");
      error.httpStatus = 400;
      throw error;
    }

    // generamos un codigo de recuperación
    const recoverCode = generateRandomString();

    //guardarlo en la base de datos
    await conexion.query(
      `
        UPDATE usuarios
        SET codigo_recuperacion=?
        WHERE email=?
    `,
      [recoverCode, email]
    );

    // enviar el email
    const emailBody = `
      Se solicitó el cambio de contraseña en experiencias diferentes.
      El codigo de recuperación es: ${recoverCode}
      Si no fuiste tu a solicitar el cambio de la contraseña, por favor ignora este email.
      Gracias!
    `;

    sendMail({
      to: email,
      subject: "Cambio de contraseña de experiencias diferentes",
      body: emailBody,
    });

    // dar una respuesta al front
    res.send({
      status: "ok",
      message: "Email enviado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}

module.exports = solicitarRecuperacionContraseña;
