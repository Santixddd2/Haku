/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$4 = require('@bot-whatsapp/bot');
var require$$1$3 = require('venom-bot');
var require$$1 = require('fs');
var require$$3$1 = require('console');
var require$$0$1 = require('mime-types');
var require$$1$1 = require('os');
var require$$2 = require('http');
var require$$3 = require('https');
var require$$0 = require('sharp');
var require$$2$1 = require('follow-redirects');
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

const { writeFile, createWriteStream: createWriteStream$2 } = require$$1;
const { tmpdir: tmpdir$1 } = require$$1$1;
const http$1 = require$$2;
const https$1 = require$$3;
const { cleanImage } = cleanImage_1;

const venomCleanNumber$1 = (number, full = false) => {
    number = number.replace('@c.us', '');
    number = !full ? `${number}@c.us` : `${number}`;
    return number
};

const venomGenerateImage$1 = async (base, name = 'qr.png') => {
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

/**
 * Incompleta
 * Descargar archivo multimedia para enviar
 * @param {*} url
 * @returns
 */
const venomDownloadMedia = (url) => {
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

const venomisValidNumber$1 = (rawNumber) => {
    const regexGroup = /\@g.us\b/gm;
    const exist = rawNumber.match(regexGroup);
    return !exist
};
var utils = {
    venomCleanNumber: venomCleanNumber$1,
    venomGenerateImage: venomGenerateImage$1,
    venomisValidNumber: venomisValidNumber$1,
    venomDownloadMedia,
};

const mimeDep = require$$0$1;
const { tmpdir } = require$$1$1;
const http = require$$2$1.http;
const https = require$$2$1.https;
const { rename, createWriteStream: createWriteStream$1, existsSync } = require$$1;
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
const venom = require$$1$3;
const { createWriteStream } = require$$1;
const { Console } = require$$3$1;
const mime = require$$0$1;

const { venomCleanNumber, venomGenerateImage, venomisValidNumber } = utils;

const logger = new Console({
    stdout: createWriteStream(`${process.cwd()}/venom.log`),
});

const { generalDownload } = download;
const { generateRefprovider } = hash;
const { convertAudio } = convertAudio_1;

/**
 * ⚙️ VenomProvider: Es una clase tipo adaptor
 * que extiende clases de ProviderClass (la cual es como interfaz para sber que funciones rqueridas)
 * https://github.com/orkestral/venom
 */
class VenomProvider extends ProviderClass {
    globalVendorArgs = { name: `bot`, gifPlayback: false }
    vendor
    constructor(args) {
        super();
        this.globalVendorArgs = { ...this.globalVendorArgs, ...args };
        this.init().then(() => this.initBusEvents());
    }

    /**
     * Iniciamos el Proveedor Venom
     */
    init = async () => {
        const NAME_DIR_SESSION = `${this.globalVendorArgs.name}_sessions`;
        try {
            const client = await venom.create(
                {
                    session: NAME_DIR_SESSION,
                    multidevice: true,
                    disableSpins: true,
                    disableWelcome: true,
                    logger,
                    logQR: false,
                },
                (base) => this.generateQr(base),
                undefined
            );
            this.vendor = client;
            this.emit('ready', true);
        } catch (e) {
            logger.log(e);
            this.emit('auth_failure', {
                instructions: [
                    `Ocurrio un error con la inicializacion de venom`,
                    `Reinicia el BOT`,
                    `Tambien puedes mirar un log que se ha creado venom.log`,
                    `(Puedes abrir un ISSUE) https://github.com/codigoencasa/bot-whatsapp/issues/new/choose`,
                ],
            });
        }
    }

    /**
     * Generamos QR Code pra escanear con el Whatsapp
     */
    generateQr = async (qr) => {
        console.clear();
        this.emit('require_action', {
            instructions: [
                `Debes escanear el QR Code para iniciar ${this.globalVendorArgs.name}.qr.png`,
                `Recuerda que el QR se actualiza cada minuto `,
                `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
            ],
        });
        await venomGenerateImage(qr, `${this.globalVendorArgs.name}.qr.png`);
    }

    /**
     * Mapeamos los eventos nativos de  https://docs.orkestral.io/venom/#/?id=events
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
                if (!venomisValidNumber(payload.from)) {
                    return
                }
                payload.from = venomCleanNumber(payload.from, true);

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
                this.emit('message', payload);
            },
        },
    ]

    /**
     * Iniciamos y mapeamos el BusEvent
     * Ejemplo:
     * this.vendor.onMessage() 👉 this.vendor["onMessage"]()
     */
    initBusEvents = () => {
        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            if (this.vendor[event]) this.vendor[event]((payload) => func(payload));
        }
    }

    /**
     * Enviar botones
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
        const buttonToStr = [message].concat(buttons.map((btn) => `${btn.body}`)).join(`\n`);
        return this.vendor.sendText(number, buttonToStr)
        // return this.vendor.sendButtons(number, "Title", buttons1, "Description");
    }

    /**
     * Enviar audio
     * @alpha
     * @param {string} number
     * @param {string} message
     * @param {boolean} voiceNote optional
     * @example await sendMessage('+XXXXXXXXXXX', 'audio.mp3')
     */

    sendAudio = async (number, audioPath) => {
        return this.vendor.sendVoice(number, audioPath)
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
            const fileOpus = await convertAudio(fileDownloaded, 'mp3');
            return this.sendAudio(number, fileOpus)
        }

        return this.sendFile(number, fileDownloaded, text)
    }

    /**
     * Enviar mensaje al usuario
     * @param {*} userId
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (userId, message, { options }) => {
        const number = venomCleanNumber(userId);
        if (options?.buttons?.length) return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, options.media, message)
        return this.vendor.sendText(number, message)
    }
}

var venom_1 = VenomProvider;

module.exports = venom_1;
