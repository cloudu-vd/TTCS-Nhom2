const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nha_tro_management"
});

db.connect((err) => {
    if (err) {
        console.log("Kết nối database lỗi");
    } else {
        console.log("Kết nối MySQL thành công");
    }
});

module.exports = db;