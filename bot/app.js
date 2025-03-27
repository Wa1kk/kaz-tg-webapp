import { Telegraf, Markup } from 'telegraf'

const token = '8103999486:AAE9_QKHdJxXtnxdSQPoM_U_6-kvNpGmFV0'
const webAppUrl = 'https://t.me/testVRNwebapp_bot/testVRN'

const bot = new Telegraf(token)

bot.command('start', (ctx) => {
  ctx.reply(
    'TEST LUDKA',
    Markup.inlineKeyboard([
      Markup.button.webApp('OPEN LUDKA', `${webAppUrl}?ref=${ctx.payload}`),
    ])
  )
})

bot.launch()