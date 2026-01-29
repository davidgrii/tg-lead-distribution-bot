import {type Bot, Context, InlineKeyboard, Keyboard} from "grammy";
import LeadsModel from "../models/leads.model.js";
import {TG_CHANNEL_KVADROCIKLY_URL, TG_CHANNEL_MINITRAKTORY_URL} from "../constants.js";

export const setupStartCommands = (bot: Bot) => {
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

  bot.command('chatid', async (ctx: Context) => {
    const chatId = String(ctx.chat?.id) || ''
    return await ctx.reply(chatId)
  })

  bot.on('message:contact', async (ctx) => {
    const contact = ctx.message?.contact
    if (!contact) return

    const contactPhone = contact.phone_number ? `+${contact.phone_number}` : ''
    const username = ctx.from?.username ? `@${ctx.from.username}` : ''

    let relatedLead = null;
    let currentContactMethod = ''
    let currentCategory = ''

    if (contactPhone) {
      relatedLead = await LeadsModel.findOne({ phone: contactPhone })
      currentContactMethod = relatedLead?.phone || ''

      currentCategory =
        relatedLead?.category === 'kvadrocikly' && TG_CHANNEL_KVADROCIKLY_URL
        || relatedLead?.category === 'snegohody' && TG_CHANNEL_KVADROCIKLY_URL
        || TG_CHANNEL_MINITRAKTORY_URL
    }

    if (!relatedLead && username) {
      relatedLead = await LeadsModel.findOne({telegram_username: username})
      currentContactMethod = relatedLead?.telegram_username || ''

      currentCategory =
        relatedLead?.category === 'kvadrocikly' && TG_CHANNEL_KVADROCIKLY_URL
        || relatedLead?.category === 'snegohody' && TG_CHANNEL_KVADROCIKLY_URL
        || TG_CHANNEL_MINITRAKTORY_URL
    }

    const message = `

❗️ <b>Получена новая заявка:</b> ❗️

<b>Источник:</b> <code>ТГ Бот</code>
<b>Контакт:</b> <code>${currentContactMethod}</code>

—————————

👇👇👇
`

    if (relatedLead) {
      await ctx.api.sendMessage(relatedLead.channel_id, message, {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML'
      })

      await ctx.api.forwardMessage(
        relatedLead.channel_id,
        ctx.chat.id,
        ctx.message.message_id,
      );
    }

    const inlineKeyboard = new InlineKeyboard()
      .url('📢  ПОДПИСАТЬСЯ  📢', currentCategory)

    await ctx.reply(
      `<b>✅ Спасибо, мы отправим вам предложения в ближайшее время!</b>
       
А пока подписывайтесь на наш канал с самыми выгодными вариантами:
<b>${currentCategory}</b>
`,
      {
        reply_markup: inlineKeyboard,
        parse_mode: 'HTML'
      }
    );
  })
};