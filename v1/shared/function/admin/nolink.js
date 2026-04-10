import fs from "fs";
import filepath from "#func/namefile.js";

export default async function nolink({ remoteJid, sock, text, msg, fullCommand, args, grupIndex }) {
    const command = fullCommand.replace('.nolink', '');
    const on_of = args[1]?.toLowerCase();
    const no_link_json = JSON.parse(fs.readFileSync(filepath('./database/no_link.json'), "utf-8"));
    if (no_link_json[grupIndex][command]) {
        try {
            if (!on_of || (on_of !== 'on' && on_of !== 'off')) {
                return await sock.sendMessage(remoteJid, {
                    text: `Format salah! Gunakan: .nolink${command} on/off`
                }, { quoted: msg });
            }
            const currentCondition = no_link_json[grupIndex][command].condition;
            if (currentCondition !== on_of) {
                no_link_json[grupIndex][command].condition = on_of;
                fs.writeFileSync(filepath('./database/no_link.json'), JSON.stringify(no_link_json, null, 4));
                return await sock.sendMessage(remoteJid, {
                    text: `Pengaturan *${command}* telah diubah menjadi *${on_of}* ✅.`
                });
            } else {
                return await sock.sendMessage(remoteJid, {
                    text: `Pengaturan *${command}* memang sudah *${on_of}* 👍.`
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
}