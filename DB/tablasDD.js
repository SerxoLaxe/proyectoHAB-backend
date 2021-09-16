/** Tabla de Usuarios */
const tablaUsuarios = {
  nombre: "usuarios",
  columnas: ` 
        (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(200),
        biografia TEXT,
        activo BOOLEAN NOT NULL DEFAULT false,
        email VARCHAR(200) UNIQUE NOT NULL,
        contraseña VARCHAR(512) NOT NULL,
        privilegios ENUM("admin","normal") DEFAULT "normal" NOT NULL,
        avatar VARCHAR(500),
        fecha DATETIME NOT NULL,
        codigo_validacion VARCHAR(100),
        eliminado BOOLEAN DEFAULT false,
        ultimo_cambio_contraseña DATETIME,
        codigo_recuperacion VARCHAR(100)
        )
    `,
};

/** Tabla de experiencias */
const tablaExperiencias = {
  nombre: "experiencias",
  columnas: `
        (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        fecha_insert DATETIME NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion VARCHAR(8000) NOT NULL,
        fecha_inicial DATE NOT NULL,
        fecha_final DATE NOT NULL,
        rating INT,
        precio FLOAT NOT NULL,
        ubicacion VARCHAR(200) NOT NULL,
        plazas_totales INT NOT NULL,
        id_autor INT NOT NULL,
        FOREIGN KEY (id_autor) REFERENCES usuarios (id)
        )
    `,
};

/** Tabla de experiencias_fotos */
const tablaExperiencias_fotos = {
  nombre: "experiencias_fotos",
  columnas: `
        (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fecha_foto DATETIME NOT NULL,
        foto VARCHAR(64),
        experiencia_id INT NOT NULL,
        FOREIGN KEY (experiencia_id) REFERENCES experiencias(id)
        )
    `,
};

const tablaReservas = {
  nombre: "reservas",
  columnas: `(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        fecha DATETIME NOT NULL,
        cancelada BOOLEAN DEFAULT false,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
        id_experiencia INT NOT NULL,
        FOREIGN KEY (id_experiencia) REFERENCES experiencias(id)
    )`,
};

const tablaPuntuaciones = {
  nombre: "puntuaciones",
  columnas: `(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        fecha DATETIME NOT NULL,
        comentario VARCHAR(1000), 
        puntuacion DECIMAL(2,1) NOT NULL,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
        id_experiencia INT NOT NULL,
        FOREIGN KEY (id_experiencia) REFERENCES experiencias(id)

    )`,
};

module.exports = {
  tablaUsuarios,
  tablaExperiencias,
  tablaExperiencias_fotos,
  tablaReservas,
  tablaPuntuaciones,
};
