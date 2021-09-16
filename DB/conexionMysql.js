require("dotenv").config();
const mysql = require("mysql2/promise");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

let pool;

async function conexionMysql() {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      timezone: "Z",
    });
  }
  return await pool.getConnection();
}

module.exports = conexionMysql;
