import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import connectDB from './db.js'
import type {IMinitraktoryRequest, ISnegohodyRequest, ISpectechnikiRequest} from './types.js'
import ClientsModel from './models/client.model.js'
import {CHANNELS_MINITRAKKTORY, CHANNELS_SNEGOHOD, CHANNELS_SPECTECHNIKI} from './constants.js'
import {bot} from "./bot.js";

const app = express()
const PORT = Number(process.env.PORT) || 3004

app.use(
  cors({
    origin: ['*']
  })
)

app.use(express.json())

let channelIndexSpectehniki = 0
let channelIndexSnegohody = 0
let channelIndexMinitraktory = 0

app.post(
  '/tilda-webhook-catalog-spectehniki',
  async (req: Request, res: Response) => {
    const lead = req.body as ISpectechnikiRequest
    const orConditions = []

    const contactMethod = (lead.Telegram && 'Telegram') || (lead.Whatsapp && 'Whatsapp') || 'Телефон'

    const contactPhone = lead?.Телефон || lead?.Telegram_номер || lead?.Whatsapp || ''
    const telegramUsername = lead?.Telegram_username || ''

    if (contactPhone !== '') {
      orConditions.push({ phone: contactPhone })
    } else {
      orConditions.push({ telegram_username: telegramUsername })
    }

    const client = await ClientsModel.findOne({
      $or: orConditions
    })

    if (!client) {
      await ClientsModel.create({
        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    console.log('NEW LEAD spectehniki:', lead)

    const leadData = Object.entries(lead)
      .map(([key, value], index) => {
        const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`
        return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
      })
      .join('\n')

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

    await bot.api.sendMessage(
      CHANNELS_SPECTECHNIKI[channelIndexSpectehniki],
      message,
      {
        parse_mode: 'HTML'
      }
    )

    channelIndexSpectehniki =
      (channelIndexSpectehniki + 1) % CHANNELS_SPECTECHNIKI.length
    res.sendStatus(200)
  }
)

app.post(
  '/tilda-webhook-xlkja-snegohody',
  async (req: Request, res: Response) => {
    const lead = req.body as ISnegohodyRequest
    const orConditions = []

    const contactMethod =
      (lead.Telegram && 'Telegram') ||
      (lead.Whatsapp && 'Whatsapp') ||
      'Телефон'

    const contactPhone = lead?.Телефон || lead?.Telegram_номер || lead?.Whatsapp || ''
    const telegramUsername = lead?.Telegram_username || ''

    if (contactPhone !== '') {
      orConditions.push({ phone: contactPhone })
    } else {
      orConditions.push({ telegram_username: telegramUsername })
    }

    const client = await ClientsModel.findOne({
      $or: orConditions
    })

    if (!client) {
      await ClientsModel.create({
        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    console.log('NEW LEAD snegohody:', lead)

    const leadData = Object.entries(lead)
      .map(([key, value], index) => {
        const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`
        return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
      })
      .join('\n')

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

    await bot.api.sendMessage(
      CHANNELS_SNEGOHOD[channelIndexSnegohody],
      message,
      {
        parse_mode: 'HTML'
      }
    )

    channelIndexSnegohody =
      (channelIndexSnegohody + 1) % CHANNELS_SNEGOHOD.length
    res.sendStatus(200)
  }
)

app.post(
  '/tilda-webhook-brwio-minitraktory',
  async (req: Request, res: Response) => {
    const lead = req.body as IMinitraktoryRequest
    const orConditions = []

    const contactMethod = (lead.Telegram && 'Telegram') || (lead.Whatsapp && 'Whatsapp') || 'Телефон'

    const contactPhone = lead?.Телефон || lead?.Telegram_номер || lead?.Whatsapp || ''
    const telegramUsername = lead?.Telegram_username || ''

    if (contactPhone !== '') {
      orConditions.push({ phone: contactPhone })
    } else {
      orConditions.push({ telegram_username: telegramUsername })
    }

    const client = await ClientsModel.findOne({
      $or: orConditions
    })

    if (!client) {
      await ClientsModel.create({
        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    console.log('NEW LEAD minitraktory:', lead)

    const leadData = Object.entries(lead)
      .map(([key, value], index) => {
        const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`
        return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
      })
      .join('\n')

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

    await bot.api.sendMessage(
      CHANNELS_MINITRAKKTORY[channelIndexMinitraktory],
      message,
      {
        parse_mode: 'HTML'
      }
    )

    channelIndexMinitraktory =
      (channelIndexMinitraktory + 1) % CHANNELS_MINITRAKKTORY.length
    res.sendStatus(200)
  }
)

const startApp = async () => {
  await connectDB()
  bot.start()
}

startApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
