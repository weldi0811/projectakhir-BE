const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user: 'userbersama',
        password: 'Mysql123',
        host: '127.0.0.1',
        database: 'ithink',
        port : 3306
    }
)

module.exports = conn