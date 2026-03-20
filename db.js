const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nha_tro_management"
});



module.exports = db;