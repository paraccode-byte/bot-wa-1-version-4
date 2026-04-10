import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: '192.168.1.12',
    user: 'root',
    password: '',
    database: 'my-bot-v3',
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
})

export async function write_data(id, jid, banner, name) {
    try {
        const [rows] = await pool.execute(
            `INSERT INTO data_grup (id, jid, banner, name) VALUES (?, ?, ?, ?)`,
            [id, jid, banner, name]
        )
        if (rows.length === 0) return null;
        if (rows.affectedRows === 0) {
            return null;
        } else {
            return true;
        };
    } catch (err) {
        console.error(err);
    }
}

export async function read_data({table, where, i}) {
    try {
        const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE ${where} = ?`, [i]);
        if (rows.length === 0) return null;
        if (rows.affectedRows === 0) {
            return null;
        } else {
            return rows;
        };
    } catch (error) {

    }
}