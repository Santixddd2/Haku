/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$4 = require('whatsapp-web.js');
var require$$1$3 = require('@bot-whatsapp/bot');
var require$$2$2 = require('console');
var require$$0$1 = require('mime-types');
var require$$1 = require('fs');
var require$$1$1 = require('qr-image');
var require$$2 = require('os');
var require$$3 = require('http');
var require$$4 = require('https');
var require$$0 = require('sharp');
var require$$2$1 = require('follow-redirects');
var require$$4$1 = require('path');
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
const qr = require$$1$1;
const { tmpdir: tmpdir$1 } = require$$2;
const http$1 = require$$3;
const https$1 = require$$4;
const { cleanImage } = cleanImage_1;

const wwebCleanNumber$1 = (number, full = false) => {
    number = number.replace('@c.us', '');
    number = !full ? `${number}@c.us` : `${number}`;
    return number
};

const wwebGenerateImage$1 = async (base64, name = 'qr.png') => {
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

const wwebIsValidNumber$1 = (rawNumber) => {
    const regexGroup = /\@g.us\b/gm;
    const exist = rawNumber.match(regexGroup);
    return !exist
};

/**
 * Incompleta
 * Descargar archivo multimedia para enviar
 * @param {*} url
 * @returns
 */
const wwebDownloadMedia = (url) => {
    return new Promise((resolve, reject) => {
        const ext = url.split('.').pop();
        const checkProtocol = url.includes('https:');
        const handleHttp = checkProtocol ? https$1 : http$1;
        const name = `tmp-${Date.now()}.${ext}`;
        const fullPath = `${tmpdir$1()}/${name}`;
        const file = createWriteStream$2(fullPath);
        handleHttp.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                resolve(fullPath);
            });
            file.on('error', function () {
                console.log('errro');
                file.close();
                reject(null);
            });
        });
    })
};

var utils = {
    wwebCleanNumber: wwebCleanNumber$1,
    wwebGenerateImage: wwebGenerateImage$1,
    wwebIsValidNumber: wwebIsValidNumber$1,
    wwebDownloadMedia,
};

const mimeDep = require$$0$1;
const { tmpdir } = require$$2;
const http = require$$2$1.http;
const https = require$$2$1.https;
const { rename, createWriteStream: createWriteStream$1, existsSync } = require$$1;
const { extname, basename, parse } = require$$4$1;

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
const path = require$$4$1;
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

const { Client, LocalAuth, MessageMedia, Buttons } = require$$0$4;
const { ProviderClass } = require$$1$3;
const { Console } = require$$2$2;
const mime = require$$0$1;
const { createWriteStream, readFileSync } = require$$1;
const { wwebCleanNumber, wwebGenerateImage, wwebIsValidNumber } = utils;

const logger = new Console({
    stdout: createWriteStream('./log'),
});

const { generalDownload } = download;
const { generateRefprovider } = hash;
const { convertAudio } = convertAudio_1;

/**
 * ⚙️ WebWhatsappProvider: Es una clase tipo adaptor
 * que extiende clases de ProviderClass (la cual es como interfaz para sber que funciones rqueridas)
 * https://github.com/pedroslopez/whatsapp-web.js
 */
class WebWhatsappProvider extends ProviderClass {
    globalVendorArgs = { name: `bot`, gifPlayback: false }
    vendor
    constructor(args) {
        super();
        this.globalVendorArgs = { ...this.globalVendorArgs, ...args };
        this.vendor = new Client({
            authStrategy: new LocalAuth({
                clientId: `${this.globalVendorArgs.name}_sessions`,
            }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--unhandled-rejections=strict'],
                //executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            },
        });

        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.vendor.on(event, func);
        }

        this.vendor.emit('preinit');
        this.vendor.initialize().catch((e) => {
            logger.log(e);
            this.emit('require_action', {
                instructions: [
                    `(Opcion 1): Debes eliminar la carpeta .wwebjs_auth y reiniciar nuevamente el bot. `,
                    `(Opcion 2): Ejecutar este comando "npm install whatsapp-web.js@latest" `,
                    `(Opcion 3): Ir FORO de discord https://link.codigoencasa.com/DISCORD `,
                ],
            });
        });
    }

    /**
     * Mapeamos los eventos nativos de  whatsapp-web.js a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'auth_failure',
            func: (payload) => this.emit('error', payload),
        },
        {
            event: 'qr',
            func: async (qr) => {
                this.emit('require_action', {
                    instructions: [
                        `Debes escanear el QR Code para iniciar ${this.globalVendorArgs.name}.qr.png`,
                        `Recuerda que el QR se actualiza cada minuto `,
                        `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
                    ],
                });
                await wwebGenerateImage(qr, `${this.globalVendorArgs.name}.qr.png`);
            },
        },
        {
            event: 'ready',
            func: () => {
                const host = { ...this.vendor?.info?.wid, phone: this.vendor?.info?.wid?.user };
                this.emit('ready', true);
                this.emit('host', host);
            },
        },
        {
            event: 'message',
            func: (payload) => {
                if (payload.from === 'status@broadcast') {
                    return
                }

                if (!wwebIsValidNumber(payload.from)) {
                    return
                }
                payload.from = wwebCleanNumber(payload.from, true);
                if (payload._data.lat && payload._data.lng) {
                    payload = { ...payload, body: generateRefprovider('_event_location_') };
                }

                if (payload._data.hasOwnProperty('type') && ['image', 'video'].includes(payload._data.type)) {
                    payload = { ...payload, body: generateRefprovider('_event_media_') };
                }

                if (payload._data.hasOwnProperty('type') && ['document'].includes(payload._data.type)) {
                    payload = { ...payload, body: generateRefprovider('_event_document_') };
                }

                if (payload._data.hasOwnProperty('type') && ['ptt'].includes(payload._data.type)) {
                    payload = { ...payload, body: generateRefprovider('_event_voice_note_') };
                }

                this.emit('message', payload);
            },
        },
    ]

    /**
     * Enviar botones
     * https://docs.wwebjs.dev/Buttons.html
     * @private
     * @param {*} number
     * @param {*} message
     * @param {*} buttons []
     * @returns
     */
    sendButtons = async (number, message, buttons = []) => {
        this.emit(
            'notice',
            [
                `[NOTA]: Actualmente enviar botones no esta disponible con este proveedor`,
                `[NOTA]: esta funcion esta disponible con Meta o Twilio`,
            ].join('\n')
        );
        const buttonMessage = new Buttons(message, buttons, '', '');
        return this.vendor.sendMessage(number, buttonMessage)
    }

    /**
     * Enviar lista
     * https://docs.wwebjs.dev/List.html
     * @private
     * @alpha No funciona en whatsapp bussines
     * @param {*} number
     * @param {*} message
     * @param {*} buttons []
     * @returns
     */
    // sendList = async (number, message, listInput = []) => {
    //     let sections = [
    //         {
    //             title: 'sectionTitle',
    //             rows: [
    //                 { title: 'ListItem1', description: 'desc' },
    //                 { title: 'ListItem2' },
    //             ],
    //         },
    //     ]
    //     let list = new List('List body', 'btnText', sections, 'Title', 'footer')
    //     return this.vendor.sendMessage(number, list)
    // }

    /**
     * Enviar un mensaje solo texto
     * https://docs.wwebjs.dev/Message.html
     * @private
     * @param {*} number
     * @param {*} message
     * @returns
     */
    sendText = async (number, message) => {
        return this.vendor.sendMessage(number, message)
    }

    /**
     * Enviar imagen
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendImage = async (number, filePath, caption) => {
        const base64 = readFileSync(filePath, { encoding: 'base64' });
        const mimeType = mime.lookup(filePath);
        const media = new MessageMedia(mimeType, base64);
        return this.vendor.sendMessage(number, media, { caption })
    }

    /**
     * Enviar audio
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */

    sendAudio = async (number, filePath, caption) => {
        const base64 = readFileSync(filePath, { encoding: 'base64' });
        const mimeType = mime.lookup(filePath);
        const media = new MessageMedia(mimeType, base64);
        return this.vendor.sendMessage(number, media, { caption })
    }

    /**
     * Enviar video
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendVideo = async (number, filePath) => {
        const base64 = readFileSync(filePath, { encoding: 'base64' });
        const mimeType = mime.lookup(filePath);
        const media = new MessageMedia(mimeType, base64);
        return this.vendor.sendMessage(number, media, {
            sendMediaAsDocument: true,
        })
    }

    /**
     * Enviar Arhivos/pdf
     * @param {*} number
     * @param {*} imageUrl
     * @param {*} text
     * @returns
     */
    sendFile = async (number, filePath) => {
        const base64 = readFileSync(filePath, { encoding: 'base64' });
        const mimeType = mime.lookup(filePath);
        const media = new MessageMedia(mimeType, base64);
        return this.vendor.sendMessage(number, media)
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
        if (mimeType.includes('video')) return this.sendVideo(number, fileDownloaded)
        if (mimeType.includes('audio')) {
            const fileOpus = await convertAudio(fileDownloaded);
            return this.sendAudio(number, fileOpus)
        }

        return this.sendFile(number, fileDownloaded)
    }

    /**
     * Funcion SendRaw envia opciones directamente del proveedor
     * @param {string} number
     * @param {string} message
     * @example await sendMessage('+XXXXXXXXXXX', 'Hello World')
     */

    sendRaw = () => this.vendor.sendMessage
    /**
     *
     * @param {*} userId
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (userId, message, { options }) => {
        const number = wwebCleanNumber(userId);
        if (options?.buttons?.length) return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, options.media)
        return this.sendText(number, message)
    }
}

var webWhatsapp = WebWhatsappProvider;

module.exports = webWhatsapp;
