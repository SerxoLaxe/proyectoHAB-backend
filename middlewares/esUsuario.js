const conexionMysql = require('../DB/conexionMysql');
const jwt = require("jsonwebtoken");

const isUser = async (req, res, next) => {
    let conexion;
    try {
        conexion = await conexionMysql();
        const { token } = req.headers;

        // comprobar que la petición tenga el token (authorization)
        if (!token) {
            const error = new Error("Falta la cabecera de autorización");
            error.httpStatus = 401;
            throw error;
        }

        // valido el token, y voy a leer id y role
        let tokenInfo;
        try {
            tokenInfo = jwt.verify(token, process.env.SECRET);
        } catch (err) {
            const error = new Error("Token no válido");
            error.httpStatus = 401;
            throw error;
        }

        // voy a leer en la base de datos la fecha del último cambio de contraseña. Para evitar que el usuario pueda acceder con un token antiguo si es que cambió la contraseña.
        const [result] = await conexion.query(
            `
      SELECT ultimo_cambio_contraseña
      FROM usuarios
      WHERE id=?
    `,
            [tokenInfo.id]
        );

        const ultimoCambioContraseña = new Date(result[0].ultimo_cambio_contraseña);
        const fechaEmisionToken = new Date(tokenInfo.iat * 1000);

        if (fechaEmisionToken < ultimoCambioContraseña) {
            const error = new Error("Token no valido");
            error.httpStatus = 401;
            throw error;
        }

        // añadir a la request el token info (id, role)
        req.userAuth = tokenInfo;

        // Continuo en el siguiente middleware
        next();
    } catch (error) {
        next(error);
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = isUser;
