import { poolconnection } from "#func/database.js";
const messageHistory = {};

export default async function cekspam({ remoteJid, grupIndex, msg, sock, sender }) {
    const now = Date.now();
    try {
        if (!messageHistory[sender]) messageHistory[sender] = [];
        messageHistory[sender].push(now);
        messageHistory[sender] = messageHistory[sender].filter(timestamp => now - timestamp < 10000);
        if (messageHistory[sender].length < 4) return;
        const cekgrup = await poolconnection({ table: "spam", i: grupIndex, type: "read" });
        if (cekgrup.conditions !== "on") return;
        const cekuser = await poolconnection({ table: "spam_users", i: sender, type: "read" });
        if (!cekuser || cekuser?.violate < 3) {
            await poolconnection({ table: "spam_users", i: sender, type: "write", violate: cekuser?.violate ? cekuser.violate + 1 : 1 });
            await sock.sendMessage(remoteJid, { delete: msg.key });
            await sock.sendMessage(remoteJid, {
                text: `⚠️ Pesan dihapus karena mengandung spam.\n\nPeringatan ke: ${cekuser?.violate ? cekuser.violate + 1 : '1'} / 3\nJika sudah 3 kali, @${sender.split('@')[0]} akan dikeluarkan otomatis.`,
                mentions: [sender]
            });
        } else if (cekuser?.violate >= 3) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Anggota @${sender.split('@')[0]} dikeluarkan karena telah melanggar batas spam (3/3).`,
                mentions: [sender]
            });
            await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
            await poolconnection({ table: "spam_users", i: sender, type: "write", violate: 0 });
            messageHistory[sender] = [];
        }
        messageHistory[sender] = [];
    } catch (err) {
        console.error(err);
    }
}