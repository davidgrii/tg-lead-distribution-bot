import {ADMIN_IDS} from "../constants.js";
import ClientModel from "../models/client.model.js";
import {type Bot, InlineKeyboard, InputFile} from "grammy";

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

  bot.callbackQuery('status:NO_CONTACT', async (ctx) => {
    const chat = ctx.chat;
    const message = ctx.callbackQuery.message;

    if (!chat || !message) return;
    const keyboard = new InlineKeyboard()
      .text('🔴  НЕТ КОНТАКТА  🔴', 'status:NO_CONTACT_LOCKED');

    await ctx.api.editMessageReplyMarkup(
      chat.id,
      message.message_id,
      {
        reply_markup: keyboard,
      }
    );

    await ctx.answerCallbackQuery({ text: '🔴  Статус: Нет контакта  🔴' });
  })

  bot.callbackQuery('status:CONTACTED', async (ctx) => {
    const chat = ctx.chat;
    const message = ctx.callbackQuery.message;

    if (!chat || !message) return;

    const keyboard = new InlineKeyboard()
      .text('🟢  СВЯЗАЛСЯ  🟢', 'status:CONTACTED_LOCKED');

    await ctx.api.editMessageReplyMarkup(
      chat.id,
      message.message_id,
      {
        reply_markup: keyboard,
      }
    );

    await ctx.answerCallbackQuery({ text: '🟢  Статус: Связался  🟢' });
  })

  bot.callbackQuery('status:DUPLICATE', async (ctx) => {
    const chat = ctx.chat;
    const message = ctx.callbackQuery.message;

    if (!chat || !message) return;

    const keyboard = new InlineKeyboard()
      .text('🟡  ДУБЛЬ  🟡', 'status:DUPLICATE_LOCKED');

    await ctx.api.editMessageReplyMarkup(
      chat.id,
      message.message_id,
      {
        reply_markup: keyboard,
      }
    );

    await ctx.answerCallbackQuery({ text: '🟡  Статус: Дубль  🟡' });
  })

  bot.callbackQuery('status:NO_CONTACT_LOCKED', async (ctx) => {
    await ctx.answerCallbackQuery({ text: '❗  Статус зафиксирован  ❗' });
  });

  bot.callbackQuery('status:CONTACTED_LOCKED', async (ctx) => {
    await ctx.answerCallbackQuery({ text: '❗  Статус зафиксирован  ❗' });
  });

  bot.callbackQuery('status:DUPLICATE_LOCKED', async (ctx) => {
    await ctx.answerCallbackQuery({ text: '❗  Статус зафиксирован  ❗' });
  });
}