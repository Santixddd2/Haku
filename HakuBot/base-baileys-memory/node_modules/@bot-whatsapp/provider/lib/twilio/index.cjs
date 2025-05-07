/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$2 = require('twilio');
var require$$1$1 = require('@bot-whatsapp/bot');
var require$$0$1 = require('node:events');
var require$$1 = require('node:fs');
var require$$2 = require('mime-types');
var require$$3 = require('polka');
var require$$4 = require('body-parser');
var require$$0 = require('crypto');

const parseNumber$2 = (number) => {
    return `${number}`.replace('whatsapp:', '').replace('+', '')
};

var utils = { parseNumber: parseNumber$2 };

const crypto = require$$0;

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
const encryptData$1 = (data) => {
    const cipher = crypto.createCipheriv(METHOD, key, encryptionIV);
    return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64')
};

/**
 * Desencriptar data
 * @param {*} encryptedData
 * @returns
 */
const decryptData$1 = (encryptedData) => {
    try {
        const buff = Buffer.from(encryptedData, 'base64');
        const decipher = crypto.createDecipheriv(METHOD, key, encryptionIV);
        return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8')
    } catch (e) {
        return 'FAIL'
    }
};

var hash = { generateRefprovider: generateRefprovider$1, encryptData: encryptData$1, decryptData: decryptData$1 };

const { EventEmitter } = require$$0$1;
const { existsSync, createReadStream } = require$$1;
const mime = require$$2;
const polka = require$$3;
const { urlencoded, json } = require$$4;
const { parseNumber: parseNumber$1 } = utils;
const { decryptData } = hash;
const { generateRefprovider } = hash;

/**
 * Encargado de levantar un servidor HTTP con una hook url
 * [POST] /twilio-hook
 */
let TwilioWebHookServer$1 = class TwilioWebHookServer extends EventEmitter {
    twilioServer
    twilioPort
    constructor(_twilioPort) {
        super();
        this.twilioServer = this.buildHTTPServer();
        this.twilioPort = _twilioPort;
    }

    /**
     * Mensaje entrante
     * emit: 'message'
     * @param {*} req
     * @param {*} res
     */
    incomingMsg = (req, res) => {
        const { body } = req;
        const payload = {
            ...body,
            from: parseNumber$1(body.From),
            to: parseNumber$1(body.To),
            body: body.Body,
        };
        if (body.NumMedia !== '0' && body.MediaContentType0) {
            const type = body.MediaContentType0.split('/')[0];
            switch (type) {
                case 'audio': {
                    payload.body = generateRefprovider('_event_voice_note_');
                    break
                }
                case 'image':
                case 'video': {
                    payload.body = generateRefprovider('_event_media_');
                    break
                }
                case 'application': {
                    payload.body = generateRefprovider('_event_document_');
                    break
                }
                case 'text': {
                    payload.body = generateRefprovider('_event_contacts_');
                    break
                }
            }
        } else {
            if (body.Latitude && body.Longitude) {
                payload.body = generateRefprovider('_event_location_');
            }
        }
        this.emit('message', payload);
        const json = JSON.stringify({ body });
        res.end(json);
    }

    /**
     * Manejar los local media como
     * C\\Projects\\bot-restaurante\\tmp\\menu.png
     * para que puedas ser llevar a una url online
     * @param {*} req
     * @param {*} res
     */
    handlerLocalMedia = (req, res) => {
        const { query } = req;
        const file = query?.path;
        if (!file) return res.end(`path: invalid`)
        const descryptPath = decryptData(file);
        const decodeFile = decodeURIComponent(descryptPath);
        if (!existsSync(decodeFile)) return res.end(`not exits: ${decodeFile}`)
        const fileStream = createReadStream(decodeFile);
        const mimeType = mime.lookup(decodeFile);
        res.writeHead(200, { 'Content-Type': mimeType });
        fileStream.pipe(res);
    }

    /**
     * Contruir HTTP Server
     * @returns
     */
    buildHTTPServer = () => {
        return polka()
            .use(urlencoded({ extended: true }))
            .use(json())
            .post('/twilio-hook', this.incomingMsg)
            .get('/tmp', this.handlerLocalMedia)
    }

    /**
     * Puerto del HTTP
     * @param {*} port default 3000
     */
    start = () => {
        this.twilioServer.listen(this.twilioPort, () => {
            console.log(``);
            console.log(`[Twilio]: Agregar esta url "WHEN A MESSAGE COMES IN"`);
            console.log(`[Twilio]: POST http://localhost:${this.twilioPort}/twilio-hook`);
            console.log(`[Twilio]: Más información en la documentacion`);
            console.log(``);
        });
        this.emit('ready');
    }
};

var server = TwilioWebHookServer$1;

const twilio = require$$0$2;
const { ProviderClass } = require$$1$1;

const TwilioWebHookServer = server;
const { parseNumber } = utils;
const { encryptData } = hash;

/**
 * ⚙️TwilioProvider: Es un provedor que te ofrece enviar
 * mensaje a Whatsapp via API
 * info: https://www.twilio.com/es-mx/messaging/whatsapp
 * video: https://youtu.be/KoOmsHylxUw
 *
 * Necesitas las siguientes tokens y valores
 * { accountSid, authToken, vendorNumber }
 */

const PORT = process.env.PORT || 3000;

class TwilioProvider extends ProviderClass {
    twilioServer
    vendor
    vendorNumber
    publicUrl
    constructor({ accountSid, authToken, vendorNumber, port = PORT, publicUrl = '' }) {
        super();
        this.publicUrl = publicUrl;
        this.vendor = new twilio(accountSid, authToken);
        this.twilioServer = new TwilioWebHookServer(port);
        this.vendorNumber = parseNumber(vendorNumber);

        this.twilioServer.start();
        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.twilioServer.on(event, func);
        }
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
     * Enviar un archivo multimedia
     * https://www.twilio.com/es-mx/docs/whatsapp/tutorial/send-and-receive-media-messages-whatsapp-nodejs
     * @private
     * @param {*} number
     * @param {*} mediaInput
     * @returns
     */
    sendMedia = async (number, message, mediaInput = null) => {
        if (!mediaInput) throw new Error(`MEDIA_INPUT_NULL_: ${mediaInput}`)
        const ecrypPath = encryptData(encodeURIComponent(mediaInput));
        const urlEncode = `${this.publicUrl}/tmp?path=${ecrypPath}`;
        const regexUrl = /^(?!https?:\/\/)[^\s]+$/;

        const urlNotice = [
            `[NOTA]: Estas intentando enviar una fichero que esta en local.`,
            `[NOTA]: Para que esto funcione con Twilio necesitas que el fichero este en una URL publica`,
            `[NOTA]: más informacion aqui https://bot-whatsapp.netlify.app/docs/provider-twilio/`,
            `[NOTA]: Esta es la url que se enviara a twilio (debe ser publica) ${urlEncode}`,
        ].join('\n');

        if (
            mediaInput.includes('localhost') ||
            mediaInput.includes('127.0.0.1') ||
            mediaInput.includes('0.0.0.0') ||
            regexUrl.test(mediaInput)
        ) {
            console.log(urlNotice);
            mediaInput = urlEncode;
        }

        number = parseNumber(number);
        return this.vendor.messages.create({
            mediaUrl: [`${mediaInput}`],
            body: message,
            from: `whatsapp:+${this.vendorNumber}`,
            to: `whatsapp:+${number}`,
        })
    }

    /**
     * Enviar botones
     * https://www.twilio.com/es-mx/docs/whatsapp/buttons
     * @private
     * @param {*} number
     * @param {*} message
     * @param {*} buttons []
     * @returns
     */
    sendButtons = async () => {
        this.emit(
            'notice',
            [
                `[NOTA]: Actualmente enviar botons con Twilio esta en desarrollo`,
                `[NOTA]: https://www.twilio.com/es-mx/docs/whatsapp/buttons`,
            ].join('\n')
        );
    }

    /**
     *
     * @param {*} number
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (number, message, { options } = { options: {} }) => {
        number = parseNumber(number);
        if (options?.buttons?.length) this.sendButtons(number, message, options.buttons);
        if (options?.media) return this.sendMedia(number, message, options.media)
        return this.vendor.messages.create({
            body: message,
            from: `whatsapp:+${this.vendorNumber}`,
            to: `whatsapp:+${number}`,
        })
    }
}

var twilio_1 = TwilioProvider;

module.exports = twilio_1;
