/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$4 = require('@bot-whatsapp/bot');
var require$$1$3 = require('wa-sticker-formatter');
var require$$2$2 = require('pino');
var require$$3 = require('rimraf');
var require$$0$1 = require('mime-types');
var require$$4 = require('path');
var require$$1 = require('fs');
var require$$7 = require('console');
var require$$8 = require('@whiskeysockets/baileys');
var require$$0 = require('sharp');
var require$$2 = require('qr-image');
var require$$1$1 = require('os');
var require$$2$1 = require('follow-redirects');
var require$$0$2 = require('crypto');
var require$$0$3 = require('fluent-ffmpeg');
var require$$1$2 = require('@ffmpeg-installer/ffmpeg');

const sharp = require$$0;
const { readFile } = require$$1;

/**
 * Agregar un borde alrededor para mejorar la lectura de QR
 * @param {*} FROM
 * @returns
 */
const cleanImage$1 = async (FROM = null) => {
    const readBuffer = () => {
        return new Promise((resolve, reject) => {
            readFile(FROM, (err, data) => {
                if (err) reject(err);
                const imageBuffer = Buffer.from(data);
                resolve(imageBuffer);
            });
        })
    };

    const imgBuffer = await readBuffer();

    return new Promise((resolve, reject) => {
        sharp(imgBuffer)
            .extend({
                top: 15,
                bottom: 15,
                left: 15,
                right: 15,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .toFile(FROM, (err) => {
                if (err) reject(err);
                resolve();
            });
    })
};

var cleanImage_1 = { cleanImage: cleanImage$1 };

const { createWriteStream: createWriteStream$2 } = require$$1;
const { cleanImage } = cleanImage_1;
const qr = require$$2;

const baileyCleanNumber$1 = (number, full = false) => {
    number = number.replace('@s.whatsapp.net', '');
    number = !full ? `${number}@s.whatsapp.net` : `${number}`;
    return number
};

/**
 * Hace promesa el write
 * @param {*} base64
 */
const baileyGenerateImage$1 = async (base64, name = 'qr.png') => {
    const PATH_QR = `${process.cwd()}/${name}`;
    let qr_svg = qr.image(base64, { type: 'png', margin: 4 });

    const writeFilePromise = () =>
        new Promise((resolve, reject) => {
            const file = qr_svg.pipe(createWriteStream$2(PATH_QR));
            file.on('finish', () => resolve(true));
            file.on('error', reject);
        });

    await writeFilePromise();
    await cleanImage(PATH_QR);
};

const baileyIsValidNumber$1 = (rawNumber) => {
    const regexGroup = /\@g.us\b/gm;
    const exist = rawNumber.match(regexGroup);
    return !exist
};

var utils = {
    baileyCleanNumber: baileyCleanNumber$1,
    baileyGenerateImage: baileyGenerateImage$1,
    baileyIsValidNumber: baileyIsValidNumber$1,
};

const mimeDep = require$$0$1;
const { tmpdir } = require$$1$1;
const http = require$$2$1.http;
const https = require$$2$1.https;
const { rename, createWriteStream: createWriteStream$1, existsSync: existsSync$1 } = require$$1;
const { extname, basename, parse } = require$$4;

/**
 * Extrar el mimetype from buffer
 * @param {string} response
 * @returns
 */
const fileTypeFromFile = async (response) => {
    const type = response.headers['content-type'] ?? null;
    const ext = mimeDep.extension(type);
    return {
        type,
        ext,
    }
};

/**
 * Descargar archivo binay en tmp
 * @param {*} url
 * @returns
 */
const generalDownload$1 = async (url) => {
    const checkIsLocal = existsSync$1(url);

    const handleDownload = () => {
        const checkProtocol = url.includes('https:');
        const handleHttp = checkProtocol ? https : http;
        const fileName = basename(new URL(url).pathname);
        const name = parse(fileName).name;
        const fullPath = `${tmpdir()}/${name}`;
        const file = createWriteStream$1(fullPath);

        if (checkIsLocal) {
            /**
             * From Local
             */
            return new Promise((res) => {
                const response = {
                    headers: {
                        'content-type': mimeDep.contentType(extname(url)),
                    },
                };
                res({ response, fullPath: url });
            })
        } else {
            /**
             * From URL
             */
            return new Promise((res, rej) => {
                handleHttp.get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', async function () {
                        file.close();
                        res({ response, fullPath });
                    });
                    file.on('error', function () {
                        file.close();
                        rej(null);
                    });
                });
            })
        }
    };

    const handleFile = (pathInput, ext) =>
        new Promise((resolve, reject) => {
            const fullPath = checkIsLocal ? `${pathInput}` : `${pathInput}.${ext}`;
            rename(pathInput, fullPath, (err) => {
                if (err) reject(null);
                resolve(fullPath);
            });
        });

    const httpResponse = await handleDownload();
    const { ext } = await fileTypeFromFile(httpResponse.response);
    const getPath = await handleFile(httpResponse.fullPath, ext);

    return getPath
};

var download = { generalDownload: generalDownload$1 };

const crypto = require$$0$2;

const SALT_KEY = `sal-key-${Date.now()}`;
const SALT_IV = `sal-iv-${Date.now()}`;

const METHOD = 'aes-256-cbc';

const key = crypto.createHash('sha512').update(SALT_KEY).digest('hex').substring(0, 32);

const encryptionIV = crypto.createHash('sha512').update(SALT_IV).digest('hex').substring(0, 16);

/**
 * Generamos un UUID unico con posibilidad de tener un prefijo
 * @param {*} prefix
 * @returns
 */
const generateRefprovider$1 = (prefix = false) => {
    const id = crypto.randomUUID();
    return prefix ? `${prefix}_${id}` : id
};

/**
 * Encriptar data
 * @param {*} data
 * @returns
 */
const encryptData = (data) => {
    const cipher = crypto.createCipheriv(METHOD, key, encryptionIV);
    return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64')
};

/**
 * Desencriptar data
 * @param {*} encryptedData
 * @returns
 */
const decryptData = (encryptedData) => {
    try {
        const buff = Buffer.from(encryptedData, 'base64');
        const decipher = crypto.createDecipheriv(METHOD, key, encryptionIV);
        return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8')
    } catch (e) {
        return 'FAIL'
    }
};

var hash = { generateRefprovider: generateRefprovider$1, encryptData, decryptData };

const ffmpeg = require$$0$3;
const ffmpegInstaller = require$$1$2;
const path = require$$4;
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 *
 * @param {*} filePath
 */
const convertAudio$1 = async (filePath = null, format = 'opus') => {
    const formats = {
        mp3: {
            code: 'libmp3lame',
            ext: 'mp3',
        },
        opus: {
            code: 'libopus',
            ext: 'opus',
        },
    };

    const opusFilePath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, path.extname(filePath))}.${formats[format].ext}`
    );
    await new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .audioCodec(formats[format].code)
            .audioBitrate('64k')
            .format(formats[format].ext)
            .output(opusFilePath)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
    return opusFilePath
};

var convertAudio_1 = { convertAudio: convertAudio$1 };

const { ProviderClass } = require$$0$4;
const { Sticker } = require$$1$3;
const pino = require$$2$2;
const rimraf = require$$3;
const mime = require$$0$1;
const { join } = require$$4;
const { createWriteStream, readFileSync, existsSync } = require$$1;
const { Console } = require$$7;

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    proto,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    getAggregateVotesInPollMessage,
} = require$$8;

const { baileyGenerateImage, baileyCleanNumber, baileyIsValidNumber } = utils;

const { generalDownload } = download;
const { generateRefprovider } = hash;
const { convertAudio } = convertAudio_1;

const logger = new Console({
    stdout: createWriteStream(`${process.cwd()}/baileys.log`),
});

/**
 * ⚙️ BaileysProvider: Es una clase tipo adaptor
 * que extiende clases de ProviderClass (la cual es como interfaz para sber que funciones rqueridas)
 * https://github.com/whiskeysockets/Baileys
 */
class BaileysProvider extends ProviderClass {
    globalVendorArgs = { name: `bot`, gifPlayback: false, usePairingCode: false, phoneNumber: null }
    vendor
    store
    saveCredsGlobal = null
    constructor(args) {
        super();
        this.store = null;
        this.globalVendorArgs = { ...this.globalVendorArgs, ...args };
        this.initBailey().then();
    }

    /**
     * Iniciar todo Bailey
     */
    initBailey = async () => {
        const NAME_DIR_SESSION = `${this.globalVendorArgs.name}_sessions`;
        const { state, saveCreds } = await useMultiFileAuthState(NAME_DIR_SESSION);
        const loggerBaileys = pino({ level: 'fatal' });

        this.saveCredsGlobal = saveCreds;

        this.store = makeInMemoryStore({ loggerBaileys });
        this.store.readFromFile(`${NAME_DIR_SESSION}/baileys_store.json`);
        setInterval(() => {
            const path = `${NAME_DIR_SESSION}/baileys_store.json`;
            if (existsSync(NAME_DIR_SESSION)) {
                this.store.writeToFile(path);
            }
        }, 10_000);

        try {
            const sock = makeWASocket({
                logger: loggerBaileys,
                printQRInTerminal: false,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, loggerBaileys),
                },
                browser: ['Chrome (Linux)', '', ''],
                syncFullHistory: false,
                generateHighQualityLinkPreview: true,
                getMessage: this.getMessage,
            });

            this.store?.bind(sock.ev);

            if (this.globalVendorArgs.usePairingCode && !sock.authState.creds.registered) {
                if (this.globalVendorArgs.phoneNumber) {
                    await sock.waitForConnectionUpdate((update) => !!update.qr);
                    const code = await sock.requestPairingCode(this.globalVendorArgs.phoneNumber);
                    this.emit('require_action', {
                        instructions: [
                            `Acepta la notificación del WhatsApp ${this.globalVendorArgs.phoneNumber} en tu celular 👌`,
                            `El token para la vinculación es: ${code}`,
                            `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
                        ],
                    });
                } else {
                    this.emit('auth_failure', [
                        `No se ha definido el numero de telefono agregalo`,
                        `Reinicia el BOT`,
                        `Tambien puedes mirar un log que se ha creado baileys.log`,
                        `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
                        `(Puedes abrir un ISSUE) https://github.com/codigoencasa/bot-whatsapp/issues/new/choose`,
                    ]);
                }
            }

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                const statusCode = lastDisconnect?.error?.output?.statusCode;

                /** Conexion cerrada por diferentes motivos */
                if (connection === 'close') {
                    if (statusCode !== DisconnectReason.loggedOut) {
                        this.initBailey();
                    }

                    if (statusCode === DisconnectReason.loggedOut) {
                        const PATH_BASE = join(process.cwd(), NAME_DIR_SESSION);
                        rimraf(PATH_BASE, (err) => {
                            if (err) return
                        });

                        this.initBailey();
                    }
                }

                /** Conexion abierta correctamente */
                if (connection === 'open') {
                    const parseNumber = `${sock?.user?.id}`.split(':').shift();
                    const host = { ...sock?.user, phone: parseNumber };
                    this.emit('ready', true);
                    this.emit('host', host);
                    this.initBusEvents(sock);
                }

                /** QR Code */
                if (qr && !this.globalVendorArgs.usePairingCode) {
                    this.emit('require_action', {
                        instructions: [
                            `Debes escanear el QR Code 👌 ${this.globalVendorArgs.name}.qr.png`,
                            `Recuerda que el QR se actualiza cada minuto `,
                            `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
                        ],
                    });
                    await baileyGenerateImage(qr, `${this.globalVendorArgs.name}.qr.png`);
                }
            });

            sock.ev.on('creds.update', async () => {
                await saveCreds();
            });
        } catch (e) {
            logger.log(e);
            this.emit('auth_failure', [
                `Algo inesperado ha ocurrido NO entres en pánico`,
                `Reinicia el BOT`,
                `Tambien puedes mirar un log que se ha creado baileys.log`,
                `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
                `(Puedes abrir un ISSUE) https://github.com/codigoencasa/bot-whatsapp/issues/new/choose`,
            ]);
        }
    }

    /**
     * Mapeamos los eventos nativos a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'messages.upsert',
            func: ({ messages, type }) => {
                if (type !== 'notify') return
                const [messageCtx] = messages;

                if (messageCtx?.message?.protocolMessage?.type === 'EPHEMERAL_SETTING') return

                let payload = {
                    ...messageCtx,
                    body: messageCtx?.message?.extendedTextMessage?.text ?? messageCtx?.message?.conversation,

                    from: messageCtx?.key?.remoteJid,
                };

                //Detectar location
                if (messageCtx.message?.locationMessage) {
                    const { degreesLatitude, degreesLongitude } = messageCtx.message.locationMessage;
                    if (typeof degreesLatitude === 'number' && typeof degreesLongitude === 'number') {
                        payload = { ...payload, body: generateRefprovider('_event_location_') };
                    }
                }

                //Detectar video
                if (messageCtx.message?.videoMessage) {
                    payload = { ...payload, body: generateRefprovider('_event_media_') };
                }

                //Detectar Sticker
                if (messageCtx.message?.stickerMessage) {
                    payload = { ...payload, body: generateRefprovider('_event_media_') };
                }

                //Detectar media
                if (messageCtx.message?.imageMessage) {
                    payload = { ...payload, body: generateRefprovider('_event_media_') };
                }

                //Detectar file
                if (messageCtx.message?.documentMessage) {
                    payload = { ...payload, body: generateRefprovider('_event_document_') };
                }

                //Detectar voice note
                if (messageCtx.message?.audioMessage) {
                    payload = { ...payload, body: generateRefprovider('_event_voice_note_') };
                }

                if (payload.from === 'status@broadcast') return

                if (payload?.key?.fromMe) return

                if (!baileyIsValidNumber(payload.from)) {
                    return
                }

                const btnCtx = payload?.message?.buttonsResponseMessage?.selectedDisplayText;
                if (btnCtx) payload.body = btnCtx;

                const listRowId = payload?.message?.listResponseMessage?.title;
                if (listRowId) payload.body = listRowId;

                payload.from = baileyCleanNumber(payload.from, true);
                this.emit('message', payload);
            },
        },
        {
            event: 'messages.update',
            func: async (message) => {
                for (const { key, update } of message) {
                    if (update.pollUpdates) {
                        const pollCreation = await this.getMessage(key);
                        if (pollCreation) {
                            const pollMessage = await getAggregateVotesInPollMessage({
                                message: pollCreation,
                                pollUpdates: update.pollUpdates,
                            });
                            const [messageCtx] = message;

                            const messageOriginalKey = messageCtx?.update?.pollUpdates[0]?.pollUpdateMessageKey;
                            const messageOriginal = await this.store.loadMessage(
                                messageOriginalKey.remoteJid,
                                messageOriginalKey.id
                            );

                            let payload = {
                                ...messageCtx,
                                body: pollMessage.find((poll) => poll.voters.length > 0)?.name || '',
                                from: baileyCleanNumber(key.remoteJid, true),
                                pushName: messageOriginal?.pushName,
                                broadcast: messageOriginal?.broadcast,
                                messageTimestamp: messageOriginal?.messageTimestamp,
                                voters: pollCreation,
                                type: 'poll',
                            };
                            this.emit('message', payload);
                        }
                    }
                }
            },
        },
    ]

    initBusEvents = (_sock) => {
        this.vendor = _sock;
        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.vendor.ev.on(event, func);
        }
    }

    getMessage = async (key) => {
        if (this.store) {
            const msg = await this.store.loadMessage(key.remoteJid, key.id);
            return msg?.message || undefined
        }
        // only if store is present
        return proto.Message.fromObject({})
    }

    /**
     * Funcion SendRaw envia opciones directamente del proveedor
     * @example await sendMessage('+XXXXXXXXXXX', 'Hello World')
     */

    /**
     * @alpha
     * @param {string} number
     * @param {string} message
     * @example await sendMessage('+XXXXXXXXXXX', 'https://dominio.com/imagen.jpg' | 'img/imagen.jpg')
     */

    sendMedia = async (number, imageUrl, text) => {
        const fileDownloaded = await generalDownload(imageUrl);
        const mimeType = mime.lookup(fileDownloaded);

        if (mimeType.includes('image')) return this.sendImage(number, fileDownloaded, text)
        if (mimeType.includes('video')) return this.sendVideo(number, fileDownloaded, text)
        if (mimeType.includes('audio')) {
            const fileOpus = await convertAudio(fileDownloaded);
            return this.sendAudio(number, fileOpus, text)
        }

        return this.sendFile(number, fileDownloaded)
    }

    /**
     * Enviar imagen
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendImage = async (number, filePath, text) => {
        return this.vendor.sendMessage(number, {
            image: readFileSync(filePath),
            caption: text,
        })
    }

    /**
     * Enviar video
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendVideo = async (number, filePath, text) => {
        return this.vendor.sendMessage(number, {
            video: readFileSync(filePath),
            caption: text,
            gifPlayback: this.globalVendorArgs.gifPlayback,
        })
    }

    /**
     * Enviar audio
     * @alpha
     * @param {string} number
     * @param {string} message
     * @param {boolean} voiceNote optional
     * @example await sendMessage('+XXXXXXXXXXX', 'audio.mp3')
     */

    sendAudio = async (number, audioUrl) => {
        return this.vendor.sendMessage(number, {
            audio: { url: audioUrl },
            ptt: true,
        })
    }

    /**
     *
     * @param {string} number
     * @param {string} message
     * @returns
     */
    sendText = async (number, message) => {
        return this.vendor.sendMessage(number, { text: message })
    }

    /**
     *
     * @param {string} number
     * @param {string} filePath
     * @example await sendMessage('+XXXXXXXXXXX', './document/file.pdf')
     */

    sendFile = async (number, filePath) => {
        const mimeType = mime.lookup(filePath);
        const fileName = filePath.split('/').pop();
        return this.vendor.sendMessage(number, {
            document: { url: filePath },
            mimetype: mimeType,
            fileName: fileName,
        })
    }

    /**
     *
     * @param {string} number
     * @param {string} text
     * @param {string} footer
     * @param {Array} buttons
     * @example await sendMessage("+XXXXXXXXXXX", "Your Text", "Your Footer", [{"buttonId": "id", "buttonText": {"displayText": "Button"}, "type": 1}])
     */

    sendButtons = async (number, text, buttons) => {
        this.emit(
            'notice',
            [
                `[NOTA]: Actualmente enviar botones no esta disponible con este proveedor`,
                `[NOTA]: esta funcion esta disponible con Meta o Twilio`,
            ].join('\n')
        );
        const numberClean = baileyCleanNumber(number);

        const templateButtons = buttons.map((btn, i) => ({
            buttonId: `id-btn-${i}`,
            buttonText: { displayText: btn.body },
            type: 1,
        }));

        const buttonMessage = {
            text,
            footer: '',
            buttons: templateButtons,
            headerType: 1,
        };

        return this.vendor.sendMessage(numberClean, buttonMessage)
    }

    /**
     *
     * @param {string} number
     * @param {string} text
     * @param {string} footer
     * @param {Array} poll
     * @example await sendMessage("+XXXXXXXXXXX", { poll: { "name": "You accept terms", "values": [ "Yes", "Not"], "selectableCount": 1 })
     */

    sendPoll = async (numberIn, text, poll) => {
        const numberClean = baileyCleanNumber(numberIn);

        if (poll.options.length < 2) return false

        const pollMessage = {
            name: text,
            values: poll.options,
            selectableCount: poll?.multiselect === undefined ? 1 : poll?.multiselect ? 1 : 0,
        };

        return this.vendor.sendMessage(numberClean, { poll: pollMessage })
    }

    /**
     * TODO: Necesita terminar de implementar el sendMedia y sendButton guiarse:
     * https://github.com/leifermendez/bot-whatsapp/blob/4e0fcbd8347f8a430adb43351b5415098a5d10df/packages/provider/src/web-whatsapp/index.js#L165
     * @param {string} number
     * @param {string} message
     * @example await sendMessage('+XXXXXXXXXXX', 'Hello World')
     */

    sendMessage = async (numberIn, message, { options }) => {
        const number = baileyCleanNumber(numberIn);

        if (options?.buttons?.length) return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, options.media, message)
        return this.sendText(number, message)
    }

    /**
     * @param {string} remoteJid
     * @param {string} latitude
     * @param {string} longitude
     * @param {any} messages
     * @example await sendLocation("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "xx.xxxx", "xx.xxxx", messages)
     */

    sendLocation = async (remoteJid, latitude, longitude, messages = null) => {
        await this.vendor.sendMessage(
            remoteJid,
            {
                location: {
                    degreesLatitude: latitude,
                    degreesLongitude: longitude,
                },
            },
            { quoted: messages }
        );

        return { status: 'success' }
    }

    /**
     * @param {string} remoteJid
     * @param {string} contactNumber
     * @param {string} displayName
     * @param {any} messages - optional
     * @example await sendContact("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "+xxxxxxxxxxx", "Robin Smith", messages)
     */

    sendContact = async (remoteJid, contactNumber, displayName, messages = null) => {
        const cleanContactNumber = contactNumber.replaceAll(' ', '');
        const waid = cleanContactNumber.replace('+', '');

        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${displayName}\n` +
            'ORG:Ashoka Uni;\n' +
            `TEL;type=CELL;type=VOICE;waid=${waid}:${cleanContactNumber}\n` +
            'END:VCARD';

        await this.client.sendMessage(
            remoteJid,
            {
                contacts: {
                    displayName: 'XD',
                    contacts: [{ vcard }],
                },
            },
            { quoted: messages }
        );

        return { status: 'success' }
    }

    /**
     * @param {string} remoteJid
     * @param {string} WAPresence
     * @example await sendPresenceUpdate("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "recording")
     */
    sendPresenceUpdate = async (remoteJid, WAPresence) => {
        await this.client.sendPresenceUpdate(WAPresence, remoteJid);
    }

    /**
     * @param {string} remoteJid
     * @param {string} url
     * @param {object} stickerOptions
     * @param {any} messages - optional
     * @example await sendSticker("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://dn/image.png" || "https://dn/image.gif" || "https://dn/image.mp4", {pack: 'User', author: 'Me'} messages)
     */

    sendSticker = async (remoteJid, url, stickerOptions, messages = null) => {
        const sticker = new Sticker(url, {
            ...stickerOptions,
            quality: 50,
            type: 'crop',
        });

        const buffer = await sticker.toMessage();

        await this.client.sendMessage(remoteJid, buffer, { quoted: messages });
    }
}

var baileys = BaileysProvider;

module.exports = baileys;
