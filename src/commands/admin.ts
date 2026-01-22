import {ADMIN_IDS} from "../constants.js";
import ClientModel from "../models/client.model.js";
import {type Bot, InputFile} from "grammy";

export const setupAdminCommands = (bot: Bot) => {
  bot.command('clients', async (ctx) => {
    const userId = String(ctx.from?.id) || ''
    const isAdmin = ADMIN_IDS?.includes(userId)

    if (!isAdmin) {
      return await ctx.reply("You don't have access to this command.")
    }

    const clients = await ClientModel.find()

    const header = 'Name;Contact Method;Phone;Telegram Username\n'
    const rows = clients
      .map(
        (c) => `${c.name};${c.contact_method};${c.phone};${c.telegram_username}`
      )
      .join('\n')

    const csv = '\uFEFF' + header + rows

    await ctx.replyWithDocument(
      new InputFile(Buffer.from(csv, 'utf-8'), 'clients.csv')
    )
  })
}