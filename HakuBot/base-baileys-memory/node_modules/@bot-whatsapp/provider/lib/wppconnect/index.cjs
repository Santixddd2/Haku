/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$4 = require('@bot-whatsapp/bot');
var require$$1$3 = require('@wppconnect-team/wppconnect');
var require$$1 = require('fs');
var require$$0 = require('sharp');
var require$$0$1 = require('mime-types');
var require$$1$1 = require('os');
var require$$2 = require('follow-redirects');
var require$$4 = require('path');
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

const { writeFile } = require$$1;
const { cleanImage } = cleanImage_1;

const WppConnectCleanNumber$1 = (number, full = false) => {
    number = number.replace('@c.us', '');
    number = full ? `${number}@c.us` : `${number}`;
    return number
};

const WppConnectGenerateImage$1 = async (base, name = 'qr.png') => {
    const PATH_QR = `${process.cwd()}/${name}`;
    const matches = base.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        return new Error('Invalid input string')
    }

    let response = {};
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    const writeFilePromise = () =>
        new Promise((resolve, reject) => {
            writeFile(PATH_QR, response['data'], 'binary', (err) => {
                if (err != null) reject('ERROR_QR_GENERATE');
                resolve(true);
            });
        });

    await writeFilePromise();
    await cleanImage(PATH_QR);
};

const WppConnectValidNumber$1 = (rawNumber) => {
    const regexGroup = /\@g.us\b/gm;
    const exist = rawNumber.match(regexGroup);
    return !exist
};

var utils = {
    WppConnectValidNumber: WppConnectValidNumber$1,
    WppConnectGenerateImage: WppConnectGenerateImage$1,
    WppConnectCleanNumber: WppConnectCleanNumber$1,
};

const mimeDep = require$$0$1;
const { tmpdir } = require$$1$1;
const http = require$$2.http;
const https = require$$2.https;
const { rename, createWriteStream, existsSync } = require$$1;
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
    const checkIsLocal = existsSync(url);

    const handleDownload = () => {
        const checkProtocol = url.includes('https:');
        const handleHttp = checkProtocol ? https : http;
        const fileName = basename(new URL(url).pathname);
        const name = parse(fileName).name;
        const fullPath = `${tmpdir()}/${name}`;
        const file = createWriteStream(fullPath);

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
const { create, defaultLogger } = require$$1$3;
const { WppConnectGenerateImage, WppConnectValidNumber, WppConnectCleanNumber } = utils;
const { generalDownload } = download;
const { generateRefprovider } = hash;
const { convertAudio } = convertAudio_1;
const mime = require$$0$1;

/**
 * ⚙️ WppConnectProvider: Es una clase tipo adaptador
 * que extiende la clase ProviderClass (la cual es como una interfaz para saber qué funciones son requeridas).
 * https://github.com/wppconnect-team/wppconnect
 */
defaultLogger.transports.forEach((t) => (t.silent = true)); //<==
class WPPConnectProviderClass extends ProviderClass {
    globalVendorArgs = { name: 'bot' }
    vendor

    constructor(args) {
        super();
        this.globalVendorArgs = { ...this.globalVendorArgs, ...args };
        this.initWppConnect().then();
    }

    /**
     * Iniciar WppConnect
     */
    initWppConnect = async () => {
        try {
            this.emit('preinit');
            const name = this.globalVendorArgs.name;
            const session = await create({
                session: name,
                catchQR: (base64Qrimg, { attempt }) => {
                    if (attempt == 5) throw new Error()

                    this.emit('require_action', {
                        instructions: [
                            `Debes escanear el QR Code para iniciar ${this.globalVendorArgs.name}.qr.png`,
                            `Recuerde que el código QR se actualiza cada minuto `,
                            `¿Necesita ayuda? https://link.codigoencasa.com/DISCORD`,
                        ],
                    });
                    WppConnectGenerateImage(base64Qrimg, `${this.globalVendorArgs.name}.qr.png`);
                },
                puppeteerOptions: {
                    headless: true,
                    args: ['--no-sandbox'],
                },
            });

            this.vendor = session;
            this.emit('ready', true);
            this.initBusEvents();
        } catch (error) {
            this.emit('auth_failure', [
                `Algo inesperado ha ocurrido, no entres en pánico`,
                `Reinicie el bot`,
                `También puede consultar el registro generado wppconnect.log`,
                `Necesita ayuda: https://link.codigoencasa.com/DISCORD`,
                `(Puede abrir un ISSUE) https://github.com/codigoencasa/bot-whatsapp/issues/new/choose`,
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
            event: 'onMessage',
            func: (payload) => {
                if (payload.from === 'status@broadcast') {
                    return
                }
                if (!WppConnectValidNumber(payload.from)) {
                    return
                }
                payload.from = WppConnectCleanNumber(payload.from, false);

                if (payload.hasOwnProperty('type') && ['image', 'video'].includes(payload.type)) {
                    payload = { ...payload, body: generateRefprovider('_event_media_') };
                }
                if (payload.hasOwnProperty('type') && ['document'].includes(payload.type)) {
                    payload = { ...payload, body: generateRefprovider('_event_document_') };
                }
                if (payload.hasOwnProperty('type') && ['ptt'].includes(payload.type)) {
                    payload = { ...payload, body: generateRefprovider('_event_voice_note_') };
                }
                if (payload.hasOwnProperty('lat') && payload.hasOwnProperty('lng')) {
                    const lat = payload.lat;
                    const lng = payload.lng;
                    if (lat !== '' && lng !== '') {
                        payload = { ...payload, body: generateRefprovider('_event_location_') };
                    }
                }

                // Emitir el evento "message" con el payload modificado
                this.emit('message', payload);
            },
        },
        {
            event: 'onPollResponse',
            func: async (payload) => {
                const selectedOption = payload.selectedOptions.find((option) => option && option.name);

                payload.id = payload.msgId?._serialized ?? '';
                payload.type = 'poll';
                payload.body = selectedOption ? selectedOption.name : '';
                payload.notifyName = payload.sender;
                payload.from = WppConnectCleanNumber(payload.sender, false);
                payload.to = payload.sender;
                payload.sender = (await this.vendor.getContact(payload.chatId)) ?? {};
                payload.notifyName = payload?.sender?.pushname ?? '';
                payload.t = payload.timestamp;

                // Emitir el evento "message" con el payload modificado
                this.emit('message', payload);
            },
        },
    ]

    initBusEvents = () => {
        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            if (this.vendor[event]) this.vendor[event]((payload) => func(payload));
        }
    }

    /**
     * Enviar mensaje con botones
     * @param {string} number
     * @param {string} text
     * @param {Array} buttons
     * @example await sendButtons("+XXXXXXXXXXX", "Your Text", [{"body": "Button 1"},{"body": "Button 2"}])
     */
    sendButtons = async (number, text, buttons) => {
        this.emit(
            'notice',
            [
                `[NOTA]: Actualmente enviar botones no esta disponible con este proveedor`,
                `[NOTA]: esta funcion esta disponible con Meta o Twilio`,
            ].join('\n')
        );

        const templateButtons = buttons.map((btn, i) => ({
            id: `id-btn-${i}`,
            text: btn.body,
        }));

        const buttonMessage = {
            useTemplateButtons: true,
            buttons: templateButtons,
        };

        return this.vendor.sendText(number, text, buttonMessage)
    }

    /**
     * Enviar mensaje con encuesta
     * @param {string} number
     * @param {string} text
     * @param {Array} poll
     * @example await sendPollMessage("+XXXXXXXXXXX", "You accept terms", [ "Yes", "Not"], {"selectableCount": 1})
     */

    sendPoll = async (number, text, poll) => {
        if (poll.options.length < 2) return false

        const selectableCount = poll.multiselect === undefined ? 1 : poll.multiselect ? 1 : 0;
        return this.vendor.sendPollMessage(number, text, poll.options, { selectableCount })
    }

    /**
     * Enviar audio
     * @alpha
     * @param {string} number
     * @param {string} message
     * @param {boolean} voiceNote optional
     * @example await sendMessage('+XXXXXXXXXXX', 'audio.mp3')
     */

    sendPtt = async (number, audioPath) => {
        return this.vendor.sendPtt(number, audioPath)
    }

    /**
     * Enviar imagen
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendImage = async (number, filePath, text) => {
        return this.vendor.sendImage(number, filePath, 'image-name', text)
    }

    /**
     *
     * @param {string} number
     * @param {string} filePath
     * @example await sendMessage('+XXXXXXXXXXX', './document/file.pdf')
     */

    sendFile = async (number, filePath, text) => {
        const fileName = filePath.split('/').pop();
        return this.vendor.sendFile(number, filePath, fileName, text)
    }

    /**
     * Enviar video
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendVideo = async (number, filePath, text) => {
        return this.vendor.sendVideoAsGif(number, filePath, 'video.gif', text)
    }

    /**
     * Enviar imagen o multimedia
     * @param {*} number
     * @param {*} mediaInput
     * @param {*} message
     * @returns
     */
    sendMedia = async (number, mediaUrl, text) => {
        const fileDownloaded = await generalDownload(mediaUrl);
        const mimeType = mime.lookup(fileDownloaded);

        if (mimeType.includes('image')) return this.sendImage(number, fileDownloaded, text)
        if (mimeType.includes('video')) return this.sendVideo(number, fileDownloaded, text)
        if (mimeType.includes('audio')) {
            const fileOpus = await convertAudio(fileDownloaded);
            return this.sendPtt(number, fileOpus)
        }

        return this.sendFile(number, fileDownloaded, text)
    }

    /**
     * Enviar mensaje al usuario
     * @param {*} to
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (to, message, { options }) => {
        const number = to;
        if (options?.buttons?.length) return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, options.media, message)
        return this.vendor.sendText(number, message)
    }
}

var wppconnect = WPPConnectProviderClass;

module.exports = wppconnect;
