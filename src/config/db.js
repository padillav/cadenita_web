const mariadb = require('mariadb');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../..', '.env') });

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'torneo_db',
    connectionLimit: 5
});

module.exports = pool;
