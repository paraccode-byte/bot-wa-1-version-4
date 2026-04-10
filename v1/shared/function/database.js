import mysql from "mysql2/promise";
    
export async function getdata(i, table) {
    let connection;
    try {
        connection = await mysql.createPool({
            host: '192.168.1.12',
            user: 'root',
            password: '',
            database: 'my-bot-v3',
            waitForConnections: true,
            connectionLimit: 3,
            queueLimit: 0
        })

        const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE id = ?`, [i]);
        if (rows.length === 0) return null;
        const data = rows[0];
        return {
            caption: data?.caption,
            url: data?.url_media,
            type: data?.type,
            conditions: data?.conditions
        };
    } catch (error) {
        console.error("Terjadi kesalahan:", error.message);
        return null;
    }
}

export async function editdata({ table, i, url, caption, type }) {
    if (!["welcome", "leaves"].includes(table)) return null;
    let connection;
    try {
        connection = await mysql.createConnection({
            host: '192.168.1.12',
            user: 'root',
            password: '',
            database: 'my-bot-v3'
        });
        const query =
            `INSERT INTO ${table} (id, url_media, caption, type)
   VALUES (?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
   url_media = VALUES(url_media),
   caption = VALUES(caption),
   type = VALUES(type)`

        const [rows] = await connection.execute(query, [i, url, caption, type]);
        if (rows.length === 0) return null;
        if (rows.affectedRows === 0) {
            return null
        } else {
            return {
                status: "Data Berhasil Diperbarui!",
                caption: caption,
                url: url?.trim() || null
            }
        };
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return null;
    } finally {
        if (connection) await connection.end();
    }
}
export async function editdata_rules({ i, conditions, table }) {
    if (!["on", "off"].includes(conditions) || !["toxic", "spam"].includes(table)) return null;
    let connection;
    try {
        connection = await mysql.createConnection({
            host: '192.168.1.12',
            user: 'root',
            password: '',
            database: 'my-bot-v3'
        });
        const query = `INSERT INTO ${table} (id, conditions) VALUES (?, ?) ON DUPLICATE KEY UPDATE conditions = VALUES(conditions)`
        const [rows] = await connection.execute(query, [i, conditions]);
        if (rows.length === 0) return null;
        if (rows.affectedRows === 0) {
            return null
        } else {
            return {
                status: "Data Berhasil Diperbarui!",
                conditions: conditions
            }
        };
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return null;
    } finally {
        if (connection) await connection.end();
    }
}


const poll = mysql.createPool({
    host: '192.168.1.12',
    user: 'root',
    password: '',
    database: 'my-bot-v3',
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
})
export async function poolconnection({ table, i, type, violate = null }) {
    if (!['read', 'write'].includes(type)) return;
    try {
        const query = type === "read" ? `SELECT * FROM ${table} WHERE id = ?` : `INSERT INTO ${table} (id, violate) VALUES (?, ?) ON DUPLICATE KEY UPDATE violate = VALUES(violate)`;
        const arrparams = type === "read" ? [i] : [i, violate];
        const [rows] = await poll.execute(query, arrparams);
        if (rows.length === 0) return null;
        const data = rows[0];
        return {
            conditions: data?.conditions || null,
            violate: data?.violate || null
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return null;
    }
}