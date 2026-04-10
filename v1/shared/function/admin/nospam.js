import { editdata_rules } from "#func/database.js";

export default async function nospam({ grupIndex, remoteJid, text, sock, msg }) {
    try {
        const on_of = text.replace('.nospam', '').trim().toLowerCase();
        if (on_of !== 'on' && on_of !== 'off') {
            return await sock.sendMessage(remoteJid, { text: 'Format salah! contoh .nospam on' }, { quoted: msg });
        }
        const table = "spam";
        if (on_of === 'on') {
            const res = await editdata_rules({ i: grupIndex, conditions: "on", table: table });
            if(!res) return await sock.sendMessage(remoteJid, { text: "Server tidak merespon ada masalah pada server!, data gagal di perbaharui" }, { quoted: msg });
            return await sock.sendMessage(remoteJid, { text: `Fitur nospam berhasil diubah ke ${res.conditions} ✅` }, { quoted: msg });
        } else {
            const res = await editdata_rules({ i: grupIndex, conditions: "off", table: table });
            if(!res) return await sock.sendMessage(remoteJid, { text: "Server tidak merespon ada masalah pada server!, data gagal di perbaharui" }, { quoted: msg });
            return await sock.sendMessage(remoteJid, { text: `Fitur nospam berhasil diubah ke ${res.status} ❎` }, { quoted: msg });
        }
    } catch (err) {
        console.error(err);
        return await sock.sendMessage(remoteJid, { text: "Ups ada masalah pada server!, data gagal di perbaharui" }, { quoted: msg });
    }
}