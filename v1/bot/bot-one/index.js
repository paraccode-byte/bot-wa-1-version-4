import makeWASocket, { useMultiFileAuthState, DisconnectReason, downloadMediaMessage, downloadContentFromMessage, getContentType } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import 'module-alias/register';
// HELPER FUNCTION
import pino from 'pino';
import welc_leav from 'my-function/alert/welc_leav.js';
import mainData from './mainData.js';
import cektoxic from 'my-function/filter_msg/notoxic.js';
import cekspam from 'my-function/filter_msg/nospam.js';
import ceklink from 'my-function/filter_msg/nolink.js';
import getinfo_admin from 'my-admin/.getinfo.js';
import add_data from 'my-admin/addup.js';
import { verify } from 'my-admin/verif.js';

async function connectToWhatsApp() {
    const logger = pino({ level: 'silent' });
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        defaultQueryTimeoutMs: undefined,
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi terputus karena:', lastDisconnect.error, ', mencoba hubungkan kembali:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Bot sudah terhubung ke WhatsApp! ✅');
        }
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || m.type !== 'notify' || msg.key.fromMe) return;
        const msgType = Object.keys(msg?.message || {})[0];
        const remoteJid = msg.key.remoteJid;
        const text = msg.message?.conversation ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (remoteJid === '104105779396783@lid' || remoteJid === "62895322357910@s.whatsapp.net") {
            const params = {
                m: m,
                remoteJid: remoteJid,
                sock: sock,
                text: text,
                msgType: msgType,
                msg: msg,
                downloadMediaMessage: downloadMediaMessage,
            }
            if (text.startsWith('.getinfo')) {
                console.log(`Memproses perintah: getinfo`);
                await getinfo_admin(params);
            }
            if (text.startsWith('.add-data')) {
                console.log(`Memproses perintah: add-data`);
                await add_data(params);
            }
        }
        const grupIndex = await verify(remoteJid);
        if (!grupIndex) return;
        const user_name = msg.pushName;
        const sender = msg.key.participantAlt || msg.key.remoteJid;

        const allParams = {
            m: m,
            remoteJid: remoteJid,
            sock: sock,
            text: text,
            grupIndex: grupIndex,
            msgType: msgType,
            msg: msg,
            downloadMediaMessage: downloadMediaMessage,
            sender: sender,
            user_name: user_name,
        }
        await cektoxic(allParams);
        await cekspam(allParams);
        await ceklink(allParams);

        for (const d of mainData) {
            if (text.startsWith(d.command)) {
                console.log('In process..', d.command);
                const f = d.function || null;
                if (f) {
                    f(allParams);
                };
            }
        }
    });
    sock.ev.on('group-participants.update', async (update) => {
        const jid = update.id;
        const grupIndex = await verify(jid);
        const params = {
            jid: jid,
            grupIndex: grupIndex,
            sock: sock,
            update: update
        };
        const alert = {
            add: "welcome",
            remove: "leaves"
        }
        if (update.action === 'add') {
            await welc_leav(params, alert[update.action]);
        }
        if (update.action === 'remove') {
            await welc_leav(params, alert[update.action])
        }
    })
}

connectToWhatsApp();