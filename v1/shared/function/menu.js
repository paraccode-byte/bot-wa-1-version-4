import { ident_grup, menu } from "./helper.js";

export default async function menuf({remoteJid, sock, grupIndex, msg}) {
    try {
        const data = await ident_grup(grupIndex)
        const url = data.banner;
        const botname = data.name;
        await sock.sendMessage(remoteJid, {
            image: { url: url },
            caption: menu(botname)
        }, { quoted: msg }
        );
    } catch (err) {
        console.error('Gagal membaca database:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu sedang tidak tersedia.' });
    }
}