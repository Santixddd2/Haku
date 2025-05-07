/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$5 = require('@bot-whatsapp/bot');
var require$$0$3 = require('axios');
var require$$2$2 = require('form-data');
var require$$3 = require('fs');
var require$$0 = require('mime-types');
var require$$1 = require('os');
var require$$2 = require('follow-redirects');
var require$$4 = require('path');
var require$$0$1 = require('fluent-ffmpeg');
var require$$1$1 = require('@ffmpeg-installer/ffmpeg');
var require$$0$4 = require('node:events');
var require$$1$2 = require('polka');
var require$$2$1 = require('body-parser');
var require$$0$2 = require('crypto');
var require$$5 = require('queue-promise');

const mimeDep = require$$0;
const { tmpdir } = require$$1;
const http = require$$2.http;
const https = require$$2.https;
const { rename, createWriteStream, existsSync } = require$$3;
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

const ffmpeg = require$$0$1;
const ffmpegInstaller = require$$1$1;
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

const axios$1 = require$$0$3;

async function getMediaUrl$1(version, IdMedia, numberId, Token) {
    try {
        const response = await axios$1.get(
            `https://graph.facebook.com/${version}/${IdMedia}?phone_number_id=${numberId}`,
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                maxBodyLength: Infinity,
            }
        );
        return response.data?.url
    } catch (error) {
        console.log(error);
    }
}

var utils = {
    getMediaUrl: getMediaUrl$1,
};

const { EventEmitter } = require$$0$4;
const polka = require$$1$2;
const { urlencoded, json } = require$$2$1;
const { generateRefprovider } = hash;
const { getMediaUrl } = utils;
const Queue$1 = require$$5;

let MetaWebHookServer$1 = class MetaWebHookServer extends EventEmitter {
    constructor(jwtToken, numberId, version, token, metaPort = 3000) {
        super();
        this.metaPort = metaPort;
        this.token = token;

        this.jwtToken = jwtToken;
        this.numberId = numberId;
        this.version = version;
        this.metaServer = this.buildHTTPServer();

        this.messageQueue = new Queue$1({
            concurrent: 1, // Procesa un mensaje a la vez
            interval: 50, // Intervalo de 100 milisegundos entre mensajes
            start: true, // La cola empieza a procesar tareas inmediatamente
        });
    }

    /**
     * Mensaje entrante
     * emit: 'message'
     * @param {*} req
     * @param {*} res
     */
    incomingMsg = async (req, res) => {
        const { body } = req;
        const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
        const contacts = req?.body?.entry?.[0]?.changes?.[0]?.value?.contacts;

        if (!messages) {
            res.statusCode = 200;
            res.end('empty endpoint');
            return
        }

        messages.forEach(async (message) => {
            const [contact] = contacts;
            const to = body.entry[0].changes[0].value?.metadata?.display_phone_number;
            const pushName = contact?.profile?.name;
            let responseObj;

            switch (message.type) {
                case 'text': {
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        to,
                        body: message.text?.body,
                        pushName,
                    };
                    break
                }
                case 'interactive': {
                    responseObj = {
                        type: 'interactive',
                        from: message.from,
                        to,
                        body: message.interactive?.button_reply?.title || message.interactive?.list_reply?.id,
                        title_button_reply: message.interactive?.button_reply?.title,
                        title_list_reply: message.interactive?.list_reply?.title,
                        pushName,
                    };
                    break
                }
                case 'button': {
                    responseObj = {
                        type: 'button',
                        from: message.from,
                        to,
                        body: message.button?.text,
                        payload: message.button?.payload,
                        title_button_reply: message.button?.payload,
                        pushName,
                    };
                    break
                }
                case 'image': {
                    const imageUrl = await getMediaUrl(this.version, message.image?.id, this.numberId, this.jwtToken);
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        url: imageUrl,
                        to,
                        body: generateRefprovider('_event_media_'),
                        pushName,
                    };
                    break
                }
                case 'document': {
                    const documentUrl = await getMediaUrl(
                        this.version,
                        message.document?.id,
                        this.numberId,
                        this.jwtToken
                    );
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        url: documentUrl,
                        to,
                        body: generateRefprovider('_event_document_'),
                        pushName,
                    };
                    break
                }
                case 'video': {
                    const videoUrl = await getMediaUrl(this.version, message.video?.id, this.numberId, this.jwtToken);
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        url: videoUrl,
                        to,
                        body: generateRefprovider('_event_media_'),
                        pushName,
                    };
                    break
                }
                case 'location': {
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        to,
                        latitude: message.location.latitude,
                        longitude: message.location.longitude,
                        body: generateRefprovider('_event_location_'),
                        pushName,
                    };
                    break
                }
                case 'audio': {
                    const audioUrl = await getMediaUrl(this.version, message.audio?.id, this.numberId, this.jwtToken);
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        url: audioUrl,
                        to,
                        body: generateRefprovider('_event_voice_note_'),
                        pushName,
                    };
                    break
                }
                case 'sticker': {
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        to,
                        id: message.sticker.id,
                        body: generateRefprovider('_event_media_'),
                        pushName,
                    };
                    break
                }
                case 'contacts': {
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        contacts: [
                            {
                                name: message.contacts[0].name,
                                phones: message.contacts[0].phones,
                            },
                        ],
                        to,
                        body: generateRefprovider('_event_contacts_'),
                        pushName,
                    };
                    break
                }
                case 'order': {
                    responseObj = {
                        type: message.type,
                        from: message.from,
                        to,
                        order: {
                            catalog_id: message.order.catalog_id,
                            product_items: message.order.product_items,
                        },
                        body: generateRefprovider('_event_order_'),
                        pushName,
                    };
                    break
                }
            }

            if (responseObj) {
                this.messageQueue.enqueue(() => this.processMessage(responseObj));
            }
        });

        res.statusCode = 200;
        res.end('Messages enqueued');
    }

    processMessage = (message) => {
        this.emit('message', message);
    }

    /**
     * Valida el token
     * @param {string} mode
     * @param {string} token
     * @returns {boolean}
     */
    tokenIsValid(mode, token) {
        return mode === 'subscribe' && this.token === token
    }

    /**
     * Verificación del token
     * @param {*} req
     * @param {*} res
     */
    verifyToken = (req, res) => {
        const { query } = req;
        const mode = query?.['hub.mode'];
        const token = query?.['hub.verify_token'];
        const challenge = query?.['hub.challenge'];

        if (!mode || !token) {
            res.statusCode = 403;
            res.end('No token!');
            return
        }

        if (this.tokenIsValid(mode, token)) {
            console.log('Webhook verified');
            res.statusCode = 200;
            res.end(challenge);
            return
        }

        res.statusCode = 403;
        res.end('Invalid token!');
    }

    emptyCtrl = (_, res) => {
        res.end('');
    }

    /**
     * Contruir HTTP Server
     */
    buildHTTPServer() {
        return polka()
            .use(urlencoded({ extended: true }))
            .use(json())
            .get('/', this.emptyCtrl)
            .get('/webhook', this.verifyToken)
            .post('/webhook', this.incomingMsg)
    }

    /**
     * Iniciar el servidor HTTP
     */
    start() {
        this.metaServer.listen(this.metaPort, () => {
            console.log(`[meta]: Agregar esta url "Webhook"`);
            console.log(`[meta]: POST http://localhost:${this.metaPort}/webhook`);
            console.log(`[meta]: Más información en la documentación`);
        });
        this.emit('ready');
    }
};

var server = MetaWebHookServer$1;

const { ProviderClass } = require$$0$5;
const axios = require$$0$3;
const FormData = require$$2$2;
const { createReadStream } = require$$3;
const mime = require$$0;
const { generalDownload } = download;
const { convertAudio } = convertAudio_1;
const MetaWebHookServer = server;
const URL$1 = `https://graph.facebook.com`;
const Queue = require$$5;

/**
 * ⚙️MetaProvider: Es un provedor que te ofrece enviar
 * mensaje a Whatsapp via API
 * info: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 *
 *
 * Necesitas las siguientes tokens y valores
 * { jwtToken, numberId, vendorNumber, verifyToken }
 */
const PORT = process.env.PORT || 3000;

class MetaProvider extends ProviderClass {
    metHook = undefined
    jwtToken = undefined
    numberId = undefined
    version = 'v16.0'

    constructor({ jwtToken, numberId, verifyToken, version, port = PORT }) {
        super();
        this.jwtToken = jwtToken;
        this.numberId = numberId;
        this.version = version;
        this.metHook = new MetaWebHookServer(jwtToken, numberId, version, verifyToken, port);
        this.metHook.start();

        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.metHook.on(event, func);
        }

        this.queue = new Queue({
            concurrent: 1, // Cantidad de tareas que se ejecutarán en paralelo
            interval: 100, // Intervalo entre tareas
            start: true, // Iniciar la cola automáticamente
        });
    }

    /**
     * Mapeamos los eventos nativos a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'auth_failure',
            func: (payload) => this.emit('error', payload),
        },
        {
            event: 'ready',
            func: () => this.emit('ready', true),
        },
        {
            event: 'message',
            func: (payload) => {
                this.emit('message', payload);
            },
        },
    ]

    /**
     * Sends a message with metadata to the API.
     *
     * @param {Object} body - The body of the message.
     * @return {Promise} A Promise that resolves when the message is sent.
     */
    sendMessageMeta(body) {
        return this.queue.add(() => this.sendMessageToApi(body))
    }

    /**
     * Sends a message to the API.
     *
     * @param {Object} body - The body of the message.
     * @return {Object} The response data from the API.
     */
    async sendMessageToApi(body) {
        try {
            const response = await axios.post(`${URL$1}/${this.version}/${this.numberId}/messages`, body, {
                headers: {
                    Authorization: `Bearer ${this.jwtToken}`,
                },
            });
            return response.data
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    sendtext = async (number, message) => {
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'text',
            text: {
                preview_url: false,
                body: message,
            },
        };
        return this.sendMessageMeta(body)
    }

    sendImage = async (number, mediaInput = null) => {
        if (!mediaInput) throw new Error(`MEDIA_INPUT_NULL_: ${mediaInput}`)

        const formData = new FormData();
        const mimeType = mime.lookup(mediaInput);
        formData.append('file', createReadStream(mediaInput), {
            contentType: mimeType,
        });
        formData.append('messaging_product', 'whatsapp');

        const {
            data: { id: mediaId },
        } = await axios.post(`${URL$1}/${this.version}/${this.numberId}/media`, formData, {
            headers: {
                Authorization: `Bearer ${this.jwtToken}`,
                ...formData.getHeaders(),
            },
        });

        const body = {
            messaging_product: 'whatsapp',
            to: number,
            type: 'image',
            image: {
                id: mediaId,
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     *
     * @param {*} number
     * @param {*} _
     * @param {*} pathVideo
     * @returns
     */
    sendVideo = async (number, pathVideo = null) => {
        if (!pathVideo) throw new Error(`MEDIA_INPUT_NULL_: ${pathVideo}`)

        const formData = new FormData();
        const mimeType = mime.lookup(pathVideo);
        formData.append('file', createReadStream(pathVideo), {
            contentType: mimeType,
        });
        formData.append('messaging_product', 'whatsapp');

        const {
            data: { id: mediaId },
        } = await axios.post(`${URL$1}/${this.version}/${this.numberId}/media`, formData, {
            headers: {
                Authorization: `Bearer ${this.jwtToken}`,
                ...formData.getHeaders(),
            },
        });

        const body = {
            messaging_product: 'whatsapp',
            to: number,
            type: 'video',
            video: {
                id: mediaId,
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * @alpha
     * @param {string} number
     * @param {string} message
     * @example await sendMessage('+XXXXXXXXXXX', 'https://dominio.com/imagen.jpg' | 'img/imagen.jpg')
     */

    sendMedia = async (number, text = '', mediaInput) => {
        const fileDownloaded = await generalDownload(mediaInput);
        const mimeType = mime.lookup(fileDownloaded);
        mediaInput = fileDownloaded;
        if (mimeType.includes('image')) return this.sendImage(number, mediaInput)
        if (mimeType.includes('video')) return this.sendVideo(number, fileDownloaded)
        if (mimeType.includes('audio')) {
            const fileOpus = await convertAudio(mediaInput);
            return this.sendAudio(number, fileOpus, text)
        }

        return this.sendFile(number, mediaInput)
    }

    /**
     * Enviar listas
     * @param {*} number
     * @param {*} text
     * @param {*} buttons
     * @returns
     */
    sendLists = async (number, list) => {
        const parseList = { ...list, ...{ type: 'list' } };
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: parseList,
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar listas alternativo
     * @param {*} number
     * @param {*} header
     * @param {*} text
     * @param {*} footer
     * @param {*} button
     * @param {*} list
     * @returns
     */
    sendList = async (number, header, text, footer, button, list) => {
        const parseList = list.map((list) => ({
            title: list.title,
            rows: list.rows.map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description,
            })),
        }));

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: {
                    type: 'text',
                    text: header,
                },
                body: {
                    text: text,
                },
                footer: {
                    text: footer,
                },
                action: {
                    button: button,
                    sections: parseList,
                },
            },
        };
        return this.sendMessageMeta(body)
    }
    /**
     * Enviar buttons
     * @param {*} number
     * @param {*} text
     * @param {*} buttons
     * @returns
     */
    sendButtons = async (number, text, buttons) => {
        const parseButtons = buttons.map((btn, i) => ({
            type: 'reply',
            reply: {
                id: `btn-${i}`,
                title: btn.body,
            },
        }));

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: text,
                },
                action: {
                    buttons: parseButtons,
                },
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar buttons only text
     * @param {*} number
     * @param {*} text
     * @param {*} buttons
     * @returns
     */
    sendButtonsText = async (number, text, buttons) => {
        const parseButtons = buttons.map((btn) => ({
            type: 'reply',
            reply: {
                id: btn.id,
                title: btn.title,
            },
        }));
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: text,
                },
                action: {
                    buttons: parseButtons,
                },
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar buttons with image
     * @param {*} number
     * @param {*} text
     * @param {*} buttons
     * @param {*} url
     * @returns
     */
    sendButtonsMedia = async (number, text, buttons, url) => {
        const parseButtons = buttons.map((btn) => ({
            type: 'reply',
            reply: {
                id: btn.id,
                title: btn.title,
            },
        }));
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'button',
                header: {
                    type: 'image',
                    image: {
                        link: url,
                    },
                },
                body: {
                    text: text,
                },
                action: {
                    buttons: parseButtons,
                },
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar plantillas
     * @param {*} number
     * @param {*} template
     * @param {*} languageCode
     * Usarse de acuerdo a cada plantilla en particular, esto solo es un mapeo de como funciona.
     * @returns
     */

    sendTemplate = async (number, template, languageCode) => {
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'template',
            template: {
                name: template,
                language: {
                    code: languageCode, // examples: es_Mex, en_Us
                },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'image',
                                image: {
                                    link: 'https://i.imgur.com/3xUQq0U.png',
                                },
                            },
                        ],
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text', // currency, date_time, etc
                                text: 'text-string',
                            },
                            {
                                type: 'currency',
                                currency: {
                                    fallback_value: '$100.99',
                                    code: 'USD',
                                    amount_1000: 100990,
                                },
                            },
                        ],
                    },
                    {
                        type: 'button',
                        subtype: 'quick_reply',
                        index: 0,
                        parameters: [
                            {
                                type: 'payload',
                                payload: 'aGlzIHRoaXMgaXMgY29v',
                            },
                        ],
                    },
                ],
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar Contactos
     * @param {*} number
     * @param {*} contact
     * @returns
     */

    sendContacts = async (number, contact) => {
        const parseContacts = contact.map((contact) => ({
            name: {
                formatted_name: contact.name,
                first_name: contact.first_name,
                last_name: contact.last_name,
                middle_name: contact.middle_name,
                suffix: contact.suffix,
                prefix: contact.prefix,
            },
            birthday: contact.birthday,
            phones: contact.phones.map((phone) => ({
                phone: phone.phone,
                wa_id: phone.wa_id,
                type: phone.type,
            })),
            emails: contact.emails.map((email) => ({
                email: email.email,
                type: email.type,
            })),
            org: {
                company: contact.company,
                department: contact.department,
                title: contact.title,
            },
            urls: contact.urls.map((url) => ({
                url: url.url,
                type: url.type,
            })),
            addresses: contact.addresses.map((address) => ({
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country,
                country_code: address.counry_code,
                type: address.type,
            })),
        }));

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'contacts',
            contacts: parseContacts,
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar catálogo
     * @param {*} number
     * @param {*} bodyText
     * @param {*} itemCatalogId
     * @param {*} footerText
     * @returns
     */

    sendCatalog = async (number, bodyText, itemCatalogId) => {
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'catalog_message',
                body: {
                    text: bodyText,
                },
                action: {
                    name: 'catalog_message',
                    parameters: {
                        thumbnail_product_retailer_id: itemCatalogId,
                    },
                },
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     *
     * @param {*} userId
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (number, message, { options }) => {
        if (options?.buttons?.length) return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, message, options.media)

        this.sendtext(number, message);
    }

    /**
     * Enviar reacción a un mensaje
     * @param {*} number
     * @param {*} react
     */
    sendReaction = async (number, react) => {
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'reaction',
            reaction: {
                message_id: react.message_id,
                emoji: react.emoji,
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar Ubicación
     * @param {*} longitude
     * @param {*} latitude
     * @param {*} name
     * @param {*} address
     * @returns
     */
    sendLocation = async (number, localization) => {
        const body = {
            messaging_product: 'whatsapp',
            to: number,
            type: 'location',
            location: {
                longitude: localization.long_number,
                latitude: localization.lat_number,
                name: localization.name,
                address: localization.address,
            },
        };
        return this.sendMessageMeta(body)
    }
}

var meta = MetaProvider;

module.exports = meta;
