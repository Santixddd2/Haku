/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$2 = require('node:events');
var require$$0 = require('crypto');
var require$$0$1 = require('kleur');
var require$$4 = require('console');
var require$$5 = require('fs');

const flatObject$2 = (listArray = []) => {
    const cbNestedList = Array.isArray(listArray) ? listArray : [];

    if (!cbNestedList.length) return {}

    const cbNestedObj = cbNestedList.map(({ ctx }) => ctx?.callbacks).filter(Boolean);

    const flatObj = cbNestedObj.reduce((acc, current) => {
        const keys = Object.keys(current);
        const values = Object.values(current);

        keys.forEach((key, i) => {
            // acc[key] = values[i](a,b,c)
            acc[key] = values[i];
        });

        return acc
    }, {});

    return flatObj
};

var flattener = { flatObject: flatObject$2 };

const crypto = require$$0;

/**
 * Generamos un UUID unico con posibilidad de tener un prefijo
 * @param {*} prefix
 * @returns
 */
const generateRef$b = (prefix = false) => {
    const id = crypto.randomUUID();
    return prefix ? `${prefix}_${id}` : id
};

/**
 * Generar randon sin prefijos hex
 * @returns
 */
const generateTime = () => {
    return Date.now()
};

/**
 * Genera un HASH MD5
 * @param {*} param0
 * @returns
 */
const generateRefSerialize$2 = ({ index, answer, keyword }) =>
    crypto.createHash('md5').update(JSON.stringify({ index, answer, keyword })).digest('hex');

var hash = { generateRef: generateRef$b, generateRefSerialize: generateRefSerialize$2, generateTime };

const { generateRefSerialize: generateRefSerialize$1 } = hash;

/**
 * Crear referencia serializada
 * @param {*} flowJson
 * @returns array[]
 */
const toSerialize$4 = (flowJson) => {
    if (!Array.isArray(flowJson)) throw new Error('Esto debe ser un ARRAY')

    const jsonToSerialize = flowJson.map((row, index) => ({
        ...row,
        refSerialize: `${generateRefSerialize$1({
            index,
            keyword: row.keyword,
            answer: row.answer,
        })}`,
    }));

    return jsonToSerialize
};

var toSerialize_1 = { toSerialize: toSerialize$4 };

const { toSerialize: toSerialize$3 } = toSerialize_1;
/**
 * @deprecate
 * @param answer string
 * @param options {media:string, buttons:[], capture:true default false}
 * @returns
 */
const addChild$3 = (flowIn = null) => {
    if (!flowIn?.toJson) {
        throw new Error('DEBE SER UN FLOW CON toJSON()')
    }
    return toSerialize$3(flowIn.toJson())
};

var addChild_1 = { addChild: addChild$3 };

const toJson$3 = (inCtx) => () => {
    const lastCtx = inCtx.hasOwnProperty('ctx') ? inCtx.ctx : inCtx;
    return lastCtx.json
};

var toJson_1 = { toJson: toJson$3 };

const { flatObject: flatObject$1 } = flattener;
const { generateRef: generateRef$a } = hash;
const { addChild: addChild$2 } = addChild_1;
const { toJson: toJson$2 } = toJson_1;
/**
 *
 * @param answer string
 * @param options {media:string, buttons:[{"body":"😎 Cursos"}], delay:ms, capture:true default false}
 * @returns
 */
const addAnswer$3 =
    (inCtx) =>
    (answer, options, cb = null, nested = []) => {
        answer = Array.isArray(answer) ? answer.join('\n') : answer;
        /**
         * Todas las opciones referentes a el mensaje en concreto options:{}
         * @returns
         */
        const getAnswerOptions = () => ({
            media: typeof options?.media === 'string' ? `${options?.media}` : null,
            buttons: Array.isArray(options?.buttons) ? options.buttons : [],
            capture: typeof options?.capture === 'boolean' ? options?.capture : false,
            child: typeof options?.child === 'string' ? `${options?.child}` : null,
            delay: typeof options?.delay === 'number' ? options?.delay : 0,
            idle: typeof options?.idle === 'number' ? options?.idle : null,
            ref: typeof options?.ref === 'string' ? options?.ref : null,
        });

        const getNested = () => {
            let flatNested = [];
            if (Array.isArray(nested)) {
                for (const iterator of nested) {
                    flatNested = [...flatNested, ...addChild$2(iterator)];
                }

                return {
                    nested: flatNested,
                }
            }
            return {
                nested: addChild$2(nested),
            }
        };

        /**
         * Esta funcion aplana y busca los callback anidados de los hijos
         * @returns
         */
        const getCbFromNested = () => flatObject$1(Array.isArray(nested) ? nested : [nested]);

        const callback = typeof cb === 'function' ? cb : () => null;

        const lastCtx = inCtx.hasOwnProperty('ctx') ? inCtx.ctx : inCtx;

        /**
         * Esta funcion se encarga de mapear y transformar todo antes
         * de retornar
         * @returns
         */
        const ctxAnswer = () => {
            const options = {
                ...getAnswerOptions(),
                ...getNested(),
                keyword: {},
                callback: !!cb,
            };
            const ref = options?.ref ?? `ans_${generateRef$a()}`;

            const json = [].concat(inCtx.json).concat([
                {
                    ref,
                    keyword: lastCtx.ref,
                    answer,
                    options,
                },
            ]);

            const callbacks = {
                ...inCtx.callbacks,
                ...getCbFromNested(),
                [ref]: callback,
            };

            return {
                ...lastCtx,
                ref,
                answer,
                json,
                options,
                callbacks,
            }
        };

        /// Retornar contexto no colocar nada más abajo de esto
        const ctx = ctxAnswer();

        return {
            ctx,
            ref: ctx.ref,
            addAnswer: addAnswer$3(ctx),
            addAction: (cb = () => null, flagCb = () => null) => {
                if (typeof cb === 'object') return addAnswer$3(ctx)('__capture_only_intended__', cb, flagCb)
                return addAnswer$3(ctx)('__call_action__', null, cb)
            },
            toJson: toJson$2(ctx),
        }
    };

var addAnswer_1 = { addAnswer: addAnswer$3 };

const { generateRef: generateRef$9 } = hash;
const { addAnswer: addAnswer$2 } = addAnswer_1;
const { toJson: toJson$1 } = toJson_1;

/**
 *
 * @param {*} message `string | string[]`
 * @param {*} options {sensitive:boolean} default false
 */
const addKeyword$2 = (keyword, options) => {
    if (typeof keyword !== 'string' && !Array.isArray(keyword)) {
        throw new Error('DEBE_SER_STRING_ARRAY_REGEX')
    }

    const parseOptions = () => {
        const defaultProperties = {
            sensitive: typeof options?.sensitive === 'boolean' ? options?.sensitive : false,
            regex: typeof options?.regex === 'boolean' ? options?.regex : false,
        };

        return defaultProperties
    };

    const ctxAddKeyword = () => {
        const ref = `key_${generateRef$9()}`;
        const options = parseOptions();
        const json = [
            {
                ref,
                keyword,
                options,
            },
        ];
        /**
         * Se guarda en db
         */

        return { ref, keyword, options, json }
    };

    const ctx = ctxAddKeyword();

    return {
        ctx,
        ref: ctx.ref,
        addAnswer: addAnswer$2(ctx),
        addAction: (cb = () => null, flagCb = () => null) => {
            if (typeof cb === 'object') return addAnswer$2(ctx)('__capture_only_intended__', cb, flagCb)
            return addAnswer$2(ctx)('__call_action__', null, cb)
        },
        toJson: toJson$1(ctx),
    }
};

var addKeyword_1 = { addKeyword: addKeyword$2 };

const { generateRef: generateRef$8, generateRefSerialize } = hash;
/**
 * @deprecate
 * @param answer string
 * @param options {media:string, buttons:[], capture:true default false}
 * @returns
 */
const toCtx$2 = ({ body, from, prevRef, keyword, options = {}, index }) => {
    return {
        ref: generateRef$8(),
        keyword: prevRef ?? keyword,
        answer: body,
        options: options ?? {},
        from,
        refSerialize: generateRefSerialize({ index, answer: body }),
    }
};

var toCtx_1 = { toCtx: toCtx$2 };

const { addAnswer: addAnswer$1 } = addAnswer_1;
const { addKeyword: addKeyword$1 } = addKeyword_1;
const { addChild: addChild$1 } = addChild_1;
const { toSerialize: toSerialize$2 } = toSerialize_1;
const { toCtx: toCtx$1 } = toCtx_1;
const { toJson } = toJson_1;

var methods = { addAnswer: addAnswer$1, addKeyword: addKeyword$1, addChild: addChild$1, toCtx: toCtx$1, toJson, toSerialize: toSerialize$2 };

const { yellow, bgRed } = require$$0$1;
const NODE_ENV$1 = process.env.NODE_ENV || 'dev';
const printer$1 = (message, title) => {
    if (NODE_ENV$1 !== 'test') {
        if (title) console.log(bgRed(`${title}`));
        console.log(yellow(Array.isArray(message) ? message.join('\n') : message));
        console.log(``);
    }
};

var interactive = { printer: printer$1 };

const delay$2 = (miliseconds) => new Promise((res) => setTimeout(res, miliseconds));

var delay_1 = { delay: delay$2 };

let Queue$1 = class Queue {
    constructor(logger, concurrencyLimit = 15, timeout = 50000) {
        this.queue = new Map();
        this.queueTime = new Map();
        this.timers = new Map();
        this.idsCallbacks = new Map();
        this.workingOnPromise = new Map();
        this.logger = logger;
        this.timeout = timeout;
        this.concurrencyLimit = concurrencyLimit;
    }

    /**
     * Encola el proceso
     * @param {*} from
     * @param {*} promiseFunc
     * @returns
     */
    async enqueue(from, promiseInFunc, fingerIdRef) {
        this.logger.log(`${from}:ENCOLADO ${fingerIdRef}`);

        if (!this.timers.has(fingerIdRef)) {
            this.timers.set(fingerIdRef, false);
        }

        if (!this.queue.has(from)) {
            this.queue.set(from, []);
            this.workingOnPromise.set(from, false);
        }

        const queueByFrom = this.queue.get(from);
        const workingByFrom = this.workingOnPromise.get(from);

        const promiseFunc = (item) => {
            const timer = ({ resolve }) =>
                setTimeout(() => {
                    console.log('no debe aparecer si la otra funcion del race se ejecuta primero 🙉🙉🙉🙉', fingerIdRef);
                    resolve('timeout');
                }, this.timeout);

            const timerPromise = new Promise((resolve, reject) => {
                if (item.cancelled) {
                    reject('cancelled');
                }
                if (!this.timers.has(fingerIdRef)) {
                    const refIdTimeOut = timer({ reject, resolve });
                    clearTimeout(this.timers.get(fingerIdRef));
                    this.timers.set(fingerIdRef, refIdTimeOut);
                    this.clearQueue(from);
                    return refIdTimeOut
                }

                return this.timers.get(fingerIdRef)
            });

            const cancel = () => {
                clearTimeout(this.timers.get(fingerIdRef));
                this.timers.delete(fingerIdRef);
            };
            return { promiseInFunc, timer, timerPromise, cancel }
        };

        return new Promise((resolve, reject) => {
            const pid = queueByFrom.findIndex((i) => i.fingerIdRef === fingerIdRef);
            if (pid !== -1) {
                console.log(`🔥🔥🔥🔥`);
                this.clearQueue(from);
            }

            queueByFrom.push({
                promiseFunc,
                fingerIdRef,
                cancelled: false,
                resolve,
                reject,
            });

            if (!workingByFrom) {
                this.logger.log(`EJECUTANDO:${fingerIdRef}`);
                this.processQueue(from);
                this.workingOnPromise.set(from, true);
            }
        })
    }

    /**
     * Ejecuta el proceso encolado
     * @param {*} from
     */
    async processQueue(from) {
        const queueByFrom = this.queue.get(from);

        while (queueByFrom.length > 0) {
            const tasksToProcess = queueByFrom.splice(0, this.concurrencyLimit);

            const promises = tasksToProcess.map(async (item) => {
                try {
                    const refToPromise = item.promiseFunc(item);
                    const value = await Promise.race([
                        refToPromise.timerPromise,
                        refToPromise.promiseInFunc().then(() => {
                            return refToPromise.cancel()
                        }),
                    ]);

                    this.clearIdFromCallback(from, item.fingerIdRef);
                    this.logger.log(`${from}:SUCCESS`);
                    return item.resolve(value)
                } catch (err) {
                    this.clearIdFromCallback(from, item.fingerIdRef);

                    this.logger.error(`${from}:ERROR: ${JSON.stringify(err)}`);
                    return item.reject(err)
                }
            });

            await Promise.allSettled(promises);
        }

        this.workingOnPromise.set(from, false);
        await this.clearQueue(from);
    }

    /**
     * Limpia la cola de procesos
     * @param {*} from
     */
    async clearQueue(from) {
        if (this.queue.has(from)) {
            const queueByFrom = this.queue.get(from);
            const workingByFrom = this.workingOnPromise.get(from);

            try {
                for (const item of queueByFrom) {
                    item.cancelled = true;
                    item.resolve('Queue cleared');
                }
            } finally {
                this.queue.set(from, []);
            }

            // Si hay un proceso en ejecución, también deberías cancelarlo
            if (workingByFrom) {
                this.workingOnPromise.set(from, false);
            }
        }
    }

    /**
     * Establecer una marca de tiempo de ejecuccion de promeses
     * esto evita resolver promesas que yo no necesita
     * @param {*} from
     * @param {*} fingerTime
     */
    setFingerTime = (from, fingerTime) => {
        this.queueTime.set(from, fingerTime);
    }

    setIdsCallbacks = (from, ids = []) => {
        this.idsCallbacks.set(from, ids);
    }

    getIdsCallback = (from) => {
        if (this.idsCallbacks.has(from)) {
            return this.idsCallbacks.get(from)
        } else {
            return []
        }
    }

    clearIdFromCallback = (from, id) => {
        if (this.idsCallbacks.has(from)) {
            const ids = this.idsCallbacks.get(from);
            const index = ids.indexOf(id);

            if (index !== -1) {
                ids.splice(index, 1);
            }
        }
    }
};

var queue = Queue$1;

const { generateRef: generateRef$7 } = hash;

const eventDocument$1 = () => {
    return generateRef$7('_event_document_')
};

const REGEX_EVENT_DOCUMENT$1 = /^_event_document__[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/;

var eventDocument_1 = { eventDocument: eventDocument$1, REGEX_EVENT_DOCUMENT: REGEX_EVENT_DOCUMENT$1 };

const { generateRef: generateRef$6 } = hash;

const eventLocation$1 = () => {
    return generateRef$6('_event_location_')
};

const REGEX_EVENT_LOCATION$1 = /^_event_location__[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/;

var eventLocation_1 = { eventLocation: eventLocation$1, REGEX_EVENT_LOCATION: REGEX_EVENT_LOCATION$1 };

const { generateRef: generateRef$5 } = hash;

const eventMedia$1 = () => {
    return generateRef$5('_event_media_')
};

const REGEX_EVENT_MEDIA$1 = /^_event_media__[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/;

var eventMedia_1 = { eventMedia: eventMedia$1, REGEX_EVENT_MEDIA: REGEX_EVENT_MEDIA$1 };

const { generateRef: generateRef$4 } = hash;

const eventVoiceNote$1 = () => {
    return generateRef$4('_event_voice_note_')
};

const REGEX_EVENT_VOICE_NOTE$1 = /^_event_voice_note__[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/;

var eventVoiceNote_1 = { eventVoiceNote: eventVoiceNote$1, REGEX_EVENT_VOICE_NOTE: REGEX_EVENT_VOICE_NOTE$1 };

const { generateRef: generateRef$3 } = hash;

const eventOrder$1 = () => {
    return generateRef$3('_event_order_')
};

const REGEX_EVENT_ORDER$1 = /^_event_order__[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/;

var eventOrder_1 = { eventOrder: eventOrder$1, REGEX_EVENT_ORDER: REGEX_EVENT_ORDER$1 };

const { generateRef: generateRef$2 } = hash;

const eventTemplate$1 = () => {
    return generateRef$2('_event_template_')
};

const REGEX_EVENT_TEMPLATE$1 = /^_event_template__[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/;

var eventTemplate_1 = { eventTemplate: eventTemplate$1, REGEX_EVENT_TEMPLATE: REGEX_EVENT_TEMPLATE$1 };

const { generateRef: generateRef$1 } = hash;

const eventWelcome$1 = () => {
    return generateRef$1('_event_welcome_')
};

var eventWelcome_1 = { eventWelcome: eventWelcome$1 };

const { generateRef } = hash;

const eventAction$1 = () => {
    return generateRef('_event_action_')
};

var eventAction_1 = { eventAction: eventAction$1 };

const { eventDocument, REGEX_EVENT_DOCUMENT } = eventDocument_1;
const { eventLocation, REGEX_EVENT_LOCATION } = eventLocation_1;
const { eventMedia, REGEX_EVENT_MEDIA } = eventMedia_1;
const { eventVoiceNote, REGEX_EVENT_VOICE_NOTE } = eventVoiceNote_1;
const { eventOrder, REGEX_EVENT_ORDER } = eventOrder_1;
const { eventTemplate, REGEX_EVENT_TEMPLATE } = eventTemplate_1;
const { eventWelcome } = eventWelcome_1;
const { eventAction } = eventAction_1;

const LIST_ALL = {
    WELCOME: eventWelcome(),
    MEDIA: eventMedia(),
    LOCATION: eventLocation(),
    DOCUMENT: eventDocument(),
    VOICE_NOTE: eventVoiceNote(),
    ACTION: eventAction(),
    ORDER: eventOrder(),
    TEMPLATE: eventTemplate(),
};

const LIST_REGEX$1 = {
    REGEX_EVENT_DOCUMENT,
    REGEX_EVENT_LOCATION,
    REGEX_EVENT_MEDIA,
    REGEX_EVENT_VOICE_NOTE,
    REGEX_EVENT_ORDER,
    REGEX_EVENT_TEMPLATE,
};

var events = { LIST_ALL, LIST_REGEX: LIST_REGEX$1 };

let SingleState$1 = class SingleState {
    STATE = new Map()
    constructor() {}

    /**
     *
     * @param {*} ctx
     * @returns
     */
    updateState = (ctx = {}) => {
        return (keyValue) => {
            return new Promise((resolve) => {
                const currentStateByFrom = this.STATE.get(ctx.from);
                const updatedState = { ...currentStateByFrom, ...keyValue };
                this.STATE.set(ctx.from, updatedState);
                resolve();
            })
        }
    }

    /**
     *
     * @returns
     */
    getMyState = (from) => {
        return () => this.STATE.get(from)
    }

    /**
     *
     * @param {*} prop
     * @returns
     */
    get = (from) => {
        return (prop) => this.STATE.get(from)[prop]
    }

    /**
     *
     * @returns
     */
    getAllState = () => this.STATE.values()

    /**
     *
     * @param {*} from
     * @returns
     */
    clear = (from) => {
        return () => this.STATE.delete(from)
    }
};

var state_class = SingleState$1;

let GlobalState$1 = class GlobalState {
    STATE = new Map()
    RAW = {}
    constructor() {}

    /**
     *
     * @param {*} ctx
     * @returns
     */
    updateState = () => {
        const currentStateByFrom = this.STATE.get('__global__');
        return (keyValue) => this.STATE.set('__global__', { ...currentStateByFrom, ...keyValue })
    }

    /**
     *
     * @returns
     */
    getMyState = () => {
        return () => this.STATE.get('__global__')
    }

    get = () => {
        return (prop) => this.STATE.get('__global__')[prop]
    }
    /**
     *
     * @returns
     */
    getAllState = () => this.STATE.values()

    /**
     *
     * @param {*} from
     * @returns
     */
    clear = () => {
        return () => this.STATE.delete('__global__')
    }
};

var globalState_class = GlobalState$1;

let IdleState$1 = class IdleState {
    indexCb = new Map()

    /**
     *
     * @param param0
     */
    setIdleTime = ({ from, inRef, timeInSeconds, cb }) => {
        cb = cb ?? (() => {});
        const startTime = new Date().getTime();
        const endTime = startTime + timeInSeconds * 1000;

        if (!this.indexCb.has(from)) this.indexCb.set(from, []);
        const queueCb = this.indexCb.get(from);

        const interval = setInterval(() => {
            const internalTime = new Date().getTime();
            if (internalTime > endTime) {
                cb({ next: true, inRef });
                const map = this.indexCb.get(from) ?? [];
                const index = map.findIndex((o) => o.inRef === inRef);
                clearInterval(interval);
                map.splice(index, 1);
            }
        }, 1000);

        queueCb.push({
            from,
            inRef,
            cb,
            stop: (ctxInComming) => {
                clearInterval(interval);
                cb({ ...ctxInComming, next: false, inRef });
            },
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    get = ({ from, inRef }) => {
        try {
            const queueCb = this.indexCb.get(from) ?? [];
            const isHas = queueCb.findIndex((i) => i.inRef !== inRef) !== -1;
            return isHas
        } catch (err) {
            console.error(`Error Get ctxInComming: `, err);
            return null
        }
    }

    /**
     *
     * @param ctxInComming
     */
    stop = (ctxInComming) => {
        try {
            const queueCb = this.indexCb.get(ctxInComming.from) ?? [];
            for (const iterator of queueCb) {
                iterator.stop(ctxInComming);
            }
            this.indexCb.set(ctxInComming.from, []);
        } catch (err) {
            console.error(err);
        }
    }
};

var idleState_class = IdleState$1;

class BlackListClass {
    #blacklist = new Set()

    /**
     * Constructor para inicializar la lista negra.
     * @param {Array<string>} initialNumbers - Lista inicial de números a bloquear.
     */
    constructor(initialNumbers = []) {
        this.add(initialNumbers);
    }

    /**
     * Excepción lanzada cuando un número ya existe en la lista negra.
     */
    static PhoneNumberAlreadyExistsError = class extends Error {
        constructor(phoneNumber) {
            super(`El número de teléfono ${phoneNumber} ya está en la lista negra.`);
            this.name = 'PhoneNumberAlreadyExistsError';
        }
    }

    /**
     * Excepción lanzada cuando un número no se encuentra en la lista negra.
     */
    static PhoneNumberNotFoundError = class extends Error {
        constructor(phoneNumber) {
            super(`El número de teléfono ${phoneNumber} no está en la lista negra.`);
            this.name = 'PhoneNumberNotFoundError';
        }
    }

    /**
     * Añade uno o varios números de teléfono a la lista negra.
     * @param {string | Array<string>} phoneNumbers - Número o números a añadir.
     * @returns {Array<string>} - Devuelve una lista de mensajes indicando el resultado de añadir cada número.
     */
    add(...phoneNumbers) {
        const responseMessages = [];

        phoneNumbers.flat().forEach((number) => {
            if (this.#blacklist.has(number)) {
                responseMessages.push(`El número de teléfono ${number} ya está en la lista negra.`);
            } else {
                this.#blacklist.add(number);
                responseMessages.push(`Número ${number} añadido exitosamente.`);
            }
        });

        return responseMessages
    }

    /**
     * Elimina un número de teléfono de la lista negra.
     * @param {string} phoneNumber - El número a eliminar.
     */
    remove(phoneNumber) {
        if (!this.#blacklist.has(phoneNumber)) {
            throw new BlackListClass.PhoneNumberNotFoundError(phoneNumber)
        }
        this.#blacklist.delete(phoneNumber);
    }

    /**
     * Verifica si un número de teléfono está en la lista negra.
     * @param {string} phoneNumber - El número a verificar.
     * @returns {boolean} - Verdadero si está en la lista, falso en caso contrario.
     */
    checkIf(phoneNumber) {
        return this.#blacklist.has(phoneNumber)
    }

    /**
     * Proporciona una copia de la lista negra actual.
     * @returns {Array<string>} - Los números de teléfono en la lista negra.
     */
    getList() {
        return [...this.#blacklist]
    }
}
var blacklist_class = BlackListClass;

const { EventEmitter: EventEmitter$1 } = require$$0$2;
const { toCtx } = methods;
const { printer } = interactive;
const { delay: delay$1 } = delay_1;
const { Console } = require$$4;
const { createWriteStream } = require$$5;
const Queue = queue;

const { LIST_REGEX } = events;
const SingleState = state_class;
const GlobalState = globalState_class;
const IdleState = idleState_class;

const logger = new Console({
    stdout: createWriteStream(`${process.cwd()}/core.class.log`),
});
const loggerQueue = new Console({
    stdout: createWriteStream(`${process.cwd()}/queue.class.log`),
});

const idleForCallback = new IdleState();
const DynamicBlacklist = blacklist_class;

/**
 * [ ] Escuchar eventos del provider asegurarte que los provider emitan eventos
 * [ ] Guardar historial en db
 * [ ] Buscar mensaje en flow
 *
 */
let CoreClass$1 = class CoreClass extends EventEmitter$1 {
    flowClass
    databaseClass
    providerClass
    queuePrincipal
    stateHandler = new SingleState()
    globalStateHandler = new GlobalState()
    dynamicBlacklist = new DynamicBlacklist()
    generalArgs = {
        blackList: [],
        listEvents: {},
        delay: 0,
        globalState: {},
        extensions: undefined,
        queue: {
            timeout: 20000,
            concurrencyLimit: 15,
        },
    }
    constructor(_flow, _database, _provider, _args) {
        super();
        this.flowClass = _flow;
        this.databaseClass = _database;
        this.providerClass = _provider;
        this.generalArgs = { ...this.generalArgs, ..._args };
        this.dynamicBlacklist.add(this.generalArgs.blackList);

        this.queuePrincipal = new Queue(
            loggerQueue,
            this.generalArgs.queue.concurrencyLimit,
            this.generalArgs.queue.timeout
        );

        this.globalStateHandler.updateState()(this.generalArgs.globalState);

        if (this.generalArgs.extensions) this.globalStateHandler.RAW = this.generalArgs.extensions;

        for (const { event, func } of this.listenerBusEvents()) {
            this.providerClass.on(event, func);
        }
    }

    /**
     * Manejador de eventos
     */
    listenerBusEvents = () => [
        {
            event: 'preinit',
            func: () => printer('Iniciando proveedor, espere...'),
        },
        {
            event: 'require_action',
            func: ({ instructions, title = '⚡⚡ ACCIÓN REQUERIDA ⚡⚡' }) => printer(instructions, title),
        },
        {
            event: 'ready',
            func: () => printer('Proveedor conectado y listo'),
        },
        {
            event: 'auth_failure',
            func: ({ instructions }) => printer(instructions, '⚡⚡ ERROR AUTH ⚡⚡'),
        },
        {
            event: 'message',
            func: (msg) => this.handleMsg(msg),
        },
        {
            event: 'notice',
            func: (note) => printer(note),
        },
    ]

    /**
     * GLOSSARY.md
     * @param {*} messageCtxInComming
     * @returns
     */
    handleMsg = async (messageCtxInComming) => {
        logger.log(`[handleMsg]: `, messageCtxInComming);
        idleForCallback.stop(messageCtxInComming);
        const { body, from } = messageCtxInComming;
        let msgToSend = [];
        let endFlowFlag = false;
        let fallBackFlag = false;
        if (this.dynamicBlacklist.checkIf(from)) return
        if (!body) return

        let prevMsg = await this.databaseClass.getPrevByNumber(from);
        const refToContinue = this.flowClass.findBySerialize(prevMsg?.refSerialize);

        if (prevMsg?.ref) {
            delete prevMsg._id;
            const ctxByNumber = toCtx({
                body,
                from,
                prevRef: prevMsg.refSerialize,
            });
            await this.databaseClass.save(ctxByNumber);
        }

        // 📄 Mantener estado de conversacion por numero
        const state = {
            getMyState: this.stateHandler.getMyState(messageCtxInComming.from),
            get: this.stateHandler.get(messageCtxInComming.from),
            getAllState: this.stateHandler.getAllState,
            update: this.stateHandler.updateState(messageCtxInComming),
            clear: this.stateHandler.clear(messageCtxInComming.from),
        };

        // 📄 Mantener estado global
        const globalState = {
            getMyState: this.globalStateHandler.getMyState(),
            get: this.globalStateHandler.get(),
            getAllState: this.globalStateHandler.getAllState,
            update: this.globalStateHandler.updateState(messageCtxInComming),
            clear: this.globalStateHandler.clear(),
        };

        const extensions = this.globalStateHandler.RAW;

        // 📄 Crar CTX de mensaje (uso private)
        const createCtxMessage = (payload = {}, index = 0) => {
            const body = typeof payload === 'string' ? payload : payload?.body ?? payload?.answer;
            const media = payload?.media ?? null;
            const buttons = payload?.buttons ?? [];
            const capture = payload?.capture ?? false;
            const delay = payload?.delay ?? 0;
            const keyword = payload?.keyword ?? null;

            return toCtx({
                body,
                from,
                keyword,
                index,
                options: { media, buttons, capture, delay },
            })
        };

        // 📄 Limpiar cola de procesos
        const clearQueue = () => {
            this.queuePrincipal.clearQueue(from);
            return
        };

        // 📄 Finalizar flujo
        const endFlow =
            (flag) =>
            async (message = null) => {
                flag.endFlow = true;
                endFlowFlag = true;
                if (message) this.sendProviderAndSave(from, createCtxMessage(message));
                clearQueue();
                return
            };

        // 📄 Finalizar flujo (patch)
        const endFlowToGotoFlow =
            (flag) =>
            async (messages = null, options = { fromGotoFlow: false, end: false }) => {
                flag.endFlow = true;
                endFlowFlag = true;

                if (Array.isArray(messages)) {
                    for (const iteratorCtxMessage of messages) {
                        const scopeCtx = await resolveCbEveryCtx(iteratorCtxMessage, {
                            omitEndFlow: options.fromGotoFlow,
                            idleCtx: !!iteratorCtxMessage?.options?.idle,
                            triggerKey: iteratorCtxMessage.keyword.startsWith('key_'),
                        });
                        if (scopeCtx?.endFlow) break
                    }
                }
                clearQueue();
                return
            };

        // 📄 Esta funcion se encarga de enviar un array de mensajes dentro de este ctx
        const sendFlow = async (messageToSend, numberOrId, options = {}) => {
            options = { prev: prevMsg, forceQueue: false, ...options };

            const idleCtxQueue = idleForCallback.get({ from, inRef: prevMsg?.ref });

            const { ref: prevRef, options: prevOptions } = options.prev || {};
            const { capture, idle } = prevOptions || {};

            if (messageCtxInComming?.ref && idleCtxQueue && messageToSend.length) {
                return
            }

            if (capture && idle && messageToSend.length === 0) {
                await cbEveryCtx(prevRef);
                return
            }

            if (capture && !idle) {
                await cbEveryCtx(prevRef);
            }

            for (const ctxMessage of messageToSend) {
                if (endFlowFlag) {
                    break
                }

                const delayMs = ctxMessage?.options?.delay ?? this.generalArgs.delay ?? 0;
                await delay$1(delayMs);

                //TODO el proceso de forzar cola de procsos
                if (options.forceQueue) {
                    await handleForceQueue(ctxMessage, messageToSend, numberOrId, from);
                }

                await enqueueMsg(numberOrId, ctxMessage, from);
            }
        };

        // Se han extraído algunas funcionalidades en nuevas funciones para mejorar la legibilidad
        const handleForceQueue = async (_, messageToSend, numberOrId, from) => {
            const listIdsRefCallbacks = messageToSend.map((i) => i.ref);
            const listProcessWait = this.queuePrincipal.getIdsCallback(from);

            if (!listProcessWait.length) {
                this.queuePrincipal.setIdsCallbacks(from, listIdsRefCallbacks);
            } else {
                const lastMessage = messageToSend[messageToSend.length - 1];
                await this.databaseClass.save({ ...lastMessage, from: numberOrId });

                if (listProcessWait.includes(lastMessage.ref)) {
                    this.queuePrincipal.clearQueue(from);
                }
            }
        };

        const enqueueMsg = async (numberOrId, ctxMessage, from) => {
            try {
                await this.queuePrincipal.enqueue(
                    from,
                    async () => {
                        await this.sendProviderAndSave(numberOrId, ctxMessage)
                            .then(() => resolveCbEveryCtx(ctxMessage))
                            .catch((error) => {
                                logger.error(`Error en sendProviderAndSave (ID ${ctxMessage.ref}):`, error);
                                throw error
                            });

                        logger.log(`[QUEUE_SE_ENVIO]: `, ctxMessage);
                    },
                    ctxMessage.ref
                );
            } catch (error) {
                logger.error(`Error al encolar (ID ${ctxMessage.ref}):`, error);
                throw error
            }
        };

        const continueFlow = async (initRef = undefined) => {
            const currentPrev = await this.databaseClass.getPrevByNumber(from);

            let nextFlow = this.flowClass.find(refToContinue?.ref, true) || [];
            if (initRef && !initRef?.idleFallBack) {
                nextFlow = this.flowClass.find(initRef?.ref, true) || [];
            }

            const getContinueIndex = nextFlow.findIndex((msg) => msg.refSerialize === currentPrev?.refSerialize);
            const indexToContinue = getContinueIndex !== -1 ? getContinueIndex : 0;
            const filterNextFlow = nextFlow
                .slice(indexToContinue)
                .filter((i) => i.refSerialize !== currentPrev?.refSerialize);

            // const filterNextFlow = nextFlow.filter((msg) => msg.refSerialize !== currentPrev?.refSerialize);
            const isContinueFlow = filterNextFlow.map((i) => i.keyword).includes(currentPrev?.ref);

            if (!isContinueFlow) {
                const refToContinueChild = this.flowClass.getRefToContinueChild(currentPrev?.keyword);
                const flowStandaloneChild = this.flowClass.getFlowsChild();
                const nextChildMessages =
                    (await this.flowClass.find(refToContinueChild?.ref, true, flowStandaloneChild)) || [];
                if (nextChildMessages?.length)
                    return exportFunctionsSend(() => sendFlow(nextChildMessages, from, { prev: undefined }))

                return exportFunctionsSend(() => sendFlow(filterNextFlow, from, { prev: undefined }))
            }

            if (initRef && !initRef?.idleFallBack) {
                return exportFunctionsSend(() => sendFlow(filterNextFlow, from, { prev: undefined }))
            }
        };
        // 📄 [options: fallBack]: esta funcion se encarga de repetir el ultimo mensaje
        const fallBack =
            (flag) =>
            async (message = null) => {
                this.queuePrincipal.clearQueue(from);
                flag.fallBack = true;
                await this.sendProviderAndSave(from, {
                    ...prevMsg,
                    answer: typeof message === 'string' ? message : message?.body ?? prevMsg.answer,
                    options: {
                        ...prevMsg.options,
                        buttons: prevMsg.options?.buttons,
                    },
                });
                return
            };

        const gotoFlow =
            (flag) =>
            async (flowInstance, step = 0) => {
                const promises = [];
                flag.gotoFlow = true;

                if (!flowInstance?.toJson) {
                    printer([
                        `[POSSIBLE_CIRCULAR_DEPENDENCY]: Se ha detectado una dependencia circular.`,
                        `Para evitar problemas, te recomendamos utilizar 'require'('./ruta_del_flow')`,
                        `Ejemplo:  gotoFlow(helloFlow) -->  gotoFlow(require('./flows/helloFlow.js'))`,
                        `[INFO]: https://bot-whatsapp.netlify.app/docs/goto-flow/`,
                    ]);
                    return
                }

                await delay$1(flowInstance?.ctx?.options?.delay ?? 0);

                const flowTree = flowInstance.toJson();

                const flowParentId = flowTree[step];

                const parseListMsg = await this.flowClass.find(flowParentId?.ref, true, flowTree);

                for (const msg of parseListMsg) {
                    const msgParse = this.flowClass.findSerializeByRef(msg?.ref);

                    const ctxMessage = { ...msgParse, ...msg };
                    await this.sendProviderAndSave(from, ctxMessage).then(() => promises.push(ctxMessage));
                }

                await endFlowToGotoFlow(flag)(promises, { fromGotoFlow: true, ...{ end: endFlowFlag } });
                return
            };

        // 📄 [options: flowDynamic]: esta funcion se encarga de responder un array de respuesta esta limitado a 5 mensajes
        // para evitar bloque de whatsapp

        const flowDynamic =
            (flag, inRef, privateOptions) =>
            async (listMsg = [], options = { continue: true }) => {
                if (!options.hasOwnProperty('continue')) {
                    options = { ...options, continue: true };
                }

                flag.flowDynamic = true;

                if (!Array.isArray(listMsg)) {
                    listMsg = [{ body: listMsg, ...options }];
                }

                const parseListMsg = listMsg.map((opt, index) => createCtxMessage(opt, index));

                // Si endFlowFlag existe y no se omite la finalización del flujo, no hacer nada.
                if (endFlowFlag && !privateOptions?.omitEndFlow) {
                    return
                }

                this.queuePrincipal.setFingerTime(from, inRef); // Debe decirle al sistema que finalizó el flujo aquí.

                for (const msg of parseListMsg) {
                    if (privateOptions?.idleCtx) {
                        continue // Saltar al siguiente mensaje si se está en modo idleCtx.
                    }

                    const delayMs = msg?.options?.delay ?? this.generalArgs.delay ?? 0;
                    await delay$1(delayMs);
                    await this.sendProviderAndSave(from, msg);
                }

                if (options?.continue) {
                    await continueFlow();
                    return
                }
                return
            };

        // 📄 Se encarga de revisar si el contexto del mensaje tiene callback o idle
        const resolveCbEveryCtx = async (
            ctxMessage,
            options = { omitEndFlow: false, idleCtx: false, triggerKey: false }
        ) => {
            if (!!ctxMessage?.options?.idle && !ctxMessage?.options?.capture) {
                printer(
                    `[ATENCION IDLE]: La función "idle" no tendrá efecto a menos que habilites la opción "capture:true". Por favor, asegúrate de configurar "capture:true" o elimina la función "idle"`
                );
                return
            }

            // const endFlowState = state.getMyState() && state.get('__end_flow__')
            // if(endFlowState) return

            if (ctxMessage?.options?.idle) {
                const run = await cbEveryCtx(ctxMessage?.ref, { ...options, startIdleMs: ctxMessage?.options?.idle });
                return run
            }
            if (!ctxMessage?.options?.capture) {
                const run = await cbEveryCtx(ctxMessage?.ref, options);
                return run
            }
        };

        // 📄 Se encarga de revisar si el contexto del mensaje tiene callback y ejecutarlo
        const cbEveryCtx = async (
            inRef,
            options = { startIdleMs: 0, omitEndFlow: false, idleCtx: false, triggerKey: false }
        ) => {
            const flags = {
                endFlow: false,
                fallBack: false,
                flowDynamic: false,
                gotoFlow: false,
            };

            const provider = this.providerClass;
            const database = this.databaseClass;

            if (!this.flowClass.allCallbacks[inRef]) return Promise.resolve()
            const argsCb = {
                database,
                provider,
                state,
                globalState,
                extensions,
                queue: this.queuePrincipal,
                idle: idleForCallback,
                inRef,
                fallBack: fallBack(flags),
                flowDynamic: flowDynamic(flags, inRef, options),
                endFlow: endFlow(flags),
                gotoFlow: gotoFlow(flags),
            };

            const runContext = async (continueAfterIdle = false, overCtx = {}) => {
                messageCtxInComming = { ...messageCtxInComming, ...overCtx };

                if (options?.idleCtx && !options?.triggerKey) {
                    return
                }

                await this.flowClass.allCallbacks[inRef](messageCtxInComming, argsCb);
                //Si no hay llamado de fallaback y no hay llamado de flowDynamic y no hay llamado de enflow EL flujo continua
                if (continueAfterIdle) {
                    await continueFlow(overCtx);
                    return
                }
                const ifContinue = !flags.endFlow && !flags.fallBack && !flags.flowDynamic;
                if (ifContinue) {
                    await continueFlow();
                    return
                }
            };

            if (options.startIdleMs > 0) {
                idleForCallback.setIdleTime({
                    from,
                    inRef,
                    timeInSeconds: options.startIdleMs / 1000,
                    cb: async (opts) => {
                        if (opts?.next) {
                            await runContext(true, { idleFallBack: opts.next, ref: opts.inRef, body: opts.body });
                        }
                    },
                });
                return
            }

            await runContext();
            return { ...flags }
        };

        const exportFunctionsSend = async (cb = () => Promise.resolve()) => {
            await cb();
            return {
                createCtxMessage,
                clearQueue,
                endFlow,
                sendFlow,
                continueFlow,
                fallBack,
                gotoFlow,
                flowDynamic,
                resolveCbEveryCtx,
                cbEveryCtx,
            }
        };

        // 📄🤘(tiene return) [options: nested(array)]: Si se tiene flujos hijos los implementa
        if (!endFlowFlag && prevMsg?.options?.nested?.length) {
            const nestedRef = prevMsg.options.nested;
            const flowStandalone = nestedRef.map((f) => ({
                ...nestedRef.find((r) => r.refSerialize === f.refSerialize),
            }));

            msgToSend = this.flowClass.find(body, false, flowStandalone) || [];

            return exportFunctionsSend(() => sendFlow(msgToSend, from))
        }

        // 📄🤘(tiene return) Si el mensaje previo implementa capture
        if (!endFlowFlag && !prevMsg?.options?.nested?.length) {
            const typeCapture = typeof prevMsg?.options?.capture;

            if (typeCapture === 'boolean' && fallBackFlag) {
                msgToSend = this.flowClass.find(refToContinue?.ref, true) || [];
                return exportFunctionsSend(() => sendFlow(msgToSend, from, { forceQueue: true }))
            }
        }

        msgToSend = this.flowClass.find(body) || [];

        if (msgToSend.length) {
            return exportFunctionsSend(() => sendFlow(msgToSend, from))
        }

        if (!prevMsg?.options?.capture) {
            msgToSend = this.flowClass.find(this.generalArgs.listEvents.WELCOME) || [];

            if (LIST_REGEX.REGEX_EVENT_LOCATION.test(body)) {
                msgToSend = this.flowClass.find(this.generalArgs.listEvents.LOCATION) || [];
            }

            if (LIST_REGEX.REGEX_EVENT_MEDIA.test(body)) {
                msgToSend = this.flowClass.find(this.generalArgs.listEvents.MEDIA) || [];
            }

            if (LIST_REGEX.REGEX_EVENT_DOCUMENT.test(body)) {
                msgToSend = this.flowClass.find(this.generalArgs.listEvents.DOCUMENT) || [];
            }

            if (LIST_REGEX.REGEX_EVENT_VOICE_NOTE.test(body)) {
                msgToSend = this.flowClass.find(this.generalArgs.listEvents.VOICE_NOTE) || [];
            }

            if (LIST_REGEX.REGEX_EVENT_ORDER.test(body)) {
                msgToSend = this.flowClass.find(this.generalArgs.listEvents.ORDER) || [];
            }

            if (LIST_REGEX.REGEX_EVENT_TEMPLATE.test(body)) {
                msgToSend = this.flowClass.find(this.generalArgs.listEvents.TEMPLATE) || [];
            }
        }

        return exportFunctionsSend(() => sendFlow(msgToSend, from, { forceQueue: true }))
    }

    /**
     * Enviar mensaje con contexto atraves del proveedor de whatsapp
     * @param {*} numberOrId
     * @param {*} ctxMessage ver más en GLOSSARY.md
     * @returns
     */
    sendProviderAndSave = async (numberOrId, ctxMessage) => {
        try {
            const { answer } = ctxMessage;
            if (answer && answer.length && answer !== '__call_action__' && answer !== '__goto_flow__') {
                if (answer !== '__capture_only_intended__') {
                    await this.providerClass.sendMessage(numberOrId, answer, ctxMessage);
                    this.emit('send_message', { numberOrId, answer, ctxMessage });
                }
            }
            await this.databaseClass.save({ ...ctxMessage, from: numberOrId });

            return Promise.resolve()
        } catch (err) {
            logger.log(`[ERROR ID (${ctxMessage.ref})]: `, err);
            return Promise.reject()
        }
    }

    /**
     * @deprecated
     * @private
     * @param {*} message
     * @param {*} ref
     */
    continue = (message, ref = false) => {
        const responde = this.flowClass.find(message, ref);
        if (responde) {
            this.providerClass.sendMessage(responde.answer);
            this.databaseClass.saveLog(responde.answer);
            this.continue(null, responde.ref);
        }
    }

    /**
     * Funcion dedicada a enviar el mensaje sin pasar por el flow
     * (dialogflow)
     * @param {*} messageToSend
     * @param {*} numberOrId
     * @returns
     */
    sendFlowSimple = async (messageToSend, numberOrId) => {
        for (const ctxMessage of messageToSend) {
            const delayMs = ctxMessage?.options?.delay ?? this.generalArgs.delay ?? 0;
            await delay$1(delayMs);
            await this.queuePrincipal.enqueue(
                numberOrId,
                () => this.sendProviderAndSave(numberOrId, ctxMessage),
                ctxMessage.ref
            );
            // await queuePromises.dequeue()
        }
        return Promise.resolve
    }
};
var core_class = CoreClass$1;

const { EventEmitter } = require$$0$2;
/**
 * Esta clase debe siempre proporcionar los siguietes metodos
 * sendMessage = Para enviar un mensaje
 *
 * @important
 * Esta clase extiende de la clase del provider OJO
 * Eventos
 *  - message
 *  - ready
 *  - error
 *  - require_action
 */

const NODE_ENV = process.env.NODE_ENV || 'dev';
let ProviderClass$2 = class ProviderClass extends EventEmitter {
    /**
     * events: message | auth | auth_error | ...
     *
     */

    sendMessage = async (userId, message) => {
        if (NODE_ENV !== 'production') console.log('[sendMessage]', { userId, message });
        return message
    }

    getInstance = () => this.vendor
};

var provider_class = ProviderClass$2;

const { toSerialize: toSerialize$1 } = toSerialize_1;
const { flatObject } = flattener;

/**
 * Esta clas se encarga de manera la manipulacion de los flows
 * y la creaciones de indices donde almacenar los callbacks
 */
let FlowClass$1 = class FlowClass {
    allCallbacks = []
    flowSerialize = []
    flowRaw = []

    constructor(_flow) {
        if (!Array.isArray(_flow)) throw new Error('Esto debe ser un ARRAY')
        // this.flowRaw = this.addEndsFlows(_flow)
        this.flowRaw = _flow;

        this.allCallbacks = flatObject(_flow);

        const mergeToJsonSerialize = Object.keys(_flow)
            .map((indexObjectFlow) => _flow[indexObjectFlow].toJson())
            .flat(2);

        this.flowSerialize = toSerialize$1(mergeToJsonSerialize);
    }

    /**
     * Agregamos un addAcion con un endFlow
     * al finalizar el flow para limpiar rendimiento, colas, etc
     * @param {*} _flows
     * @returns
     */
    addEndsFlows = (_flows) => {
        return _flows.map((flow) =>
            flow.addAction(async (_, { endFlow }) => {
                return endFlow()
            })
        )
    }

    /**
     * Funcion principal encargada de devolver un array de mensajes a continuar
     * la idea es basado en un ref o id devolver la lista de mensaes a enviar
     * @param {*} keyOrWord
     * @param {*} symbol
     * @param {*} overFlow
     * @returns
     */
    find = (keyOrWord, symbol = false, overFlow = null) => {
        keyOrWord = `${keyOrWord}`;
        let capture = false;
        let messages = [];
        let refSymbol = null;
        overFlow = overFlow ?? this.flowSerialize;

        const mapSensitive = (str, mapOptions = { sensitive: false, regex: false }) => {
            if (mapOptions.regex) return new Function(`return ${str}`)()
            const regexSensitive = mapOptions.sensitive ? 'g' : 'i';

            if (Array.isArray(str)) {
                const patterns = mapOptions.sensitive ? str.map((item) => `\\b${item}\\b`) : str;
                return new RegExp(patterns.join('|'), regexSensitive)
            }
            const pattern = mapOptions.sensitive ? `\\b${str}\\b` : str;
            return new RegExp(pattern, regexSensitive)
        };

        const findIn = (keyOrWord, symbol = false, flow = overFlow) => {
            capture = refSymbol?.options?.capture || false;
            if (capture) return messages

            if (symbol) {
                refSymbol = flow.find((c) => c.keyword === keyOrWord);
                if (refSymbol?.answer) messages.push(refSymbol);
                if (refSymbol?.ref) findIn(refSymbol.ref, true);
            } else {
                refSymbol = flow.find((c) => {
                    const sensitive = c?.options?.sensitive || false;
                    const regex = c?.options?.regex || false;
                    return mapSensitive(c.keyword, { sensitive, regex }).test(keyOrWord)
                });
                if (refSymbol?.ref) findIn(refSymbol.ref, true);
                return messages
            }
        };
        findIn(keyOrWord, symbol);
        return messages
    }

    findBySerialize = (refSerialize) => this.flowSerialize.find((r) => r.refSerialize === refSerialize)

    findIndexByRef = (ref) => this.flowSerialize.findIndex((r) => r.ref === ref)

    findSerializeByRef = (ref) => this.flowSerialize.find((r) => r.ref === ref)

    findSerializeByKeyword = (keyword) => this.flowSerialize.find((r) => r.keyword === keyword)

    getRefToContinueChild = (keyword) => {
        try {
            const flowChilds = this.flowSerialize
                .reduce((acc, cur) => {
                    const merge = [...acc, cur?.options?.nested].flat(2);
                    return merge
                }, [])
                .filter((i) => !!i && i?.refSerialize === keyword)
                .shift();

            return flowChilds
        } catch (e) {
            return undefined
        }
    }

    /**
     * El proposito es cargar los flows y la serializacion de los callbacks
     * a los flows qu son hijos
     * @returns
     */
    getFlowsChild = () => {
        try {
            const flowChilds = this.flowSerialize
                .reduce((acc, cur) => {
                    const merge = [...acc, cur?.options?.nested].flat(2);
                    return merge
                }, [])
                .filter((i) => !!i);

            return flowChilds
        } catch (e) {
            return []
        }
    }
};

var flow_class = FlowClass$1;

const CoreClass = core_class;
const ProviderClass$1 = provider_class;
const FlowClass = flow_class;
const { addKeyword, addAnswer, addChild, toSerialize } = methods;
const { LIST_ALL: EVENTS } = events;

/**
 * Crear instancia de clase Bot
 * @param {*} args
 * @returns {CoreClass}
 * @property {Flow} `flowClass` - Instancia de la clase Flow.
 * @property {Database} `databaseClass` - Instancia de la clase Database.
 * @property {Provider} `providerClass` - Instancia de la clase Provider.
 * @property {Queue} `queuePrincipal` - Instancia de la clase Queue.
 * @property {SingleState} `stateHandler` - Instancia de la clase SingleState.
 * @property {GlobalState} `globalStateHandler` - Instancia de la clase GlobalState.
 * @property {Object} `generalArgs` - Argumentos generales que incluyen:
 *   - blackList: Un array de elementos en la lista negra.
 *   - listEvents: Un objeto que almacena eventos.
 *   - delay: Valor de retraso.
 *   - globalState: Un objeto que almacena el estado global.
 *   - extensions: Extensiones, si están definidas.
 *   - queue: Configuración de la cola que incluye timeout y límite de concurrencia.
 */
const createBot = async ({ flow, database, provider }, args = {}) =>
    new CoreClass(flow, database, provider, { ...args, listEvents: EVENTS });

/**
 * Crear instancia de clase Io (Flow)
 * @param {*} args
 * @returns
 */
const createFlow = (args) => {
    return new FlowClass(args)
};

/**
 * Crear instancia de clase Provider
 * Depdendiendo del Provider puedes pasar argumentos
 * Ver Documentacion
 * @param {*} args
 * @returns
 */
const createProvider = (providerClass = class {}, args = null) => {
    const providerInstance = new providerClass(args);
    if (!providerClass.prototype instanceof ProviderClass$1) throw new Error('El provider no implementa ProviderClass')
    return providerInstance
};

var bot = {
    createBot,
    createFlow,
    createProvider,
    addKeyword,
    addAnswer,
    addChild,
    toSerialize,
    ProviderClass: ProviderClass$1,
    CoreClass,
    EVENTS,
};

const { ProviderClass } = bot;

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms))
}

class MockProvider extends ProviderClass {
    constructor() {
        super();
    }

    delaySendMessage = async (miliseconds, eventName, payload) => {
        await delay(miliseconds);
        this.emit(eventName, payload);
    }

    sendMessage = async (userId, message) => {
        return Promise.resolve({ userId, message })
    }
}

var mock = MockProvider;

module.exports = mock;
