import {Request, Response, Router} from "express";
import type {IMinitraktoryRequest} from "../../types.js";
import ClientsModel from "../../models/client.model.js";
import {bot} from "../../bot.js";
import {CHANNELS_MINITRAKKTORY} from "../../constants.js";
import {getContactMethod, getContactPhoneOrUsername} from "../../utils.js";

const router = Router();

let channelIndexMinitraktory = 0

router.post(
  '/tilda-webhook-brwio-minitraktory',
  async (req: Request, res: Response) => {
    const lead = req.body as IMinitraktoryRequest
    const orConditions = []

    const contactMethod = getContactMethod(lead)
    const { contactPhone, telegramUsername } = getContactPhoneOrUsername(lead)

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

router.post(
  '/tilda-webhook-brwio-minitraktory-cart',
  async (req: Request, res: Response) => {
    const lead = req.body as IMinitraktoryRequest
    const orConditions = []

    const contactMethod = getContactMethod(lead)
    const { contactPhone, telegramUsername } = getContactPhoneOrUsername(lead)

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
<b>Источник:</b> <code>Корзина</code>
  
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

export default router;