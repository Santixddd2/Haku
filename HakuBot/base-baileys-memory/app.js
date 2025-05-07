const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { send_order } = require("./sendHaku/sendHaku.js");

async function SendHaku(ctx,ctxFn) {
    try {
      const { answer, nPetit } = await send_order(ctx, 1);
      await ctxFn.flowDynamic(answer)
    } catch (error) {
      console.error("Error:", error);
    }
  }
const flowWelcome= addKeyword(EVENTS.WELCOME)

.addAnswer('.', {delay:100},async (ctx,ctxFn)=>{
    SendHaku(ctx.body,ctxFn)

})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
