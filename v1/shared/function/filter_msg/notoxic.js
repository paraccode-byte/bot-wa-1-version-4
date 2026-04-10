import { poolconnection } from "#func/database.js";
import toxic_word from "./toxic-data.json" with { type: "json" };

export default async function cektoxic({ remoteJid, grupIndex, text, msg, sock, sender }) {
    if (!toxic_word.some(w => text.toLowerCase().includes(w))) return;
    try {
        const cekgrup = await poolconnection({ table: "toxic", i: grupIndex, type: "read" });
        if (cekgrup.conditions !== "on") return;
        const cekuser = await poolconnection({ table: "toxic_users", i: sender, type: "read" });
        if (!cekuser || cekuser?.violate < 3) {
            await poolconnection({ table: "toxic_users", i: sender, type: "write", violate: cekuser?.violate ? cekuser.violate + 1 : 1 });
            await sock.sendMessage(remoteJid, { delete: msg.key });
            await sock.sendMessage(remoteJid, {
                text: `⚠️ Pesan dihapus karena mengandung toxic.\n\nPeringatan ke: ${cekuser?.violate ? cekuser.violate + 1 : '1'} / 3\nJika sudah 3 kali, Anda akan dikeluarkan otomatis.`
            });
        } else if (cekuser?.violate >= 3) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Anggota @${sender.split('@')[0]} dikeluarkan karena telah melanggar batas limit_toxic (3/3).`,
                mentions: [sender]
            });
            await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
            await poolconnection({ table: "toxic_users", i: sender, type: "write", violate: 0 })
        }
    } catch (err) {
        console.error(err);
    }
}