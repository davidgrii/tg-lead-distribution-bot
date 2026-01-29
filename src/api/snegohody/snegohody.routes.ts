import {Request, Response, Router} from "express";
import type {ISnegohodyCartRequest, ISnegohodyRequest} from "../../types.js";
import ClientsModel from "../../models/client.model.js";
import {bot} from "../../bot.js";
import {CHANNELS_SNEGOHODY} from "../../constants.js";
import {getContactMethod, getContactPhoneOrUsername} from "../../utils.js";
import LeadsModel from "../../models/leads.model.js";
import {InlineKeyboard} from "grammy";

const router = Router();

let channelIndexSnegohody = 0

router.post(
  '/tilda-webhook-xlkja-snegohody',
  async (req: Request, res: Response) => {
    const lead = req.body as ISnegohodyRequest
    const orConditions = []

    let channelId = CHANNELS_SNEGOHODY[channelIndexSnegohody]

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

    const duplicatedLead = await LeadsModel.findOne({
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

    if (duplicatedLead) {
      channelId = duplicatedLead.channel_id
    }

    console.log('NEW LEAD snegohody:', lead)

    const leadData = Object.entries(lead)
      .map(([key, value], index) => {
        const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`
        return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
      })
      .join('\n')

    const statusKeyboard = new InlineKeyboard()
      .text('🟢  СВЯЗАЛСЯ  🟢', 'status:CONTACTED')
      .text('🔴  НЕТ КОНТАКТА  🔴', 'status:NO_CONTACT')
      .row()
      .text('🟡  ДУБЛЬ  🟡', 'status:DUPLICATE');

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
      
${leadData}
  `

    const { message_id } = await bot.api.sendMessage(
      channelId,
      message,
      {
        reply_markup: statusKeyboard,
        parse_mode: 'HTML'
      }
    )

    if (!duplicatedLead) {
      channelIndexSnegohody = (channelIndexSnegohody + 1) % CHANNELS_SNEGOHODY.length

      await LeadsModel.create({
        message_id: message_id,
        channel_id: channelId,
        category: 'snegohody',

        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    res.sendStatus(200)
  }
)

router.post(
  '/tilda-webhook-xlkja-snegohody-cart',
  async (req: Request, res: Response) => {
    const lead = req.body as ISnegohodyCartRequest
    const orConditions = []

    let channelId = CHANNELS_SNEGOHODY[channelIndexSnegohody]

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

    const duplicatedLead = await LeadsModel.findOne({
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

    if (duplicatedLead) {
      channelId = duplicatedLead.channel_id
    }

    console.log('NEW LEAD snegohody (cart):', lead)

    const leadData = Object.entries(lead)
      .map(([key, value], index) => {
        if (key === 'payment') return null

        const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`

        return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
      })
      .filter(Boolean)
      .join('\n')


    const productsLeadData = Object.entries(lead?.payment?.products[0])
      .map(([key, value], index) => {
        if (key === 'img') return null

        const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${key === 'price' || key === 'amount'  ? value + '₽' : value}`

        return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
      })
      .filter(Boolean)
      .join('\n')

    const statusKeyboard = new InlineKeyboard()
      .text('🟢  СВЯЗАЛСЯ  🟢', 'status:CONTACTED')
      .text('🔴  НЕТ КОНТАКТА  🔴', 'status:NO_CONTACT')
      .row()
      .text('🟡  ДУБЛЬ  🟡', 'status:DUPLICATE');

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>Источник:</b> <code>Корзина</code>
  
${leadData}

—————————

📌 <b>О товаре:</b> 📌

${productsLeadData}

  `

    const { message_id } = await bot.api.sendMessage(
      channelId,
      message,
      {
        reply_markup: statusKeyboard,
        parse_mode: 'HTML'
      }
    )

    if (!duplicatedLead) {
      channelIndexSnegohody = (channelIndexSnegohody + 1) % CHANNELS_SNEGOHODY.length

      await LeadsModel.create({
        message_id: message_id,
        channel_id: channelId,
        category: 'snegohody',

        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    res.sendStatus(200)
  }
)

export default router;