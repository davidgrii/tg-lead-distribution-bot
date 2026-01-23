import {Request, Response, Router} from "express";
import type {ISnegohodyRequest, ISpectechnikiRequest} from "../../types.js";
import ClientsModel from "../../models/client.model.js";
import {bot} from "../../bot.js";
import {CHANNELS_SNEGOHOD, CHANNELS_SPECTECHNIKI} from "../../constants.js";
import {getContactMethod, getContactPhoneOrUsername} from "../../utils.js";

const router = Router();

let channelIndexSnegohody = 0

router.post(
  '/tilda-webhook-xlkja-snegohody',
  async (req: Request, res: Response) => {
    const lead = req.body as ISnegohodyRequest
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

router.post(
  '/tilda-webhook-xlkja-snegohody-cart',
  async (req: Request, res: Response) => {
    const lead = req.body as ISnegohodyRequest
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
<b>Источник:</b> <code>Корзина</code>
  
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

export default router;