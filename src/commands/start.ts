import {type Bot, Context} from "grammy";


export const setupStartCommands = (bot: Bot) => {
  bot.command('start', async (ctx: Context) => {
    return await ctx.reply('Working')
  })

  bot.command('chatid', async (ctx: Context) => {
    const chatId = String(ctx.chat?.id) || ''

    return await ctx.reply(chatId)
  })
};