import 'dotenv/config'
import express, {Request, Response} from 'express'
import cors from 'cors'
import {Bot, Context, InputFile} from 'grammy'
import connectDB from "./db.js";
import ClientModel from "./models/client.model.js";
import type {ISpectechnikiRequest} from "./types.js";
import ClientsModel from "./models/client.model.js";

const app = express()
const PORT = Number(process.env.PORT) || 3004

app.use(
  cors({
    origin: [
      '*'
    ],
  })
)

app.use(express.json())

const bot = new Bot(process.env.BOT_TOKEN!)

const CHANNELS_SPECTECHNIKI = [
  Number(process.env.CHANNEL_PART_1),
  Number(process.env.CHANNEL_PART_2),
]

const CHANNELS_SNEGOHOD = [
  Number(process.env.CHANNEL_SNEGOHOD_PART_1),
  Number(process.env.CHANNEL_SNEGOHOD_PART_2),
]

const CHANNELS_MINITRAKKTORY = [
  Number(process.env.CHANNEL_MINITRAKKTORY_PART_1),
  Number(process.env.CHANNEL_MINITRAKKTORY_PART_2),
]

let channelIndexSpectehniki = 0
let channelIndexSnegohody = 0
let channelIndexMinitraktory = 0

app.post('/tilda-webhook-catalog-spectehniki', async (req: Request, res: Response) => {
  const lead = req.body as ISpectechnikiRequest

  const contactMethod = lead.Telegram && 'Telegram' || lead.WhatsApp && 'WhatsApp' || 'Телефон'
  const contactPhone = lead?.Телефон || lead?.Telegram_номер || lead?.WhatsApp || ''
  const telegramUsername = lead?.Telegram_username || ''

  const client = await ClientsModel.findOne({
    $or: [
      { phone: contactPhone },
      { telegram_username: telegramUsername },
    ]
  })

  if (!client) {
    await ClientModel.create({
      name: lead.Name,
      contact_method: contactMethod,
      phone: contactPhone,
      telegram_username: telegramUsername,
    })
  }

  console.log('NEW LEAD spectehniki:', lead)

  const leadData = Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`;
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted;
    })
    .join('\n');

  const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

  await bot.api.sendMessage(CHANNELS_SPECTECHNIKI[channelIndexSpectehniki], message, {
    parse_mode: 'HTML',
  })

  channelIndexSpectehniki = (channelIndexSpectehniki + 1) % CHANNELS_SPECTECHNIKI.length
  res.sendStatus(200)
})

app.post('/tilda-webhook-xlkja-snegohody', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD snegohody:', lead)

  const leadData = Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`;
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted;
    })
    .join('\n');

  const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

  await bot.api.sendMessage(CHANNELS_SNEGOHOD[channelIndexSnegohody], message, {
    parse_mode: 'HTML',
  })

  channelIndexSnegohody = (channelIndexSnegohody + 1) % CHANNELS_SNEGOHOD.length
  res.sendStatus(200)
})

app.post('/tilda-webhook-brwio-minitraktory', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD minitraktory:', lead)

  const leadData = Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`;
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted;
    })
    .join('\n');

  const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

  await bot.api.sendMessage(CHANNELS_MINITRAKKTORY[channelIndexMinitraktory], message, {
    parse_mode: 'HTML',
  })

  channelIndexMinitraktory = (channelIndexMinitraktory + 1) % CHANNELS_MINITRAKKTORY.length
  res.sendStatus(200)
})

// COMMANDS

bot.command('start', async (ctx: Context) => {
  return await ctx.reply('Working')
})

bot.command('clients', async (ctx) => {
  const clients = await ClientModel.find()

  const header = 'Name;Contact Method;Phone;Telegram Username\n'
  const rows = clients.map(c =>
    `${c.name};${c.contact_method};${c.phone};${c.telegram_username}`
  ).join('\n')

  const csv = '\uFEFF' + header + rows

  await ctx.replyWithDocument(
    new InputFile(
      Buffer.from(csv, 'utf-8'),
      'clients.csv'
    )
  )
})

bot.command('chatid', async (ctx: Context) => {
  const chatId = String(ctx.chat?.id) || ''

  return await ctx.reply(chatId)
})

// - // - // - // - //

const startApp = async () => {
  await connectDB()
  bot.start()
}

startApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})