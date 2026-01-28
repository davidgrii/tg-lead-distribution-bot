import {type Bot, Context, InlineKeyboard, Keyboard} from "grammy";
import LeadsModel from "../models/leads.model.js";

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
    const contactPhone = ('+' + ctx.message?.contact?.phone_number) || ''
    const username = ('@' + ctx.from?.username) || ''

    let relatedLead = null;
    const currentCategory = 'Квадроциклов'
    let currentContactMethod = ''

    if (contactPhone) {
      relatedLead = await LeadsModel.findOne({
        phone: contactPhone
      })
      currentContactMethod = contactPhone
    }

    if (username) {
      relatedLead = await LeadsModel.findOne({
        telegram_username: username
      })
      currentContactMethod = username
    }

    const message = `❗️ <b>Получена новая заявка:</b> ❗️

<b>Источник:</b> <code>ТГ Бот</code>
<b>Контакт:</b> <code>${currentContactMethod}</code>
`

    if (relatedLead) {
      await ctx.api.sendMessage(relatedLead.channel_id, message,
        {
          parse_mode: 'HTML',
          reply_to_message_id: relatedLead.message_id
        }
      )
    }

    const inlineKeyboard = new InlineKeyboard()
      .url('📢  ПОДПИСАТЬСЯ  📢', 'https://t.me/spectechnikamir')

    await ctx.reply(
      `<b>✅ Спасибо, мы отправим вам предложения в ближайшее время!</b>
       
А пока подписывайтесь на наш канал с самыми выгодными вариантами <b>${currentCategory}</b>
`,
      {
        reply_markup: inlineKeyboard,
        parse_mode: 'HTML'
      }
    );
  })
};