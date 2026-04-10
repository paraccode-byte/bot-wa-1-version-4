import { editdata } from "#func/database.js";
import upload_file from "./upload_file.js";
import message from "./fail.json" with { type: "json" };

export async function setwelcome({ remoteJid, sock, text, grupIndex, msgType, msg, downloadMediaMessage }) {
    const caption = text.replace('.setwelcome', '').trim();
    if (!caption) return await sock.sendMessage(remoteJid, { text:  message.welcome })
    const table = "welcome";
    if (msgType === 'imageMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "image");
            const res = await editdata({ i: grupIndex, url: url, caption: caption, table: table, type: "image" });
            if (!res) {
                return await sock.sendMessage(remoteJid, {
                    text: '❌ Ups ada kesalah, data gagal di update'
                }, { quoted: msg });
            }
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan welcome berhasil diperbarui!\n\nTipe: media image\nteks: ${res.caption}\nUrl media: ${res.url}`
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else if (msgType === 'videoMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "video");
            const res = await editdata({ i: grupIndex, url: url, caption: caption, table: table, type: "video" });
            if (!res) {
                return await sock.sendMessage(remoteJid, {
                    text: '❌ Ups ada kesalah, data gagal di update'
                }, { quoted: msg });
            }
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan welcome berhasil diperbarui!\n\nTipe: media video\nteks: ${res.caption}\nUrl media: ${res.url}`
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else {
        try {
            const res = await editdata({ i: grupIndex, url: "", caption: caption, table: table, type: "plan" });
            if (!res) {
                return await sock.sendMessage(remoteJid, {
                    text: '❌ Ups ada kesalah, data gagal di update'
                }, { quoted: msg });
            }
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan welcome berhasil diperbarui!\n\nTipe: plan teks\nteks: ${res.caption}`
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    }
}

export async function setleave({ remoteJid, sock, text, grupIndex, msgType, msg, downloadMediaMessage }) {
    const caption = text.replace('.setleave', '').trim();
    if (!caption) return await sock.sendMessage(remoteJid, { text: message.leave })
    const table = "leaves";
    if (msgType === 'imageMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "image");
            const res = await editdata({ i: grupIndex, url: url, caption: caption, table: table, type: "image" });
            if (!res) {
                return await sock.sendMessage(remoteJid, {
                    text: '❌ Ups ada kesalah, data gagal di update'
                }, { quoted: msg });
            }
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan leave berhasil diperbarui!\n\nTipe: media image\nteks: ${res.caption}\nUrl media: ${res.url}`
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else if (msgType === 'videoMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "video");
            const res = await editdata({ i: grupIndex, url: url, caption: caption, table: table, type: "video" });
            if (!res) {
                return await sock.sendMessage(remoteJid, {
                    text: '❌ Ups ada kesalah, data gagal di update'
                }, { quoted: msg });
            }
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan leave berhasil diperbarui!\n\nTipe: media video\nteks: ${res.caption}\nUrl media: ${res.url}`
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else {
        try {
            const res = await editdata({ i: grupIndex, url: "", caption: caption, table: table, type: "plan" });
            if (!res) {
                return await sock.sendMessage(remoteJid, {
                    text: '❌ Ups ada kesalah, data gagal di update'
                }, { quoted: msg });
            }
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan leave berhasil diperbarui!\n\nTipe: plan teks\nteks: ${res.caption}`
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    }
}