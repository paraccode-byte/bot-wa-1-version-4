import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function filepath(location) {
    return path.join(__dirname, location);
}

const pool = mysql.createPool({
    host: '192.168.1.12',
    user: 'root',
    password: '',
    database: 'my-bot-v3',
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
})

async function read_data({ table, where, i }) {
    try {
        const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE ${where} = ?`, [i]);
        if (rows.length === 0) return null;
        return rows;
    } catch (error) {
        console.error(error);
    }
}

export async function ident_grup(grupIndex) {
    try {
        const rows = await read_data({ table: "data_grup", where: "id", i: grupIndex })
        if (!rows || rows.length === 0) return null;
        const data = rows[0];
        return data;
    } catch (err) {
        console.error(err);
    }
}

export function menu(name) {
    try {
        const data_menu = fs.readFileSync(filepath('./menu.txt'), 'utf-8');
        const result = data_menu.replaceAll('{name}', name);
        return result
    } catch (err) {
        console.error(err)
    }
}