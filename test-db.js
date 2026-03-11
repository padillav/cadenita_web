// test-db.js
const mariadb = require('mariadb');

async function test() {
    try {
        const conn = await mariadb.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'torneo_db'
        });
        console.log('✅ Conexión exitosa!');
        const rows = await conn.query('SELECT 1 as test');
        console.log(rows);
        conn.end();
    } catch (err) {
        console.log('❌ Error:', err.message);
        console.log('Código:', err.errno);
    }
}

test();