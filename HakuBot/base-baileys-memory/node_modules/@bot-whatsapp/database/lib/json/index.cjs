/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0 = require('path');
var require$$1 = require('fs');

const { join } = require$$0;
const { existsSync } = require$$1;
const { writeFile, readFile } = require$$1.promises;

class JsonFileAdapter {
    db
    pathFile
    listHistory = []
    options = { filename: 'db.json' }

    constructor(options = {}) {
        this.options = { ...this.options, ...options };
        this.pathFile = join(process.cwd(), this.options.filename);
        this.init().then();
    }

    /**
     * Revisamos si existe o no el json file
     * @returns
     */
    init = async () => {
        if (existsSync(this.pathFile)) {
            return Promise.resolve()
        }
        try {
            const parseData = JSON.stringify([], null, 2);
            return writeFile(this.pathFile, parseData, 'utf-8')
        } catch (e) {
            return Promise.reject(e.message)
        }
    }

    validateJson = (raw) => {
        try {
            return JSON.parse(raw)
        } catch (e) {
            return {}
        }
    }

    /**
     * Leer archivo y parsear
     * @returns
     */
    readFileAndParse = async () => {
        const data = await readFile(this.pathFile, 'utf-8');
        const parseData = this.validateJson(data);
        return parseData
    }

    /**
     * Buscamos el ultimo mensaje por numero
     * @param {*} from
     * @returns
     */
    getPrevByNumber = async (from) => {
        const history = await this.readFileAndParse();
        if (!history.length) {
            return []
        }

        const result = history
            .slice()
            .reverse()
            .filter((i) => !!i.keyword);
        return result.find((a) => a.from === from)
    }

    /**
     * Guardar dato
     * @param {*} ctx
     */
    save = async (ctx) => {
        this.listHistory.push(ctx);
        const parseData = JSON.stringify(this.listHistory, null, 2);
        await writeFile(this.pathFile, parseData, 'utf-8');
    }
}

var json = JsonFileAdapter;

module.exports = json;
