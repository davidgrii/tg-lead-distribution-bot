import {type Bot, Context, InlineKeyboard, Keyboard} from "grammy";
import LeadsModel from "../models/leads.model.js";
import {CHANNELS_MINITRAKTORY, TG_CHANNEL_MINITRAKTORY_URL} from "../constants.js";
import {getNextChannel} from "../utils.js";

export const setupMinitractoryCommands = (bot: Bot) => {
  bot.command('start', async (ctx: Context) => {
    const username = ctx.from?.username || ''

    const welcomeMessage =
      `<b>👋 ${username}, Добро пожаловать!</b>

📱 Чтобы получить самые выгодные предложения по вашему запросу прямо сейчас, нажмите
кнопку ниже и поделитесь своим контактом.

🔒 Мы используем номер только для быстрой связи
и не передаём его третьим лицам.
`;

    const keyboard = new Keyboard()
      .requestContact('☎️  ПОДЕЛИТЬСЯ КОНТАКТОМ  ☎️')
      .resized()
      .oneTime();

    await ctx.reply(welcomeMessage, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  });

  bot.on('message:contact', async (ctx) => {
    const contact = ctx.message?.contact
    if (!contact) return

    const contactPhone = contact.phone_number ? `+${contact.phone_number}` : ''
    const username = ctx.from?.username ? `@${ctx.from.username}` : ''

    let relatedLead = null;
    let currentContactMethod = ''

    if (contactPhone) {
      relatedLead = await LeadsModel.findOne({ phone: contactPhone, category: 'minitraktory'})
      currentContactMethod = relatedLead?.phone || ''
    }

    if (!relatedLead && username) {
      relatedLead = await LeadsModel.findOne({ telegram_username: username, category: 'minitraktory'})
      currentContactMethod = relatedLead?.telegram_username || ''
    }

    let channelId = relatedLead
      ? relatedLead.channel_id
      : await getNextChannel("minitraktory", CHANNELS_MINITRAKTORY)

    const message = `

❗️ <b>Получена новая заявка:</b> ❗️

<b>Источник:</b> <code>ТГ Бот</code>
<b>Контакт:</b> <code>${currentContactMethod}</code>

—————————

👇👇👇
`
    if (!relatedLead) {
      await ctx.api.sendMessage(channelId, message, {
        parse_mode: 'HTML',
      })

      await ctx.api.forwardMessage(
        channelId,
        ctx.chat.id,
        ctx.message.message_id,
      );
    }

    if (relatedLead) {
      await ctx.api.sendMessage(relatedLead.channel_id, message, {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      })

      await ctx.api.forwardMessage(
        relatedLead.channel_id,
        ctx.chat.id,
        ctx.message.message_id,
      );
    }

    await ctx.reply(
      `<b>✅ Спасибо, мы отправим вам предложения в ближайшее время!</b>
       
А пока подписывайтесь на наш канал с самыми выгодными вариантами <b>Минитракторов:</b>

<b>${TG_CHANNEL_MINITRAKTORY_URL}</b>
`,
      {
        reply_markup: new InlineKeyboard().url('📢  ПОДПИСАТЬСЯ  📢', TG_CHANNEL_MINITRAKTORY_URL),
        parse_mode: 'HTML'
      }
    );
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

    await ctx.answerCallbackQuery({text: '🔴  Статус: Нет контакта  🔴'});
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

    await ctx.answerCallbackQuery({text: '🟢  Статус: Связался  🟢'});
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

    await ctx.answerCallbackQuery({text: '🟡  Статус: Дубль  🟡'});
  })

  bot.callbackQuery('status:NO_CONTACT_LOCKED', async (ctx) => {
    await ctx.answerCallbackQuery({text: '❗  Статус зафиксирован  ❗'});
  });

  bot.callbackQuery('status:CONTACTED_LOCKED', async (ctx) => {
    await ctx.answerCallbackQuery({text: '❗  Статус зафиксирован  ❗'});
  });

  bot.callbackQuery('status:DUPLICATE_LOCKED', async (ctx) => {
    await ctx.answerCallbackQuery({text: '❗  Статус зафиксирован  ❗'});
  });

  bot.catch((err) => {
    console.error('BOT ERROR:', err.error)
  })
};