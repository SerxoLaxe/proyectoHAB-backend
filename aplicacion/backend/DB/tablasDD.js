/** Tabla de experiencias_fotos */
const tablaExperiencias_fotos = {
    nombre: 'experiencias_fotos',
    columnas:
        `
        (id INT PRIMARY KEY AUTO_INCREMENT,
        fecha_foto DATETIME NOT NULL,
        foto VARCHAR(64),
        experiencia_id INT NOT NULL,
        FOREIGN KEY (experiencia_id) REFERENCES experiencias(id))
    `,
};

/** Tabla de experiencias */
const tablaExperiencias = {

    nombre: 'experiencias',
    columnas:
        `
        (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT NOT NULL,
        fecha_inicial DATE NOT NULL,
        fecha_final DATE NOT NULL,
        rating INT,
        precio FLOAT NOT NULL,
        ubicacion VARCHAR(200) NOT NULL,
        plazas_totales INT NOT NULL
        )
    `
};

/** Tabla de Usuarios */
const tablaUsuarios = {

    nombre: 'usuarios',
    columnas:
        ` 
        ( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(200),
        biografia TEXT,
        activo BOOLEAN NOT NULL DEFAULT false,
        email VARCHAR(200) UNIQUE NOT NULL,
        contraseña VARCHAR(512) NOT NULL,
        privilegios ENUM("admin","normal") DEFAULT "normal" NOT NULL,
        avatar VARCHAR(500),
        fecha DATE NOT NULL,
        codigo_validacion VARCHAR(100))
    `,
};

module.exports = { tablaExperiencias, tablaUsuarios, tablaExperiencias_fotos };

