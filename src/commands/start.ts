import {type Bot, Context, Keyboard} from "grammy";


export const setupStartCommands = (bot: Bot) => {
  bot.command('start', async (ctx: Context) => {
    const username = ctx.from?.username || ''
    const welcomeMessage =
      `<b>👋 ${username}, Добро пожаловать!</b>

<b>*Нажмите кнопку ниже*</b>
чтобы поделиться контактом

👇👇👇
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
};