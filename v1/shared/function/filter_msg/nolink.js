import fs from "fs";
import filepath from "#func/namefile.js";

export default async function ceklink({ remoteJid, grupIndex, text, msg, sock, sender }) {
    try {
        const no_link_json = JSON.parse(fs.readFileSync(filepath('./database/no_link.json'), "utf-8"));
        const limit_nolink = JSON.parse(fs.readFileSync(filepath('./database/limitnolink.json'), "utf-8"));
        for (let key in no_link_json[grupIndex]) {
            const filter = no_link_json[grupIndex][key];
            if (filter.condition === 'on' && text.includes(filter.link)) {
                limit_nolink[sender] = (limit_nolink[sender] || 0) + 1;

                const jsonData = JSON.stringify(limit_nolink, null, 2);
                fs.writeFileSync(filepath('./database/limitnolink.json'), jsonData);

                await sock.sendMessage(remoteJid, { delete: msg.key });
                if (limit_nolink[sender] >= 3) {
                    limit_nolink[sender] = 0;
                    fs.writeFileSync(filepath('./database/limitnolink.json'), JSON.stringify(limit_nolink, null, 2));
                    await sock.sendMessage(remoteJid, {
                        text: `❌ Anggota @${sender.split('@')[0]} dikeluarkan karena telah melanggar batas link terlarang (3/3).`,
                        mentions: [sender]
                    });
                    await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
                    return;
                } else {
                    await sock.sendMessage(remoteJid, {
                        text: `⚠️ Pesan dihapus karena mengandung link terlarang (${key}).\n\nPeringatan ke: ${limit_nolink[sender]} / 3\nJika sudah 3 kali, Anda akan dikeluarkan otomatis.`
                    });
                }
                break;
            }
        }
    } catch (err) {
        console.error(err);
    }
}