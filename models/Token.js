const db = require('../db');

const Token = {
    create: (userId, token, loginTime, ipAddress, callback) => {
        const query = 'INSERT INTO tokens (user_id, token, login_time, ip_address) VALUES (?, ?, ?, ?)';
        db.query(query, [userId, token, loginTime, ipAddress], callback);
    },
    findByUserId: (userId, callback) => {
        const query = 'SELECT * FROM tokens WHERE user_id = ?';
        db.query(query, [userId], callback);
    },
    deleteByUserId: (userId, callback) => {
        const query = 'DELETE FROM tokens WHERE user_id = ?';
        db.query(query, [userId], callback);
    },
};

module.exports = Token;
