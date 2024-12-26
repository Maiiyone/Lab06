const db = require('../db'); // Module kết nối MySQL

const User = {
    create: (username, password, role = 'user', callback) => {
        const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.query(query, [username, password, role], callback);
    },
    findByUsername: (username, callback) => {
        
        const query = "SELECT * FROM users WHERE username = ?";
       const query2= db.query(query, [username], callback);
       console.log(query2.sql);
    },
    
    findById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [id], callback);
    },
};

module.exports = User;
