/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0 = require('mongodb');

const { MongoClient } = require$$0;

class MongoAdapter {
    db
    listHistory = []
    credentials = { dbUri: null, dbName: null }
    constructor(_credentials) {
        this.credentials = _credentials;
        this.init().then();
    }

    init = async () => {
        try {
            const client = new MongoClient(this.credentials.dbUri, {});
            await client.connect();
            console.log('🆗 Conexión Correcta DB');
            const db = client.db(this.credentials.dbName);
            this.db = db;
            return true
        } catch (e) {
            console.log('Error', e);
            return
        }
    }

    getPrevByNumber = async (from) => {
        const result = await this.db.collection('history').find({ from }).sort({ _id: -1 }).limit(1).toArray();
        return result[0]
    }

    save = async (ctx) => {
        const ctxWithDate = {
            ...ctx,
            date: new Date(),
        };
        await this.db.collection('history').insertOne(ctxWithDate);

        this.listHistory.push(ctx);
    }
}

var mongo = MongoAdapter;

module.exports = mongo;
