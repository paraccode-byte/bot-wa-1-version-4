import { getdata } from "#func/database.js";
import crypto from "crypto";

export default async function welc_leav({ jid, update, grupIndex, sock}, alert) {
    const participant = update.participants;
    const res = await getdata(grupIndex, alert);
    if(!res) return;
    const { caption, url, type } = res;
    for (const user of participant) {
        const tag = user.id || user.phoneNumber;
        const format = caption.replaceAll('@', `@${tag.split('@')[0]}`);
        if (type === 'plan') {
            await sock.sendMessage(jid, {
                text: format,
                mentions: [tag]
            })
        } else if (type === 'image') {
            await sock.sendMessage(jid, {
                image: { url: url },
                caption: format,
                mimetype: 'image/jpeg',
                mentions: [tag]
            });
        } else if (type === 'video') {
            await sock.sendMessage(jid, {
                video: { url: url },
                caption: format,
                mimetype: 'video/mp4',
                fileName: `${crypto.randomUUID()}.mp4`,
                mentions: [tag]
            });
        }
    }
} 