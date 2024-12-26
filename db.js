require('dotenv').config();
const mysql = require('mysql2');
const DB_CONFIG = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "jwt_auth"
}
const db = mysql.createConnection(DB_CONFIG);

const query =async (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}
module.exports = db, { query };