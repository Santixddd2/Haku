/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

/**
 * Si necesitas saber que trae el "ctx"
 * Puedes ver el README.md dentro packages/database
 */

class MockDatabase {
    db
    listHistory = []

    constructor() {}

    getPrevByNumber = (from) => {
        const history = this.listHistory
            .slice()
            .reverse()
            .filter((i) => !!i.keyword);
        return history.find((a) => a.from === from)
    }

    save = (ctx) => {
        this.listHistory.push(ctx);
    }
}

var mock = MockDatabase;

module.exports = mock;
