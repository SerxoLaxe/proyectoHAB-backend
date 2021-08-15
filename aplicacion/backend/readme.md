# Backend
Rest API Experiencias diferentes.

## Estructura de la aplicación

```
backend
|   server.js           ejecutable principal.
|   helpers.js          Módulo con funciones de ayuda (formateo de fechas, envio de email...).
│   package.json        Dependencias NPM.
|   package-lock.json   Dependencias NPM. 
|   .env                Variables de entorno usadas por la aplicación.
|   readme.md           Este mismo documento que estás leyendo.
|
└── controllers     
|       |
|       └── experiencias
|       |   controller-1.js
|       |   controller-2.js
|       |   ...
|       |
|       └── usuarios
|           controller-1.js
|           controller-2.js
|           ...
|
└── middlewares
|   middleware-1.js
|   middleware-2.js
|   ...
|
└── database
|   initDB.js       Módulo para definición y manipulación inicial de base de datos.
|   connectDB.js    Módulo para obtener conexión a la base de datos.
|   tablesDDL.js    Módulo con las querys para la creación de las tablas.
|
└── postman
    *.postman-collection.json   Colección de requests para su uso en postman.
```

## Endpoints

Endpoints finalizados marcados con ✅. No finalizados marcados con ❌

#### Experiencia

- GET de todas las experiencias. ❌
- GET experiencias mediante búsqueda y filtrado opcional mediante rango de fechas y precios. ❌
- GET Selecciona experiencia mediante id. ❌
- POST Añade nueva experiencia. ( Sólo administrador). ❌
- PUT Editar experiencia. ( Sólo administrador ). ❌
- DELETE Elimina experiencia. ( Sólo administrador ). ❌
- POST Puntua experiencia ( sólo cuando está finalizada y el usuario ha participado).❌
- POST Añade imagen a experiencia.( Sólo administrador). ❌
- DELETE Elimina imagen de experiencia (Sólo administrador). ❌
- POST reservar experiencia ( Sólo usuarios registrados ). ❌
- DELETE cancela reserva de experiencia ( sólo usuarios registrados ). ❌

#### Usuario

- GET de todos los usuarios. ❌
- GET usuario, para acceso al perfil mediante ID. ( Sólo usuarios registrados )❌  
- POST registro de nuevo usuario. ❌
- POST validar usuario mediante codigo. ❌
- PUT usuario, para editar sus datos. (Sólo el propio usuario) ❌
- DELETE usuario, elimina un usuario. (Sólo administrador) ❌
- GET login de usuario. ❌
- PUT Cambiar la contraseña ❌

## Instalación backend desarrollo

Se debe crear un archivo .env e introducir en él las variables necesarias. El archivo .envExample sirve de modelo.

```console
git clone https://github.com/SerxoLaxe/proyectoHAB/tree/develop/aplicacion/backend
cd proyectoHAB/aplicacion/backend
npm run dev
```
